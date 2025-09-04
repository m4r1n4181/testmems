using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class RecordedSaleRepository : Repository<RecordedSale>
    {
        public RecordedSaleRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
