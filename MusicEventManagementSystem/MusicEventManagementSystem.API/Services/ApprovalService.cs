using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.DTOs.MediaCampaign;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.API.Services.IService;

namespace MusicEventManagementSystem.API.Services
{
    public class ApprovalService : IApprovalService
    {
        private readonly IApprovalRepository _approvalRepository;
        private readonly IMediaTaskRepository _mediaTaskRepository;  
        private readonly IMediaVersionRepository _mediaVersionRepository;

        public ApprovalService(IApprovalRepository approvalRepository, IMediaTaskRepository mediaTaskRepository, IMediaVersionRepository mediaVersionRepository)
        {
            _approvalRepository = approvalRepository;
            _mediaTaskRepository = mediaTaskRepository;
            _mediaVersionRepository = mediaVersionRepository;
            
        }

        public async Task<IEnumerable<ApprovalResponseDto>> GetAllApprovalsAsync()
        {
            var approvals = await _approvalRepository.GetAllAsync();
            return approvals.Select(MapToResponseDto);
        }

        public async Task<ApprovalResponseDto?> GetApprovalByIdAsync(int id)
        {
            var approval = await _approvalRepository.GetByIdAsync(id);
            return approval == null ? null : MapToResponseDto(approval);
        }

        public async Task<ApprovalResponseDto> CreateApprovalAsync(ApprovalCreateDto dto)
        {
            // Validate task exists
            var task = await _mediaTaskRepository.GetByIdAsync(dto.MediaTaskId);
            if (task == null)
                throw new InvalidOperationException($"MediaTask with ID {dto.MediaTaskId} not found");

            // Validate submitted version if provided
            if (dto.SubmittedMediaVersionId.HasValue)
            {
                var version = await _mediaVersionRepository.GetByIdAsync(dto.SubmittedMediaVersionId.Value);
                if (version == null)
                    throw new InvalidOperationException($"MediaVersion with ID {dto.SubmittedMediaVersionId} not found");
                
                if (!version.IsFinalVersion)
                    throw new InvalidOperationException("Submitted version must be marked as final");
            }

            var approval = MapToEntity(dto);
            await _approvalRepository.AddAsync(approval);
            await _approvalRepository.SaveChangesAsync();
            return MapToResponseDto(approval);
        }

        public async Task<ApprovalResponseDto?> UpdateApprovalAsync(int id, ApprovalUpdateDto dto)
        {
            var approval = await _approvalRepository.GetByIdAsync(id);
            if (approval == null) return null;

            if (dto.ApprovalStatus != null) approval.ApprovalStatus = dto.ApprovalStatus;
            if (dto.Comment != null) approval.Comment = dto.Comment;
            if (dto.ApprovalDate.HasValue) approval.ApprovalDate = dto.ApprovalDate.Value;
            if (dto.MediaTaskId.HasValue) approval.MediaTaskId = dto.MediaTaskId.Value;
            if (dto.SubmittedMediaVersionId.HasValue) approval.SubmittedMediaVersionId = dto.SubmittedMediaVersionId.Value;

            _approvalRepository.Update(approval);
            await _approvalRepository.SaveChangesAsync();
            return MapToResponseDto(approval);
        }

        public async Task<bool> DeleteApprovalAsync(int id)
        {
            var approval = await _approvalRepository.GetByIdAsync(id);
            if (approval == null) return false;
            _approvalRepository.Delete(approval);
            await _approvalRepository.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ApprovalResponseDto>> GetByApprovalStatusAsync(string approvalStatus)
        {
            var approvals = await _approvalRepository.GetByApprovalStatusAsync(approvalStatus);
            return approvals.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<ApprovalResponseDto>> GetByCommentAsync(string comment)
        {
            var approvals = await _approvalRepository.GetByCommentAsync(comment);
            return approvals.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<ApprovalResponseDto>> GetByApprovalDateAsync(DateTime approvalDate)
        {
            var approvals = await _approvalRepository.GetByApprovalDateAsync(approvalDate);
            return approvals.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<ApprovalResponseDto>> GetByMediaTaskIdAsync(int mediaTaskId)
        {
            var approvals = await _approvalRepository.GetByMediaTaskIdAsync(mediaTaskId);
            return approvals.Select(MapToResponseDto);
        }
        public async Task<IEnumerable<ApprovalResponseDto>> GetApprovalsForManagerAsync(string managerId)
        {
            var approvals = await _approvalRepository.GetByManagerIdAsync(managerId);
            return approvals.Select(MapToResponseDto);
        }

        private static ApprovalResponseDto MapToResponseDto(Approval approval) => new()
        {
            ApprovalId = approval.ApprovalId,
            ApprovalStatus = approval.ApprovalStatus,
            Comment = approval.Comment,
            ApprovalDate = approval.ApprovalDate,
            MediaTaskId = approval.MediaTaskId,
            SubmittedMediaVersionId = approval.SubmittedMediaVersionId,
            SubmittedMediaVersion = approval.SubmittedMediaVersion != null ? new MediaVersionResponseDto
            {
                MediaVersionId = approval.SubmittedMediaVersion.MediaVersionId,
                VersionFileName = approval.SubmittedMediaVersion.VersionFileName,
                FileType = approval.SubmittedMediaVersion.FileType,
                FileURL = approval.SubmittedMediaVersion.FileURL,
                IsFinalVersion = approval.SubmittedMediaVersion.IsFinalVersion,
                AdId = approval.SubmittedMediaVersion.AdId,
                CreatedAt = approval.SubmittedMediaVersion.CreatedAt,
                MediaTaskId = approval.SubmittedMediaVersion.MediaTaskId
            } : null
        };

        private static Approval MapToEntity(ApprovalCreateDto dto) => new()
        {
            ApprovalStatus = dto.ApprovalStatus,
            Comment = dto.Comment,
            ApprovalDate = dto.ApprovalDate,
            MediaTaskId = dto.MediaTaskId,
            SubmittedMediaVersionId = dto.SubmittedMediaVersionId
        };
    }
}