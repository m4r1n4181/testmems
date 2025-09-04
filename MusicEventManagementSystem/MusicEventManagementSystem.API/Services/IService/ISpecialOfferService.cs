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
    }
}
