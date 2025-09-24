using MusicEventManagementSystem.API.Enums.TicketSales;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.API.Services.IService;

namespace MusicEventManagementSystem.API.Services
{
    public class TicketTypeService : ITicketTypeService
    {
        private readonly ITicketTypeRepository _ticketTypeRepository;

        public TicketTypeService(ITicketTypeRepository ticketTypeRepository)
        {
            _ticketTypeRepository = ticketTypeRepository;
        }

        public async Task<IEnumerable<TicketType>> GetAllTicketTypesAsync()
        {
            return await _ticketTypeRepository.GetAllAsync();
        }

        public async Task<TicketType?> GetTicketTypeByIdAsync(int id)
        {
            return await _ticketTypeRepository.GetByIdAsync(id);
        }

        public async Task<TicketType> CreateTicketTypeAsync(TicketType ticketType)
        {
            await _ticketTypeRepository.AddAsync(ticketType);
            await _ticketTypeRepository.SaveChangesAsync();
            return ticketType;
        }

        public async Task<TicketType?> UpdateTicketTypeAsync(int id, TicketType ticketType)
        {
            var existingTicketType = await _ticketTypeRepository.GetByIdAsync(id);
            
            if (existingTicketType == null)
            {
                return null;
            }

            existingTicketType.Name = ticketType.Name;
            existingTicketType.Description = ticketType.Description;
            existingTicketType.Status = ticketType.Status;
            existingTicketType.AvailableQuantity = ticketType.AvailableQuantity;

            _ticketTypeRepository.Update(existingTicketType);
            await _ticketTypeRepository.SaveChangesAsync();
            return existingTicketType;
        }

        public async Task<bool> DeleteTicketTypeAsync(int id)
        {
            var ticketType = await _ticketTypeRepository.GetByIdAsync(id);
            
            if (ticketType == null)
            {
                return false;
            }

            _ticketTypeRepository.Delete(ticketType);
            await _ticketTypeRepository.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<TicketType>> GetByZoneIdAsync(int zoneId)
        {
            return await _ticketTypeRepository.GetByZoneIdAsync(zoneId);
        }

        public async Task<IEnumerable<TicketType>> GetByEventIdAsync(int eventId)
        {
            return await _ticketTypeRepository.GetByEventIdAsync(eventId);
        }

        public async Task<IEnumerable<TicketType>> GetByStatusAsync(TicketTypeStatus status)
        {
            return await _ticketTypeRepository.GetByStatusAsync(status);
        }

        public async Task<IEnumerable<TicketType>> GetAvailableTicketTypesAsync()
        {
            return await _ticketTypeRepository.GetAvailableTicketTypesAsync();
        }

        public async Task<bool> UpdateAvailableQuantityAsync(int id, int quantity)
        {
            if (quantity < 0)
            {
                return false;
            }

            return await _ticketTypeRepository.UpdateAvailableQuantityAsync(id, quantity);
        }

        public async Task<IEnumerable<TicketType>> GetByZoneAndEventAsync(int zoneId, int eventId)
        {
            return await _ticketTypeRepository.GetByZoneAndEventAsync(zoneId, eventId);
        }

        public async Task<int> GetTotalAvailableQuantityByEventAsync(int eventId)
        {
            return await _ticketTypeRepository.GetTotalAvailableQuantityByEventAsync(eventId);
        }

        public async Task<bool> ReserveTicketsAsync(int ticketTypeId, int quantity)
        {
            if (quantity <= 0)
            {
                return false;
            }

            var existingTicketType = await _ticketTypeRepository.GetByIdAsync(ticketTypeId);

            if (existingTicketType == null || existingTicketType.AvailableQuantity < quantity)
            {
                return false;
            }

            var newQuantity = existingTicketType.AvailableQuantity - quantity;
            return await _ticketTypeRepository.UpdateAvailableQuantityAsync(ticketTypeId, newQuantity);
        }

        public async Task<bool> ReleaseTicketsAsync(int ticketTypeId, int quantity)
        {
            if (quantity <= 0)
            {
                return false;
            }

            var existingTicketType = await _ticketTypeRepository.GetByIdAsync(ticketTypeId);

            if (existingTicketType == null)
            {
                return false;
            }

            var newQuantity = existingTicketType.AvailableQuantity + quantity;
            return await _ticketTypeRepository.UpdateAvailableQuantityAsync(ticketTypeId, newQuantity);
        }
    }
}
