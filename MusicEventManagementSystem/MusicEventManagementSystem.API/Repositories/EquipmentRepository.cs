using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class EquipmentRepository : Repository<Equipment>, IEquipmentRepository
    {
        public EquipmentRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Equipment?> GetBySerialNumberAsync(string serialNumber)
        {
            return await _dbSet.FirstOrDefaultAsync(e => e.SerialNumber == serialNumber);
        }

        public async Task<IEnumerable<Equipment>> GetByModelAsync(string model)
        {
            return await _dbSet.Where(e => e.Model.Contains(model)).ToListAsync();
        }
    }
}