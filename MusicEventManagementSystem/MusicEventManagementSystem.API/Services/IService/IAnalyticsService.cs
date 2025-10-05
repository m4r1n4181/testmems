using MusicEventManagementSystem.API.DTOs.MediaCampaign;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IAnalyticsService
    {
        Task<IEnumerable<WorkflowPhaseEfficiencyDto>> GetWorkflowPhaseEfficiencyAsync(int workflowId);
        Task<UserApprovalRateDto> GetUserApprovalRateAsync(string managerId);
        Task<IEnumerable<AvgTaskPreparationTimeDto>> GetAvgTaskPreparationTimeAsync();
        Task<IEnumerable<WorkflowPerformanceSummaryDto>> GetWorkflowPerformanceSummaryAsync();
    }
}
