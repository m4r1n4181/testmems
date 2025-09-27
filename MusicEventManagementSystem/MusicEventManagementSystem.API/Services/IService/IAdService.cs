using MusicEventManagementSystem.API.DTOs.MediaCampaign;
using MusicEventManagementSystem.Enums;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IAdService
    {
        Task<IEnumerable<AdResponseDto>> GetAllAdsAsync();
        Task<AdResponseDto?> GetAdByIdAsync(int id);
        Task<AdResponseDto> CreateAdAsync(AdCreateDto createDto);
        Task<AdResponseDto?> UpdateAdAsync(int id, AdUpdateDto updateDto);
        Task<bool> DeleteAdAsync(int id);

        Task<IEnumerable<AdResponseDto>> GetByDeadlineAsync(DateTime deadline);
        Task<IEnumerable<AdResponseDto>> GetByTitleAsync(string title);
        Task<IEnumerable<AdResponseDto>> GetByCreationDateAsync(DateTime creationDate);
        Task<IEnumerable<AdResponseDto>> GetByCurrentPhaseAsync(AdStatus currentPhase);
        Task<IEnumerable<AdResponseDto>> GetByPublicationDateAsync(DateTime publicationDate);
        Task<IEnumerable<AdResponseDto>> GetByMediaWorkflowIdAsync(int mediaWorkflowId);
        Task<IEnumerable<AdResponseDto>> GetByCampaignIdAsync(int campaignId);
        Task<IEnumerable<AdResponseDto>> GetByAdTypeIdAsync(int adTypeId);
    }
}