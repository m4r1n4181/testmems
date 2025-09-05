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
    }
}
