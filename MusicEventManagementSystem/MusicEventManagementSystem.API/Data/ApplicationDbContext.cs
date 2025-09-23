using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.Models.Auth;

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

        // DbSets for Performer Subsystem
        public DbSet<Performer> Performers { get; set; }
        public DbSet<Requirement> Requirements { get; set; }
        public DbSet<Phase> Phases { get; set; }
        public DbSet<Negotiation> Negotiations { get; set; }
        public DbSet<Contract> Contracts { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<Communication> Communications { get; set; }
        public DbSet<NegotiationUser> NegotiationUsers { get; set; }

        // DbSets za Event Management podsistem
        public DbSet<Event> Events { get; set; }
        public DbSet<Resource> Resources { get; set; }
        public DbSet<Equipment> Equipment { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Performance> Performances { get; set; }
        public DbSet<PerformanceResource> PerformanceResources { get; set; }
        public DbSet<WorkTask> WorkTasks { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Staff> Staff { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Infrastructure> Infrastructures { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure Negotiation relationships
            
            // One-to-One: Negotiation has one Event
            builder.Entity<Negotiation>()
                .HasOne(n => n.Event)
                .WithOne(e => e.Negotiation)
                .HasForeignKey<Negotiation>(n => n.EventId)
                .OnDelete(DeleteBehavior.Restrict);

            // One-to-One: Negotiation has one Performer
            builder.Entity<Negotiation>()
                .HasOne(n => n.Performer)
                .WithOne(p => p.Negotiation)
                .HasForeignKey<Negotiation>(n => n.PerformerId)
                .OnDelete(DeleteBehavior.Restrict);

            // One-to-One: Negotiation has one Communication (Communication is dependent)
            builder.Entity<Communication>()
                .HasOne(c => c.Negotiation)
                .WithOne(n => n.Communication)
                .HasForeignKey<Communication>(c => c.NegotiationId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: Negotiation has many Phases
            builder.Entity<Phase>()
                .HasOne(p => p.Negotiation)
                .WithMany(n => n.Phases)
                .HasForeignKey(p => p.NegotiationId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: Negotiation has many Documents
            builder.Entity<Document>()
                .HasOne(d => d.Negotiation)
                .WithMany(n => n.Documents)
                .HasForeignKey(d => d.NegotiationId)
                .OnDelete(DeleteBehavior.Cascade);

            // Many-to-Many: Negotiation and Users through NegotiationUser
            builder.Entity<NegotiationUser>()
                .HasKey(nu => new { nu.NegotiationId, nu.UserId });

            builder.Entity<NegotiationUser>()
                .HasOne(nu => nu.Negotiation)
                .WithMany(n => n.Users)
                .HasForeignKey(nu => nu.NegotiationId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<NegotiationUser>()
                .HasOne(nu => nu.User)
                .WithMany()
                .HasForeignKey(nu => nu.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: Performer has many Contracts
            builder.Entity<Contract>()
                .HasOne(c => c.Performer)
                .WithMany(p => p.Contracts)
                .HasForeignKey(c => c.PerformerId)
                .OnDelete(DeleteBehavior.Restrict);

            // One-to-One (optional): Contract has one Phase (nullable)
            builder.Entity<Phase>()
                .HasOne(p => p.Contract)
                .WithOne(c => c.Phase)
                .HasForeignKey<Phase>(p => p.ContractId)
                .OnDelete(DeleteBehavior.SetNull);

            // One-to-Many: Phase has many Requirements
            builder.Entity<Requirement>()
                .HasOne(r => r.Phase)
                .WithMany(p => p.Requirements)
                .HasForeignKey(r => r.PhaseId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
