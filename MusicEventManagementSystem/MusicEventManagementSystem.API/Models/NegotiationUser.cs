using MusicEventManagementSystem.Models.Auth;

namespace MusicEventManagementSystem.API.Models
{
    public class NegotiationUser
    {
        public int NegotiationId { get; set; }
        public string UserId { get; set; } = string.Empty;

        // Navigation Properties
        public Negotiation Negotiation { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;
    }
}