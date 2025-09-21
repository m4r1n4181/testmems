﻿using MusicEventManagementSystem.Models.Auth;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicEventManagementSystem.API.Models
{
    public class RecordedSale
    {
        public int RecordedSaleId { get; set; }
        public decimal TotalAmount { get; set; }
        public string? PaymentMethod { get; set; }
        public DateTime SaleDate { get; set; }
        public string? TransactionStatus { get; set; }

        // Navigation property - RecordedSale - (0,N) -> Ticket
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }

        // Navigation property - RecordedSale - (1,N) -> Ticket
        public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();

        // Navigation property - RecordedSale - (0,N) -> SpecialOffer
        public ICollection<SpecialOffer> SpecialOffers { get; set; } = new List<SpecialOffer>();
    }
}
