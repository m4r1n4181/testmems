namespace MusicEventManagementSystem.API.Models
{
    public class AdType
    {
        public int AdTypeId { get; set; }
        public string? TypeName { get; set; }
        public string? TypeDescription { get; set; }
        public string? Dimensions { get; set; }
        public int Duration { get; set; }
        public string? FileFormat { get; set; }
        public int? MediaWorkflowId { get; set; }
        public virtual ICollection<Ad> Ads { get; set; } = new List<Ad>();
        public virtual MediaWorkflow? MediaWorkflow { get; set; }

    }
}