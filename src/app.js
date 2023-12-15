import express from 'express';
import { productModel } from './dao/models/product.model.js';
import userRouter from './router/session.router.js';
import productRouter from './router/products.router.js';
import cartRouter from './router/carts.router.js';
import handlebars from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import passport from "passport"
import initializePassport from './config/passport.config.js';


const app = express();

// Middleware para parsear los datos del formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Configuración de la sesión
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: 'mongodb+srv://Shootemotion:wBI77vP5D5vIpwb7@shootemotion.galhkcd.mongodb.net/',
      dbName: 'sessionsDB',
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    }),
    secret: 'secretKey',
    resave: true,
    saveUninitialized: true
  })
);
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

http://localhost:8080/api/session/githubcallback




// Configuración del motor de plantillas
app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');



// Configuración de rutas
app.use(express.static('./public'));
app.use('/products', productRouter);
app.use('/carts', cartRouter);
app.use('/users', userRouter);


//VISTAS HANDLEBARS
// Ruta para la vista /home
app.get('/home', async (req, res) => {
  const products = await productModel.find().lean().exec();
  res.render('home', {
    nombre_vista: 'Home',
    products
  });
});

// Ruta para la vista /realtimeproducts
app.get('/realtimeproducts', async (req, res) => {
  const productsPerPage = 10; // Número de productos por página (ajústalo según tus necesidades)
  const page = parseInt(req.query.page) || 1;

  try {
    const options = {
      page,
      limit: productsPerPage,
      lean: true
    };

    const products = await productModel.paginate({}, options); // Utiliza la función paginate de mongoose-paginate-v2

    products.prevLink = products.hasPrevPage 
    ? `/realtimeproducts?page=${products.prevPage}`
    : '';

    products.nextLink = products.hasNextPage 
    ? `/realtimeproducts?page=${products.nextPage}`
    : '';

    const totalPages = products.totalPages;
    
    res.render('realTimeProducts', {
      nombre_vista: 'Real Time Products',
      products: products.docs,
      currentPage: page,
      totalPages,
      prevLink: products.prevLink,
      nextLink: products.nextLink,
      firstLink: `/realtimeproducts?page=1`,
      lastLink: `/realtimeproducts?page=${totalPages}`
    });


  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});


// Rutas para el registro y el login
app.get('/users/register', (req, res) => {
  res.render('register',{
    nombre_vista: 'Registro',
  });
});

// Ruta para el formulario de inicio de sesión
app.get('/users/login', (req, res) => {
  res.render('login',{
    nombre_vista: 'Logging',
  });
});



// Configuración de la conexión a MongoDB
mongoose.set('strictQuery', false);

const mongoURL = 'mongodb+srv://Shootemotion:wBI77vP5D5vIpwb7@shootemotion.galhkcd.mongodb.net/entregaFinal';

async function connectToMongoDB() {
  try {
      mongoose.connect(mongoURL, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
    console.log('Conectado a MongoDB correctamente.');
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1); // Salir del proceso si hay un error en la conexión a MongoDB
  }
}







// Creación del servidor de Socket.IO
const io = new Server();

// Evento para actualizar la lista de productos en tiempo real
io.on('connection', (socket) => {
  console.log('Se hizo la conexión Socket');
  socket.request.io = io;

  socket.on('updatedProducts', async () => {
    const products = await productModel.find().lean().exec();
    io.emit('updatedProductList', products);
  });

  socket.on('deleteProduct', async (productId) => {
    await productModel.deleteProduct(productId);
    const products = await productModel.find();
    io.emit('updatedProductList', products);
  });
});


// Configuración del servidor HTTP
const server = http.createServer(app);

// Iniciando el servidor HTTP y Socket.IO
const PORT = 8080;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Conexión a MongoDB
connectToMongoDB();