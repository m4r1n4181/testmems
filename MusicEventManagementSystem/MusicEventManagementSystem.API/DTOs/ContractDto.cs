namespace MusicEventManagementSystem.API.DTOs
{
    public class ContractDto
    {
        public int ContractId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ContractType { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Version { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? SignedAt { get; set; }
    }

    public class CreateContractDto
    {
        public string Title { get; set; } = string.Empty;
        public string ContractType { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Version { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }

    public class UpdateContractDto
    {
        public string Title { get; set; } = string.Empty;
        public string ContractType { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Version { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}
