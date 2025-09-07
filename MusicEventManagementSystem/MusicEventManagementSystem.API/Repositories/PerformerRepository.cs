using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class PerformerRepository : Repository<Performer>, IPerformerRepository
    {
        public PerformerRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
