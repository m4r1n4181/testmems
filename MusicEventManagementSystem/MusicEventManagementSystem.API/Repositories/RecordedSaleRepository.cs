using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class RecordedSaleRepository : Repository<RecordedSale>, IRecodedSaleRepository
    {
        public RecordedSaleRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
