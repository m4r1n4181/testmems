using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.Enums;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface IAdRepository : IRepository<Ad>
    {
        Task<IEnumerable<Ad>> GetByDeadlineAsync(DateTime deadline);
        Task<IEnumerable<Ad>> GetByTitleAsync(string title);
        Task<IEnumerable<Ad>> GetByCreationDateAsync(DateTime creationDate);
        Task<IEnumerable<Ad>> GetByCurrentPhaseAsync(AdStatus currentPhase);
        Task<IEnumerable<Ad>> GetByPublicationDateAsync(DateTime publicationDate);
        Task<IEnumerable<Ad>> GetByMediaWorkflowIdAsync(int mediaWorkflowId);
        Task<IEnumerable<Ad>> GetByCampaignIdAsync(int campaignId);
        Task<IEnumerable<Ad>> GetByAdTypeIdAsync(int adTypeId);
    }
}