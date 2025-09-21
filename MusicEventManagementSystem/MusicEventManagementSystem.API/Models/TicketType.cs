﻿namespace MusicEventManagementSystem.API.Models
{
    public class TicketType
    {
        public int TicketTypeId { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
        public int AvailableQuantity { get; set; }

        public int ZoneId { get; set; }
        public Zone Zone { get; set; }

        public int EventId { get; set; }
        public Event Event { get; set; }

        // Navigation property - TicketType - (1,N) -> Ticket
        public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();

        // Navigation property - TicketType - (0,N) -> SpecialOffer
        public ICollection<SpecialOffer> SpecialOffers { get; set; } = new List<SpecialOffer>();

        // Navigation property - TicketType - (0,N) -> PriceRules
        public ICollection<PricingRule> PricingRules { get; set; } = new List<PricingRule>();
    }
}
