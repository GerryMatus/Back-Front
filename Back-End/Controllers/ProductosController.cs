using Back_End.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Json;
using System.Text.Json;

namespace Back_End.Controllers
{
    [Route("productos")]
    public class ProductosController : Controller
    {
        private readonly HttpClient _httpClient;

        public ProductosController(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://api.escuelajs.co/api/v1/");
        }

        // GET: /productos
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var response = await _httpClient.GetAsync("products");
            if (response.IsSuccessStatusCode)
            {
                var productos = await response.Content.ReadFromJsonAsync<List<Producto>>();
                return Json(productos);
            }
            return Json(new List<Producto>());
        }

        // GET: /productos/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _httpClient.GetAsync($"products/{id}");
            if (response.IsSuccessStatusCode)
            {
                var producto = await response.Content.ReadFromJsonAsync<Producto>();
                return Json(producto); // Devuelve el producto como JSON
            }
            else
            {
                var message = "No hay datos existentes de ese producto";
                return Json(new { message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Producto producto)
        {
            if (producto.CategoryId <= 0)
            {
                return BadRequest(new { message = "La categoría debería ser mayor a 0" });
            }

            if (string.IsNullOrWhiteSpace(producto.Title) || producto.Price <= 0 || string.IsNullOrWhiteSpace(producto.Description))
            {
                return BadRequest("Los campos Title, Price y Description son obligatorios.");
            }

            var response = await _httpClient.PostAsJsonAsync("products", producto);
            if (response.IsSuccessStatusCode)
            {
                var createdProduct = await response.Content.ReadFromJsonAsync<Producto>();
                return CreatedAtAction(nameof(GetById), new { id = createdProduct.Id }, createdProduct);
            }

            ModelState.AddModelError(string.Empty, "Error al registrar el producto");
            return BadRequest(ModelState);
        }




        // PUT: /productos/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(int id, [FromBody] Producto producto)
        {
            producto.Id = id;

            var response = await _httpClient.PutAsJsonAsync($"products/{id}", producto);

            if (response.IsSuccessStatusCode)
            {
                var updatedProduct = await response.Content.ReadFromJsonAsync<Producto>();

                return Ok(updatedProduct);
            }

            var errorResponse = await response.Content.ReadAsStringAsync();
            return BadRequest(errorResponse);
        }

        // POST: /productos/upload
        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new {message = "No se ha proporcionado ningún archivo." });
            }

            var permittedExtensions = new[] { "image/png", "image/jpeg", "image/jpg" };
            if (!permittedExtensions.Contains(file.ContentType.ToLower()))
            {
                return BadRequest(new {menssage = "Solo se permiten archivos en formato PNG, JPG o JPEG."});
            }

            using (var content = new MultipartFormDataContent())
            {
                var fileContent = new StreamContent(file.OpenReadStream());
                fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(file.ContentType);
                content.Add(fileContent, "file", file.FileName);

                var response = await _httpClient.PostAsync("files/upload", content);

                if (response.IsSuccessStatusCode)
                {
                    var uploadResult = await response.Content.ReadAsStringAsync();
                    return Ok(uploadResult);
                }

                var errorResponse = await response.Content.ReadAsStringAsync();
                return BadRequest(new { mensaje = "Error al subir el archivo", detalles = errorResponse });
            }
        }



    }
}
