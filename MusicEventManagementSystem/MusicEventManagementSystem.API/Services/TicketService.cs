using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.API.Services.IService;

namespace MusicEventManagementSystem.API.Services
{
    public class TicketService : ITicketService
    {
        private readonly ITicketRepository _ticketRepository;

        public TicketService(ITicketRepository ticketRepository)
        {
            _ticketRepository = ticketRepository;
        }

        public async Task<IEnumerable<Ticket>> GetAllTicketsAsync()
        {
            return await _ticketRepository.GetAllAsync();
        }

        public async Task<Ticket?> GetTicketByIdAsync(int id)
        {
            return await _ticketRepository.GetByIdAsync(id);
        }

        public async Task<Ticket> CreateTicketAsync(Ticket ticket)
        {
            await _ticketRepository.AddAsync(ticket);
            await _ticketRepository.SaveChangesAsync();
            return ticket;
        }

        public async Task<Ticket?> UpdateTicketAsync(int id, Ticket ticket)
        {
            var existingTicket = await _ticketRepository.GetByIdAsync(id);
            if (existingTicket == null)
            {
                return null;
            }

            existingTicket.UniqueCode = ticket.UniqueCode;
            existingTicket.QrCode = ticket.QrCode;
            existingTicket.IssueDate = ticket.IssueDate;
            existingTicket.FinalPrice = ticket.FinalPrice;
            existingTicket.Status = ticket.Status;

            _ticketRepository.Update(existingTicket);
            await _ticketRepository.SaveChangesAsync();
            return existingTicket;
        }

        public async Task<bool> DeleteTicketAsync(int id)
        {
            var ticket = await _ticketRepository.GetByIdAsync(id);
            if (ticket == null)
            {
                return false;
            }

            _ticketRepository.Delete(ticket);
            await _ticketRepository.SaveChangesAsync();
            return true;
        }
    }
}
