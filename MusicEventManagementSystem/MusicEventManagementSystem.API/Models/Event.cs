using MusicEventManagementSystem.Enums;

namespace MusicEventManagementSystem.API.Models
{
    public class Event
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime Interval { get; set; }
        public EventStatus Status { get; set; } 
        public Guid CreatedById { get; set; }
        public int LocationId { get; set; }
        //public Location Location { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }


    }

}
