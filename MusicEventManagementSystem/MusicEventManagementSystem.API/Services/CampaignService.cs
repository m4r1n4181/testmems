using MusicEventManagementSystem.API.DTOs.MediaCampaign;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.API.Services.IService;

namespace MusicEventManagementSystem.API.Services
{
    public class CampaignService : ICampaignService
    {
        private readonly ICampaignRepository _campaignRepository;

        public CampaignService(ICampaignRepository campaignRepository)
        {
            _campaignRepository = campaignRepository;
        }

        public async Task<IEnumerable<CampaignResponseDto>> GetAllCampaignsAsync()
        {
            var campaigns = await _campaignRepository.GetAllAsync();
            return campaigns.Select(MapToResponseDto);
        }

        public async Task<CampaignResponseDto?> GetCampaignByIdAsync(int id)
        {
            var campaign = await _campaignRepository.GetByIdAsync(id);
            return campaign == null ? null : MapToResponseDto(campaign);
        }

        public async Task<CampaignResponseDto> CreateCampaignAsync(CampaignCreateDto dto)
        {
            var campaign = MapToEntity(dto);
            await _campaignRepository.AddAsync(campaign);
            await _campaignRepository.SaveChangesAsync();
            return MapToResponseDto(campaign);
        }

        public async Task<CampaignResponseDto?> UpdateCampaignAsync(int id, CampaignUpdateDto dto)
        {
            var campaign = await _campaignRepository.GetByIdAsync(id);
            if (campaign == null) return null;

            if (dto.EventId.HasValue) campaign.EventId = dto.EventId.Value;
            if (dto.Name != null) campaign.Name = dto.Name;
            if (dto.StartDate.HasValue) campaign.StartDate = dto.StartDate.Value;
            if (dto.EndDate.HasValue) campaign.EndDate = dto.EndDate.Value;
            if (dto.TotalBudget.HasValue) campaign.TotalBudget = dto.TotalBudget.Value;

            _campaignRepository.Update(campaign);
            await _campaignRepository.SaveChangesAsync();
            return MapToResponseDto(campaign);
        }

        public async Task<bool> DeleteCampaignAsync(int id)
        {
            var campaign = await _campaignRepository.GetByIdAsync(id);
            if (campaign == null) return false;
            _campaignRepository.Delete(campaign);
            await _campaignRepository.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<CampaignResponseDto>> GetByEventIdAsync(int eventId)
        {
            var campaigns = await _campaignRepository.GetByEventIdAsync(eventId);
            return campaigns.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<CampaignResponseDto>> GetByNameAsync(string name)
        {
            var campaigns = await _campaignRepository.GetByNameAsync(name);
            return campaigns.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<CampaignResponseDto>> GetByStartDateAsync(DateTime startDate)
        {
            var campaigns = await _campaignRepository.GetByStartDateAsync(startDate);
            return campaigns.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<CampaignResponseDto>> GetByEndDateAsync(DateTime endDate)
        {
            var campaigns = await _campaignRepository.GetByEndDateAsync(endDate);
            return campaigns.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<CampaignResponseDto>> GetByTotalBudgetAsync(decimal totalBudget)
        {
            var campaigns = await _campaignRepository.GetByTotalBudgetAsync(totalBudget);
            return campaigns.Select(MapToResponseDto);
        }

        private static CampaignResponseDto MapToResponseDto(Campaign campaign) => new()
        {
            CampaignId = campaign.CampaignId,
            EventId = campaign.EventId,
            Name = campaign.Name,
            StartDate = campaign.StartDate,
            EndDate = campaign.EndDate,
            TotalBudget = campaign.TotalBudget,
            AdIds = campaign.Ads?.Select(a => a.AdId).ToList()
        };

        private static Campaign MapToEntity(CampaignCreateDto dto) => new()
        {
            EventId = dto.EventId,
            Name = dto.Name,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            TotalBudget = dto.TotalBudget
        };
    }
}