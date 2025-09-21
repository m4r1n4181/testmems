using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;
using MusicEventManagementSystem.Enums;

namespace MusicEventManagementSystem.API.Repositories
{
    public class VehicleRepository : Repository<Vehicle>, IVehicleRepository
    {
        public VehicleRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Vehicle?> GetByLicensePlateAsync(string licensePlate)
        {
            return await _dbSet.FirstOrDefaultAsync(v => v.LicensePlate == licensePlate);
        }

        public async Task<IEnumerable<Vehicle>> GetByTypeAsync(VehicleType type)
        {
            return await _dbSet.Where(v => v.VehicleType == type).ToListAsync();
        }
    }
}