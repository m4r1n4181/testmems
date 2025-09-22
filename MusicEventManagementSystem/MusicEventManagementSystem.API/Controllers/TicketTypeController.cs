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

        // GET: api/tickettype
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

        // GET: api/tickettype/{id}
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

        // POST: api/tickettype
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

        // PUT: api/tickettype/{id}
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

        // DELETE: api/tickettype/{id}
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

        // GET: api/tickettype/zone/{zoneId}
        [HttpGet("zone/{zoneId}")]
        public async Task<ActionResult<IEnumerable<TicketType>>> GetTicketTypesByZoneId(int zoneId)
        {
            try
            {
                var ticketTypes = await _ticketTypeService.GetByZoneIdAsync(zoneId);
                return Ok(ticketTypes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/tickettype/event/{eventId}
        [HttpGet("event/{eventId}")]
        public async Task<ActionResult<IEnumerable<TicketType>>> GetTicketTypesByEventId(int eventId)
        {
            try
            {
                var ticketTypes = await _ticketTypeService.GetByEventIdAsync(eventId);
                return Ok(ticketTypes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/tickettype/status/{status}
        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<TicketType>>> GetTicketTypesByStatus(string status)
        {
            try
            {
                var ticketTypes = await _ticketTypeService.GetByStatusAsync(status);
                return Ok(ticketTypes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/tickettype/available
        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<TicketType>>> GetAvailableTicketTypes()
        {
            try
            {
                var ticketTypes = await _ticketTypeService.GetAvailableTicketTypesAsync();
                return Ok(ticketTypes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/tickettype/{id}/quantity
        [HttpPut("{id}/quantity")]
        public async Task<ActionResult> UpdateAvailableQuantity(int id, [FromBody] int quantity)
        {
            try
            {
                var isUpdated = await _ticketTypeService.UpdateAvailableQuantityAsync(id, quantity);

                if (!isUpdated)
                {
                    return NotFound($"Ticket Type with ID {id} not found or invalid quantity.");
                }

                return Ok($"Available quantity updated successfully for Ticket Type {id}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/tickettype/zone/{zoneId}/event/{eventId}
        [HttpGet("zone/{zoneId}/event/{eventId}")]
        public async Task<ActionResult<IEnumerable<TicketType>>> GetTicketTypesByZoneAndEvent(int zoneId, int eventId)
        {
            try
            {
                var ticketTypes = await _ticketTypeService.GetByZoneAndEventAsync(zoneId, eventId);
                return Ok(ticketTypes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/tickettype/event/{eventId}/totalquantity
        [HttpGet("event/{eventId}/totalquantity")]
        public async Task<ActionResult<int>> GetTotalAvailableQuantityByEvent(int eventId)
        {
            try
            {
                var totalQuantity = await _ticketTypeService.GetTotalAvailableQuantityByEventAsync(eventId);
                return Ok(totalQuantity);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/tickettype/{id}/reserve
        [HttpPost("{id}/reserve")]
        public async Task<ActionResult> ReserveTickets(int id, [FromBody] int quantity)
        {
            try
            {
                var isReserved = await _ticketTypeService.ReserveTicketsAsync(id, quantity);

                if (!isReserved)
                {
                    return BadRequest($"Unable to reserve {quantity} tickets for Ticket Type {id}. Insufficient quantity or invalid request.");
                }

                return Ok($"Successfully reserved {quantity} tickets for Ticket Type {id}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/tickettype/{id}/release
        [HttpPost("{id}/release")]
        public async Task<ActionResult> ReleaseTickets(int id, [FromBody] int quantity)
        {
            try
            {
                var isReleased = await _ticketTypeService.ReleaseTicketsAsync(id, quantity);

                if (!isReleased)
                {
                    return BadRequest($"Unable to release {quantity} tickets for Ticket Type {id}. Invalid request.");
                }

                return Ok($"Successfully released {quantity} tickets for Ticket Type {id}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
