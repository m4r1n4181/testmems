using MusicEventManagementSystem.API.Enums.TicketSales;
using System.ComponentModel.DataAnnotations;

namespace MusicEventManagementSystem.API.DTOs.TicketSales
{
    public class RecordedSaleResponseDto
    {
        public int RecordedSaleId { get; set; }
        public decimal TotalAmount { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public DateTime SaleDate { get; set; }
        public TransactionStatus TransactionStatus { get; set; }
        public string ApplicationUserId { get; set; }
        public ApplicationUserResponseDto? ApplicationUser { get; set; }
        public List<TicketResponseDto>? Tickets { get; set; }
        public List<SpecialOfferResponseDto>? SpecialOffers { get; set; }
    }

    public class RecordedSaleCreateDto
    {
        [Required]
        [Range(0, double.MaxValue)]
        public decimal TotalAmount { get; set; }

        [Required]
        public PaymentMethod PaymentMethod { get; set; }

        [Required]
        public DateTime SaleDate { get; set; }

        [Required]
        public TransactionStatus TransactionStatus { get; set; }

        [Required]
        public string ApplicationUserId { get; set; }
    }

    public class RecordedSaleUpdateDto
    {
        [Range(0, double.MaxValue)]
        public decimal? TotalAmount { get; set; }

        public PaymentMethod? PaymentMethod { get; set; }
        public DateTime? SaleDate { get; set; }
        public TransactionStatus? TransactionStatus { get; set; }
    }
}
