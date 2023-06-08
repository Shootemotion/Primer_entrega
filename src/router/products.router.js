import {Router} from 'express';
import ProductManager from '../controller/productManager.js'

const productRouter = Router();
const productManager = new ProductManager('./src/dataBase/products.json') 

// Obtener todos los productos
productRouter.get('/', async (req, res) => {
    const limit = req.query.limit
    let products = await productManager.getProducts();
    if (limit) {
        products = products.slice(0, parseInt(limit));
      }
      
      res.json(products);
    })



// Obtener un producto por ID
productRouter.get('/:pid', async (req, res) => {
  const productId = req.params.pid
  try{
  const product = await productManager.getProductById(productId)
  res.json({ productos: product })
} catch (error){
    res.status(404).send('Producto no encontrado')
}
});

// Agregar un nuevo producto
productRouter.post('/', async (req, res) => {
    const newProduct = req.body;
  
    // Verificar que todos los campos requeridos estén presentes
    if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.stock) {
      return res.status(400).json({ error: 'Todos los campos son requeridos.' });
    }
  
    // Verificar que price y stock sean números
    if (typeof newProduct.price !== 'number' || typeof newProduct.stock !== 'number') {
      return res.status(400).json({ error: 'Los campos price y stock deben ser números.' });
    }
  
    const product = await productManager.addProduct(newProduct);
    res.json(product);
  })




// Actualizar un producto existente
productRouter.put('/:pid', async (req, res) => {
  const productId = req.params.pid;
  const updatedFields = req.body
  const updatedProduct = await productManager.updateProduct(productId, updatedFields);
  if (updatedProduct) {
    res.json(updatedProduct)
  } else {
    res.status(404).json({ error: 'Producto no encontrado' })
  }
});



// Eliminar un producto
productRouter.delete('/:id', async (req, res) => {
  const productId = req.params.id
  const success = await productManager.deleteProduct(productId);
  if (success) {
    res.send(`Producto con ID ${productId} eliminado`);
  } else {
    res.status(404).send(`Producto con ID ${productId} no encontrado`);
  }
});

export default productRouter;
