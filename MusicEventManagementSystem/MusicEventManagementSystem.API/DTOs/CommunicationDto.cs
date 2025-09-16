namespace MusicEventManagementSystem.API.DTOs
{
    public class CommunicationDto
    {
        public int CommunicationId { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Direction { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
        public DateTime? RepliedAt { get; set; }
    }

    public class CreateCommunicationDto
    {
        public string Type { get; set; } = string.Empty;
        public string Direction { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }

    public class UpdateCommunicationDto
    {
        public string Type { get; set; } = string.Empty;
        public string Direction { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }
}
