namespace MusicEventManagementSystem.API.Models
{
    public class Negotiation
    {
        public int NegotiationId { get; set; }
        public decimal ProposedFee { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
