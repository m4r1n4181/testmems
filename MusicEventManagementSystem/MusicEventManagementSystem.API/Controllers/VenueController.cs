﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Services;
using MusicEventManagementSystem.API.Services.IService;

namespace MusicEventManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VenueController : ControllerBase
    {
        private readonly IVenueService _venueService;

        public VenueController(IVenueService venueService)
        {
            _venueService = venueService;
        }

        // GET: api/venue
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Venue>>> GetAllVenues()
        {
            try
            {
                var venues = await _venueService.GetAllVenuesAsync();
                return Ok(venues);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }    

        // GET: api/venue/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Venue>>> GetVenueById(int id)
        {
            try
            {
                var existingVenue = await _venueService.GetVenueByIdAsync(id);
                
                if (existingVenue == null)
                {
                    return NotFound($"Venue with ID {id} not found.");
                }
                
                return Ok(existingVenue);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/venue
        [HttpPost]
        public async Task<ActionResult<Venue>> CreateVenue([FromBody] Venue venue)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var createdVenue = await _venueService.CreateVenueAsync(venue);
                
                return CreatedAtAction(nameof(GetVenueById), new { id = createdVenue.VenueId }, createdVenue);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/venue/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<Venue>> UpdateVenue(int id, [FromBody] Venue venue)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var updatedVenue = await _venueService.UpdateVenueAsync(id, venue);
                
                if (updatedVenue == null)
                {
                    return NotFound($"Venue with ID {id} not found.");
                }

                return Ok(updatedVenue);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/venue/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteVenue(int id)
        {
            try
            {
                var isDeleted = await _venueService.DeleteVenueAsync(id);

                if (isDeleted == false)
                {
                    return NotFound($"Venue with ID {id} not found.");
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
