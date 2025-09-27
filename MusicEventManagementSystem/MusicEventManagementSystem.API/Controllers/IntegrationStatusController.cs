using Microsoft.AspNetCore.Mvc;
using MusicEventManagementSystem.API.DTOs.MediaCampaign;
using MusicEventManagementSystem.API.Services.IService;
using MusicEventManagementSystem.API.Enums;

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
        public async Task<ActionResult<IEnumerable<IntegrationStatusResponseDto>>> GetAllIntegrationStatuses()
        {
            var statuses = await _integrationStatusService.GetAllIntegrationStatusesAsync();
            return Ok(statuses);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IntegrationStatusResponseDto>> GetIntegrationStatusById(int id)
        {
            var status = await _integrationStatusService.GetIntegrationStatusByIdAsync(id);
            if (status == null)
                return NotFound($"IntegrationStatus with ID {id} not found.");
            return Ok(status);
        }

        [HttpPost]
        public async Task<ActionResult<IntegrationStatusResponseDto>> CreateIntegrationStatus([FromBody] IntegrationStatusCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var createdStatus = await _integrationStatusService.CreateIntegrationStatusAsync(dto);
            return CreatedAtAction(nameof(GetIntegrationStatusById), new { id = createdStatus.IntegrationStatusId }, createdStatus);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<IntegrationStatusResponseDto>> UpdateIntegrationStatus(int id, [FromBody] IntegrationStatusUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedStatus = await _integrationStatusService.UpdateIntegrationStatusAsync(id, dto);
            if (updatedStatus == null)
                return NotFound($"IntegrationStatus with ID {id} not found.");
            return Ok(updatedStatus);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteIntegrationStatus(int id)
        {
            var isDeleted = await _integrationStatusService.DeleteIntegrationStatusAsync(id);
            if (!isDeleted)
                return NotFound($"IntegrationStatus with ID {id} not found.");
            return NoContent();
        }

        [HttpGet("adId/{adId}")]
        public async Task<ActionResult<IEnumerable<IntegrationStatusResponseDto>>> GetByAdId(int adId)
        {
            var statuses = await _integrationStatusService.GetByAdIdAsync(adId);
            return Ok(statuses);
        }

        [HttpGet("channelId/{channelId}")]
        public async Task<ActionResult<IEnumerable<IntegrationStatusResponseDto>>> GetByChannelId(int channelId)
        {
            var statuses = await _integrationStatusService.GetByChannelIdAsync(channelId);
            return Ok(statuses);
        }

        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<IntegrationStatusResponseDto>>> GetByStatus(StatusIntegration status)
        {
            var statuses = await _integrationStatusService.GetByStatusAsync(status);
            return Ok(statuses);
        }

        [HttpGet("publicationDate/{publicationDate}")]
        public async Task<ActionResult<IEnumerable<IntegrationStatusResponseDto>>> GetByPublicationDate(DateTime publicationDate)
        {
            var statuses = await _integrationStatusService.GetByPublicationDateAsync(publicationDate);
            return Ok(statuses);
        }

        [HttpGet("error/{error}")]
        public async Task<ActionResult<IEnumerable<IntegrationStatusResponseDto>>> GetByError(string error)
        {
            var statuses = await _integrationStatusService.GetByErrorAsync(error);
            return Ok(statuses);
        }

        [HttpGet("lastSynced/{lastSynced}")]
        public async Task<ActionResult<IEnumerable<IntegrationStatusResponseDto>>> GetByLastSynced(DateTime lastSynced)
        {
            var statuses = await _integrationStatusService.GetByLastSyncedAsync(lastSynced);
            return Ok(statuses);
        }
    }
}