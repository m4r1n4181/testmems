using Microsoft.AspNetCore.Mvc;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Services.IService;

namespace MusicEventManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IntegrationStatusController : ControllerBase
    {
        private readonly IIntegrationStatusService _integrationStatusService;

        public IntegrationStatusController(IIntegrationStatusService integrationStatusService)
        {
            _integrationStatusService = integrationStatusService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<IntegrationStatus>>> GetAllIntegrationStatuses()
        {
            try
            {
                var integrationStatuses = await _integrationStatusService.GetAllIntegrationStatusesAsync();
                return Ok(integrationStatuses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IntegrationStatus>> GetIntegrationStatusById(int id)
        {
            try
            {
                var integrationStatus = await _integrationStatusService.GetIntegrationStatusByIdAsync(id);
                if (integrationStatus == null)
                {
                    return NotFound($"IntegrationStatus with ID {id} not found.");
                }
                return Ok(integrationStatus);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<IntegrationStatus>> CreateIntegrationStatus([FromBody] IntegrationStatus integrationStatus)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var createdIntegrationStatus = await _integrationStatusService.CreateIntegrationStatusAsync(integrationStatus);
                return CreatedAtAction(nameof(GetIntegrationStatusById), new { id = createdIntegrationStatus.IntegrationStatusId }, createdIntegrationStatus);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<IntegrationStatus>> UpdateIntegrationStatus(int id, [FromBody] IntegrationStatus integrationStatus)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var updatedIntegrationStatus = await _integrationStatusService.UpdateIntegrationStatusAsync(id, integrationStatus);
                if (updatedIntegrationStatus == null)
                {
                    return NotFound($"IntegrationStatus with ID {id} not found.");
                }

                return Ok(updatedIntegrationStatus);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteIntegrationStatus(int id)
        {
            try
            {
                var isDeleted = await _integrationStatusService.DeleteIntegrationStatusAsync(id);
                if (!isDeleted)
                {
                    return NotFound($"IntegrationStatus with ID {id} not found.");
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