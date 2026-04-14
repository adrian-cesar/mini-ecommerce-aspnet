using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MiniEcommerce.Data;
using MiniEcommerce.Repositories;
using MiniEcommerce.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configurar autentica��o JWT
var jwtKey = builder.Configuration.GetValue<string>("Jwt:Key") 
    ?? "sua-chave-secreta-super-segura-123456-mini-ecommerce";

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidIssuer = "MiniEcommerce",
            ValidateAudience = true,
            ValidAudience = "MiniEcommerceUsers",
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

// Registrar servi�os e reposit�rios para Produto
builder.Services.AddScoped<IProdutoRepository, ProdutoRepository>();
builder.Services.AddScoped<IProdutoService, ProdutoService>();

// Registrar servi�os e reposit�rios para Cliente
builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<IClienteService, ClienteService>();

// Registrar servi�os e reposit�rios para Venda
builder.Services.AddScoped<IVendaRepository, VendaRepository>();
builder.Services.AddScoped<IVendaService, VendaService>();

var app = builder.Build();

// Inicializar banco de dados com dados de exemplo
SeedData.InitializeDb(app);

app.UseHttpsRedirection();

// Adicionar autentica��o ANTES de autoriza��o
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
