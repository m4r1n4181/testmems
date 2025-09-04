using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class SpecialOfferRepository : Repository<SpecialOffer>
    {
        public SpecialOfferRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
