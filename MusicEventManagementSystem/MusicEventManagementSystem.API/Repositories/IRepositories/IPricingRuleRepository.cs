using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface IPricingRuleRepository : IRepository<PricingRule>
    {
        Task<IEnumerable<PricingRule>> GetActivePricingRulesAsync();
        Task<IEnumerable<PricingRule>> GetPricingRulesByEventAsync(int eventId);
        Task<IEnumerable<PricingRule>> GetPricingRulesByTicketTypeAsync(int ticketTypeId);
        Task<decimal> CalculatePriceAsync(int pricingRuleId, decimal basePrice, decimal occupancyRate, bool isEarlyBird = false);
    }
}
