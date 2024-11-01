using Back_End.Controllers;

var builder = WebApplication.CreateBuilder(args);

// Agregar servicios al contenedor.
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();
builder.Services.AddHttpClient<ProductosController>();

var app = builder.Build();

// Configurar el pipeline de solicitudes HTTP.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "productos",
    pattern: "Productos/{action=Index}/{id?}",
    defaults: new { controller = "Productos" });

// Mapea las páginas de Razor para que la página de inicio pueda mostrarse.
app.MapRazorPages();

app.Run();
