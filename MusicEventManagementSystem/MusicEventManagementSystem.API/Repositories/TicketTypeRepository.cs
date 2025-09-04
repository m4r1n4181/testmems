using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class TicketTypeRepository : Repository<TicketType>
    {
        public TicketTypeRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
