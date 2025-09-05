// MusicEventManagementSystem.API/Models/Campaign.cs
namespace MusicEventManagementSystem.API.Models
{
    public class Campaign
    {
        public int IdCampaign { get; set; }
        public int IdEvent { get; set; }
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal TotalBudget { get; set; }
        public virtual ICollection<Ad> Ads { get; set; } = new List<Ad>();
    }
}