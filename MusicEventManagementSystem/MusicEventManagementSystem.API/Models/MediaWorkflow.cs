namespace MusicEventManagementSystem.API.Models
{
    public class MediaWorkflow
    {
        public int MediaWorkflowId { get; set; }
        public string? WorkflowDescription { get; set; }
        public int? ApprovalId { get; set; }
        

        // Navigation properties
        public virtual ICollection<AdType> AdTypes { get; set; } = new List<AdType>();
        public virtual Approval? Approval { get; set; }
        public virtual ICollection<Ad> Ads { get; set; } = new List<Ad>();
        public virtual ICollection<MediaTask> Tasks { get; set; } = new List<MediaTask>();
    }
}