using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class SegmentRepository : Repository<Segment>
    {
        public SegmentRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
