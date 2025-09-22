using Microsoft.EntityFrameworkCore;
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
            ValidateSpecialOffer(specialOffer);

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

            ValidateSpecialOffer(specialOffer);

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

        public async Task<IEnumerable<SpecialOffer>> GetActiveOffersAsync(DateTime currentDate)
        {
            return await _specialOfferRepository.GetActiveOffersAsync(currentDate);
        }

        public async Task<IEnumerable<SpecialOffer>> GetByOfferTypeAsync(string offerType)
        {
            if (string.IsNullOrWhiteSpace(offerType))
            {
                throw new ArgumentException("Offer type cannot be null or empty.", nameof(offerType));
            }

            return await _specialOfferRepository.GetByOfferTypeAsync(offerType);
        }

        public async Task<IEnumerable<SpecialOffer>> GetByDateRangeAsync(DateTime start, DateTime end)
        {
            if (start > end)
            {
                throw new ArgumentException("Start date cannot be greater than end date.");
            }

            return await _specialOfferRepository.GetByDateRangeAsync(start, end);
        }

        public async Task<IEnumerable<SpecialOffer>> GetByTicketTypeAsync(int ticketTypeId)
        {
            if (ticketTypeId <= 0)
            {
                throw new ArgumentException("Ticket type ID must be greater than 0.", nameof(ticketTypeId));
            }

            return await _specialOfferRepository.GetByTicketTypeAsync(ticketTypeId);
        }

        public async Task<bool> IsOfferValidAsync(int specialOfferId, DateTime checkDate)
        {
            if (specialOfferId <= 0)
            {
                return false;
            }

            return await _specialOfferRepository.IsOfferValidAsync(specialOfferId, checkDate);
        }

        public async Task<bool> HasActiveOfferForTicketTypeAsync(int ticketTypeId, DateTime currentDate)
        {
            if (ticketTypeId <= 0)
            {
                return false;
            }

            return await _specialOfferRepository.HasActiveOfferForTicketTypeAsync(ticketTypeId, currentDate);
        }

        // Helper method
        private void ValidateSpecialOffer(SpecialOffer specialOffer)
        {
            if (string.IsNullOrWhiteSpace(specialOffer.Name))
                throw new ArgumentException("Special offer name cannot be empty.");

            if (string.IsNullOrWhiteSpace(specialOffer.OfferType))
                throw new ArgumentException("Offer type cannot be empty.");

            if (specialOffer.StartDate >= specialOffer.EndDate)
                throw new ArgumentException("Start date must be before end date.");

            if (specialOffer.DiscountValue < 0)
                throw new ArgumentException("Discount value cannot be negative.");

            if (specialOffer.TicketLimit < 0)
                throw new ArgumentException("Ticket limit cannot be negative.");
        }
    }
}
