using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Enums.TicketSales;
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

        public override async Task<IEnumerable<RecordedSale>> GetAllAsync()
        {
            return await _context.RecordedSales.Include(rs => rs.ApplicationUser).Include(rs => rs.Tickets).Include(rs => rs.SpecialOffers).OrderByDescending(rs => rs.SaleDate).ToListAsync();
        }

        public override async Task<RecordedSale?> GetByIdAsync(int id)
        {
            return await _context.RecordedSales.Include(rs => rs.ApplicationUser).Include(rs => rs.Tickets).Include(rs => rs.SpecialOffers).FirstOrDefaultAsync(rs => rs.RecordedSaleId == id);
        }

        public async Task<IEnumerable<RecordedSale>> GetSalesByUserAsync(string userId)
        {
            return await _context.RecordedSales.Include(rs => rs.ApplicationUser).Include(rs => rs.Tickets).Include(rs => rs.SpecialOffers).Where(rs => rs.ApplicationUserId == userId).OrderByDescending(rs => rs.SaleDate).ToListAsync();
        }

        public async Task<IEnumerable<RecordedSale>> GetSalesByDateRangeAsync(DateTime from, DateTime to)
        {
            return await _context.RecordedSales.Include(rs => rs.ApplicationUser).Include(rs => rs.Tickets).Include(rs => rs.SpecialOffers).Where(rs => rs.SaleDate.Date >= from.Date && rs.SaleDate.Date <= to.Date).OrderByDescending(rs => rs.SaleDate).ToListAsync();
        }

        public async Task<IEnumerable<RecordedSale>> GetSalesByStatusAsync(TransactionStatus status)
        {
            return await _context.RecordedSales.Include(rs => rs.ApplicationUser).Include(rs => rs.Tickets).Include(rs => rs.SpecialOffers).Where(rs => rs.TransactionStatus == status).OrderByDescending(rs => rs.SaleDate).ToListAsync();
        }

        public async Task<IEnumerable<RecordedSale>> GetSalesByPaymentMethodAsync(PaymentMethod paymentMethod)
        {
            return await _context.RecordedSales.Include(rs => rs.ApplicationUser).Include(rs => rs.Tickets).Include(rs => rs.SpecialOffers).Where(rs => rs.PaymentMethod == paymentMethod).OrderByDescending(rs => rs.SaleDate).ToListAsync();
        }

        public async Task<decimal> GetTotalRevenueAsync()
        {
            var completedSales = await _context.RecordedSales.Where(rs => rs.TransactionStatus == TransactionStatus.Completed).ToListAsync();
            return completedSales.Sum(rs => rs.TotalAmount);
        }

        public async Task<decimal> GetRevenueByDateRangeAsync(DateTime from, DateTime to)
        {
            var completedSales = await _context.RecordedSales.Where(rs => rs.SaleDate.Date >= from.Date && rs.SaleDate.Date <= to.Date && rs.TransactionStatus == TransactionStatus.Completed).ToListAsync();
            return completedSales.Sum(rs => rs.TotalAmount);
        }

        public async Task<int> GetSalesCountByStatusAsync(TransactionStatus status)
        {
            return await _context.RecordedSales.CountAsync(rs => rs.TransactionStatus == status);
        }
    }
}
