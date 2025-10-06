using System.ComponentModel.DataAnnotations;
using MusicEventManagementSystem.Enums;

namespace MusicEventManagementSystem.API.DTOs.MediaCampaign
{
    public class MediaTaskResponseDto
    {
        public int MediaTaskId { get; set; }
        public string? TaskName { get; set; }
        public int Order { get; set; }
        public MediaTaskStatus TaskStatus { get; set; }
        public int? WorkflowId { get; set; }
        public int? ApprovalId { get; set; }
        public string? ManagerId { get; set; }
        public int? AdId { get; set; }
        public DateTime? TaskStartedAt { get; set; }
        public DateTime? TaskCompletedAt { get; set; }
        public DateTime? SubmittedForApprovalAt { get; set; }
    }

    public class MediaTaskCreateDto
    {
        [Required]
        [StringLength(200)]
        public string TaskName { get; set; }

        [Required]
        public int Order { get; set; }

        public MediaTaskStatus TaskStatus { get; set; }

        public int? WorkflowId { get; set; }
        public int? ApprovalId { get; set; }
        public string? ManagerId { get; set; }
        public int? AdId { get; set; }
    }

    public class MediaTaskUpdateDto
    {
        [StringLength(200)]
        public string? TaskName { get; set; }

        public int? Order { get; set; }

        public MediaTaskStatus? TaskStatus { get; set; }

        public int? WorkflowId { get; set; }
        public int? ApprovalId { get; set; }
        public string? ManagerId { get; set; }
        public int? AdId { get; set; }
        public DateTime? TaskStartedAt { get; set; }
        public DateTime? TaskCompletedAt { get; set; }
        public DateTime? SubmittedForApprovalAt { get; set; }
    }


}