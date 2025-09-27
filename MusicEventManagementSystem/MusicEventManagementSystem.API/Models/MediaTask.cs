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

        public virtual MediaWorkflow MediaWorkflow { get; set; } = null!;
        public virtual Approval? Approval { get; set; }
    }
}
