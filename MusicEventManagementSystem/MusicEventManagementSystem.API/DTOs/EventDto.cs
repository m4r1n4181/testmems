﻿using MusicEventManagementSystem.API.DTOs.TicketSales;
using MusicEventManagementSystem.Enums;
using System.ComponentModel.DataAnnotations;

namespace MusicEventManagementSystem.API.DTOs
{
    public class EventResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime Interval { get; set; }
        public EventStatus Status { get; set; }
        public Guid CreatedById { get; set; }
        public int LocationId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public List<int>? TicketTypeIds { get; set; }
        public List<int>? PricingRuleIds { get; set; }
    }

    public class EventCreateDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(500)]
        public string Description { get; set; }

        [Required]
        public DateTime Interval { get; set; }

        [Required]
        public EventStatus Status { get; set; }

        [Required]
        public Guid CreatedById { get; set; }

        [Required]
        public int LocationId { get; set; }
    }

    public class EventUpdateDto
    {
        [StringLength(100)]
        public string? Name { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        public DateTime? Interval { get; set; }
        public EventStatus? Status { get; set; }
        public int? LocationId { get; set; }
    }
}
