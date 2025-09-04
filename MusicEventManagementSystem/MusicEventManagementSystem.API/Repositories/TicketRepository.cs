using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class TicketRepository : Repository<Ticket>
    {
        public TicketRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
