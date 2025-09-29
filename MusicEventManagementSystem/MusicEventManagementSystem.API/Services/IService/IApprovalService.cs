using MusicEventManagementSystem.API.DTOs.MediaCampaign;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IApprovalService
    {
        Task<IEnumerable<ApprovalResponseDto>> GetAllApprovalsAsync();
        Task<ApprovalResponseDto?> GetApprovalByIdAsync(int id);
        Task<ApprovalResponseDto> CreateApprovalAsync(ApprovalCreateDto createDto);
        Task<ApprovalResponseDto?> UpdateApprovalAsync(int id, ApprovalUpdateDto updateDto);
        Task<bool> DeleteApprovalAsync(int id);

        Task<IEnumerable<ApprovalResponseDto>> GetByApprovalStatusAsync(string approvalStatus);
        Task<IEnumerable<ApprovalResponseDto>> GetByCommentAsync(string comment);
        Task<IEnumerable<ApprovalResponseDto>> GetByApprovalDateAsync(DateTime approvalDate);
        Task<IEnumerable<ApprovalResponseDto>> GetByMediaTaskIdAsync(int mediaTaskId);
        Task<IEnumerable<ApprovalResponseDto>> GetApprovalsForManagerAsync(string managerId);
    }
}