using Microsoft.AspNetCore.Mvc;
using MusicEventManagementSystem.API.DTOs.MediaCampaign;
using MusicEventManagementSystem.API.Services.IService;

namespace MusicEventManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MediaWorkflowController : ControllerBase
    {
        private readonly IMediaWorkflowService _mediaWorkflowService;

        public MediaWorkflowController(IMediaWorkflowService mediaWorkflowService)
        {
            _mediaWorkflowService = mediaWorkflowService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MediaWorkflowResponseDto>>> GetAllMediaWorkflows()
        {
            var workflows = await _mediaWorkflowService.GetAllMediaWorkflowsAsync();
            return Ok(workflows);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MediaWorkflowResponseDto>> GetMediaWorkflowById(int id)
        {
            var workflow = await _mediaWorkflowService.GetMediaWorkflowByIdAsync(id);
            if (workflow == null)
                return NotFound($"MediaWorkflow with ID {id} not found.");
            return Ok(workflow);
        }

        [HttpPost]
        public async Task<ActionResult<MediaWorkflowResponseDto>> CreateMediaWorkflow([FromBody] MediaWorkflowCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var createdWorkflow = await _mediaWorkflowService.CreateMediaWorkflowAsync(dto);
            return CreatedAtAction(nameof(GetMediaWorkflowById), new { id = createdWorkflow.MediaWorkflowId }, createdWorkflow);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<MediaWorkflowResponseDto>> UpdateMediaWorkflow(int id, [FromBody] MediaWorkflowUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedWorkflow = await _mediaWorkflowService.UpdateMediaWorkflowAsync(id, dto);
            if (updatedWorkflow == null)
                return NotFound($"MediaWorkflow with ID {id} not found.");
            return Ok(updatedWorkflow);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMediaWorkflow(int id)
        {
            var isDeleted = await _mediaWorkflowService.DeleteMediaWorkflowAsync(id);
            if (!isDeleted)
                return NotFound($"MediaWorkflow with ID {id} not found.");
            return NoContent();
        }

        [HttpGet("workflowDescription/{workflowDescription}")]
        public async Task<ActionResult<IEnumerable<MediaWorkflowResponseDto>>> GetByWorkflowDescription(string workflowDescription)
        {
            var workflows = await _mediaWorkflowService.GetByWorkflowDescriptionAsync(workflowDescription);
            return Ok(workflows);
        }
    }
}