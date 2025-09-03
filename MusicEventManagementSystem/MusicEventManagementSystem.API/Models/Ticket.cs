namespace MusicEventManagementSystem.API.Models
{
    public class Ticket
    {
        public int TicketId { get; set; }
        public string? UniqueCode { get; set; }
        public string? QrCode { get; set; }
        public DateTime IssueDate { get; set; }
        public decimal FinalPrice { get; set; }
        public string? Status { get; set; }
    }
}
