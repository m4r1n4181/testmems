﻿using MusicEventManagementSystem.API.DTOs.MediaCampaign;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.API.Services.IService;
using MusicEventManagementSystem.API.Enums;

namespace MusicEventManagementSystem.API.Services
{
    public class IntegrationStatusService : IIntegrationStatusService
    {
        private readonly IIntegrationStatusRepository _integrationStatusRepository;

        public IntegrationStatusService(IIntegrationStatusRepository integrationStatusRepository)
        {
            _integrationStatusRepository = integrationStatusRepository;
        }

        public async Task<IEnumerable<IntegrationStatusResponseDto>> GetAllIntegrationStatusesAsync()
        {
            var statuses = await _integrationStatusRepository.GetAllAsync();
            return statuses.Select(MapToResponseDto);
        }

        public async Task<IntegrationStatusResponseDto?> GetIntegrationStatusByIdAsync(int id)
        {
            var status = await _integrationStatusRepository.GetByIdAsync(id);
            return status == null ? null : MapToResponseDto(status);
        }

        public async Task<IntegrationStatusResponseDto> CreateIntegrationStatusAsync(IntegrationStatusCreateDto dto)
        {
            var status = MapToEntity(dto);
            await _integrationStatusRepository.AddAsync(status);
            await _integrationStatusRepository.SaveChangesAsync();
            return MapToResponseDto(status);
        }

        public async Task<IntegrationStatusResponseDto?> UpdateIntegrationStatusAsync(int id, IntegrationStatusUpdateDto dto)
        {
            var status = await _integrationStatusRepository.GetByIdAsync(id);
            if (status == null) return null;

            if (dto.AdId.HasValue) status.AdId = dto.AdId.Value;
            if (dto.ChannelId.HasValue) status.ChannelId = dto.ChannelId.Value;
            if (dto.Status.HasValue) status.Status = dto.Status.Value;
            if (dto.PublicationDate.HasValue) status.PublicationDate = dto.PublicationDate.Value;
            if (dto.Error != null) status.Error = dto.Error;
            if (dto.LastSynced.HasValue) status.LastSynced = dto.LastSynced.Value;

            _integrationStatusRepository.Update(status);
            await _integrationStatusRepository.SaveChangesAsync();
            return MapToResponseDto(status);
        }

        public async Task<bool> DeleteIntegrationStatusAsync(int id)
        {
            var status = await _integrationStatusRepository.GetByIdAsync(id);
            if (status == null) return false;
            _integrationStatusRepository.Delete(status);
            await _integrationStatusRepository.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<IntegrationStatusResponseDto>> GetByAdIdAsync(int adId)
        {
            var statuses = await _integrationStatusRepository.GetByAdIdAsync(adId);
            return statuses.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<IntegrationStatusResponseDto>> GetByChannelIdAsync(int channelId)
        {
            var statuses = await _integrationStatusRepository.GetByChannelIdAsync(channelId);
            return statuses.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<IntegrationStatusResponseDto>> GetByStatusAsync(StatusIntegration status)
        {
            var statuses = await _integrationStatusRepository.GetByStatusAsync(status);
            return statuses.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<IntegrationStatusResponseDto>> GetByPublicationDateAsync(DateTime publicationDate)
        {
            var statuses = await _integrationStatusRepository.GetByPublicationDateAsync(publicationDate);
            return statuses.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<IntegrationStatusResponseDto>> GetByErrorAsync(string error)
        {
            var statuses = await _integrationStatusRepository.GetByErrorAsync(error);
            return statuses.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<IntegrationStatusResponseDto>> GetByLastSyncedAsync(DateTime lastSynced)
        {
            var statuses = await _integrationStatusRepository.GetByLastSyncedAsync(lastSynced);
            return statuses.Select(MapToResponseDto);
        }

        private static IntegrationStatusResponseDto MapToResponseDto(IntegrationStatus status) => new()
        {
            IntegrationStatusId = status.IntegrationStatusId,
            AdId = status.AdId,
            ChannelId = status.ChannelId,
            Status = status.Status,
            PublicationDate = status.PublicationDate,
            Error = status.Error,
            LastSynced = status.LastSynced
        };

        private static IntegrationStatus MapToEntity(IntegrationStatusCreateDto dto) => new()
        {
            AdId = dto.AdId,
            ChannelId = dto.ChannelId,
            Status = dto.Status,
            PublicationDate = dto.PublicationDate,
            Error = dto.Error,
            LastSynced = dto.LastSynced
        };
    }
}