var builder = WebApplication.CreateBuilder(args);

// ----------------------
// Services
// ----------------------

// Add controllers
builder.Services.AddControllers();

// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS policy to allow React dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactDevServer", policy =>
        policy.WithOrigins("http://localhost:5173") // React dev server
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

// ----------------------
// Middleware
// ----------------------

// Enable Swagger in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS before routing
app.UseCors("AllowReactDevServer");

// Redirect HTTP → HTTPS (optional, you can comment out for HTTP testing)
app.UseHttpsRedirection();

app.UseAuthorization();

// Map API controllers
app.MapControllers();

// ----------------------
// Run the app
// ----------------------
app.Run();
