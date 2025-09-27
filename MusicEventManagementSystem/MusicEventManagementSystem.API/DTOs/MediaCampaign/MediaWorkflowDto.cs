using MusicEventManagementSystem.API.Models;
using System.ComponentModel.DataAnnotations;

namespace MusicEventManagementSystem.API.DTOs.MediaCampaign
{
    public class MediaWorkflowResponseDto
    {
        public int MediaWorkflowId { get; set; }
        public string? WorkflowDescription { get; set; }
        public ICollection<int>? TaskIds{ get; set; }
        public int? ApprovalId { get; set; }
        public int? AdId { get; set; }
    }

    public class MediaWorkflowCreateDto
    {
        [StringLength(500)]
        public string? WorkflowDescription { get; set; }
        [Range(0,100)]
        public ICollection<int>? TaskIds { get; set; }
        [Range(0, 100)]
        public int? ApprovalId { get; set; }
        [Range(0,100)]
        public int? AdId { get; set; }
    }

    public class MediaWorkflowUpdateDto
    {
        [StringLength(500)]
        public string? WorkflowDescription { get; set; }
        [Range(0, 100)]
        public ICollection<int>? TaskIds { get; set; }
        [Range(0, 100)]
        public int? ApprovalId { get; set; }
        [Range(0, 100)]
        public int? AdId { get; set; }
    }
}