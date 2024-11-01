$(document).ready(function () {
    console.log("Entrando a CargaTabla");
    CargaTabla();
});

function CargaTabla() {
    $('#tabla-products').find("thead").hide();

    $.ajax({
        url: "../productos/",
        method: "GET",
        dataType: "json"
    })
        .done(function (data) {
            if (data && data.length > 0) {
                $("#tabla-products").find("thead").show();
                $("#tabla-products").find("tbody").html("");

                $.each(data, function (index, product) {
                    var imagesHtml = '';
                    if (product.images && product.images.length > 0) {
                        $.each(product.images, function (i, image) {
                            const cleanedImage = image.replace(/^\["|"\]$/g, '').replace(/\\+/g, '');
                            imagesHtml += `<img src="${cleanedImage}" width="50" height="50" style="margin-right:5px;"/>`;
                        });
                    } else {
                        imagesHtml = "No image available";
                    }
                    var row = `
                <tr>
                    <td>${product.title}</td>
                    <td>$${product.price}</td>
                    <td>${product.description}</td>
                    <td>${imagesHtml}</td>
                    <td class="text-center">
                        <button class="btn btn-primary btn-sm me-2" data-bs-toggle="modal" data-bs-target="#editModal" onclick="btnEdit(${product.id})">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="fa fas-pen" viewBox="0 0 16 16">
                                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                            </svg>
                        </button>
                        <button class="btn btn-secondary btn-sm me-2" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="btnView(${product.id})">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                            </svg>
                        </button>
                    </td>
                </tr>
                `;
                    $("#tabla-products").find("tbody").append(row);
                });
            } else {
                $("#tabla-products").find("tbody").html("<tr><td colspan='5'>No hay productos disponibles.</td></tr>");
            }
        })
        .fail(function () {
            console.error("Error al cargar los datos.");
            $("#tabla-products").find("tbody").html("<tr><td colspan='5'>Error al cargar los productos.</td></tr>");
        });
}
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredProducts = [];

    $("#tabla-products tbody tr").each(function () {
        const productTitle = $(this).find('td').eq(0).text().toLowerCase();
        if (productTitle.includes(searchTerm)) {
            filteredProducts.push(this);
        }
    });

    $("#tabla-products tbody tr").hide();
    $(filteredProducts).show();
}

function btnView(id) {
    $.ajax({
        url: `../productos/${id}`,
        method: "GET",
        dataType: "json"
    })
        .done(function (data) {
            if (data) {
                const modalBody = `
                <div><strong>Producto:</strong></div>
                <div id="product-carousel" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner" id="product-images"></div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#product-carousel" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#product-carousel" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
                <div class=text-center>
                <p><h1>${data.title}</h1></p>
                <p><strong>Descripción:</strong> ${data.description}</p>
                <p><strong>Precio:</strong> $${data.price}</p>
                </div>
            `;

                $(".modal-body").html(modalBody);

                $('#product-images').html('');

                if (data.images && data.images.length > 0) {
                    $.each(data.images, function (i, image) {
                        const cleanedImage = image.replace(/^\["|"\]$/g, '').replace(/\\+/g, '');

                        const isActive = (i === 0) ? 'active' : '';
                        $('#product-images').append(`
                            <div class="carousel-item ${isActive}">
                                <img src="${cleanedImage}" class="d-block w-100" alt="Imagen del producto" style="height: 300px; object-fit: cover;">
                            </div>
                        `);
                    });
                } else {
                    $('#product-images').append("<p>No images available</p>");
                }

                // Muestra la modal
                $('#exampleModal').modal('show');
            }
        })
        .fail(function () {
            console.error("Error al cargar los datos del producto.");
            $(".modal-body").html("<p>Error al cargar los detalles del producto.</p>");
        });
}

async function btnEdit(id) {
    try {
        const response = await fetch(`../productos/${id}`);
        const productData = await response.json();

        document.getElementById("productId").value = productData.id;
        document.getElementById("productTitle").value = productData.title;
        document.getElementById("productDescription").value = productData.description;
        document.getElementById("productPrice").value = productData.price;

        const editModal = new bootstrap.Modal(document.getElementById("editModal"));
        editModal.show();

        document.getElementById("saveProductBtn").onclick = function () {
            saveEditedProduct(id);
        };

    } catch (error) {
        console.error("Error al obtener los datos del producto:", error);
        alert("Hubo un error al cargar los datos del producto.");
    }
}

async function saveEditedProduct(id) {
    const formData = new FormData();
    const imageFile = document.getElementById("productImage").files[0];
    formData.append("file", imageFile);

    try {
        const uploadResponse = await fetch('../productos/upload', {
            method: 'POST',
            body: formData
        });

        const uploadResult = await uploadResponse.json();
        if (!uploadResult.location) {
            alert("Error: La respuesta del servidor no contiene la ubicación de la imagen.");
            return;
        }
        const cleanImageUrl = uploadResult.location.replace(/["\\[\]]/g, '');

        const editedProduct = {
            id: id,
            title: document.getElementById("productTitle").value,
            description: document.getElementById("productDescription").value,
            price: parseFloat(document.getElementById("productPrice").value),
            images: [cleanImageUrl]
        };

        console.log(editedProduct);

        $.ajax({
            url: `../productos/${id}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(editedProduct),
            success: function (response) {
                alert("Producto editado exitosamente");
                window.location.reload();
            },
            error: function (error) {
                console.error("Error al editar el producto:", error);
                alert("Error al editar el producto");
            }
        });

    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error en la operación");
    }
}

async function saveNewProduct() {
    const formData = new FormData();
    const imageFile = document.getElementById("productImagea").files[0];
    const categoryId = document.getElementById("categoryId").value;

    if (!imageFile) {
        alert("Por favor, selecciona una imagen para subir.");
        return;
    }

    formData.append("file", imageFile);
    formData.append("title", document.getElementById("productTitlea").value);
    formData.append("description", document.getElementById("productDescriptiona").value);
    formData.append("price", parseFloat(document.getElementById("productPricea").value));
    formData.append("categoryId", categoryId); // Agrega el ID de la categoría

    try {
        // 1. Subimos la imagen
        const uploadResponse = await fetch('../productos/upload', {
            method: 'POST',
            body: formData
        });

        const uploadResult = await uploadResponse.json();

        // Verificamos si la URL de la imagen (location) existe en la respuesta
        if (!uploadResult.location) {
            alert("Error: La respuesta del servidor no contiene la ubicación de la imagen.");
            return;
        }

        // Limpiamos los caracteres especiales en la URL de la imagen
        const cleanImageUrl = uploadResult.location.replace(/["\\[\]]/g, '');

        // 2. Preparamos los datos para crear el nuevo producto
        const newProduct = {
            title: document.getElementById("productTitlea").value,
            description: document.getElementById("productDescriptiona").value,
            price: parseFloat(document.getElementById("productPricea").value),
            images: [cleanImageUrl],
            categoryId: categoryId // Aquí agregas el ID de la categoría
        };

        // 3. Enviamos la solicitud para guardar el nuevo producto
        const response = await fetch('../productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        });

        if (!response.ok) {
            throw new Error('Error al guardar el producto: ' + response.statusText);
        }

        alert("Producto guardado exitosamente");
        window.location.reload(); // Recarga la página después de guardar

    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error en la operación: " + error.message);
    }
}

async function fetchCategories() {
    try {
        const response = await fetch('https://api.escuelajs.co/api/v1/categories');
        if (!response.ok) {
            throw new Error('Error al cargar las categorías');
        }
        const categories = await response.json();
        const categorySelect = document.getElementById("categoryId");

        categorySelect.innerHTML = '<option value="">Seleccione una categoría</option>';

        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al cargar las categorías.");
    }
}

document.getElementById("altaModal").addEventListener('show.bs.modal', fetchCategories);
