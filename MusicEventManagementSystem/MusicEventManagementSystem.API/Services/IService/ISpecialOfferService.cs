using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface ISpecialOfferService
    {
        Task<IEnumerable<SpecialOffer>> GetAllSpecialOffersAsync();
        Task<SpecialOffer?> GetSpecialOfferByIdAsync(int id);
        Task<SpecialOffer> CreateSpecialOfferAsync(SpecialOffer specialOffer);
        Task<SpecialOffer?> UpdateSpecialOfferAsync(int id, SpecialOffer specialOffer);
        Task<bool> DeleteSpecialOfferAsync(int id);

        Task<IEnumerable<SpecialOffer>> GetActiveOffersAsync(DateTime currentDate);
        Task<IEnumerable<SpecialOffer>> GetByOfferTypeAsync(string offerType);
        Task<IEnumerable<SpecialOffer>> GetByDateRangeAsync(DateTime start, DateTime end);
        Task<IEnumerable<SpecialOffer>> GetByTicketTypeAsync(int ticketTypeId);
        Task<bool> IsOfferValidAsync(int specialOfferId, DateTime checkDate);
        Task<bool> HasActiveOfferForTicketTypeAsync(int ticketTypeId, DateTime currentDate);
    }
}
