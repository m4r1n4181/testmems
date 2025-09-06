using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface IEquipmentRepository : IRepository<Equipment>
    {
        Task<Equipment?> GetBySerialNumberAsync(string serialNumber);
        Task<IEnumerable<Equipment>> GetByModelAsync(string model);
    }
}