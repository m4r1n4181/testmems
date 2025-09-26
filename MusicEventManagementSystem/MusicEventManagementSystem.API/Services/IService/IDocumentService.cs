using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IDocumentService
    {
        Task<IEnumerable<Document>> GetAllDocumentsAsync();
        Task<Document?> GetDocumentByIdAsync(int id);
        Task<Document> CreateDocumentAsync(Document document);
        Task<Document?> UpdateDocumentAsync(int id, Document document);
        Task<bool> DeleteDocumentAsync(int id);
    }
}
