using MusicEventManagementSystem.Models.Auth;

namespace MusicEventManagementSystem.API.Models
{
    public class MediaTask
    {
        public int MediaTaskId { get; set; }
        public string? TaskName { get; set; }
        public int Order { get; set; }
        public string? TaskStatus { get; set; }
        public int WorkflowId { get; set; }
        public int? ApprovalId { get; set; }
        public string ManagerId { get; set; }
        public int? AdId { get; set; }


        public virtual MediaWorkflow MediaWorkflow { get; set; } = null!;
        public virtual Approval? Approval { get; set; }
        public ApplicationUser Manager { get; set; }
        public virtual Ad? Ad { get; set; } = null!;
    }
}
