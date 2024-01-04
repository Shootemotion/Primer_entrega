const socket = io();
const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');

// Escucha el evento 'submit' del formulario
productForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Obtiene los valores ingresados en el formulario
  const title = document.querySelector('input[name="title"]').value;
  const description = document.querySelector('input[name="description"]').value;
  const price = +document.querySelector('input[name="price"]').value;
  const code = document.querySelector('input[name="code"]').value;
  const stock = +document.querySelector('input[name="stock"]').value;
  console.log({ title, description, price, stock });



  // Emite el evento 'addProduct' con los datos del nuevo producto
  socket.emit('addProduct', { title, description, price, stock });


  
  // Limpia los campos del formulario
  productForm.reset();
});

// Escucha el evento 'updatedProductList' para actualizar la lista de productos en la vista
socket.on('updatedProductList', (products) => {
  console.log(products); // Verificar si se reciben los productos actualizados correctamente

  // Borra el contenido actual de la tabla de productos
  productList.innerHTML = '';

  // Agrega cada producto a la tabla
  products.forEach((product) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${product.id}</td>
      <td>${product.title}</td>
      <td>${product.description}</td>
      <td>${product.price}</td>
      <td>${product.stock}</td>
      <td>
        <button onclick="deleteProduct('${product.id}')">Delete</button>
      </td>
    `;
    productList.appendChild(tr);
  });
});

// Escucha el evento de clic en el botón de eliminación
// Función para eliminar un producto
async function eliminarProducto(id) {
  try {
    const response = await fetch(`/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);
      // Puedes agregar más mensajes de consola o acciones aquí según sea necesario
      location.reload(true);
      // Realiza alguna actualización de la interfaz de usuario si es necesario
    } else {
      const errorMessage = await response.text();
      console.error(errorMessage);
    }
  } catch (error) {
    console.error(error.message);
  }
}

