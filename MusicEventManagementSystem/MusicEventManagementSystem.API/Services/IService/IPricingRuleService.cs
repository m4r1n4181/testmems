using MusicEventManagementSystem.API.DTOs.TicketSales;
using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IPricingRuleService
    {
        Task<IEnumerable<PricingRuleResponseDto>> GetAllPricingRulesAsync();
        Task<PricingRuleResponseDto?> GetPricingRuleByIdAsync(int id);
        Task<PricingRuleResponseDto> CreatePricingRuleAsync(PricingRuleCreateDto dto);
        Task<PricingRuleResponseDto?> UpdatePricingRuleAsync(int id, PricingRuleUpdateDto dto);
        Task<bool> DeletePricingRuleAsync(int id);

        Task<IEnumerable<PricingRuleResponseDto>> GetActivePricingRulesAsync();
        Task<IEnumerable<PricingRuleResponseDto>> GetPricingRulesByEventAsync(int eventId);
        Task<IEnumerable<PricingRuleResponseDto>> GetPricingRulesByTicketTypeAsync(int ticketTypeId);
        Task<decimal> CalculatePriceAsync(int pricingRuleId, CalculatePriceRequestDto dto);
    }
}
