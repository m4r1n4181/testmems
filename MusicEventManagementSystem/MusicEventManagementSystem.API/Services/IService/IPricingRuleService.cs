using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IPricingRuleService
    {
        Task<IEnumerable<PricingRule>> GetAllPricingRulesAsync();
        Task<PricingRule?> GetPricingRuleByIdAsync(int id);
        Task<PricingRule> CreatePricingRuleAsync(PricingRule pricingRule);
        Task<PricingRule?> UpdatePricingRuleAsync(int id, PricingRule pricingRule);
        Task<bool> DeletePricingRuleAsync(int id);
    }
}
