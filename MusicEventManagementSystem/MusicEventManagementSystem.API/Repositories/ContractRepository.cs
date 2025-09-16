using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class ContractRepository : Repository<Contract>, IContractRepository
    {
        public ContractRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
