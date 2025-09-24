using MusicEventManagementSystem.API.Enums.TicketSales;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.API.Services.IService;

namespace MusicEventManagementSystem.API.Services
{
    public class RecordedSaleService : IRecordedSaleService
    {
        private readonly IRecodedSaleRepository _recordedSaleRepository;

        public RecordedSaleService(IRecodedSaleRepository recordedSaleRepository)
        {
            _recordedSaleRepository = recordedSaleRepository;
        }

        public async Task<IEnumerable<RecordedSale>> GetAllRecordedSalesAsync()
        {
            return await _recordedSaleRepository.GetAllAsync();
        }

        public async Task<RecordedSale?> GetRecordedSaleByIdAsync(int id)
        {
            return await _recordedSaleRepository.GetByIdAsync(id);
        }

        public async Task<RecordedSale> CreateRecordedSaleAsync(RecordedSale recordedSale)
        {
            recordedSale.SaleDate = DateTime.UtcNow;

            await _recordedSaleRepository.AddAsync(recordedSale);
            await _recordedSaleRepository.SaveChangesAsync();
            return recordedSale;
        }

        public async Task<RecordedSale?> UpdateRecordedSaleAsync(int id, RecordedSale recordedSale)
        {
            var existingRecordedSale = await _recordedSaleRepository.GetByIdAsync(id);
            
            if (existingRecordedSale == null)
            {
                return null;
            }

            existingRecordedSale.TotalAmount = recordedSale.TotalAmount;
            existingRecordedSale.PaymentMethod = recordedSale.PaymentMethod;
            existingRecordedSale.SaleDate = recordedSale.SaleDate;
            existingRecordedSale.TransactionStatus = recordedSale.TransactionStatus;

            _recordedSaleRepository.Update(existingRecordedSale);
            await _recordedSaleRepository.SaveChangesAsync();
            return existingRecordedSale;
        }

        public async Task<bool> DeleteRecordedSaleAsync(int id)
        {
            var recordedSale = await _recordedSaleRepository.GetByIdAsync(id);
            
            if (recordedSale == null)
            {
                return false;
            }

            _recordedSaleRepository.Delete(recordedSale);
            await _recordedSaleRepository.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<RecordedSale>> GetSalesByUserAsync(string userId)
        {
            return await _recordedSaleRepository.GetSalesByUserAsync(userId);
        }

        public async Task<IEnumerable<RecordedSale>> GetSalesByDateRangeAsync(DateTime fromDate, DateTime toDate)
        {
            return await _recordedSaleRepository.GetSalesByDateRangeAsync(fromDate, toDate);
        }

        public async Task<IEnumerable<RecordedSale>> GetSalesByStatusAsync(TransactionStatus status)
        {
            return await _recordedSaleRepository.GetSalesByStatusAsync(status);
        }

        public async Task<IEnumerable<RecordedSale>> GetSalesByPaymentMethodAsync(PaymentMethod paymentMethod)
        {
            return await _recordedSaleRepository.GetSalesByPaymentMethodAsync(paymentMethod);
        }

        public async Task<decimal> GetTotalRevenueAsync()
        {
            return await _recordedSaleRepository.GetTotalRevenueAsync();
        }

        public async Task<decimal> GetRevenueByDateRangeAsync(DateTime from, DateTime to)
        {
            return await _recordedSaleRepository.GetRevenueByDateRangeAsync(from, to);
        }

        public async Task<int> GetSalesCountByStatusAsync(TransactionStatus status)
        {
            return await _recordedSaleRepository.GetSalesCountByStatusAsync(status);
        }
    }
}
