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
    }
}
