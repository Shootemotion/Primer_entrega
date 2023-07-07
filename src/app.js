import express from 'express';
import userRouter from  './router/user.router.js';
import productRouter from './router/products.router.js';
import cartRouter from './router/carts.router.js';
import handlebars from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import ProductManager from './dao/fsManager/productManager.js';
import mongoose from 'mongoose'

const productModel = new ProductManager('./src/dataBase/products.json');


const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server);


// Configuración del motor de plantillas
app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');



// Configuración de rutas
app.use(express.static('./public'));
app.use('/products', productRouter);
app.use('/carts', cartRouter);
app.use('/users', userRouter)

// Ruta para la vista /home
app.get('/home', async (req, res) => {
  const products = await productModel.find();
  res.render('home', { 
    nombre_vista: 'Home',
    products
  });
});

// Ruta para la vista /realtimeproducts
app.get('/realtimeproducts', async (req, res) => {
  const products = await productModel.find();
  res.render('realTimeProducts', {
    nombre_vista: 'Real Time Products',
    products
  });
});



// Evento para actualizar la lista de productos en tiempo real
io.on('connection', (socket) => {
  console.log('Se hizo la conexión Socket');
  socket.request.io = io;
  // socket.on('addProduct', async (newProduct) => {
  //   await productModel.create(newProduct);
  //   const products = await productModel.find();
  //   io.emit('updatedProductList', products);
  // });

  socket.on('updatedProducts', async () => {
    const products = await productModel.find().lean().exec()
    io.emit('updatedProductList', products);
  });

  socket.on('deleteProduct', async (productId) => {
    await productModel.deleteProduct(productId);
    const products = await productModel.find();
    io.emit('updatedProductList', products);
  });
});

mongoose.set('strictQuery',false)

try {
  await mongoose.connect('mongodb+srv://Shootemotion:Soporte01@cluster0.trosur8.mongodb.net/entregaFinal', {
    useUnifiedTopology: true
})
 server.listen(8080, () =>  console.log('Server running on port 8080'))
}
 catch(err) {
  console.error('Error al conectar a la base de datos:', err);
}

