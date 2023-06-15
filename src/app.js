import express from 'express';
import productRouter from './router/products.router.js';
import cartRouter from './router/carts.router.js';
import handlebars from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';

import ProductManager from './controller/productManager.js';

const productManager = new ProductManager('./src/dataBase/products.json');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

// Configuración del motor de plantillas
app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');

// Configuración de rutas
app.use(express.static('./public'));
app.use('/products', productRouter);
app.use('/carts', cartRouter);

// Ruta para la vista /home
app.get('/home', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { 
    nombre_vista: 'Home',
    products
  });
});

// Ruta para la vista /realtimeproducts
app.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realTimeProducts', {
    nombre_vista: 'Real Time Products',
    products
  });
});


// Evento para actualizar la lista de productos en tiempo real
io.on('connection', (socket) => {
  console.log('Se hizo la conexión');

  socket.on('addProduct', async (newProduct) => {
    await productManager.addProduct(newProduct);
    const products = await productManager.getProducts();
    io.emit('updatedProductList', products);
  });

  socket.on('updateProducts', async () => {
    const products = await productManager.getProducts();
    io.emit('updatedProductList', products);
  });

  socket.on('deleteProduct', async (productId) => {
    await productManager.deleteProduct(productId);
    const products = await productManager.getProducts();
    io.emit('updatedProductList', products);
  });
});

server.listen(8080, () => {
  console.log('Server running on port 8080');
});
