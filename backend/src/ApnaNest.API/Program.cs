using ApnaNest.API.Middleware;
using ApnaNest.Data.Factories;
using ApnaNest.Data.Repositories;
using ApnaNest.Services.Interfaces;
using ApnaNest.Services.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure Dapper to map snake_case columns to PascalCase properties
Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;

// Configure Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ApnaNest API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Configure JWT Authentication. Fail closed instead of using a public fallback key.
var jwtSecret = builder.Configuration["JwtSettings:Secret"];
if (string.IsNullOrWhiteSpace(jwtSecret) ||
    jwtSecret.StartsWith("CHANGE_ME", StringComparison.OrdinalIgnoreCase) ||
    Encoding.UTF8.GetByteCount(jwtSecret) < 32)
{
    throw new InvalidOperationException(
        "JwtSettings:Secret must be configured with at least 32 bytes of secret material.");
}
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSecret)),
            ValidateIssuer = false, // Set to true in prod
            ValidateAudience = false // Set to true in prod
        };
    });

// Configure Dependency Injection for Data Access
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Host=localhost;Database=apnanest;Username=postgres;Password=postgres";
builder.Services.AddSingleton<IDbConnectionFactory>(new NpgsqlConnectionFactory(connectionString));

// Register Repositories
builder.Services.AddScoped<IPropertyRepository, PropertyRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ILeadRepository, LeadRepository>();

// Register Services
builder.Services.AddScoped<IPropertyService, PropertyService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ILeadService, LeadService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .SetIsOriginAllowed(origin =>
            {
                var uri = new Uri(origin);
                // Allow localhost (any port) for local dev
                if (uri.Host == "localhost" || uri.Host == "127.0.0.1")
                    return true;
                // Allow all Vercel preview and production deployments
                if (uri.Host.EndsWith(".vercel.app"))
                    return true;
                return false;
            })
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ApnaNest API V1");
    c.RoutePrefix = "swagger"; // Ensure it's at /swagger
});

if (app.Environment.IsDevelopment())
{
    // Other dev-only middleware
}

app.UseMiddleware<ErrorHandlingMiddleware>();

// IMPORTANT: CORS must come before HTTPS redirect.
// If HTTPS redirect is first, the browser's OPTIONS preflight
// gets a 307 redirect → browser rejects it → all CORS calls fail.
app.UseCors("AllowFrontend");
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
