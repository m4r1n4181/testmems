using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MusicEventManagementSystem.API.Migrations
{
    /// <inheritdoc />
    public partial class AddWorkflowAnalyticsFunctions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Function to calculate workflow phase efficiency
            migrationBuilder.Sql(@"
                CREATE OR REPLACE FUNCTION get_workflow_phase_efficiency(workflow_id_param INT)
                RETURNS TABLE (
                    phase_name VARCHAR(50),
                    avg_time_hours NUMERIC,
                    task_count BIGINT
                ) AS $$
                BEGIN
                    RETURN QUERY
                    SELECT 
                        CASE 
                            WHEN mt.""TaskStatus"" = 'InProgress' THEN 'In Progress'
                            WHEN mt.""TaskStatus"" = 'PendingApproval' THEN 'Pending Approval'
                            WHEN mt.""TaskStatus"" = 'Approved' THEN 'Approved'
                            WHEN mt.""TaskStatus"" = 'Rejected' THEN 'Rejected'
                            ELSE 'Other'
                        END AS phase_name,
                        AVG(EXTRACT(EPOCH FROM (COALESCE(mt.""TaskCompletedAt"", CURRENT_TIMESTAMP) - COALESCE(mt.""TaskStartedAt"", mt.""SubmittedForApprovalAt"", CURRENT_TIMESTAMP))) / 3600) AS avg_time_hours,
                        COUNT(*) AS task_count
                    FROM ""MediaTasks"" mt
                    WHERE mt.""WorkflowId"" = workflow_id_param
                    GROUP BY phase_name;
                END;
                $$ LANGUAGE plpgsql;
            ");

            // Function to calculate approval rate per user
            migrationBuilder.Sql(@"
                CREATE OR REPLACE FUNCTION get_user_approval_rate(manager_id_param VARCHAR(450))
                RETURNS TABLE (
                    total_tasks BIGINT,
                    approved_tasks BIGINT,
                    rejected_tasks BIGINT,
                    approval_rate NUMERIC
                ) AS $$
                BEGIN
                    RETURN QUERY
                    SELECT 
                        COUNT(*) AS total_tasks,
                        COUNT(*) FILTER (WHERE mt.""TaskStatus"" = 'Approved') AS approved_tasks,
                        COUNT(*) FILTER (WHERE mt.""TaskStatus"" = 'Rejected') AS rejected_tasks,
                        CASE 
                            WHEN COUNT(*) > 0 THEN 
                                ROUND((COUNT(*) FILTER (WHERE mt.""TaskStatus"" = 'Approved')::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
                            ELSE 0
                        END AS approval_rate
                    FROM ""MediaTasks"" mt
                    WHERE mt.""ManagerId"" = manager_id_param;
                END;
                $$ LANGUAGE plpgsql;
            ");

            // Function to calculate average task preparation time
            migrationBuilder.Sql(@"
                CREATE OR REPLACE FUNCTION get_avg_task_preparation_time()
                RETURNS TABLE (
                    task_name VARCHAR(200),
                    avg_prep_time_hours NUMERIC,
                    task_count BIGINT
                ) AS $$
                BEGIN
                    RETURN QUERY
                    SELECT 
                        mt.""TaskName""::VARCHAR(200),
                        AVG(EXTRACT(EPOCH FROM (mt.""SubmittedForApprovalAt"" - mt.""TaskStartedAt"")) / 3600) AS avg_prep_time_hours,
                        COUNT(*) AS task_count
                    FROM ""MediaTasks"" mt
                    WHERE mt.""TaskStartedAt"" IS NOT NULL 
                      AND mt.""SubmittedForApprovalAt"" IS NOT NULL
                    GROUP BY mt.""TaskName"";
                END;
                $$ LANGUAGE plpgsql;
            ");

            // Function to get workflow performance summary
            migrationBuilder.Sql(@"
                CREATE OR REPLACE FUNCTION get_workflow_performance_summary()
                RETURNS TABLE (
                    workflow_id INT,
                    workflow_description TEXT,
                    total_ads BIGINT,
                    completed_ads BIGINT,
                    avg_completion_time_hours NUMERIC,
                    avg_tasks_per_ad NUMERIC
                ) AS $$
                BEGIN
                    RETURN QUERY
                    SELECT 
                        mw.""MediaWorkflowId"",
                        mw.""WorkflowDescription"",
                        COUNT(DISTINCT a.""AdId"") AS total_ads,
                        COUNT(DISTINCT a.""AdId"") FILTER (WHERE a.""CurrentPhase"" = 3) AS completed_ads,
                        AVG(EXTRACT(EPOCH FROM (a.""PublicationDate"" - a.""CreationDate"")) / 3600) AS avg_completion_time_hours,
                        (COUNT(mt.""MediaTaskId"")::NUMERIC / NULLIF(COUNT(DISTINCT a.""AdId""), 0)) AS avg_tasks_per_ad
                    FROM ""MediaWorkflows"" mw
                    LEFT JOIN ""Ads"" a ON a.""MediaWorkflowId"" = mw.""MediaWorkflowId""
                    LEFT JOIN ""MediaTasks"" mt ON mt.""WorkflowId"" = mw.""MediaWorkflowId""
                    GROUP BY mw.""MediaWorkflowId"", mw.""WorkflowDescription"";
                END;
                $$ LANGUAGE plpgsql;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP FUNCTION IF EXISTS get_workflow_phase_efficiency(INT);");
            migrationBuilder.Sql("DROP FUNCTION IF EXISTS get_user_approval_rate(VARCHAR);");
            migrationBuilder.Sql("DROP FUNCTION IF EXISTS get_avg_task_preparation_time();");
            migrationBuilder.Sql("DROP FUNCTION IF EXISTS get_workflow_performance_summary();");
        }
    }
}
