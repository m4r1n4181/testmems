namespace MusicEventManagementSystem.API.DTOs.MediaCampaign
{
    public class WorkflowPhaseEfficiencyDto
    {
        public string PhaseName { get; set; } = string.Empty;
        public decimal AvgTimeHours { get; set; }
        public long TaskCount { get; set; }
    }

    public class UserApprovalRateDto
    {
        public long TotalTasks { get; set; }
        public long ApprovedTasks { get; set; }
        public long RejectedTasks { get; set; }
        public decimal ApprovalRate { get; set; }
    }

    public class AvgTaskPreparationTimeDto
    {
        public string TaskName { get; set; } = string.Empty;
        public decimal AvgPrepTimeHours { get; set; }
        public long TaskCount { get; set; }
    }

    public class WorkflowPerformanceSummaryDto
    {
        public int WorkflowId { get; set; }
        public string? WorkflowDescription { get; set; }
        public long TotalAds { get; set; }
        public long CompletedAds { get; set; }
        public decimal? AvgCompletionTimeHours { get; set; }
        public decimal? AvgTasksPerAd { get; set; }
    }
}
