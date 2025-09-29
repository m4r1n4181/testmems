﻿using System.ComponentModel.DataAnnotations;

namespace MusicEventManagementSystem.API.DTOs.MediaCampaign
{
    public class MediaTaskResponseDto
    {
        public int MediaTaskId { get; set; }
        public string? TaskName { get; set; }
        public int Order { get; set; }
        public string? TaskStatus { get; set; }
        public int WorkflowId { get; set; }
        public int? ApprovalId { get; set; }
        public string ManagerId { get; set; }
        public int? AdId { get; set; }
    }

    public class MediaTaskCreateDto
    {
        [Required]
        [StringLength(200)]
        public string TaskName { get; set; }

        [Required]
        public int Order { get; set; }

        [StringLength(50)]
        public string? TaskStatus { get; set; }

        [Required]
        public int WorkflowId { get; set; }
        public int? ApprovalId { get; set; }
        [Required]
        public string ManagerId { get; set; }
        public int? AdId { get; set; }
    }

    public class MediaTaskUpdateDto
    {
        [StringLength(200)]
        public string? TaskName { get; set; }

        public int? Order { get; set; }

        [StringLength(50)]
        public string? TaskStatus { get; set; }

        public int? WorkflowId { get; set; }
        public int? ApprovalId { get; set; }
        public string? ManagerId { get; set; }
        public int? AdId { get; set; }
    }

    public class AssignTaskDto
    {
        [Required]
        public int TaskId { get; set; }
        [Required]
        public string ManagerId { get; set; }
    }

}