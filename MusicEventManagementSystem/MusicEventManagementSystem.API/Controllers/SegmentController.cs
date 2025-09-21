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
    public class SegmentController : ControllerBase
    {
        private readonly ISegmentService _segmentService;

        public SegmentController(ISegmentService segmentService)
        {
            _segmentService = segmentService;
        }

        // GET: api/segment
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Segment>>> GetAllSegments()
        {
            try
            {
                var segments = await _segmentService.GetAllSegmentsAsync();
                return Ok(segments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/segment/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Segment>> GetSegmentById(int id)
        {
            try
            {
                var existingSegment = await _segmentService.GetSegmentByIdAsync(id);

                if (existingSegment == null)
                {
                    return NotFound($"Segment with ID {id} not found.");
                }

                return Ok(existingSegment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/segment
        [HttpPost]
        public async Task<ActionResult<Segment>> CreateSegment([FromBody] Segment segment)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var createdSegment = await _segmentService.CreateSegmentAsync(segment);

                return CreatedAtAction(nameof(GetSegmentById), new { id = createdSegment.SegmentId }, createdSegment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/segment/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<Segment>> UpdateSegment(int id, [FromBody] Segment segment)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var updatedSegment = await _segmentService.UpdateSegmentAsync(id, segment);

                if (updatedSegment == null)
                {
                    return NotFound($"Segment with ID {id} not found.");
                }

                return Ok(updatedSegment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/segment/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSegment(int id)
        {
            try
            {
                var isDeleted = await _segmentService.DeleteSegmentAsync(id);

                if (isDeleted == false)
                {
                    return NotFound($"Segment with ID {id} not found.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/segment/venue/{venueId}
        [HttpGet("venue/{venueId}")]
        public async Task<ActionResult<IEnumerable<Segment>>> GetSegmentsByVenueId(int venueId)
        {
            try
            {
                var segments = await _segmentService.GetByVenueIdAsync(venueId);
                return Ok(segments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/segment/type/{segmentType}
        [HttpGet("type/{segmentType}")]
        public async Task<ActionResult<IEnumerable<Segment>>> GetSegmentsByType(string segmentType)
        {
            try
            {
                var segments = await _segmentService.GetBySegmentTypeAsync(segmentType);
                return Ok(segments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/segment/{id}/zones
        [HttpGet("{id}/zones")]
        public async Task<ActionResult<IEnumerable<Zone>>> GetZonesBySegmentId(int id)
        {
            try
            {
                var zones = await _segmentService.GetZonesAsync(id);
                return Ok(zones);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/segment/{id}/capacity
        [HttpGet("{id}/capacity")]
        public async Task<ActionResult<int>> CalculateSegmentTotalCapacity(int id)
        {
            try
            {
                var totalCapacity = await _segmentService.CalculateTotalCapacityAsync(id);
                return Ok(totalCapacity);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
