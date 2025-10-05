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
        private readonly IMediaTaskRepository _mediaTaskRepository;
        private readonly IIntegrationStatusService _integrationStatusService;

        public AdService(
            IAdRepository adRepository, 
            IMediaTaskRepository mediaTaskRepository,
            IIntegrationStatusService integrationStatusService)
        {
            _adRepository = adRepository;
            _mediaTaskRepository = mediaTaskRepository;
            _integrationStatusService = integrationStatusService;
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
            if (dto.CreatedById != null) ad.CreatedById = dto.CreatedById;

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

        public async Task<PublicationScheduleResultDto> SchedulePublicationAsync(int adId, PublicationScheduleDto dto)
        {
            // Check if all tasks in the workflow are approved
            var canSchedule = await CanSchedulePublicationAsync(adId);
            if (!canSchedule)
            {
                return new PublicationScheduleResultDto
                {
                    Success = false,
                    Message = "Cannot schedule publication. Not all workflow tasks are approved."
                };
            }

            // Create integration status for scheduled publication
            var integrationStatusDto = new IntegrationStatusCreateDto
            {
                Status = API.Enums.StatusIntegration.Scheduled,
                PublicationDate = dto.PublicationDate,
                AdId = adId,
                ChannelId = dto.ChannelId,
                Error = dto.Notes,
                LastSynced = DateTime.UtcNow
            };

            var integrationStatus = await _integrationStatusService.CreateIntegrationStatusAsync(integrationStatusDto);

            // Update ad publication date and phase
            await UpdateAdAsync(adId, new AdUpdateDto
            {
                PublicationDate = dto.PublicationDate,
                CurrentPhase = AdStatus.ScheduledPublication
            });

            return new PublicationScheduleResultDto
            {
                Success = true,
                Message = "Publication scheduled successfully.",
                IntegrationStatusId = integrationStatus.IntegrationStatusId
            };
        }

        public async Task<bool> CanSchedulePublicationAsync(int adId)
        {
            var ad = await _adRepository.GetByIdAsync(adId);
            if (ad == null)
                return false;

            // Get all tasks in the workflow for this ad
            var workflowTasks = await _mediaTaskRepository.GetByWorkflowIdAsync(ad.MediaWorkflowId);
            var adTasks = workflowTasks.Where(t => t.AdId == adId).ToList();

            // Check if all tasks are approved
            return adTasks.Any() && adTasks.All(t => t.TaskStatus?.ToLower() == "approved");
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
            AdTypeId = ad.AdTypeId,
            CreatedById = ad.CreatedById
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
            AdTypeId = dto.AdTypeId,
            CreatedById = dto.CreatedById
        };
    }
}