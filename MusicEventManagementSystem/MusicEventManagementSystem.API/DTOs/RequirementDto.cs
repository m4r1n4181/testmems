namespace MusicEventManagementSystem.API.DTOs
{
    public class RequirementDto
    {
        public int RequirementId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool Fulfilled { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateRequirementDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool Fulfilled { get; set; }
    }

    public class UpdateRequirementDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool Fulfilled { get; set; }
    }
}
