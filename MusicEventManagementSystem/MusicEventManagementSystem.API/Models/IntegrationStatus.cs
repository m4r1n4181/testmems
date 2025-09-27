using MusicEventManagementSystem.API.Enums;

namespace MusicEventManagementSystem.API.Models
{
    public class IntegrationStatus
    {
        public int IntegrationStatusId { get; set; }
        public StatusIntegration Status { get; set; }
        public DateTime? PublicationDate { get; set; }
        public string? Error { get; set; }
        public DateTime? LastSynced { get; set; }
        public int AdId { get; set; }
        public int ChannelId { get; set; }

        // Navigation properties
        public virtual Ad Ad { get; set; } = null!;
        public virtual MediaChannel MediaChannel { get; set; } = null!;
    }
}