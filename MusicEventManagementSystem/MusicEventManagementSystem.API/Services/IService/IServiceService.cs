using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IServiceService
    {
        Task<IEnumerable<Service>> GetAllServicesAsync();
        Task<Service?> GetServiceByIdAsync(int id);
        Task<Service> CreateServiceAsync(Service service, Resource resource);
        Task<Service?> UpdateServiceAsync(int id, Service service);
        Task<bool> DeleteServiceAsync(int id);
    }
}