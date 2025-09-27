using MusicEventManagementSystem.API.DTOs.MediaCampaign;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.API.Services.IService;
using MusicEventManagementSystem.Enums;

namespace MusicEventManagementSystem.API.Services
{
    public class AdService : IAdService
    {
        private readonly IAdRepository _adRepository;

        public AdService(IAdRepository adRepository)
        {
            _adRepository = adRepository;
        }

        public async Task<IEnumerable<AdResponseDto>> GetAllAdsAsync()
        {
            var ads = await _adRepository.GetAllAsync();
            return ads.Select(MapToResponseDto);
        }

        public async Task<AdResponseDto?> GetAdByIdAsync(int id)
        {
            var ad = await _adRepository.GetByIdAsync(id);
            return ad == null ? null : MapToResponseDto(ad);
        }

        public async Task<AdResponseDto> CreateAdAsync(AdCreateDto dto)
        {
            var ad = MapToEntity(dto);
            await _adRepository.AddAsync(ad);
            await _adRepository.SaveChangesAsync();
            return MapToResponseDto(ad);
        }

        public async Task<AdResponseDto?> UpdateAdAsync(int id, AdUpdateDto dto)
        {
            var ad = await _adRepository.GetByIdAsync(id);
            if (ad == null) return null;

            if (dto.Deadline.HasValue) ad.Deadline = dto.Deadline.Value;
            if (dto.Title != null) ad.Title = dto.Title;
            if (dto.CreationDate.HasValue) ad.CreationDate = dto.CreationDate.Value;
            if (dto.CurrentPhase.HasValue) ad.CurrentPhase = dto.CurrentPhase.Value;
            if (dto.PublicationDate.HasValue) ad.PublicationDate = dto.PublicationDate.Value;
            if (dto.MediaWorkflowId.HasValue) ad.MediaWorkflowId = dto.MediaWorkflowId.Value;
            if (dto.CampaignId.HasValue) ad.CampaignId = dto.CampaignId.Value;
            if (dto.AdTypeId.HasValue) ad.AdTypeId = dto.AdTypeId.Value;
            if (dto.IntegrationStatusId.HasValue) ad.IntegrationStatusId = dto.IntegrationStatusId.Value;
            if (dto.MediaVersionId.HasValue) ad.MediaVersionId = dto.MediaVersionId.Value;

            _adRepository.Update(ad);
            await _adRepository.SaveChangesAsync();
            return MapToResponseDto(ad);
        }

        public async Task<bool> DeleteAdAsync(int id)
        {
            var ad = await _adRepository.GetByIdAsync(id);
            if (ad == null) return false;
            _adRepository.Delete(ad);
            await _adRepository.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<AdResponseDto>> GetByDeadlineAsync(DateTime deadline)
        {
            var ads = await _adRepository.GetByDeadlineAsync(deadline);
            return ads.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<AdResponseDto>> GetByTitleAsync(string title)
        {
            var ads = await _adRepository.GetByTitleAsync(title);
            return ads.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<AdResponseDto>> GetByCreationDateAsync(DateTime creationDate)
        {
            var ads = await _adRepository.GetByCreationDateAsync(creationDate);
            return ads.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<AdResponseDto>> GetByCurrentPhaseAsync(AdStatus currentPhase)
        {
            var ads = await _adRepository.GetByCurrentPhaseAsync(currentPhase);
            return ads.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<AdResponseDto>> GetByPublicationDateAsync(DateTime publicationDate)
        {
            var ads = await _adRepository.GetByPublicationDateAsync(publicationDate);
            return ads.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<AdResponseDto>> GetByMediaWorkflowIdAsync(int mediaWorkflowId)
        {
            var ads = await _adRepository.GetByMediaWorkflowIdAsync(mediaWorkflowId);
            return ads.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<AdResponseDto>> GetByCampaignIdAsync(int campaignId)
        {
            var ads = await _adRepository.GetByCampaignIdAsync(campaignId);
            return ads.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<AdResponseDto>> GetByAdTypeIdAsync(int adTypeId)
        {
            var ads = await _adRepository.GetByAdTypeIdAsync(adTypeId);
            return ads.Select(MapToResponseDto);
        }

        private static AdResponseDto MapToResponseDto(Ad ad) => new()
        {
            AdId = ad.AdId,
            Deadline = ad.Deadline,
            Title = ad.Title,
            CreationDate = ad.CreationDate,
            CurrentPhase = ad.CurrentPhase,
            PublicationDate = ad.PublicationDate,
            MediaWorkflowId = ad.MediaWorkflowId,
            CampaignId = ad.CampaignId,
            AdTypeId = ad.AdTypeId
        };

        private static Ad MapToEntity(AdCreateDto dto) => new()
        {
            Deadline = dto.Deadline,
            Title = dto.Title,
            CreationDate = dto.CreationDate,
            CurrentPhase = dto.CurrentPhase,
            PublicationDate = dto.PublicationDate,
            MediaWorkflowId = dto.MediaWorkflowId,
            CampaignId = dto.CampaignId,
            AdTypeId = dto.AdTypeId
        };
    }
}