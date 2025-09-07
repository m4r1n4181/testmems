namespace MusicEventManagementSystem.API.Models
{
    public class Performer
    {
        public int PerformerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Contact { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
        public int Popularity { get; set; }
        public string TechnicalRequirements { get; set; } = string.Empty;
        public decimal MinPrice { get; set; }
        public decimal MaxPrice { get; set; }
        public TimeSpan AverageResponseTime { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
