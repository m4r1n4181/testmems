using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IRequirementService
    {
        Task<IEnumerable<Requirement>> GetAllRequirementsAsync();
        Task<Requirement?> GetRequirementByIdAsync(int id);
        Task<Requirement> CreateRequirementAsync(Requirement requirement);
        Task<Requirement?> UpdateRequirementAsync(int id, Requirement requirement);
        Task<bool> DeleteRequirementAsync(int id);
    }
}
