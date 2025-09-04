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
    }
}
