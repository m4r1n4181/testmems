using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.Models.Auth;
using System.Threading.Channels;

namespace MusicEventManagementSystem.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // DbSets for Ticket-Sales Subsystem
        public DbSet<Venue> Venues { get; set; }
        public DbSet<Segment> Segments { get; set; }
        public DbSet<Zone> Zones { get; set; }
        public DbSet<SpecialOffer> SpecialOffers { get; set; }
        public DbSet<TicketType> TicketTypes { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<RecordedSale> RecordedSales { get; set; }
        public DbSet<PricingRule> PricingRules { get; set; }

        // DbSets for Media-Campaign Subsystem
        public DbSet<Campaign> Campaigns { get; set; }
        public DbSet<Ad> Ads { get; set; }
        public DbSet<MediaTask> MediaTasks { get; set; }
        public DbSet<MediaWorkflow> MediaWorkflows { get; set; }
        public DbSet<AdType> AdTypes { get; set; }
        public DbSet<MediaVersion> MediaVersions { get; set; }
        public DbSet<MediaChannel> Channels { get; set; }
        //public DbSet<IntegrationStatus> IntegrationStatuses { get; set; }
        public DbSet<Approval> Approvals { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

        }
    }
}
