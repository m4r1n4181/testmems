using Microsoft.AspNetCore.Mvc;
using MusicEventManagementSystem.API.DTOs.MediaCampaign;
using MusicEventManagementSystem.API.Services.IService;

namespace MusicEventManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdTypeController : ControllerBase
    {
        private readonly IAdTypeService _adTypeService;

        public AdTypeController(IAdTypeService adTypeService)
        {
            _adTypeService = adTypeService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdTypeResponseDto>>> GetAllAdTypes()
        {
            var adTypes = await _adTypeService.GetAllAdTypesAsync();
            return Ok(adTypes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AdTypeResponseDto>> GetAdTypeById(int id)
        {
            var adType = await _adTypeService.GetAdTypeByIdAsync(id);
            if (adType == null)
                return NotFound($"AdType with ID {id} not found.");
            return Ok(adType);
        }

        [HttpPost]
        public async Task<ActionResult<AdTypeResponseDto>> CreateAdType([FromBody] AdTypeCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var createdAdType = await _adTypeService.CreateAdTypeAsync(dto);
            return CreatedAtAction(nameof(GetAdTypeById), new { id = createdAdType.AdTypeId }, createdAdType);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<AdTypeResponseDto>> UpdateAdType(int id, [FromBody] AdTypeUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedAdType = await _adTypeService.UpdateAdTypeAsync(id, dto);
            if (updatedAdType == null)
                return NotFound($"AdType with ID {id} not found.");
            return Ok(updatedAdType);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAdType(int id)
        {
            var isDeleted = await _adTypeService.DeleteAdTypeAsync(id);
            if (!isDeleted)
                return NotFound($"AdType with ID {id} not found.");
            return NoContent();
        }

        [HttpGet("typeName/{typeName}")]
        public async Task<ActionResult<IEnumerable<AdTypeResponseDto>>> GetByTypeName(string typeName)
        {
            var adTypes = await _adTypeService.GetByTypeNameAsync(typeName);
            return Ok(adTypes);
        }

        [HttpGet("typeDescription/{typeDescription}")]
        public async Task<ActionResult<IEnumerable<AdTypeResponseDto>>> GetByTypeDescription(string typeDescription)
        {
            var adTypes = await _adTypeService.GetByTypeDescriptionAsync(typeDescription);
            return Ok(adTypes);
        }

        [HttpGet("dimensions/{dimensions}")]
        public async Task<ActionResult<IEnumerable<AdTypeResponseDto>>> GetByDimensions(string dimensions)
        {
            var adTypes = await _adTypeService.GetByDimensionsAsync(dimensions);
            return Ok(adTypes);
        }

        [HttpGet("duration/{duration}")]
        public async Task<ActionResult<IEnumerable<AdTypeResponseDto>>> GetByDuration(int duration)
        {
            var adTypes = await _adTypeService.GetByDurationAsync(duration);
            return Ok(adTypes);
        }

        [HttpGet("fileFormat/{fileFormat}")]
        public async Task<ActionResult<IEnumerable<AdTypeResponseDto>>> GetByFileFormat(string fileFormat)
        {
            var adTypes = await _adTypeService.GetByFileFormatAsync(fileFormat);
            return Ok(adTypes);
        }
    }
}