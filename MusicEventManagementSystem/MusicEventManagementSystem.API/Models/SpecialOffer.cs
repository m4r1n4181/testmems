namespace MusicEventManagementSystem.API.Models
{
    public class SpecialOffer
    {
        public int SpecialOfferId { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? OfferType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? ApplicationCondition { get; set; }
        public decimal DiscountValue { get; set; }
        public int TicketLimit { get; set; }
    }
}
