using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class RecordedSaleRepository : Repository<RecordedSale>, IRecodedSaleRepository
    {
        public RecordedSaleRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<RecordedSale>> GetSalesByUserAsync(string userId)
        {
            return await _context.RecordedSales.Where(rs => rs.ApplicationUserId == userId).OrderByDescending(rs => rs.SaleDate).ToListAsync();
        }

        public async Task<IEnumerable<RecordedSale>> GetSalesByDateRangeAsync(DateTime from, DateTime to)
        {
            return await _context.RecordedSales.Where(rs => rs.SaleDate.Date >= from.Date && rs.SaleDate.Date <= to.Date).OrderByDescending(rs => rs.SaleDate).ToListAsync();
        }

        public async Task<IEnumerable<RecordedSale>> GetSalesByStatusAsync(string status)
        {
            return await _context.RecordedSales.Where(rs => rs.TransactionStatus != null && rs.TransactionStatus.ToLower() == status.ToLower()).OrderByDescending(rs => rs.SaleDate).ToListAsync();
        }

        public async Task<IEnumerable<RecordedSale>> GetSalesByPaymentMethodAsync(string paymentMethod)
        {
            return await _context.RecordedSales.Where(rs => rs.PaymentMethod != null && rs.PaymentMethod.ToLower() == paymentMethod.ToLower()).OrderByDescending(rs => rs.SaleDate).ToListAsync();
        }

        public async Task<decimal> GetTotalRevenueAsync()
        {
            var completedSales = await _context.RecordedSales.Where(rs => rs.TransactionStatus != null && rs.TransactionStatus.ToLower() == "completed").ToListAsync();

            return completedSales.Sum(rs => rs.TotalAmount);
        }

        public async Task<decimal> GetRevenueByDateRangeAsync(DateTime from, DateTime to)
        {
            var completedSales = await _context.RecordedSales.Where(rs => rs.SaleDate.Date >= from.Date && rs.SaleDate.Date <= to.Date && rs.TransactionStatus != null && rs.TransactionStatus.ToLower() == "completed").ToListAsync();
            
            return completedSales.Sum(rs => rs.TotalAmount);
        }

        public async Task<int> GetSalesCountByStatusAsync(string status)
        {
            return await _context.RecordedSales.CountAsync(rs => rs.TransactionStatus != null && rs.TransactionStatus.ToLower() == status.ToLower());
        }
    }
}
