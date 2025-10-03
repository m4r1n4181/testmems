using Microsoft.AspNetCore.Mvc;
using MusicEventManagementSystem.API.DTOs.MediaCampaign;
using MusicEventManagementSystem.API.Services.IService;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace MusicEventManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MediaTaskController : ControllerBase
    {
        private readonly IMediaTaskService _mediaTaskService;

        public MediaTaskController(IMediaTaskService mediaTaskService)
        {
            _mediaTaskService = mediaTaskService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MediaTaskResponseDto>>> GetAllMediaTasks()
        {
            var tasks = await _mediaTaskService.GetAllMediaTasksAsync();
            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MediaTaskResponseDto>> GetMediaTaskById(int id)
        {
            var task = await _mediaTaskService.GetMediaTaskByIdAsync(id);
            if (task == null)
                return NotFound($"MediaTask with ID {id} not found.");
            return Ok(task);
        }

        [HttpPost]
        public async Task<ActionResult<MediaTaskResponseDto>> CreateMediaTask([FromBody] MediaTaskCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var createdTask = await _mediaTaskService.CreateMediaTaskAsync(dto);
            return CreatedAtAction(nameof(GetMediaTaskById), new { id = createdTask.MediaTaskId }, createdTask);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<MediaTaskResponseDto>> UpdateMediaTask(int id, [FromBody] MediaTaskUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedTask = await _mediaTaskService.UpdateMediaTaskAsync(id, dto);
            if (updatedTask == null)
                return NotFound($"MediaTask with ID {id} not found.");
            return Ok(updatedTask);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMediaTask(int id)
        {
            var isDeleted = await _mediaTaskService.DeleteMediaTaskAsync(id);
            if (!isDeleted)
                return NotFound($"MediaTask with ID {id} not found.");
            return NoContent();
        }

        [HttpGet("taskName/{taskName}")]
        public async Task<ActionResult<IEnumerable<MediaTaskResponseDto>>> GetByTaskName(string taskName)
        {
            var tasks = await _mediaTaskService.GetByTaskNameAsync(taskName);
            return Ok(tasks);
        }

        [HttpGet("order/{order}")]
        public async Task<ActionResult<IEnumerable<MediaTaskResponseDto>>> GetByOrder(int order)
        {
            var tasks = await _mediaTaskService.GetByOrderAsync(order);
            return Ok(tasks);
        }

        [HttpGet("taskStatus/{taskStatus}")]
        public async Task<ActionResult<IEnumerable<MediaTaskResponseDto>>> GetByTaskStatus(string taskStatus)
        {
            var tasks = await _mediaTaskService.GetByTaskStatusAsync(taskStatus);
            return Ok(tasks);
        }

        [HttpGet("workflowId/{workflowId}")]
        public async Task<ActionResult<IEnumerable<MediaTaskResponseDto>>> GetByWorkflowId(int workflowId)
        {
            var tasks = await _mediaTaskService.GetByWorkflowIdAsync(workflowId);
            return Ok(tasks);
        }
        [Authorize]
        [HttpGet("manager/my-tasks")]
        public async Task<IActionResult> GetTasksForManager()
        {
            var managerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(managerId))
                return Unauthorized("Nije moguće preuzeti Id korisnika.");

            var tasks = await _mediaTaskService.GetTasksByManager(managerId);
            return Ok(tasks);
        }

        [HttpGet("managerId/{managerId}")]
        public async Task<ActionResult<IEnumerable<MediaTaskResponseDto>>> GetByManagerId(string managerId)
        {
            var tasks = await _mediaTaskService.GetTasksByManager(managerId);
            return Ok(tasks);
        }
    }
}