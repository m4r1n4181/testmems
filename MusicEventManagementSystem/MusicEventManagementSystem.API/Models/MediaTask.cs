﻿using MusicEventManagementSystem.Models.Auth;
using MusicEventManagementSystem.Enums;

namespace MusicEventManagementSystem.API.Models
{
    public class MediaTask
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


        public virtual MediaWorkflow? MediaWorkflow { get; set; }
        public virtual Approval? Approval { get; set; }
        public ApplicationUser? Manager { get; set; }
        public virtual Ad? Ad { get; set; } = null!;
    }
}
