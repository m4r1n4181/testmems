﻿using MusicEventManagementSystem.API.DTOs.MediaCampaign;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.API.Services.IService;

namespace MusicEventManagementSystem.API.Services
{
    public class MediaTaskService : IMediaTaskService
    {
        private readonly IMediaTaskRepository _mediaTaskRepository;

        public MediaTaskService(IMediaTaskRepository mediaTaskRepository)
        {
            _mediaTaskRepository = mediaTaskRepository;
        }

        public async Task<IEnumerable<MediaTaskResponseDto>> GetAllMediaTasksAsync()
        {
            var tasks = await _mediaTaskRepository.GetAllAsync();
            return tasks.Select(MapToResponseDto);
        }

        public async Task<MediaTaskResponseDto?> GetMediaTaskByIdAsync(int id)
        {
            var task = await _mediaTaskRepository.GetByIdAsync(id);
            return task == null ? null : MapToResponseDto(task);
        }

        public async Task<MediaTaskResponseDto> CreateMediaTaskAsync(MediaTaskCreateDto dto)
        {
            var task = MapToEntity(dto);
            await _mediaTaskRepository.AddAsync(task);
            await _mediaTaskRepository.SaveChangesAsync();
            return MapToResponseDto(task);
        }

        public async Task<MediaTaskResponseDto?> UpdateMediaTaskAsync(int id, MediaTaskUpdateDto dto)
        {
            var task = await _mediaTaskRepository.GetByIdAsync(id);
            if (task == null) return null;

            if (dto.TaskName != null) task.TaskName = dto.TaskName;
            if (dto.Order.HasValue) task.Order = dto.Order.Value;
            if (dto.TaskStatus != null) task.TaskStatus = dto.TaskStatus;
            if (dto.WorkflowId.HasValue) task.WorkflowId = dto.WorkflowId.Value;
            if (dto.ApprovalId.HasValue) task.ApprovalId = dto.ApprovalId.Value;

            _mediaTaskRepository.Update(task);
            await _mediaTaskRepository.SaveChangesAsync();
            return MapToResponseDto(task);
        }

        public async Task<bool> DeleteMediaTaskAsync(int id)
        {
            var task = await _mediaTaskRepository.GetByIdAsync(id);
            if (task == null) return false;
            _mediaTaskRepository.Delete(task);
            await _mediaTaskRepository.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<MediaTaskResponseDto>> GetByTaskNameAsync(string taskName)
        {
            var tasks = await _mediaTaskRepository.GetByTaskNameAsync(taskName);
            return tasks.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<MediaTaskResponseDto>> GetByOrderAsync(int order)
        {
            var tasks = await _mediaTaskRepository.GetByOrderAsync(order);
            return tasks.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<MediaTaskResponseDto>> GetByTaskStatusAsync(string taskStatus)
        {
            var tasks = await _mediaTaskRepository.GetByTaskStatusAsync(taskStatus);
            return tasks.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<MediaTaskResponseDto>> GetByWorkflowIdAsync(int workflowId)
        {
            var tasks = await _mediaTaskRepository.GetByWorkflowIdAsync(workflowId);
            return tasks.Select(MapToResponseDto);
        }

        private static MediaTaskResponseDto MapToResponseDto(MediaTask task) => new()
        {
            MediaTaskId = task.MediaTaskId,
            TaskName = task.TaskName,
            Order = task.Order,
            TaskStatus = task.TaskStatus,
            WorkflowId = task.WorkflowId,
            ApprovalId = task.ApprovalId
        };

        private static MediaTask MapToEntity(MediaTaskCreateDto dto) => new()
        {
            TaskName = dto.TaskName,
            Order = dto.Order,
            TaskStatus = dto.TaskStatus,
            WorkflowId = dto.WorkflowId,
            ApprovalId = dto.ApprovalId
        };
    }
}