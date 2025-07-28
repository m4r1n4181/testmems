using MusicEventManagementSystem.DTOs.Auth;

namespace MusicEventManagementSystem.Services.Auth
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<UserDto?> GetUserByIdAsync(string userId);
    }
}
