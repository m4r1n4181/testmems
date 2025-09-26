using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.Models.Auth;
using System.Reflection.Emit;

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
            // Ticket-Sales Subsystem configurations

            // One-To-Many relationships for Ticket-Sales Subsystem

            builder.Entity<Ticket>()
                .HasOne(t => t.RecordedSale)
                .WithMany(rs => rs.Tickets)
                .HasForeignKey(t => t.RecordedSaleId)
                .IsRequired(false);

            // Many-To-Many relationships for Ticket-Sales Subsystem

            builder.Entity<TicketType>()
                .HasMany(tt => tt.SpecialOffers)
                .WithMany(so => so.TicketTypes)
                .UsingEntity(j => j.ToTable("TicketTypeSpecialOffers"));

            builder.Entity<TicketType>()
                .HasMany(tt => tt.PricingRules)
                .WithMany(pr => pr.TicketTypes)
                .UsingEntity(j => j.ToTable("TicketTypePricingRules"));

            builder.Entity<Event>()
                .HasMany(d => d.PricingRules)
                .WithMany(pr => pr.Events)
                .UsingEntity(j => j.ToTable("EventPricingRules"));

            builder.Entity<RecordedSale>()
                .HasMany(rs => rs.SpecialOffers)
                .WithMany(so => so.RecordedSales)
                .UsingEntity(j => j.ToTable("RecordedSaleSpecialOffers"));

            // Conversion DateTime to UTC
            var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
                v => v.Kind == DateTimeKind.Utc ? v : v.ToUniversalTime(),
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

            var nullableDateTimeConverter = new ValueConverter<DateTime?, DateTime?>(
                v => v.HasValue ? (v.Value.Kind == DateTimeKind.Utc ? v.Value : v.Value.ToUniversalTime()) : v,
                v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : v);

            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (property.ClrType == typeof(DateTime))
                    {
                        builder.Entity(entityType.Name)
                            .Property(property.Name)
                            .HasConversion(dateTimeConverter);
                    }
                    else if (property.ClrType == typeof(DateTime?))
                    {
                        builder.Entity(entityType.Name)
                            .Property(property.Name)
                            .HasConversion(nullableDateTimeConverter);
                    }
                }
            }

            base.OnModelCreating(builder);
        }
    }
}
