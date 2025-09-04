using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class ZoneRepository : Repository<Zone>
    {
        public ZoneRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
