namespace MusicEventManagementSystem.API.Models
{
    public class TicketType
    {
        public int TicketTypeId { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
        public int AvailableQuantity { get; set; }
    }
}
