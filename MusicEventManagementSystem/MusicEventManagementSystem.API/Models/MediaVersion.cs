namespace MusicEventManagementSystem.API.Models
{
    public class MediaVersion
    {
        public int MediaVersionId { get; set; }
        public int AdId { get; set; }
        public string? VersionFileName { get; set; }
        public string? FileType { get; set; }
        public string? FileURL { get; set; }
        public bool IsFinalVersion { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? MediaTaskId { get; set; }

        // Navigation properties
        public virtual Ad Ad { get; set; } = null!;
        public virtual MediaTask? MediaTask { get; set; }
    }
}