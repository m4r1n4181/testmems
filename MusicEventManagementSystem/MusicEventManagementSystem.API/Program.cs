using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Repositories;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.API.Services;
using MusicEventManagementSystem.API.Services.IService;
using MusicEventManagementSystem.Data;
using MusicEventManagementSystem.Models.Auth;
using MusicEventManagementSystem.Services.Auth;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// 1. DbContext with PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Identity setup
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.User.RequireUniqueEmail = true;
}).AddEntityFrameworkStores<ApplicationDbContext>()
  .AddDefaultTokenProviders();

// 3. Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 4. Register repositories for Ticket-Sales Subsystem
builder.Services.AddScoped<IVenueRepository, VenueRepository>();
builder.Services.AddScoped<ISegmentRepository, SegmentRepository>();
builder.Services.AddScoped<IZoneRepository, ZoneRepository>();
builder.Services.AddScoped<ISpecialOfferRepository, SpecialOfferRepository>();
builder.Services.AddScoped<ITicketTypeRepository, TicketTypeRepository>();
builder.Services.AddScoped<ITicketRepository, TicketRepository>();
builder.Services.AddScoped<IRecodedSaleRepository, RecordedSaleRepository>();
builder.Services.AddScoped<IPricingRuleRepository, PricingRuleRepository>();
builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<IResourceRepository, ResourceRepository>();
builder.Services.AddScoped<IPerformanceRepository, PerformanceRepository>();
builder.Services.AddScoped<IEquipmentRepository, EquipmentRepository>();
builder.Services.AddScoped<ILocationRepository, LocationRepository>();
builder.Services.AddScoped<IWorkTaskRepository, WorkTaskRepository>();
builder.Services.AddScoped<IPerformerRepository, PerformerRepository>();
builder.Services.AddScoped<IVehicleRepository, VehicleRepository>();
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
builder.Services.AddScoped<IInfrastructureRepository, InfrastructureRepository>();
builder.Services.AddScoped<IStaffRepository, StaffRepository>();
builder.Services.AddScoped<IPerformanceResourceRepository, PerformanceResourceRepository>();

// 5. Register Media Campaign repositories
builder.Services.AddScoped<ICampaignRepository, CampaignRepository>();
builder.Services.AddScoped<IAdTypeRepository, AdTypeRepository>();
builder.Services.AddScoped<IMediaWorkflowRepository, MediaWorkflowRepository>();
builder.Services.AddScoped<IMediaTaskRepository, MediaTaskRepository>();
builder.Services.AddScoped<IAdRepository, AdRepository>();
builder.Services.AddScoped<IMediaVersionRepository, MediaVersionRepository>();
builder.Services.AddScoped<IMediaChannelRepository, MediaChannelRepository>();
builder.Services.AddScoped<IIntegrationStatusRepository, IntegrationStatusRepository>();
builder.Services.AddScoped<IApprovalRepository, ApprovalRepository>();


// 6. Register services for Ticket-sales Subsystem
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IVenueService, VenueService>();
builder.Services.AddScoped<ISegmentService, SegmentService>();
builder.Services.AddScoped<IZoneService, ZoneService>();
builder.Services.AddScoped<ISpecialOfferService, SpecialOfferService>();
builder.Services.AddScoped<ITicketTypeService, TicketTypeService>();
builder.Services.AddScoped<ITicketService, TicketService>();
builder.Services.AddScoped<IRecordedSaleService, RecordedSaleService>();
builder.Services.AddScoped<IPricingRuleService, PricingRuleService>();
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<IResourceService, ResourceService>();
builder.Services.AddScoped<IPerformanceService, PerformanceService>();
builder.Services.AddScoped<IEquipmentService, EquipmentService>();
builder.Services.AddScoped<ILocationService, LocationService>();
builder.Services.AddScoped<IWorkTaskService, WorkTaskService>();
builder.Services.AddScoped<IPerformerService, PerformerService>();
builder.Services.AddScoped<IVehicleService, VehicleService>();
builder.Services.AddScoped<IServiceService, ServiceService>();
builder.Services.AddScoped<IInfrastructureService, InfrastructureService>();
builder.Services.AddScoped<IStaffService, StaffService>();
builder.Services.AddScoped<IPerformanceResourceService, PerformanceResourceService>();

// 8. Register Media Campaign services
builder.Services.AddScoped<ICampaignService, CampaignService>();
builder.Services.AddScoped<IAdTypeService, AdTypeService>();
builder.Services.AddScoped<IMediaWorkflowService, MediaWorkflowService>();
builder.Services.AddScoped<IMediaTaskService, MediaTaskService>();
builder.Services.AddScoped<IAdService, AdService>();
builder.Services.AddScoped<IMediaVersionService, MediaVersionService>();
builder.Services.AddScoped<IMediaChannelService, MediaChannelService>();
builder.Services.AddScoped<IIntegrationStatusService, IntegrationStatusService>();
builder.Services.AddScoped<IApprovalService, ApprovalService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
