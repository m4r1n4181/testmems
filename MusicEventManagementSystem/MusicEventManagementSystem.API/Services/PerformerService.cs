using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.API.Services.IService;

namespace MusicEventManagementSystem.API.Services
{
    public class PerformerService : IPerformerService
    {
        private readonly IPerformerRepository _performerRepository;

        public PerformerService(IPerformerRepository performerRepository)
        {
            _performerRepository = performerRepository;
        }

        public async Task<IEnumerable<Performer>> GetAllPerformersAsync()
        {
            return await _performerRepository.GetAllAsync();
        }

        public async Task<Performer?> GetPerformerByIdAsync(int id)
        {
            return await _performerRepository.GetByIdAsync(id);
        }

        public async Task<Performer> CreatePerformerAsync(Performer performer)
        {
            performer.CreatedAt = DateTime.UtcNow;
            performer.UpdatedAt = DateTime.UtcNow;
            await _performerRepository.AddAsync(performer);
            await _performerRepository.SaveChangesAsync();
            return performer;
        }

        public async Task<Performer?> UpdatePerformerAsync(int id, Performer performer)
        {
            var existingPerformer = await _performerRepository.GetByIdAsync(id);
            if (existingPerformer == null)
            {
                return null;
            }

            existingPerformer.Name = performer.Name;
            existingPerformer.Genre = performer.Genre;
            existingPerformer.Description = performer.Description;
            existingPerformer.ContactEmail = performer.ContactEmail;
            existingPerformer.ContactPhone = performer.ContactPhone;
            existingPerformer.UpdatedAt = DateTime.UtcNow;

            _performerRepository.Update(existingPerformer);
            await _performerRepository.SaveChangesAsync();
            return existingPerformer;
        }

        public async Task<bool> DeletePerformerAsync(int id)
        {
            var performer = await _performerRepository.GetByIdAsync(id);
            if (performer == null)
            {
                return false;
            }

            _performerRepository.Delete(performer);
            await _performerRepository.SaveChangesAsync();
            return true;
        }
    }
}