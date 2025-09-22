using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface ISpecialOfferRepository : IRepository<SpecialOffer>
    {

        Task<IEnumerable<SpecialOffer>> GetActiveOffersAsync(DateTime currentDate);
        Task<IEnumerable<SpecialOffer>> GetByOfferTypeAsync(string offerType);
        Task<IEnumerable<SpecialOffer>> GetByDateRangeAsync(DateTime start, DateTime end);
        Task<IEnumerable<SpecialOffer>> GetByTicketTypeAsync(int ticketTypeId);

        Task<bool> IsOfferValidAsync(int specialOfferId, DateTime checkDate);
        Task<bool> HasActiveOfferForTicketTypeAsync(int ticketTypeId, DateTime currentDate);
    }
}
