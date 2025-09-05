using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class SpecialOfferRepository : Repository<SpecialOffer>, ISpecialOfferRepository
    {
        public SpecialOfferRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
