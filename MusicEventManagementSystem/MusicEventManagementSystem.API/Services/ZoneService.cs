using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.API.Services.IService;

namespace MusicEventManagementSystem.API.Services
{
    public class ZoneService : IZoneService
    {
        private readonly IZoneRepository _zoneRepository;

        public ZoneService(IZoneRepository zoneRepository)
        {
            _zoneRepository = zoneRepository;
        }

        public async Task<IEnumerable<Zone>> GetAllZonesAsync()
        {
            return await _zoneRepository.GetAllAsync();
        }

        public async Task<Zone?> GetZoneByIdAsync(int id)
        {
            return await _zoneRepository.GetByIdAsync(id);
        }

        public async Task<Zone> CreateZoneAsync(Zone zone)
        {
            await _zoneRepository.AddAsync(zone);
            await _zoneRepository.SaveChangesAsync();
            return zone;
        }

        public async Task<Zone?> UpdateZoneAsync(int id, Zone zone)
        {
            var existingZone = await _zoneRepository.GetByIdAsync(id);
            if (existingZone == null)
            {
                return null;
            }

            existingZone.Name = zone.Name;
            existingZone.Description = zone.Description;
            existingZone.Capacity = zone.Capacity;
            existingZone.BasePrice = zone.BasePrice;
            existingZone.Position = zone.Position;

            _zoneRepository.Update(existingZone);
            await _zoneRepository.SaveChangesAsync();
            return existingZone;
        }

        public async Task<bool> DeleteZoneAsync(int id)
        {
            var zone = await _zoneRepository.GetByIdAsync(id);
            
            if (zone == null)
            {
                return false;
            }

            _zoneRepository.Delete(zone);
            await _zoneRepository.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Zone>> GetBySegmentIdAsync(int segmentId)
        {
            return await _zoneRepository.GetBySegmentIdAsync(segmentId);
        }

        public async Task<IEnumerable<Zone>> GetByPriceRangeAsync(decimal min, decimal max)
        {
            return await _zoneRepository.GetByPriceRangeAsync(min, max);
        }

        public async Task<IEnumerable<Zone>> GetByPositionAsync(string position)
        {
            return await _zoneRepository.GetByPositionAsync(position);
        }

        public async Task<IEnumerable<TicketType>> GetTicketTypesAsync(int zoneId)
        {
            return await _zoneRepository.GetTicketTypesAsync(zoneId);
        }
    }
}
