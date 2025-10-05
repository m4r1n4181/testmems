using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.DTOs.MediaCampaign;
using MusicEventManagementSystem.API.Services.IService;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Services
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly ApplicationDbContext _context;

        public AnalyticsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<WorkflowPhaseEfficiencyDto>> GetWorkflowPhaseEfficiencyAsync(int workflowId)
        {
            var result = await _context.Database
                .SqlQueryRaw<WorkflowPhaseEfficiencyDto>(
                    $"SELECT * FROM get_workflow_phase_efficiency({workflowId})")
                .ToListAsync();
            return result;
        }

        public async Task<UserApprovalRateDto> GetUserApprovalRateAsync(string managerId)
        {
            var result = await _context.Database
                .SqlQueryRaw<UserApprovalRateDto>(
                    $"SELECT * FROM get_user_approval_rate('{managerId}')")
                .FirstOrDefaultAsync();
            return result ?? new UserApprovalRateDto();
        }

        public async Task<IEnumerable<AvgTaskPreparationTimeDto>> GetAvgTaskPreparationTimeAsync()
        {
            var result = await _context.Database
                .SqlQueryRaw<AvgTaskPreparationTimeDto>(
                    "SELECT * FROM get_avg_task_preparation_time()")
                .ToListAsync();
            return result;
        }

        public async Task<IEnumerable<WorkflowPerformanceSummaryDto>> GetWorkflowPerformanceSummaryAsync()
        {
            var result = await _context.Database
                .SqlQueryRaw<WorkflowPerformanceSummaryDto>(
                    "SELECT * FROM get_workflow_performance_summary()")
                .ToListAsync();
            return result;
        }
    }
}
