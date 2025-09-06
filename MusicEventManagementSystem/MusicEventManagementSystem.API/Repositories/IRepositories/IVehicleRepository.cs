using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.Enums;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface IVehicleRepository : IRepository<Vehicle>
    {
        Task<Vehicle?> GetByLicensePlateAsync(string licensePlate);
        Task<IEnumerable<Vehicle>> GetByTypeAsync(VehicleType type);
    }
}