namespace MusicEventManagementSystem.API.Models
{
    public class Document
    {
        public int DocumentId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Path { get; set; } = string.Empty;
        public string Version { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; }
    }
}
