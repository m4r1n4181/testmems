using MusicEventManagementSystem.API.Enums.TicketSales;
using TransactionStatus = MusicEventManagementSystem.API.Enums.TicketSales.TransactionStatus;
using MusicEventManagementSystem.API.Models;
using System.Transactions;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface IRecordedSaleRepository : IRepository<RecordedSale>
    {
        Task<IEnumerable<RecordedSale>> GetSalesByUserAsync(string userId);
        Task<IEnumerable<RecordedSale>> GetSalesByDateRangeAsync(DateTime from, DateTime to);
        Task<IEnumerable<RecordedSale>> GetSalesByStatusAsync(TransactionStatus status);
        Task<IEnumerable<RecordedSale>> GetSalesByPaymentMethodAsync(PaymentMethod paymentMethod);
        Task<decimal> GetTotalRevenueAsync();
        Task<decimal> GetRevenueByDateRangeAsync(DateTime from, DateTime to);
        Task<int> GetSalesCountByStatusAsync(TransactionStatus status);
    }
}
