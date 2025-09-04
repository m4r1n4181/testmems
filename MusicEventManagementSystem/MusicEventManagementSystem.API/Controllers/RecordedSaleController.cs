using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Services;
using MusicEventManagementSystem.API.Services.IService;
using System;

namespace MusicEventManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecordedSaleController : ControllerBase
    {
        private readonly IRecordedSaleService _recordedSaleService;

        public RecordedSaleController(IRecordedSaleService recordedSaleService)
        {
            _recordedSaleService = recordedSaleService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecordedSale>>> GetAllRecordedSales()
        {
            try
            {
                var recordedSales = await _recordedSaleService.GetAllRecordedSalesAsync();
                return Ok(recordedSales);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RecordedSale>> GetRecordedSaleById(int id)
        {
            try
            {
                var existingRecordedSale = await _recordedSaleService.GetRecordedSaleByIdAsync(id);

                if (existingRecordedSale == null)
                {
                    return NotFound($"Recorded Sale with ID {id} not found.");
                }

                return Ok(existingRecordedSale);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<RecordedSale>> CreateRecordedSale([FromBody] RecordedSale recordedSale)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var createdRecordedSale = await _recordedSaleService.CreateRecordedSaleAsync(recordedSale);

                return CreatedAtAction(nameof(GetRecordedSaleById), new { id = createdRecordedSale.RecordedSaleId }, createdRecordedSale);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<RecordedSale>> UpdateRecordedSale(int id, [FromBody] RecordedSale recordedSale)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var updatedRecordedSale = await _recordedSaleService.UpdateRecordedSaleAsync(id, recordedSale);

                if (updatedRecordedSale == null)
                {
                    return NotFound($"Recorded Sale with ID {id} not found.");
                }

                return Ok(updatedRecordedSale);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteRecordedSale(int id)
        {
            try
            {
                var isDeleted = await _recordedSaleService.DeleteRecordedSaleAsync(id);

                if (isDeleted == false)
                {
                    return NotFound($"Recorded Sale with ID {id} not found.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
