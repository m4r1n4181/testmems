namespace MusicEventManagementSystem.API.DTOs
{
    public class PhaseDto
    {
        public int PhaseId { get; set; }
        public string PhaseName { get; set; } = string.Empty;
        public int OrderNumber { get; set; }
        public TimeSpan EstimatedDuration { get; set; }
    }

    public class CreatePhaseDto
    {
        public string PhaseName { get; set; } = string.Empty;
        public int OrderNumber { get; set; }
        public TimeSpan EstimatedDuration { get; set; }
    }

    public class UpdatePhaseDto
    {
        public string PhaseName { get; set; } = string.Empty;
        public int OrderNumber { get; set; }
        public TimeSpan EstimatedDuration { get; set; }
    }
}
