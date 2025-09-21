﻿namespace MusicEventManagementSystem.API.Models
{
    public class Segment
    {
        public int SegmentId { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int Capacity { get; set; }
        public string? SegmentType { get; set; }

        // Navigation property - Segment - (1,1) -> Venue
        public int VenueId { get; set; }
        public Venue Venue { get; set; }

        // Navigation property - Segment - (1,N) -> Zone
        public ICollection<Zone> Zones { get; set; } = new List<Zone>();
    }
}
