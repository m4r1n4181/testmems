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
    public class TicketTypeController : ControllerBase
    {
        private readonly ITicketTypeService _ticketTypeService;

        public TicketTypeController(ITicketTypeService ticketTypeService)
        {
            _ticketTypeService = ticketTypeService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketType>>> GetAllTicketTypes()
        {
            try
            {
                var ticketTypes = await _ticketTypeService.GetAllTicketTypesAsync();
                return Ok(ticketTypes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TicketType>> GetTicketTypeById(int id)
        {
            try
            {
                var existingTicketType = await _ticketTypeService.GetTicketTypeByIdAsync(id);

                if (existingTicketType == null)
                {
                    return NotFound($"Ticket Type with ID {id} not found.");
                }

                return Ok(existingTicketType);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<TicketType>> CreateTicketType([FromBody] TicketType ticketType)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var createdTicketType = await _ticketTypeService.CreateTicketTypeAsync(ticketType);

                return CreatedAtAction(nameof(GetTicketTypeById), new { id = createdTicketType.TicketTypeId }, createdTicketType);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TicketType>> UpdateTicketType(int id, [FromBody] TicketType ticketType)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var updatedVenue = await _ticketTypeService.UpdateTicketTypeAsync(id, ticketType);

                if (updatedVenue == null)
                {
                    return NotFound($"Ticket Type with ID {id} not found.");
                }

                return Ok(updatedVenue);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTicketType(int id)
        {
            try
            {
                var isDeleted = await _ticketTypeService.DeleteTicketTypeAsync(id);

                if (isDeleted == false)
                {
                    return NotFound($"Ticket Type with ID {id} not found.");
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
