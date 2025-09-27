using MusicEventManagementSystem.API.DTOs.MediaCampaign;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IAdTypeService
    {
        Task<IEnumerable<AdTypeResponseDto>> GetAllAdTypesAsync();
        Task<AdTypeResponseDto?> GetAdTypeByIdAsync(int id);
        Task<AdTypeResponseDto> CreateAdTypeAsync(AdTypeCreateDto createDto);
        Task<AdTypeResponseDto?> UpdateAdTypeAsync(int id, AdTypeUpdateDto updateDto);
        Task<bool> DeleteAdTypeAsync(int id);

        Task<IEnumerable<AdTypeResponseDto>> GetByTypeNameAsync(string typeName);
        Task<IEnumerable<AdTypeResponseDto>> GetByTypeDescriptionAsync(string typeDescription);
        Task<IEnumerable<AdTypeResponseDto>> GetByDimensionsAsync(string dimensions);
        Task<IEnumerable<AdTypeResponseDto>> GetByDurationAsync(int duration);
        Task<IEnumerable<AdTypeResponseDto>> GetByFileFormatAsync(string fileFormat);
    }
}