using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface IRecodedSaleRepository : IRepository<RecordedSale>
    {
        Task<IEnumerable<RecordedSale>> GetSalesByUserAsync(string userId);
        Task<IEnumerable<RecordedSale>> GetSalesByDateRangeAsync(DateTime from, DateTime to);
        Task<IEnumerable<RecordedSale>> GetSalesByStatusAsync(string status);
        Task<IEnumerable<RecordedSale>> GetSalesByPaymentMethodAsync(string paymentMethod);
        Task<decimal> GetTotalRevenueAsync();
        Task<decimal> GetRevenueByDateRangeAsync(DateTime from, DateTime to);
        Task<int> GetSalesCountByStatusAsync(string status);
    }
}
