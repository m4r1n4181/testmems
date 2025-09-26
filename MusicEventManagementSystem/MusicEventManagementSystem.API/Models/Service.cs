using MusicEventManagementSystem.Enums;

namespace MusicEventManagementSystem.API.Models
{

    public class Service
    {
        public int Id { get; set; }
        public string Provider { get; set; }
        public string Contact { get; set; }
        public ContractSigned ContractSigned { get; set; }
        public int ServiceDuration { get; set; }
        public int ResourceId { get; set; }
        //public Resource Resource { get; set; }
    }
}
