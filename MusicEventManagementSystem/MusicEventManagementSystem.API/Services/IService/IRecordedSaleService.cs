using MusicEventManagementSystem.API.DTOs.TicketSales;
using MusicEventManagementSystem.API.Enums.TicketSales;
using MusicEventManagementSystem.API.Models;
using System.Transactions;
using TransactionStatus = MusicEventManagementSystem.API.Enums.TicketSales.TransactionStatus;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IRecordedSaleService
    {
        Task<IEnumerable<RecordedSaleResponseDto>> GetAllRecordedSalesAsync();
        Task<RecordedSaleResponseDto?> GetRecordedSaleByIdAsync(int id);
        Task<RecordedSaleResponseDto> CreateRecordedSaleAsync(RecordedSaleCreateDto createRecordedSaleDto);
        Task<RecordedSaleResponseDto?> UpdateRecordedSaleAsync(int id, RecordedSaleUpdateDto updateRecordedSaleDto);
        Task<bool> DeleteRecordedSaleAsync(int id);

        Task<IEnumerable<RecordedSaleResponseDto>> GetSalesByUserAsync(string userId);
        Task<IEnumerable<RecordedSaleResponseDto>> GetSalesByDateRangeAsync(DateTime from, DateTime to);
        Task<IEnumerable<RecordedSaleResponseDto>> GetSalesByStatusAsync(TransactionStatus status);
        Task<IEnumerable<RecordedSaleResponseDto>> GetSalesByPaymentMethodAsync(PaymentMethod paymentMethod);
        Task<decimal> GetTotalRevenueAsync();
        Task<decimal> GetRevenueByDateRangeAsync(DateTime from, DateTime to);
        Task<int> GetSalesCountByStatusAsync(TransactionStatus status);
    }
}
