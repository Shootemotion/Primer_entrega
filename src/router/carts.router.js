import {Router} from 'express';
import { cartModel } from '../dao/models/cart.model.js'

const router = Router();


// Obtener todos los cart 
router.get('/', async (req, res) => {
  try{
    
    let cart = await cartModel.find().lean().exec()
   res.status(200).json({status: 'succes', payload: cart})
      
  }catch{
    res.status(500).json({status: 'erro', error: err.message})

    }
  })




// Crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const newCart = await cartModel.create({});
    res.status(200).json({status:'success', payload: newCart});
  } catch (err) {
    res.status(500).json({ message: 'Ocurrió un error al crear el carrito.', error: err });
  }
});



// Agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;

    // Verificar que se proporcione una cantidad válida
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'La cantidad debe ser un número válido y mayor que cero.' });
    }

    const cart = await cartModel.findOneAndUpdate(
      {
        _id: cartId,
        products: {
          $elemMatch: { product: productId }
        }
      },
      {
        $inc: { 'products.$.quantity': quantity }
      },
      { new: true }
    );

    if (!cart) {
      // El producto no existe en el carrito, se agrega como un nuevo elemento
      const addedProduct = await cartModel.findByIdAndUpdate(
        cartId,
        { $addToSet: { products: { product: productId, quantity: quantity } } },
        { new: true }
      );

      if (!addedProduct) {
        return res.status(404).json({ error: 'No se encontró el producto especificado.' });
      }

      return res.status(200).json({ status: 'success', payload: addedProduct });
    }

    res.status(200).json({ status: 'success', payload: cart });

  } catch (error) {
    console.error('Error en cart.router:', error);

    // Manejo de errores genérico
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});




// Obtener Carrito por ID
router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartModel.findById(cartId).populate('products.product').exec();
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const products = cart.products;
    res.json(products);
  } catch (err) {
    console.error('Error al obtener el carrito por ID:', err); // Agrega este mensaje para obtener información sobre el error
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router

