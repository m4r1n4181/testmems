using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.API.Services.IService;

namespace MusicEventManagementSystem.API.Services
{
    public class NegotiationService : INegotiationService
    {
        private readonly INegotiationRepository _negotiationRepository;

        public NegotiationService(INegotiationRepository negotiationRepository)
        {
            _negotiationRepository = negotiationRepository;
        }

        public async Task<IEnumerable<Negotiation>> GetAllNegotiationsAsync()
        {
            return await _negotiationRepository.GetAllAsync();
        }

        public async Task<Negotiation?> GetNegotiationByIdAsync(int id)
        {
            return await _negotiationRepository.GetByIdAsync(id);
        }

        public async Task<Negotiation> CreateNegotiationAsync(Negotiation negotiation)
        {
            await _negotiationRepository.AddAsync(negotiation);
            await _negotiationRepository.SaveChangesAsync();
            return negotiation;
        }

        public async Task<Negotiation?> UpdateNegotiationAsync(int id, Negotiation negotiation)
        {
            var existingNegotiation = await _negotiationRepository.GetByIdAsync(id);
            if (existingNegotiation == null)
            {
                return null;
            }

            existingNegotiation.ProposedFee = negotiation.ProposedFee;
            existingNegotiation.Status = negotiation.Status;
            existingNegotiation.StartDate = negotiation.StartDate;
            existingNegotiation.EndDate = negotiation.EndDate;

            _negotiationRepository.Update(existingNegotiation);
            await _negotiationRepository.SaveChangesAsync();
            return existingNegotiation;
        }

        public async Task<bool> DeleteNegotiationAsync(int id)
        {
            var negotiation = await _negotiationRepository.GetByIdAsync(id);
            if (negotiation == null)
            {
                return false;
            }

            _negotiationRepository.Delete(negotiation);
            await _negotiationRepository.SaveChangesAsync();
            return true;
        }
    }
}
