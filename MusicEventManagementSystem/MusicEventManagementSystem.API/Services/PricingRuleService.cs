﻿using MusicEventManagementSystem.API.DTOs.TicketSales;
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

        public async Task<IEnumerable<PricingRuleResponseDto>> GetAllPricingRulesAsync()
        {
            var pricingRules = await _pricingRuleRepository.GetAllAsync();
            return pricingRules.Select(MapToResponseDto);
        }

        public async Task<PricingRuleResponseDto?> GetPricingRuleByIdAsync(int id)
        {
            var existingPricingRule = await _pricingRuleRepository.GetByIdAsync(id);

            if (existingPricingRule == null)
            {
                return null;
            }

            return MapToResponseDto(existingPricingRule);
        }

        public async Task<PricingRuleResponseDto> CreatePricingRuleAsync(PricingRuleCreateDto createPricingRuleDto)
        {
            var pricingRule = MapToEntity(createPricingRuleDto);

            await _pricingRuleRepository.AddAsync(pricingRule);
            await _pricingRuleRepository.SaveChangesAsync();
            return MapToResponseDto(pricingRule);
        }

        public async Task<PricingRuleResponseDto?> UpdatePricingRuleAsync(int id, PricingRuleUpdateDto updatePricingRuleDto)
        {
            var existingPricingRule = await _pricingRuleRepository.GetByIdAsync(id);
            
            if (existingPricingRule == null)
            {
                return null;
            }

            if (!string.IsNullOrEmpty(updatePricingRuleDto.Name))
                existingPricingRule.Name = updatePricingRuleDto.Name;

            if (updatePricingRuleDto.Description != null)
                existingPricingRule.Description = updatePricingRuleDto.Description;

            if (updatePricingRuleDto.MinimumPrice.HasValue)
                existingPricingRule.MinimumPrice = updatePricingRuleDto.MinimumPrice.Value;

            if (updatePricingRuleDto.MaximumPrice.HasValue)
                existingPricingRule.MaximumPrice = updatePricingRuleDto.MaximumPrice.Value;

            if (updatePricingRuleDto.OccupancyPercentage1.HasValue)
                existingPricingRule.OccupancyPercentage1 = updatePricingRuleDto.OccupancyPercentage1.Value;

            if (updatePricingRuleDto.OccupancyPercentage2.HasValue)
                existingPricingRule.OccupancyPercentage2 = updatePricingRuleDto.OccupancyPercentage2.Value;

            if (updatePricingRuleDto.OccupancyThreshold1.HasValue)
                existingPricingRule.OccupancyThreshold1 = updatePricingRuleDto.OccupancyThreshold1.Value;

            if (updatePricingRuleDto.OccupancyThreshold2.HasValue)
                existingPricingRule.OccupancyThreshold2 = updatePricingRuleDto.OccupancyThreshold2.Value;

            if (updatePricingRuleDto.EarlyBirdPercentage.HasValue)
                existingPricingRule.EarlyBirdPercentage = updatePricingRuleDto.EarlyBirdPercentage.Value;

            if (updatePricingRuleDto.DynamicCondition != null)
                existingPricingRule.DynamicCondition = updatePricingRuleDto.DynamicCondition;

            if (updatePricingRuleDto.Modifier.HasValue)
                existingPricingRule.Modifier = updatePricingRuleDto.Modifier.Value;

            _pricingRuleRepository.Update(existingPricingRule);
            await _pricingRuleRepository.SaveChangesAsync();
            return MapToResponseDto(existingPricingRule);
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

        public async Task<IEnumerable<PricingRuleResponseDto>> GetActivePricingRulesAsync()
        {
            var pricingRules = await _pricingRuleRepository.GetActivePricingRulesAsync();
            return pricingRules.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<PricingRuleResponseDto>> GetPricingRulesByEventAsync(int eventId)
        {
            var pricingRules = await _pricingRuleRepository.GetPricingRulesByEventAsync(eventId);
            return pricingRules.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<PricingRuleResponseDto>> GetPricingRulesByTicketTypeAsync(int ticketTypeId)
        {
            var pricingRules = await _pricingRuleRepository.GetPricingRulesByTicketTypeAsync(ticketTypeId);
            return pricingRules.Select(MapToResponseDto);
        }

        public async Task<decimal> CalculatePriceAsync(int pricingRuleId, CalculatePriceRequestDto priceRequestDto)
        {
            if (priceRequestDto.OccupancyRate < 0 || priceRequestDto.OccupancyRate > 100)
                throw new ArgumentException("Occupancy rate must be between 0 and 100.");

            return await _pricingRuleRepository.CalculatePriceAsync(
                pricingRuleId, priceRequestDto.BasePrice, priceRequestDto.OccupancyRate, priceRequestDto.IsEarlyBird
            );
        }

        // Helper methods for mapping

        private static PricingRuleResponseDto MapToResponseDto(PricingRule pricingRule)
        {
            return new PricingRuleResponseDto
            {
                PricingRuleId = pricingRule.PricingRuleId,
                Name = pricingRule.Name,
                Description = pricingRule.Description,
                MinimumPrice = pricingRule.MinimumPrice,
                MaximumPrice = pricingRule.MaximumPrice,
                OccupancyPercentage1 = pricingRule.OccupancyPercentage1,
                OccupancyPercentage2 = pricingRule.OccupancyPercentage2,
                OccupancyThreshold1 = pricingRule.OccupancyThreshold1,
                OccupancyThreshold2 = pricingRule.OccupancyThreshold2,
                EarlyBirdPercentage = pricingRule.EarlyBirdPercentage,
                DynamicCondition = pricingRule.DynamicCondition,
                Modifier = pricingRule.Modifier,
                EventIds = pricingRule.Events?.Select(e => e.Id).ToList(),
                TicketTypesIds = pricingRule.TicketTypes?.Select(tt => tt.TicketTypeId).ToList()
            };
        }

        private static PricingRule MapToEntity(PricingRuleCreateDto dto)
        {
            return new PricingRule
            {
                Name = dto.Name,
                Description = dto.Description,
                MinimumPrice = dto.MinimumPrice,
                MaximumPrice = dto.MaximumPrice,
                OccupancyPercentage1 = dto.OccupancyPercentage1,
                OccupancyPercentage2 = dto.OccupancyPercentage2,
                OccupancyThreshold1 = dto.OccupancyThreshold1,
                OccupancyThreshold2 = dto.OccupancyThreshold2,
                EarlyBirdPercentage = dto.EarlyBirdPercentage,
                DynamicCondition = dto.DynamicCondition,
                Modifier = dto.Modifier
            };
        }
    }
}
