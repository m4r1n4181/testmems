using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.Enums;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface IStaffRepository : IRepository<Staff>
    {
        Task<IEnumerable<Staff>> GetByRoleAsync(StaffRole role);
        Task<IEnumerable<Staff>> GetBySkillLevelAsync(RequiredSkillLevel skillLevel);
    }
}