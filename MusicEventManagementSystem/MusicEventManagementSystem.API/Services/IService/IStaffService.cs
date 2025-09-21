using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IStaffService
    {
        Task<IEnumerable<Staff>> GetAllStaffAsync();
        Task<Staff?> GetStaffByIdAsync(int id);
        Task<Staff> CreateStaffAsync(Staff staff, Resource resource);
        Task<Staff?> UpdateStaffAsync(int id, Staff staff);
        Task<bool> DeleteStaffAsync(int id);
    }
}