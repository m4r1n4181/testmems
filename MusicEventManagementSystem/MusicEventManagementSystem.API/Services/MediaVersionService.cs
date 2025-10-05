﻿using MusicEventManagementSystem.API.DTOs.MediaCampaign;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.API.Services.IService;

namespace MusicEventManagementSystem.API.Services
{
    public class MediaVersionService : IMediaVersionService
    {
        private readonly IMediaVersionRepository _mediaVersionRepository;
        private readonly IMediaTaskRepository _mediaTaskRepository;

        public MediaVersionService(IMediaVersionRepository mediaVersionRepository, IMediaTaskRepository mediaTaskRepository)
        {
            _mediaVersionRepository = mediaVersionRepository;
            _mediaTaskRepository = mediaTaskRepository;
        }

        public async Task<IEnumerable<MediaVersionResponseDto>> GetAllMediaVersionsAsync()
        {
            var versions = await _mediaVersionRepository.GetAllAsync();
            return versions.Select(MapToResponseDto);
        }

        public async Task<MediaVersionResponseDto?> GetMediaVersionByIdAsync(int id)
        {
            var version = await _mediaVersionRepository.GetByIdAsync(id);
            return version == null ? null : MapToResponseDto(version);
        }

        public async Task<MediaVersionResponseDto> CreateMediaVersionAsync(MediaVersionCreateDto dto)
        {
            var version = MapToEntity(dto);
            await _mediaVersionRepository.AddAsync(version);
            await _mediaVersionRepository.SaveChangesAsync();
            return MapToResponseDto(version);
        }

        public async Task<MediaVersionResponseDto?> UpdateMediaVersionAsync(int id, MediaVersionUpdateDto dto)
        {
            var version = await _mediaVersionRepository.GetByIdAsync(id);
            if (version == null) return null;

            if (dto.VersionFileName != null) version.VersionFileName = dto.VersionFileName;
            if (dto.FileType != null) version.FileType = dto.FileType;
            if (dto.FileURL != null) version.FileURL = dto.FileURL;
            if (dto.IsFinalVersion.HasValue) version.IsFinalVersion = dto.IsFinalVersion.Value;
            if (dto.AdId.HasValue) version.AdId = dto.AdId.Value;
            if (dto.CreatedAt.HasValue) version.CreatedAt = dto.CreatedAt.Value;
            if (dto.MediaTaskId.HasValue) version.MediaTaskId = dto.MediaTaskId.Value;

            _mediaVersionRepository.Update(version);
            await _mediaVersionRepository.SaveChangesAsync();
            return MapToResponseDto(version);
        }

        public async Task<bool> DeleteMediaVersionAsync(int id)
        {
            var version = await _mediaVersionRepository.GetByIdAsync(id);
            if (version == null) return false;
            _mediaVersionRepository.Delete(version);
            await _mediaVersionRepository.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<MediaVersionResponseDto>> GetByVersionFileNameAsync(string versionFileName)
        {
            var versions = await _mediaVersionRepository.GetByVersionFileNameAsync(versionFileName);
            return versions.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<MediaVersionResponseDto>> GetByFileTypeAsync(string fileType)
        {
            var versions = await _mediaVersionRepository.GetByFileTypeAsync(fileType);
            return versions.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<MediaVersionResponseDto>> GetByFileURLAsync(string fileURL)
        {
            var versions = await _mediaVersionRepository.GetByFileURLAsync(fileURL);
            return versions.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<MediaVersionResponseDto>> GetByIsFinalVersionAsync(bool isFinalVersion)
        {
            var versions = await _mediaVersionRepository.GetByIsFinalVersionAsync(isFinalVersion);
            return versions.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<MediaVersionResponseDto>> GetByAdIdAsync(int adId)
        {
            var versions = await _mediaVersionRepository.GetByAdIdAsync(adId);
            return versions.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<MediaVersionResponseDto>> GetPreviousTaskVersionsAsync(int taskId)
        {
            // Get the current task
            var currentTask = await _mediaTaskRepository.GetByIdAsync(taskId);
            if (currentTask == null || currentTask.WorkflowId == null)
                return Enumerable.Empty<MediaVersionResponseDto>();

            // Get all tasks in the same workflow that have a lower order (previous tasks)
            var previousTasks = await _mediaTaskRepository.GetByWorkflowIdAsync(currentTask.WorkflowId.Value);
            var previousTasksFiltered = previousTasks.Where(t => t.Order < currentTask.Order);

            // Get all versions from those previous tasks
            var allVersions = new List<MediaVersion>();
            foreach (var task in previousTasksFiltered)
            {
                if (task.AdId.HasValue)
                {
                    var versions = await _mediaVersionRepository.GetByAdIdAsync(task.AdId.Value);
                    allVersions.AddRange(versions);
                }
            }

            return allVersions.Select(MapToResponseDto);
        }

        private static MediaVersionResponseDto MapToResponseDto(MediaVersion version) => new()
        {
            MediaVersionId = version.MediaVersionId,
            VersionFileName = version.VersionFileName,
            FileType = version.FileType,
            FileURL = version.FileURL,
            IsFinalVersion = version.IsFinalVersion,
            AdId = version.AdId,
            CreatedAt = version.CreatedAt,
            MediaTaskId = version.MediaTaskId
        };

        private static MediaVersion MapToEntity(MediaVersionCreateDto dto) => new()
        {
            VersionFileName = dto.VersionFileName,
            FileType = dto.FileType,
            FileURL = dto.FileURL,
            IsFinalVersion = dto.IsFinalVersion,
            AdId = dto.AdId,
            CreatedAt = dto.CreatedAt ?? DateTime.UtcNow,
            MediaTaskId = dto.MediaTaskId
        };
    }
}