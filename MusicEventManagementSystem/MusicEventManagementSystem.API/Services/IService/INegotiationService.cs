using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface INegotiationService
    {
        Task<IEnumerable<Negotiation>> GetAllNegotiationsAsync();
        Task<Negotiation?> GetNegotiationByIdAsync(int id);
        Task<Negotiation> CreateNegotiationAsync(Negotiation negotiation);
        Task<Negotiation?> UpdateNegotiationAsync(int id, Negotiation negotiation);
        Task<bool> DeleteNegotiationAsync(int id);
    }
}
