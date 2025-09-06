using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IEventService
    {
        Task<IEnumerable<Event>> GetAllEventsAsync();
        Task<Event?> GetEventByIdAsync(int id);
        Task<Event> CreateEventAsync(Event @event);
        Task<Event?> UpdateEventAsync(int id, Event @event);
        Task<bool> DeleteEventAsync(int id);
    }
}