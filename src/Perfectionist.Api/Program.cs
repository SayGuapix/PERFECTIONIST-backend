using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Perfectionist.Api.Auth;
using Perfectionist.Api.Middleware;
using Perfectionist.Application.Interfaces;
using Perfectionist.Application.Mapping;
using Perfectionist.Application.Services;
using Perfectionist.Application.Validation;
using Perfectionist.Infrastructure;
using Perfectionist.Infrastructure.Security;

// PUNTO DE ENTRADA DE LA API
// Aqui se configura TODO lo que necesita la aplicacion para arrancar
var builder = WebApplication.CreateBuilder(args);

// Habilita controladores y acceso al contexto http para obtener el usuario logueado
builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();

// Carga toda la configuracion de infraestructura (base de datos, repositorios)
builder.Services.AddInfrastructure(builder.Configuration);

// Configuracion AutoMapper para convertir entidades a Dtos
builder.Services.AddAutoMapper(cfg => cfg.AddProfile<ApplicationMappingProfile>());

// Configura validacion automatica de requests
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<RegisterRequestValidator>();

// Servicio para obtener el usuario actual que hace la peticion
builder.Services.AddScoped<ICurrentUser, CurrentUser>();

// REGISTRO DE SERVICIOS DE NEGOCIO
// Cada servicio maneja toda la logica de su modulo
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IGoalService, GoalService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<IFixedExpenseService, FixedExpenseService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

// CONFIGURACION AUTENTICACION JWT
// Valida tokens de usuarios logueados
var jwt = builder.Configuration.GetSection("Jwt").Get<JwtOptions>() ?? new JwtOptions();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt.Issuer,
            ValidAudience = jwt.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key)),
            ClockSkew = TimeSpan.FromMinutes(1)
        };
    });

builder.Services.AddAuthorization();

// Swagger para probar la api desde navegador
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// AQUI YA CONSTRUYE LA APLICACION
var app = builder.Build();

// Middleware que captura TODOS los errores y devuelve respuestas limpias
app.UseMiddleware<ErrorHandlingMiddleware>();

// Solo habilita swagger en desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Orden de seguridad IMPORTANTE: autenticacion primero, despues autorizacion
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

// Mapea todos los controladores como endpoints de la api
app.MapControllers();

// Arranca la api
app.Run();
