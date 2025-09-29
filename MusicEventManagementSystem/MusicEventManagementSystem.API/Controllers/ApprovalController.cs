using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MusicEventManagementSystem.API.DTOs.MediaCampaign;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Services.IService;
using System.Security.Claims;

namespace MusicEventManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApprovalController : ControllerBase
    {
        private readonly IApprovalService _approvalService;

        public ApprovalController(IApprovalService approvalService)
        {
            _approvalService = approvalService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ApprovalResponseDto>>> GetAllApprovals()
        {
            var approvals = await _approvalService.GetAllApprovalsAsync();
            return Ok(approvals);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApprovalResponseDto>> GetApprovalById(int id)
        {
            var approval = await _approvalService.GetApprovalByIdAsync(id);
            if (approval == null)
                return NotFound($"Approval with ID {id} not found.");
            return Ok(approval);
        }

        [HttpPost]
        public async Task<ActionResult<ApprovalResponseDto>> CreateApproval([FromBody] ApprovalCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var createdApproval = await _approvalService.CreateApprovalAsync(dto);
            return CreatedAtAction(nameof(GetApprovalById), new { id = createdApproval.ApprovalId }, createdApproval);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApprovalResponseDto>> UpdateApproval(int id, [FromBody] ApprovalUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedApproval = await _approvalService.UpdateApprovalAsync(id, dto);
            if (updatedApproval == null)
                return NotFound($"Approval with ID {id} not found.");
            return Ok(updatedApproval);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteApproval(int id)
        {
            var isDeleted = await _approvalService.DeleteApprovalAsync(id);
            if (!isDeleted)
                return NotFound($"Approval with ID {id} not found.");
            return NoContent();
        }

        [HttpGet("approvalStatus/{approvalStatus}")]
        public async Task<ActionResult<IEnumerable<ApprovalResponseDto>>> GetByApprovalStatus(string approvalStatus)
        {
            var approvals = await _approvalService.GetByApprovalStatusAsync(approvalStatus);
            return Ok(approvals);
        }

        [HttpGet("comment/{comment}")]
        public async Task<ActionResult<IEnumerable<ApprovalResponseDto>>> GetByComment(string comment)
        {
            var approvals = await _approvalService.GetByCommentAsync(comment);
            return Ok(approvals);
        }

        [HttpGet("approvalDate/{approvalDate}")]
        public async Task<ActionResult<IEnumerable<ApprovalResponseDto>>> GetByApprovalDate(DateTime approvalDate)
        {
            var approvals = await _approvalService.GetByApprovalDateAsync(approvalDate);
            return Ok(approvals);
        }

        [HttpGet("mediaTaskId/{mediaTaskId}")]
        public async Task<ActionResult<IEnumerable<ApprovalResponseDto>>> GetByMediaTaskId(int mediaTaskId)
        {
            var approvals = await _approvalService.GetByMediaTaskIdAsync(mediaTaskId);
            return Ok(approvals);
        }
        [Authorize]
        [HttpGet("my-approvals")]
        public async Task<IActionResult> GetMyApprovals()
        {
            var managerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var approvals = await _approvalService.GetApprovalsForManagerAsync(managerId);
            return Ok(approvals);
        }
    }
}