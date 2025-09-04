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
    public class SpecialOfferController : ControllerBase
    {
        private readonly ISpecialOfferService _specialOfferService;

        public SpecialOfferController(ISpecialOfferService specialOfferService)
        {
            _specialOfferService = specialOfferService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SpecialOffer>>> GetAllSpecialOffers()
        {
            try
            {
                var specialOffers = await _specialOfferService.GetAllSpecialOffersAsync();
                return Ok(specialOffers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SpecialOffer>> GetSpecialOfferById(int id)
        {
            try
            {
                var existingSpecialOffer = await _specialOfferService.GetSpecialOfferByIdAsync(id);

                if (existingSpecialOffer == null)
                {
                    return NotFound($"Special Offer with ID {id} not found.");
                }

                return Ok(existingSpecialOffer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<SpecialOffer>> CreateSpecialOffer([FromBody] SpecialOffer specialOffer)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var createdSpecialOffer = await _specialOfferService.CreateSpecialOfferAsync(specialOffer);

                return CreatedAtAction(nameof(GetSpecialOfferById), new { id = createdSpecialOffer.SpecialOfferId }, createdSpecialOffer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SpecialOffer>> UpdateSpecialOffer(int id, [FromBody] SpecialOffer specialOffer)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var updatedSpecialOffer = await _specialOfferService.UpdateSpecialOfferAsync(id, specialOffer);

                if (updatedSpecialOffer == null)
                {
                    return NotFound($"Special Offer with ID {id} not found.");
                }

                return Ok(updatedSpecialOffer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSpecialOffer(int id)
        {
            try
            {
                var isDeleted = await _specialOfferService.DeleteSpecialOfferAsync(id);

                if (isDeleted == false)
                {
                    return NotFound($"Special Offer with ID {id} not found.");
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
