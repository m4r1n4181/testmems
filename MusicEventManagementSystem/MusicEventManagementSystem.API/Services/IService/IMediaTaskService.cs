using MusicEventManagementSystem.API.Models;
namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IMediaTaskService
    {
        Task<IEnumerable<MediaTask>> GetAllTasksAsync();
        Task<Task?> GetTaskByIdAsync(int id);
        Task<Task> CreateTaskAsync(Task task);
        Task<Task?> UpdateTaskAsync(int id, Task task);
        Task<bool> DeleteTaskAsync(int id);
    }
}