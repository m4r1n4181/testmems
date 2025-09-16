using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.API.Services.IService;

namespace MusicEventManagementSystem.API.Services
{
    public class RequirementService : IRequirementService
    {
        private readonly IRequirementRepository _requirementRepository;

        public RequirementService(IRequirementRepository requirementRepository)
        {
            _requirementRepository = requirementRepository;
        }

        public async Task<IEnumerable<Requirement>> GetAllRequirementsAsync()
        {
            return await _requirementRepository.GetAllAsync();
        }

        public async Task<Requirement?> GetRequirementByIdAsync(int id)
        {
            return await _requirementRepository.GetByIdAsync(id);
        }

        public async Task<Requirement> CreateRequirementAsync(Requirement requirement)
        {
            requirement.CreatedAt = DateTime.Now;
            await _requirementRepository.AddAsync(requirement);
            await _requirementRepository.SaveChangesAsync();
            return requirement;
        }

        public async Task<Requirement?> UpdateRequirementAsync(int id, Requirement requirement)
        {
            var existingRequirement = await _requirementRepository.GetByIdAsync(id);
            if (existingRequirement == null)
            {
                return null;
            }

            existingRequirement.Title = requirement.Title;
            existingRequirement.Description = requirement.Description;
            existingRequirement.Fulfilled = requirement.Fulfilled;

            _requirementRepository.Update(existingRequirement);
            await _requirementRepository.SaveChangesAsync();
            return existingRequirement;
        }

        public async Task<bool> DeleteRequirementAsync(int id)
        {
            var requirement = await _requirementRepository.GetByIdAsync(id);
            if (requirement == null)
            {
                return false;
            }

            _requirementRepository.Delete(requirement);
            await _requirementRepository.SaveChangesAsync();
            return true;
        }
    }
}
