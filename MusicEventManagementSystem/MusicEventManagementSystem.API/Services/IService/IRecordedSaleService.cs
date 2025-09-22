using MusicEventManagementSystem.API.Models;

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
        Task<IEnumerable<RecordedSale>> GetSalesByStatusAsync(string status);
        Task<IEnumerable<RecordedSale>> GetSalesByPaymentMethodAsync(string paymentMethod);
        Task<decimal> GetTotalRevenueAsync();
        Task<decimal> GetRevenueByDateRangeAsync(DateTime from, DateTime to);
        Task<int> GetSalesCountByStatusAsync(string status);
    }
}
