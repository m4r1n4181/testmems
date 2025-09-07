using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.API.Services.IService;

namespace MusicEventManagementSystem.API.Services
{
    public class IntegrationStatusService : IIntegrationStatusService
    {
        private readonly IIntegrationStatusRepository _integrationStatusRepository;

        public IntegrationStatusService(IIntegrationStatusRepository integrationStatusRepository)
        {
            _integrationStatusRepository = integrationStatusRepository;
        }

        public async Task<IEnumerable<IntegrationStatus>> GetAllIntegrationStatusesAsync()
        {
            return await _integrationStatusRepository.GetAllAsync();
        }

        public async Task<IntegrationStatus?> GetIntegrationStatusByIdAsync(int id)
        {
            return await _integrationStatusRepository.GetByIdAsync(id);
        }

        public async Task<IntegrationStatus> CreateIntegrationStatusAsync(IntegrationStatus integrationStatus)
        {
            await _integrationStatusRepository.AddAsync(integrationStatus);
            await _integrationStatusRepository.SaveChangesAsync();
            return integrationStatus;
        }

        public async Task<IntegrationStatus?> UpdateIntegrationStatusAsync(int id, IntegrationStatus integrationStatus)
        {
            var existingIntegrationStatus = await _integrationStatusRepository.GetByIdAsync(id);
            if (existingIntegrationStatus == null)
            {
                return null;
            }

            existingIntegrationStatus.AdId = integrationStatus.AdId;
            existingIntegrationStatus.ChannelId = integrationStatus.ChannelId;
            existingIntegrationStatus.Status = integrationStatus.Status;
            existingIntegrationStatus.PublicationDate = integrationStatus.PublicationDate;
            existingIntegrationStatus.Error = integrationStatus.Error;
            existingIntegrationStatus.LastSynced = integrationStatus.LastSynced;

            _integrationStatusRepository.Update(existingIntegrationStatus);
            await _integrationStatusRepository.SaveChangesAsync();
            return existingIntegrationStatus;
        }

        public async Task<bool> DeleteIntegrationStatusAsync(int id)
        {
            var integrationStatus = await _integrationStatusRepository.GetByIdAsync(id);
            if (integrationStatus == null)
            {
                return false;
            }

            _integrationStatusRepository.Delete(integrationStatus);
            await _integrationStatusRepository.SaveChangesAsync();
            return true;
        }
    }
}