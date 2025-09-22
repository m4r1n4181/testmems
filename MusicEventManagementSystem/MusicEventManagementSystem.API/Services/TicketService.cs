using Microsoft.EntityFrameworkCore;
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

        public async Task<IEnumerable<Ticket>> GetTicketsByStatusAsync(string status)
        {
            return await _ticketRepository.GetTicketsByStatusAsync(status);
        }

        public async Task<Ticket?> GetTicketByUniqueCodeAsync(string uniqueCode)
        {
            return await _ticketRepository.GetTicketByUniqueCodeAsync(uniqueCode);
        }

        public async Task<Ticket?> GetTicketByQrCodeAsync(string qrCode)
        {
            return await _ticketRepository.GetTicketByQrCodeAsync(qrCode);
        }

        public async Task<int> GetTicketsCountByStatusAsync(string status)
        {
            return await _ticketRepository.GetTicketsCountByStatusAsync(status);
        }

        public async Task<decimal> GetTotalRevenueAsync()
        {
            return await _ticketRepository.GetTotalRevenueAsync();
        }

        public async Task<decimal> GetRevenueByDateRangeAsync(DateTime from, DateTime to)
        {
            return await _ticketRepository.GetRevenueByDateRangeAsync(from, to);
        }

        public async Task<decimal> GetRevenueByStatusAsync(string status)
        {
            return await _ticketRepository.GetRevenueByStatusAsync(status);
        }

        public async Task<IEnumerable<Ticket>> GetSoldTicketsAsync()
        {
            return await _ticketRepository.GetSoldTicketsAsync();
        }

        public async Task<IEnumerable<Ticket>> GetTodaysTicketsAsync()
        {
            return await _ticketRepository.GetTodaysTicketsAsync();
        }

        public async Task<Ticket?> SellTicketAsync(int ticketId)
        {
            var ticket = await _ticketRepository.GetByIdAsync(ticketId);

            if (ticket == null || ticket.Status?.ToLower() != "available")
            {
                return null;
            }

            ticket.Status = "Sold";

            _ticketRepository.Update(ticket);
            await _ticketRepository.SaveChangesAsync();
            return ticket;
        }

        public async Task<Ticket?> UseTicketAsync(string uniqueCode)
        {
            var ticket = await _ticketRepository.GetTicketByUniqueCodeAsync(uniqueCode);

            if (ticket == null || ticket.Status?.ToLower() != "sold")
            {
                return null;
            }

            ticket.Status = "Used";

            _ticketRepository.Update(ticket);
            await _ticketRepository.SaveChangesAsync();
            return ticket;
        }

        public async Task<Ticket?> CancelTicketAsync(int ticketId)
        {
            var ticket = await _ticketRepository.GetByIdAsync(ticketId);

            if (ticket == null)
            {
                return null;
            }

            ticket.Status = "Cancelled";

            _ticketRepository.Update(ticket);
            await _ticketRepository.SaveChangesAsync();
            return ticket;
        }

        public async Task<bool> IsUniqueCodeValidAsync(string uniqueCode)
        {
            var ticket = await _ticketRepository.GetTicketByUniqueCodeAsync(uniqueCode);
            return IsTicketValid(ticket);
        }

        public async Task<bool> IsQrCodeValidAsync(string qrCode)
        {
            var ticket = await _ticketRepository.GetTicketByQrCodeAsync(qrCode);
            return IsTicketValid(ticket);
        }

        public async Task<bool> CanTicketBeUsedAsync(string uniqueCode)
        {
            var ticket = await _ticketRepository.GetTicketByUniqueCodeAsync(uniqueCode);
            return IsTicketValid(ticket);
        }

        // Helper methods
        private bool IsTicketValid(Ticket ticket)
        {
            if (ticket != null && ticket.Status?.ToLower() == "sold")
            {
                return true;
            }

            return false;
        }

        private async Task<string> GenerateUniqueCodeAsync()
        {
            string uniqueCode;
            bool isCodeUnique;

            do
            {
                uniqueCode = GenerateRandomCode();
                var existingTicket = await _ticketRepository.GetTicketByUniqueCodeAsync(uniqueCode);
                isCodeUnique = existingTicket == null;
            }
            while(!isCodeUnique);

            return uniqueCode;
        }

        private static string GenerateRandomCode()
        {
            var random = new Random();
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            const int codeLength = 10;

            return new string(Enumerable.Repeat(chars, codeLength).Select(s => s[random.Next(s.Length)]).ToArray());
        }

        private static string GenerateQrCode(string uniqueCode)
        {
            // Method for generating QR code from unique code
            // Until implemented, return a base64 representation of the unique code
            byte[] encodedBytes = System.Text.Encoding.UTF8.GetBytes(uniqueCode);
            return Convert.ToBase64String(encodedBytes);
        }
    }
}
