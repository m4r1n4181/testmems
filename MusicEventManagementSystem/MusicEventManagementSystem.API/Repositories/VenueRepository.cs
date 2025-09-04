using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class VenueRepository : Repository<Venue>
    {
        public VenueRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
