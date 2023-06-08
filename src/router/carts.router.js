import express from 'express';
import CartManager from '../controller/cartManager.js';

const router = express.Router();
const cartManager = new CartManager();

// Crear un nuevo carrito
router.post('/', async (req, res) => {
  const newCart = await cartManager.createCart();
  res.json(newCart);
});

// Listar los productos del carrito
router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const products = await cartManager.getProductsInCart(cartId);
  res.json(products);
});

// Agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const addedProduct = await cartManager.addProductToCart(cartId, productId);
  res.json(addedProduct);
});

export default router;

