using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class NegotiationRepository : Repository<Negotiation>, INegotiationRepository
    {
        public NegotiationRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
