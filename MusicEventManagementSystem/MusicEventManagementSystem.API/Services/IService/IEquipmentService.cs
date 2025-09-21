using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IEquipmentService
    {
        Task<IEnumerable<Equipment>> GetAllEquipmentAsync();
        Task<Equipment?> GetEquipmentByIdAsync(int id);
        Task<Equipment> CreateEquipmentAsync(Equipment equipment, Resource resource);
        Task<Equipment?> UpdateEquipmentAsync(int id, Equipment equipment);
        Task<bool> DeleteEquipmentAsync(int id);
    }
}