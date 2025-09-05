using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.API.Services.IService;

namespace MusicEventManagementSystem.API.Services
{
    public class SpecialOfferService : ISpecialOfferService
    {
        private readonly ISpecialOfferRepository _specialOfferRepository;

        public SpecialOfferService(ISpecialOfferRepository specialOfferRepository)
        {
            _specialOfferRepository = specialOfferRepository;
        }

        public async Task<IEnumerable<SpecialOffer>> GetAllSpecialOffersAsync()
        {
            return await _specialOfferRepository.GetAllAsync();
        }

        public async Task<SpecialOffer?> GetSpecialOfferByIdAsync(int id)
        {
            return await _specialOfferRepository.GetByIdAsync(id);
        }

        public async Task<SpecialOffer> CreateSpecialOfferAsync(SpecialOffer specialOffer)
        {
            await _specialOfferRepository.AddAsync(specialOffer);
            await _specialOfferRepository.SaveChangesAsync();
            return specialOffer;
        }

        public async Task<SpecialOffer?> UpdateSpecialOfferAsync(int id, SpecialOffer specialOffer)
        {
            var existingSpecialOffer = await _specialOfferRepository.GetByIdAsync(id);
            
            if (existingSpecialOffer == null)
            {
                return null;
            }

            existingSpecialOffer.Name = specialOffer.Name;
            existingSpecialOffer.Description = specialOffer.Description;
            existingSpecialOffer.OfferType = specialOffer.OfferType;
            existingSpecialOffer.StartDate = specialOffer.StartDate;
            existingSpecialOffer.EndDate = specialOffer.EndDate;
            existingSpecialOffer.ApplicationCondition = specialOffer.ApplicationCondition;
            existingSpecialOffer.DiscountValue = specialOffer.DiscountValue;
            existingSpecialOffer.TicketLimit = specialOffer.TicketLimit;

            _specialOfferRepository.Update(existingSpecialOffer);
            await _specialOfferRepository.SaveChangesAsync();
            return existingSpecialOffer;
        }

        public async Task<bool> DeleteSpecialOfferAsync(int id)
        {
            var specialOffer = await _specialOfferRepository.GetByIdAsync(id);
            
            if (specialOffer == null)
            {
                return false;
            }

            _specialOfferRepository.Delete(specialOffer);
            await _specialOfferRepository.SaveChangesAsync();
            return true;
        }
    }
}
