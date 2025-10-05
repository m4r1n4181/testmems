using Microsoft.AspNetCore.Mvc;
using MusicEventManagementSystem.API.Services.IService;
using Microsoft.AspNetCore.Authorization;

namespace MusicEventManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAnalyticsService _analyticsService;

        public AnalyticsController(IAnalyticsService analyticsService)
        {
            _analyticsService = analyticsService;
        }

        [HttpGet("workflow-phase-efficiency/{workflowId}")]
        public async Task<ActionResult> GetWorkflowPhaseEfficiency(int workflowId)
        {
            var result = await _analyticsService.GetWorkflowPhaseEfficiencyAsync(workflowId);
            return Ok(result);
        }

        [HttpGet("user-approval-rate/{managerId}")]
        public async Task<ActionResult> GetUserApprovalRate(string managerId)
        {
            var result = await _analyticsService.GetUserApprovalRateAsync(managerId);
            return Ok(result);
        }

        [HttpGet("avg-task-preparation-time")]
        public async Task<ActionResult> GetAvgTaskPreparationTime()
        {
            var result = await _analyticsService.GetAvgTaskPreparationTimeAsync();
            return Ok(result);
        }

        [HttpGet("workflow-performance-summary")]
        public async Task<ActionResult> GetWorkflowPerformanceSummary()
        {
            var result = await _analyticsService.GetWorkflowPerformanceSummaryAsync();
            return Ok(result);
        }
    }
}
