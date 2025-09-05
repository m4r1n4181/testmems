using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class PricingRuleRepository : Repository<PricingRule>, IPricingRuleRepository
    {
        public PricingRuleRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
