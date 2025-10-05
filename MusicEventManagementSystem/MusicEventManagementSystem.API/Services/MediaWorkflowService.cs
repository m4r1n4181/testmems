using MusicEventManagementSystem.API.DTOs.MediaCampaign;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.API.Services.IService;
using System.Xml;

namespace MusicEventManagementSystem.API.Services
{
    public class MediaWorkflowService : IMediaWorkflowService
    {
        private readonly IMediaWorkflowRepository _mediaWorkflowRepository;

        public MediaWorkflowService(IMediaWorkflowRepository mediaWorkflowRepository)
        {
            _mediaWorkflowRepository = mediaWorkflowRepository;
        }

        public async Task<IEnumerable<MediaWorkflowResponseDto>> GetAllMediaWorkflowsAsync()
        {
            var workflows = await _mediaWorkflowRepository.GetAllAsync();
            return workflows.Select(MapToResponseDto);
        }

        public async Task<MediaWorkflowResponseDto?> GetMediaWorkflowByIdAsync(int id)
        {
            var workflow = await _mediaWorkflowRepository.GetByIdAsync(id);
            return workflow == null ? null : MapToResponseDto(workflow);
        }

        public async Task<MediaWorkflowResponseDto> CreateMediaWorkflowAsync(MediaWorkflowCreateDto dto)
        {
            var workflow = new MediaWorkflow 
            { 
                WorkflowDescription = dto.WorkflowDescription, 
                ApprovalId = dto.ApprovalId 
            };
            
            // Add tasks to the workflow if provided
            // EF Core will automatically set the WorkflowId when the workflow is saved
            if (dto.Tasks != null)
            {
                foreach (var taskDto in dto.Tasks)
                {
                    var task = new MediaTask
                    {
                        TaskName = taskDto.TaskName,
                        Order = taskDto.Order,
                        TaskStatus = taskDto.TaskStatus,
                        ApprovalId = taskDto.ApprovalId,
                        ManagerId = taskDto.ManagerId,
                        AdId = taskDto.AdId
                        // WorkflowId will be set automatically by EF Core when workflow is saved
                    };
                    workflow.Tasks.Add(task);
                }
            }
            
            await _mediaWorkflowRepository.AddAsync(workflow);
            await _mediaWorkflowRepository.SaveChangesAsync();
            return MapToResponseDto(workflow);
        }

        public async Task<MediaWorkflowResponseDto?> UpdateMediaWorkflowAsync(int id, MediaWorkflowUpdateDto dto)
        {
            var workflow = await _mediaWorkflowRepository.GetByIdAsync(id);
            if (workflow == null) return null;

            if (dto.WorkflowDescription != null) 
                workflow.WorkflowDescription = dto.WorkflowDescription;

            // Update tasks if provided
            if (dto.Tasks != null)
            {
                // Clear existing tasks and add new ones
                workflow.Tasks.Clear();
                foreach (var taskDto in dto.Tasks)
                {
                    workflow.Tasks.Add(new MediaTask
                    {
                        TaskName = taskDto.TaskName,
                        TaskStatus = taskDto.TaskStatus,
                        Order = taskDto.Order ?? 0,
                        WorkflowId = workflow.MediaWorkflowId,  // Set the WorkflowId explicitly for updates
                        ApprovalId = taskDto.ApprovalId,
                        ManagerId = taskDto.ManagerId,
                        AdId = taskDto.AdId
                    });
                }
            }

            _mediaWorkflowRepository.Update(workflow);
            await _mediaWorkflowRepository.SaveChangesAsync();
            return MapToResponseDto(workflow);
        }

        public async Task<bool> DeleteMediaWorkflowAsync(int id)
        {
            var workflow = await _mediaWorkflowRepository.GetByIdAsync(id);
            if (workflow == null) return false;
            _mediaWorkflowRepository.Delete(workflow);
            await _mediaWorkflowRepository.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<MediaWorkflowResponseDto>> GetByWorkflowDescriptionAsync(string workflowDescription)
        {
            var workflows = await _mediaWorkflowRepository.GetByWorkflowDescriptionAsync(workflowDescription);
            return workflows.Select(MapToResponseDto);
        }

        private static MediaWorkflowResponseDto MapToResponseDto(MediaWorkflow workflow) => new()
        {
            MediaWorkflowId = workflow.MediaWorkflowId,
            WorkflowDescription = workflow.WorkflowDescription,
            ApprovalId = workflow.ApprovalId,
            TaskIds = workflow.Tasks.Select(t => t.MediaTaskId).ToList(),
            Tasks = workflow.Tasks.Select(t => new MediaTaskResponseDto
            {
                MediaTaskId = t.MediaTaskId,
                TaskName = t.TaskName,
                Order = t.Order,
                TaskStatus = t.TaskStatus,
                WorkflowId = t.WorkflowId,
                ApprovalId = t.ApprovalId,
                ManagerId = t.ManagerId,
                ManagerName = t.Manager != null ? $"{t.Manager.FirstName} {t.Manager.LastName}" : null,
                AdId = t.AdId,
                TaskStartedAt = t.TaskStartedAt,
                TaskCompletedAt = t.TaskCompletedAt,
                SubmittedForApprovalAt = t.SubmittedForApprovalAt
            }).ToList()
        };

        private static MediaWorkflow MapToEntity(MediaWorkflowCreateDto dto) => new()
        {
            WorkflowDescription = dto.WorkflowDescription,
            ApprovalId = dto.ApprovalId
        };
    }
}