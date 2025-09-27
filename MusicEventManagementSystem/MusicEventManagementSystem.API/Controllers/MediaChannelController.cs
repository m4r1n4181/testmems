using Microsoft.AspNetCore.Mvc;
using MusicEventManagementSystem.API.DTOs.MediaCampaign;
using MusicEventManagementSystem.API.Services.IService;

namespace MusicEventManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MediaChannelController : ControllerBase
    {
        private readonly IMediaChannelService _mediaChannelService;

        public MediaChannelController(IMediaChannelService mediaChannelService)
        {
            _mediaChannelService = mediaChannelService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MediaChannelResponseDto>>> GetAllMediaChannels()
        {
            var channels = await _mediaChannelService.GetAllMediaChannelsAsync();
            return Ok(channels);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MediaChannelResponseDto>> GetMediaChannelById(int id)
        {
            var channel = await _mediaChannelService.GetMediaChannelByIdAsync(id);
            if (channel == null)
                return NotFound($"MediaChannel with ID {id} not found.");
            return Ok(channel);
        }

        [HttpPost]
        public async Task<ActionResult<MediaChannelResponseDto>> CreateMediaChannel([FromBody] MediaChannelCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var createdChannel = await _mediaChannelService.CreateMediaChannelAsync(dto);
            return CreatedAtAction(nameof(GetMediaChannelById), new { id = createdChannel.MediaChannelId }, createdChannel);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<MediaChannelResponseDto>> UpdateMediaChannel(int id, [FromBody] MediaChannelUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedChannel = await _mediaChannelService.UpdateMediaChannelAsync(id, dto);
            if (updatedChannel == null)
                return NotFound($"MediaChannel with ID {id} not found.");
            return Ok(updatedChannel);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMediaChannel(int id)
        {
            var isDeleted = await _mediaChannelService.DeleteMediaChannelAsync(id);
            if (!isDeleted)
                return NotFound($"MediaChannel with ID {id} not found.");
            return NoContent();
        }

        [HttpGet("platformType/{platformType}")]
        public async Task<ActionResult<IEnumerable<MediaChannelResponseDto>>> GetByPlatformType(string platformType)
        {
            var channels = await _mediaChannelService.GetByPlatformTypeAsync(platformType);
            return Ok(channels);
        }

        [HttpGet("apiKey/{apiKey}")]
        public async Task<ActionResult<IEnumerable<MediaChannelResponseDto>>> GetByAPIKey(string apiKey)
        {
            var channels = await _mediaChannelService.GetByAPIKeyAsync(apiKey);
            return Ok(channels);
        }

        [HttpGet("apiURL/{apiURL}")]
        public async Task<ActionResult<IEnumerable<MediaChannelResponseDto>>> GetByAPIURL(string apiURL)
        {
            var channels = await _mediaChannelService.GetByAPIURLAsync(apiURL);
            return Ok(channels);
        }

        [HttpGet("apiVersion/{apiVersion}")]
        public async Task<ActionResult<IEnumerable<MediaChannelResponseDto>>> GetByAPIVersion(string apiVersion)
        {
            var channels = await _mediaChannelService.GetByAPIVersionAsync(apiVersion);
            return Ok(channels);
        }
    }
}