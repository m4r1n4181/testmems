using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class SpecialOfferRepository : Repository<SpecialOffer>, ISpecialOfferRepository
    {
        public SpecialOfferRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<SpecialOffer>> GetActiveOffersAsync(DateTime currentDate)
        {
            return await _context.SpecialOffers.Include(so => so.TicketTypes).Include(so => so.RecordedSales).Where(so => so.StartDate <= currentDate && so.EndDate >= currentDate).OrderBy(so => so.EndDate).ToListAsync();
        }

        public async Task<IEnumerable<SpecialOffer>> GetByOfferTypeAsync(string offerType)
        {
            return await _context.SpecialOffers.Include(so => so.TicketTypes).Include(so => so.RecordedSales).Where(so => so.OfferType == offerType).OrderBy(so => so.StartDate).ToListAsync();
        }

        public async Task<IEnumerable<SpecialOffer>> GetByDateRangeAsync(DateTime start, DateTime end)
        {
            return await _context.SpecialOffers.Include(so => so.TicketTypes).Include(so => so.RecordedSales).Where(so => so.StartDate >= start && so.EndDate <= end).OrderBy(so => so.StartDate).ToListAsync();
        }

        public async Task<IEnumerable<SpecialOffer>> GetByTicketTypeAsync(int ticketTypeId)
        {
            return await _context.SpecialOffers.Include(so => so.TicketTypes).Include(so => so.RecordedSales).Where(so => so.TicketTypes.Any(tt => tt.TicketTypeId == ticketTypeId)).OrderBy(so => so.StartDate).ToListAsync();
        }

        public async Task<bool> IsOfferValidAsync(int specialOfferId, DateTime checkDate)
        {
            return await _context.SpecialOffers.AnyAsync(so => so.SpecialOfferId == specialOfferId && so.StartDate <= checkDate && so.EndDate >= checkDate);
        }

        public async Task<bool> HasActiveOfferForTicketTypeAsync(int ticketTypeId, DateTime currentDate)
        {
            return await _context.SpecialOffers.AnyAsync(so => so.TicketTypes.Any(tt => tt.TicketTypeId == ticketTypeId) && so.StartDate <= currentDate && so.EndDate >= currentDate);
        }
    }
}
