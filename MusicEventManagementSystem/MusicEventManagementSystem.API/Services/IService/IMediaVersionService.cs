using MusicEventManagementSystem.API.DTOs.MediaCampaign;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IMediaVersionService
    {
        Task<IEnumerable<MediaVersionResponseDto>> GetAllMediaVersionsAsync();
        Task<MediaVersionResponseDto?> GetMediaVersionByIdAsync(int id);
        Task<MediaVersionResponseDto> CreateMediaVersionAsync(MediaVersionCreateDto createDto);
        Task<MediaVersionResponseDto?> UpdateMediaVersionAsync(int id, MediaVersionUpdateDto updateDto);
        Task<bool> DeleteMediaVersionAsync(int id);

        Task<IEnumerable<MediaVersionResponseDto>> GetByVersionFileNameAsync(string versionFileName);
        Task<IEnumerable<MediaVersionResponseDto>> GetByFileTypeAsync(string fileType);
        Task<IEnumerable<MediaVersionResponseDto>> GetByFileURLAsync(string fileURL);
        Task<IEnumerable<MediaVersionResponseDto>> GetByIsFinalVersionAsync(bool isFinalVersion);
        Task<IEnumerable<MediaVersionResponseDto>> GetByAdIdAsync(int adId);
        Task<IEnumerable<MediaVersionResponseDto>> GetPreviousTaskVersionsAsync(int taskId);
    }
}