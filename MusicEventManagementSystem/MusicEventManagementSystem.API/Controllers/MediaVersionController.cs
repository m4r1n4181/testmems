using Microsoft.AspNetCore.Mvc;
using MusicEventManagementSystem.API.DTOs.MediaCampaign;
using MusicEventManagementSystem.API.Services.IService;

namespace MusicEventManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MediaVersionController : ControllerBase
    {
        private readonly IMediaVersionService _mediaVersionService;

        public MediaVersionController(IMediaVersionService mediaVersionService)
        {
            _mediaVersionService = mediaVersionService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MediaVersionResponseDto>>> GetAllMediaVersions()
        {
            var versions = await _mediaVersionService.GetAllMediaVersionsAsync();
            return Ok(versions);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MediaVersionResponseDto>> GetMediaVersionById(int id)
        {
            var version = await _mediaVersionService.GetMediaVersionByIdAsync(id);
            if (version == null)
                return NotFound($"MediaVersion with ID {id} not found.");
            return Ok(version);
        }

        [HttpPost]
        public async Task<ActionResult<MediaVersionResponseDto>> CreateMediaVersion([FromBody] MediaVersionCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var createdVersion = await _mediaVersionService.CreateMediaVersionAsync(dto);
            return CreatedAtAction(nameof(GetMediaVersionById), new { id = createdVersion.MediaVersionId }, createdVersion);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<MediaVersionResponseDto>> UpdateMediaVersion(int id, [FromBody] MediaVersionUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedVersion = await _mediaVersionService.UpdateMediaVersionAsync(id, dto);
            if (updatedVersion == null)
                return NotFound($"MediaVersion with ID {id} not found.");
            return Ok(updatedVersion);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMediaVersion(int id)
        {
            var isDeleted = await _mediaVersionService.DeleteMediaVersionAsync(id);
            if (!isDeleted)
                return NotFound($"MediaVersion with ID {id} not found.");
            return NoContent();
        }

        [HttpGet("versionFileName/{versionFileName}")]
        public async Task<ActionResult<IEnumerable<MediaVersionResponseDto>>> GetByVersionFileName(string versionFileName)
        {
            var versions = await _mediaVersionService.GetByVersionFileNameAsync(versionFileName);
            return Ok(versions);
        }

        [HttpGet("fileType/{fileType}")]
        public async Task<ActionResult<IEnumerable<MediaVersionResponseDto>>> GetByFileType(string fileType)
        {
            var versions = await _mediaVersionService.GetByFileTypeAsync(fileType);
            return Ok(versions);
        }

        [HttpGet("fileURL/{fileURL}")]
        public async Task<ActionResult<IEnumerable<MediaVersionResponseDto>>> GetByFileURL(string fileURL)
        {
            var versions = await _mediaVersionService.GetByFileURLAsync(fileURL);
            return Ok(versions);
        }

        [HttpGet("isFinalVersion/{isFinalVersion}")]
        public async Task<ActionResult<IEnumerable<MediaVersionResponseDto>>> GetByIsFinalVersion(bool isFinalVersion)
        {
            var versions = await _mediaVersionService.GetByIsFinalVersionAsync(isFinalVersion);
            return Ok(versions);
        }

        [HttpGet("adId/{adId}")]
        public async Task<ActionResult<IEnumerable<MediaVersionResponseDto>>> GetByAdId(int adId)
        {
            var versions = await _mediaVersionService.GetByAdIdAsync(adId);
            return Ok(versions);
        }
    }
}