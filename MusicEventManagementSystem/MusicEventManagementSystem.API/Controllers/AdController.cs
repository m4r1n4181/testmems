using Microsoft.AspNetCore.Mvc;
using MusicEventManagementSystem.API.DTOs.MediaCampaign;
using MusicEventManagementSystem.API.Services.IService;
using MusicEventManagementSystem.Enums;

namespace MusicEventManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdController : ControllerBase
    {
        private readonly IAdService _adService;

        public AdController(IAdService adService)
        {
            _adService = adService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdResponseDto>>> GetAllAds()
        {
            var ads = await _adService.GetAllAdsAsync();
            return Ok(ads);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AdResponseDto>> GetAdById(int id)
        {
            var ad = await _adService.GetAdByIdAsync(id);
            if (ad == null)
                return NotFound($"Ad with ID {id} not found.");
            return Ok(ad);
        }

        [HttpPost]
        public async Task<ActionResult<AdResponseDto>> CreateAd([FromBody] AdCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var createdAd = await _adService.CreateAdAsync(dto);
            return CreatedAtAction(nameof(GetAdById), new { id = createdAd.AdId }, createdAd);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<AdResponseDto>> UpdateAd(int id, [FromBody] AdUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedAd = await _adService.UpdateAdAsync(id, dto);
            if (updatedAd == null)
                return NotFound($"Ad with ID {id} not found.");
            return Ok(updatedAd);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAd(int id)
        {
            var isDeleted = await _adService.DeleteAdAsync(id);
            if (!isDeleted)
                return NotFound($"Ad with ID {id} not found.");
            return NoContent();
        }

        [HttpGet("deadline/{deadline}")]
        public async Task<ActionResult<IEnumerable<AdResponseDto>>> GetByDeadline(DateTime deadline)
        {
            var ads = await _adService.GetByDeadlineAsync(deadline);
            return Ok(ads);
        }

        [HttpGet("title/{title}")]
        public async Task<ActionResult<IEnumerable<AdResponseDto>>> GetByTitle(string title)
        {
            var ads = await _adService.GetByTitleAsync(title);
            return Ok(ads);
        }

        [HttpGet("creationDate/{creationDate}")]
        public async Task<ActionResult<IEnumerable<AdResponseDto>>> GetByCreationDate(DateTime creationDate)
        {
            var ads = await _adService.GetByCreationDateAsync(creationDate);
            return Ok(ads);
        }

        [HttpGet("currentPhase/{currentPhase}")]
        public async Task<ActionResult<IEnumerable<AdResponseDto>>> GetByCurrentPhase(AdStatus currentPhase)
        {
            var ads = await _adService.GetByCurrentPhaseAsync(currentPhase);
            return Ok(ads);
        }

        [HttpGet("publicationDate/{publicationDate}")]
        public async Task<ActionResult<IEnumerable<AdResponseDto>>> GetByPublicationDate(DateTime publicationDate)
        {
            var ads = await _adService.GetByPublicationDateAsync(publicationDate);
            return Ok(ads);
        }

        [HttpGet("mediaWorkflowId/{mediaWorkflowId}")]
        public async Task<ActionResult<IEnumerable<AdResponseDto>>> GetByMediaWorkflowId(int mediaWorkflowId)
        {
            var ads = await _adService.GetByMediaWorkflowIdAsync(mediaWorkflowId);
            return Ok(ads);
        }

        [HttpGet("campaignId/{campaignId}")]
        public async Task<ActionResult<IEnumerable<AdResponseDto>>> GetByCampaignId(int campaignId)
        {
            var ads = await _adService.GetByCampaignIdAsync(campaignId);
            return Ok(ads);
        }

        [HttpGet("adTypeId/{adTypeId}")]
        public async Task<ActionResult<IEnumerable<AdResponseDto>>> GetByAdTypeId(int adTypeId)
        {
            var ads = await _adService.GetByAdTypeIdAsync(adTypeId);
            return Ok(ads);
        }
    }
}