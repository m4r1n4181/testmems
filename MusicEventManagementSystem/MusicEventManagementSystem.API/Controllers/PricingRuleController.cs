using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Services;
using MusicEventManagementSystem.API.Services.IService;
using System;

namespace MusicEventManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PricingRuleController : ControllerBase
    {
        private readonly IPricingRuleService _pricingRuleService;

        public PricingRuleController(IPricingRuleService pricingRuleService)
        {
            _pricingRuleService = pricingRuleService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PricingRule>>> GetAllPricingRules()
        {
            try
            {
                var pricingRules = await _pricingRuleService.GetAllPricingRulesAsync();
                return Ok(pricingRules);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PricingRule>> GetPricingRuleById(int id)
        {
            try
            {
                var existingPricingRule = await _pricingRuleService.GetPricingRuleByIdAsync(id);

                if (existingPricingRule == null)
                {
                    return NotFound($"Pricing Rule with ID {id} not found.");
                }

                return Ok(existingPricingRule);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<PricingRule>> CreatePricingRule([FromBody] PricingRule pricingRule)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var createdPricingRule = await _pricingRuleService.CreatePricingRuleAsync(pricingRule);

                return CreatedAtAction(nameof(GetPricingRuleById), new { id = createdPricingRule.PricingRuleId }, createdPricingRule);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<PricingRule>> UpdatePricingRule(int id, [FromBody] PricingRule pricingRule)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var updatedPricingRule = await _pricingRuleService.UpdatePricingRuleAsync(id, pricingRule);

                if (updatedPricingRule == null)
                {
                    return NotFound($"Pricing Rule with ID {id} not found.");
                }

                return Ok(updatedPricingRule);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePricingRule(int id)
        {
            try
            {
                var isDeleted = await _pricingRuleService.DeletePricingRuleAsync(id);

                if (isDeleted == false)
                {
                    return NotFound($"Pricing Rule with ID {id} not found.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
