namespace MusicEventManagementSystem.API.Models
{
    public class Segment
    {
        public int SegmentId { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int Capacity { get; set; }
        public string? SegmentType { get; set; }
    }
}
