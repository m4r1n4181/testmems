using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class PhaseRepository : Repository<Phase>, IPhaseRepository
    {
        public PhaseRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
