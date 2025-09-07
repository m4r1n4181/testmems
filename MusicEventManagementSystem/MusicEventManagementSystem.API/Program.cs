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
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173", "https://localhost:7050")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .SetIsOriginAllowed(_ => true);
    });
});

// 4. Register repositories
builder.Services.AddScoped<IVenueRepository, VenueRepository>();
builder.Services.AddScoped<ISegmentRepository, SegmentRepository>();
builder.Services.AddScoped<IZoneRepository, ZoneRepository>();
builder.Services.AddScoped<ISpecialOfferRepository, SpecialOfferRepository>();
builder.Services.AddScoped<ITicketTypeRepository, TicketTypeRepository>();
builder.Services.AddScoped<ITicketRepository, TicketRepository>();
builder.Services.AddScoped<IRecodedSaleRepository, RecordedSaleRepository>();
builder.Services.AddScoped<IPricingRuleRepository, PricingRuleRepository>();

// Performer subsystem repositories
builder.Services.AddScoped<IPerformerRepository, PerformerRepository>();
builder.Services.AddScoped<IRequirementRepository, RequirementRepository>();
builder.Services.AddScoped<IPhaseRepository, PhaseRepository>();
builder.Services.AddScoped<INegotiationRepository, NegotiationRepository>();
builder.Services.AddScoped<IContractRepository, ContractRepository>();
builder.Services.AddScoped<IDocumentRepository, DocumentRepository>();
builder.Services.AddScoped<ICommunicationRepository, CommunicationRepository>();

// 5. Register services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IVenueService, VenueService>();
builder.Services.AddScoped<ISegmentService, SegmentService>();
builder.Services.AddScoped<IZoneService, ZoneService>();
builder.Services.AddScoped<ISpecialOfferService, SpecialOfferService>();
builder.Services.AddScoped<ITicketTypeService, TicketTypeService>();
builder.Services.AddScoped<ITicketService, TicketService>();
builder.Services.AddScoped<IRecordedSaleService, RecordedSaleService>();
builder.Services.AddScoped<IPricingRuleService, PricingRuleService>();

// Performer subsystem services
builder.Services.AddScoped<IPerformerService, PerformerService>();
builder.Services.AddScoped<IRequirementService, RequirementService>();
builder.Services.AddScoped<IPhaseService, PhaseService>();
builder.Services.AddScoped<INegotiationService, NegotiationService>();
builder.Services.AddScoped<IContractService, ContractService>();
builder.Services.AddScoped<IDocumentService, DocumentService>();
builder.Services.AddScoped<ICommunicationService, CommunicationService>();

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

app.UseCors("AllowReactApp"); // Move CORS before HTTPS redirection

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
