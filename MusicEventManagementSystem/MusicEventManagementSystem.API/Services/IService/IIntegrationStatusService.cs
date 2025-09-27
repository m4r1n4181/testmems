using MusicEventManagementSystem.API.DTOs.MediaCampaign;
using MusicEventManagementSystem.API.Enums;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IIntegrationStatusService
    {
        Task<IEnumerable<IntegrationStatusResponseDto>> GetAllIntegrationStatusesAsync();
        Task<IntegrationStatusResponseDto?> GetIntegrationStatusByIdAsync(int id);
        Task<IntegrationStatusResponseDto> CreateIntegrationStatusAsync(IntegrationStatusCreateDto createDto);
        Task<IntegrationStatusResponseDto?> UpdateIntegrationStatusAsync(int id, IntegrationStatusUpdateDto updateDto);
        Task<bool> DeleteIntegrationStatusAsync(int id);

        Task<IEnumerable<IntegrationStatusResponseDto>> GetByAdIdAsync(int adId);
        Task<IEnumerable<IntegrationStatusResponseDto>> GetByChannelIdAsync(int channelId);
        Task<IEnumerable<IntegrationStatusResponseDto>> GetByStatusAsync(StatusIntegration status);
        Task<IEnumerable<IntegrationStatusResponseDto>> GetByPublicationDateAsync(DateTime publicationDate);
        Task<IEnumerable<IntegrationStatusResponseDto>> GetByErrorAsync(string error);
        Task<IEnumerable<IntegrationStatusResponseDto>> GetByLastSyncedAsync(DateTime lastSynced);
    }
}