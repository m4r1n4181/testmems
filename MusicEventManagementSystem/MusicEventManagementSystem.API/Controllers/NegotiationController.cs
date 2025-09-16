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
    public class NegotiationController : ControllerBase
    {
        private readonly INegotiationService _negotiationService;

        public NegotiationController(INegotiationService negotiationService)
        {
            _negotiationService = negotiationService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Negotiation>>> GetAllNegotiations()
        {
            try
            {
                var negotiations = await _negotiationService.GetAllNegotiationsAsync();
                return Ok(negotiations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Negotiation>> GetNegotiationById(int id)
        {
            try
            {
                var existingNegotiation = await _negotiationService.GetNegotiationByIdAsync(id);

                if (existingNegotiation == null)
                {
                    return NotFound($"Negotiation with ID {id} not found.");
                }

                return Ok(existingNegotiation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Negotiation>> CreateNegotiation([FromBody] Negotiation negotiation)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var createdNegotiation = await _negotiationService.CreateNegotiationAsync(negotiation);

                return CreatedAtAction(nameof(GetNegotiationById), new { id = createdNegotiation.NegotiationId }, createdNegotiation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Negotiation>> UpdateNegotiation(int id, [FromBody] Negotiation negotiation)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var updatedNegotiation = await _negotiationService.UpdateNegotiationAsync(id, negotiation);

                if (updatedNegotiation == null)
                {
                    return NotFound($"Negotiation with ID {id} not found.");
                }

                return Ok(updatedNegotiation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteNegotiation(int id)
        {
            try
            {
                var isDeleted = await _negotiationService.DeleteNegotiationAsync(id);

                if (isDeleted == false)
                {
                    return NotFound($"Negotiation with ID {id} not found.");
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
