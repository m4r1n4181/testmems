namespace MusicEventManagementSystem.API.Models
{
    public class Zone
    {
        public int ZoneId { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int Capacity { get; set; }
        public decimal BasePrice { get; set; }
        public string? Position { get; set; }
    }
}
