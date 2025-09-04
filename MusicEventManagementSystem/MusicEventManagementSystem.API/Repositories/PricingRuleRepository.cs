using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class PricingRuleRepository : Repository<PricingRule>
    {
        public PricingRuleRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
