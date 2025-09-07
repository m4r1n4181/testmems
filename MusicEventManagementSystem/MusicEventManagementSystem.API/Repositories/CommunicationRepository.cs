using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class CommunicationRepository : Repository<Communication>, ICommunicationRepository
    {
        public CommunicationRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
