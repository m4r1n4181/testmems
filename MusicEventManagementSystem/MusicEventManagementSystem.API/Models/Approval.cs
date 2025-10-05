namespace MusicEventManagementSystem.API.Models
{
    public class Approval
    {
        public int ApprovalId { get; set; }
        public string? ApprovalStatus { get; set; }
        public string? Comment { get; set; }
        public DateTime ApprovalDate { get; set; }
        public int MediaTaskId { get; set; }
        public int? SubmittedMediaVersionId { get; set; }

        public virtual MediaTask MediaTask { get; set; }
        public virtual MediaVersion? SubmittedMediaVersion { get; set; }

    }
}