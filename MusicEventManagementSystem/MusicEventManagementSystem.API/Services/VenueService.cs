using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.API.Services.IService;

namespace MusicEventManagementSystem.API.Services
{
    public class VenueService : IVenueService
    {
        private readonly IVenueRepository _venueRepository;

        public VenueService(IVenueRepository venueRepository)
        {
            _venueRepository = venueRepository;
        }

        public async Task<IEnumerable<Venue>> GetAllVenuesAsync()
        {
            return await _venueRepository.GetAllAsync();
        }

        public async Task<Venue?> GetVenueByIdAsync(int venueId)
        {
            return await _venueRepository.GetByIdAsync(venueId);
        }

        public async Task<Venue> CreateVenueAsync(Venue venue)
        {
            await _venueRepository.AddAsync(venue);
            await _venueRepository.SaveChangesAsync();
            return venue;
        }

        public async Task<Venue?> UpdateVenueAsync(int venueId, Venue venue)
        {
            var existingVenue = await _venueRepository.GetByIdAsync(venueId);

            if (existingVenue == null)
            {
                return null;
            }
            
            existingVenue.Name = venue.Name;
            existingVenue.Description = venue.Description;
            existingVenue.City = venue.City;
            existingVenue.Address = venue.Address;
            existingVenue.Capacity = venue.Capacity;
            existingVenue.VenueType = venue.VenueType;

            _venueRepository.Update(existingVenue);
            await _venueRepository.SaveChangesAsync();
            return existingVenue;
        }

        public async Task<bool> DeleteVenueAsync(int venueId)
        {
            var venue = await _venueRepository.GetByIdAsync(venueId);

            if (venue == null)
            {
                return false;
            }

            _venueRepository.Delete(venue);
            await _venueRepository.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Venue>> GetByCityAsync(string city)
        {
            return await _venueRepository.GetByCityAsync(city);
        }

        public Task<IEnumerable<Venue>> GetByCapacityRangeAsync(int min, int max)
        {
            return _venueRepository.GetByCapacityRangeAsync(min, max);
        }

        public async Task<IEnumerable<Segment>> GetSegmentsAsync(int venueId)
        {
            return await _venueRepository.GetSegmentsAsync(venueId);
        }

        public async Task<int> CalculateTotalCapacityAsync(int venueId)
        {
            var segments = await _venueRepository.GetSegmentsAsync(venueId);
            return segments.Sum(s => s.Capacity);
        }
    }
}
