using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;
using MusicEventManagementSystem.Enums;

namespace MusicEventManagementSystem.API.Repositories
{
    public class StaffRepository : Repository<Staff>, IStaffRepository
    {
        public StaffRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Staff>> GetByRoleAsync(StaffRole role)
        {
            return await _dbSet.Where(s => s.Role == role).ToListAsync();
        }

        public async Task<IEnumerable<Staff>> GetBySkillLevelAsync(RequiredSkillLevel skillLevel)
        {
            return await _dbSet.Where(s => s.RequiredSkillLevel == skillLevel).ToListAsync();
        }
    }
}