namespace MusicEventManagementSystem.API.Models
{
    public class RecordedSale
    {
        public int RecordedSaleId { get; set; }
        public decimal TotalAmount { get; set; }
        public string? PaymentMethod { get; set; }
        public DateTime SaleDate { get; set; }
        public string? TransactionStatus { get; set; }
    }
}
