import {Router} from 'express';
import CartManager from '../controller/cartManager.js';

const router = Router();
const cartManager = new CartManager()



// Crear un nuevo carrito
router.post('/', async (req, res) => {
  const newCart = await cartManager.createCart()
  res.json(newCart)
})



// Agrregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity; // Obtener la cantidad desde el cuerpo de la solicitud

    const addedProduct = await cartManager.addProductToCart(cartId, productId, quantity);

    res.json(addedProduct)
    
  } catch (error) {
    console.error('Error en cart.router:', error)
// Ver como manejar los errores.
    if (error.status === 404) {
      res.status(404).json({ error: error.message })
    } else if (error.status === 400) {
      res.status(400).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
})



// Listar los productos del carrito
router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const products = await cartManager.getProductsInCart(cartId)
  res.json(products)
})



export default router

