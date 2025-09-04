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
    public class ZoneController : ControllerBase
    {
        private readonly IZoneService _zoneService;

        public ZoneController(IZoneService zoneService)
        {
            _zoneService = zoneService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Zone>>> GetAllZones()
        {
            try
            {
                var zones = await _zoneService.GetAllZonesAsync();
                return Ok(zones);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Zone>> GetZoneById(int id)
        {
            try
            {
                var existingZone = await _zoneService.GetZoneByIdAsync(id);

                if (existingZone == null)
                {
                    return NotFound($"Zone with ID {id} not found.");
                }

                return Ok(existingZone);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Zone>> CreateZone([FromBody] Zone zone)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var createdZone = await _zoneService.CreateZoneAsync(zone);

                return CreatedAtAction(nameof(GetZoneById), new { id = createdZone.ZoneId }, createdZone);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Zone>> UpdateZone(int id, [FromBody] Zone zone)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var updatedZone = await _zoneService.UpdateZoneAsync(id, zone);

                if (updatedZone == null)
                {
                    return NotFound($"Zone with ID {id} not found.");
                }

                return Ok(updatedZone);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteZone(int id)
        {
            try
            {
                var isDeleted = await _zoneService.DeleteZoneAsync(id);

                if (isDeleted == false)
                {
                    return NotFound($"Zone with ID {id} not found.");
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
