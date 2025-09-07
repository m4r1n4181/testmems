using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class IntegrationStatusRepository : Repository<IntegrationStatus>, IIntegrationStatusRepository
    {
        public IntegrationStatusRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
    }
  