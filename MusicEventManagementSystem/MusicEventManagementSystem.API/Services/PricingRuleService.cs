using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.API.Services.IService;

namespace MusicEventManagementSystem.API.Services
{
    public class PricingRuleService : IPricingRuleService
    {
        private readonly IPricingRuleRepository _pricingRuleRepository;

        public PricingRuleService(IPricingRuleRepository pricingRuleRepository)
        {
            _pricingRuleRepository = pricingRuleRepository;
        }

        public async Task<IEnumerable<PricingRule>> GetAllPricingRulesAsync()
        {
            return await _pricingRuleRepository.GetAllAsync();
        }

        public async Task<PricingRule?> GetPricingRuleByIdAsync(int id)
        {
            return await _pricingRuleRepository.GetByIdAsync(id);
        }

        public async Task<PricingRule> CreatePricingRuleAsync(PricingRule pricingRule)
        {
            await _pricingRuleRepository.AddAsync(pricingRule);
            await _pricingRuleRepository.SaveChangesAsync();
            return pricingRule;
        }

        public async Task<PricingRule?> UpdatePricingRuleAsync(int id, PricingRule pricingRule)
        {
            var existingPricingRule = await _pricingRuleRepository.GetByIdAsync(id);
            if (existingPricingRule == null)
            {
                return null;
            }

            existingPricingRule.Name = pricingRule.Name;
            existingPricingRule.Description = pricingRule.Description;
            existingPricingRule.MinimumPrice = pricingRule.MinimumPrice;
            existingPricingRule.MaximumPrice = pricingRule.MaximumPrice;
            existingPricingRule.OccupancyPercentage1 = pricingRule.OccupancyPercentage1;
            existingPricingRule.OccupancyPercentage2 = pricingRule.OccupancyPercentage2;
            existingPricingRule.OccupancyThreshold1 = pricingRule.OccupancyThreshold1;
            existingPricingRule.OccupancyThreshold2 = pricingRule.OccupancyThreshold2;
            existingPricingRule.EarlyBirdPercentage = pricingRule.EarlyBirdPercentage;
            existingPricingRule.DynamicCondition = pricingRule.DynamicCondition;
            existingPricingRule.Modifier = pricingRule.Modifier;

            _pricingRuleRepository.Update(existingPricingRule);
            await _pricingRuleRepository.SaveChangesAsync();
            return existingPricingRule;
        }

        public async Task<bool> DeletePricingRuleAsync(int id)
        {
            var pricingRule = await _pricingRuleRepository.GetByIdAsync(id);
            
            if (pricingRule == null)
            {
                return false;
            }

            _pricingRuleRepository.Delete(pricingRule);
            await _pricingRuleRepository.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<PricingRule>> GetActivePricingRulesAsync()
        {
            return await _pricingRuleRepository.GetActivePricingRulesAsync();
        }

        public async Task<IEnumerable<PricingRule>> GetPricingRulesByEventAsync(int eventId)
        {
            return await _pricingRuleRepository.GetPricingRulesByEventAsync(eventId);
        }

        public async Task<IEnumerable<PricingRule>> GetPricingRulesByTicketTypeAsync(int ticketTypeId)
        {
            return await _pricingRuleRepository.GetPricingRulesByTicketTypeAsync(ticketTypeId);
        }

        public async Task<decimal> CalculatePriceAsync(int pricingRuleId, decimal basePrice, decimal occupancyRate, bool isEarlyBird = false)
        {
            return await _pricingRuleRepository.CalculatePriceAsync(pricingRuleId, basePrice, occupancyRate, isEarlyBird);
        }
    }
}
