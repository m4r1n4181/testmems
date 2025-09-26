﻿using MusicEventManagementSystem.API.DTOs.TicketSales;
using MusicEventManagementSystem.API.Enums.TicketSales;
using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface ISpecialOfferService
    {
        Task<IEnumerable<SpecialOfferResponseDto>> GetAllSpecialOffersAsync();
        Task<SpecialOfferResponseDto?> GetSpecialOfferByIdAsync(int id);
        Task<SpecialOfferResponseDto> CreateSpecialOfferAsync(SpecialOfferCreateDto dto);
        Task<SpecialOfferResponseDto?> UpdateSpecialOfferAsync(int id, SpecialOfferUpdateDto dto);
        Task<bool> DeleteSpecialOfferAsync(int id);

        Task<IEnumerable<SpecialOfferResponseDto>> GetActiveOffersAsync(DateTime currentDate);
        Task<IEnumerable<SpecialOfferResponseDto>> GetByOfferTypeAsync(OfferType offerType);
        Task<IEnumerable<SpecialOfferResponseDto>> GetByDateRangeAsync(DateTime start, DateTime end);
        Task<IEnumerable<SpecialOfferResponseDto>> GetByTicketTypeAsync(int ticketTypeId);
        Task<bool> IsOfferValidAsync(int specialOfferId, DateTime checkDate);
        Task<bool> HasActiveOfferForTicketTypeAsync(int ticketTypeId, DateTime currentDate);
    }
}
