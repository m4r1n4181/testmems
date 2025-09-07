namespace MusicEventManagementSystem.API.Models
{
    public class Requirement
    {
        public int RequirementId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool Fulfilled { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
