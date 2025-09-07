namespace MusicEventManagementSystem.API.Models
{
    public class Phase
    {
        public int PhaseId { get; set; }
        public string PhaseName { get; set; } = string.Empty;
        public int OrderNumber { get; set; }
        public TimeSpan EstimatedDuration { get; set; }
    }
}
