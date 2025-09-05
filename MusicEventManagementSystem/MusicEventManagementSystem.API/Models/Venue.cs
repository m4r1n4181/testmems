namespace MusicEventManagementSystem.API.Models
{
    public class Venue
    {
        public int VenueId { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? City { get; set; }
        public string? Address { get; set; }
        public int Capacity { get; set; }
        public string? VenueType { get; set; }
    }
}
