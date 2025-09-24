using MusicEventManagementSystem.API.Models;
using TransactionStatus = MusicEventManagementSystem.API.Enums.TicketSales.TransactionStatus;
using System.Transactions;
using MusicEventManagementSystem.API.Enums.TicketSales;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IRecordedSaleService
    {
        Task<IEnumerable<RecordedSale>> GetAllRecordedSalesAsync();
        Task<RecordedSale?> GetRecordedSaleByIdAsync(int id);
        Task<RecordedSale> CreateRecordedSaleAsync(RecordedSale recordedSale);
        Task<RecordedSale?> UpdateRecordedSaleAsync(int id, RecordedSale recordedSale);
        Task<bool> DeleteRecordedSaleAsync(int id);

        Task<IEnumerable<RecordedSale>> GetSalesByUserAsync(string userId);
        Task<IEnumerable<RecordedSale>> GetSalesByDateRangeAsync(DateTime from, DateTime to);
        Task<IEnumerable<RecordedSale>> GetSalesByStatusAsync(TransactionStatus status);
        Task<IEnumerable<RecordedSale>> GetSalesByPaymentMethodAsync(PaymentMethod paymentMethod);
        Task<decimal> GetTotalRevenueAsync();
        Task<decimal> GetRevenueByDateRangeAsync(DateTime from, DateTime to);
        Task<int> GetSalesCountByStatusAsync(TransactionStatus status);
    }
}
