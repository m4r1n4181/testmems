using MusicEventManagementSystem.Enums;
using MusicEventManagementSystem.Models.Auth;
namespace MusicEventManagementSystem.API.Models
{
    public class Ad
    {
        public int AdId { get; set; }
        public DateTime Deadline { get; set; }
        public string? Title { get; set; }
        public DateTime CreationDate { get; set; }
        public AdStatus CurrentPhase { get; set; }
        public DateTime? PublicationDate { get; set; }
        public int CampaignId { get; set; }
        public int MediaWorkflowId { get; set; }
        public int AdTypeId { get; set; }
        public string CreatedById { get; set; }

        // Navigation properties
        public virtual Campaign Campaign { get; set; } = null!;
        public virtual MediaWorkflow MediaWorkflow { get; set; } = null!;
        public virtual AdType AdType { get; set; } = null!;
        public virtual ICollection<MediaVersion> Versions { get; set; } = new List<MediaVersion>();
        public virtual ICollection<IntegrationStatus> IntegrationStatuses { get; set; } = new List<IntegrationStatus>();
        public virtual ApplicationUser CreatedBy { get; set; } = null!;
    }
}