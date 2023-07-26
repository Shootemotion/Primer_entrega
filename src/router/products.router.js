import {Router} from 'express';
import ProductManager from '../dao/fsManager/productManager.js'
import { productModel } from '../dao/models/product.model.js';

const productRouter = Router();
const productManager = new ProductManager('./src/dataBase/products.json') 

// Obtener todos los productos con un limit
productRouter.get('/', async (req, res) => {
  try{
    
    const limit = req.query.limit || 0
    let products = await productModel.find().limit(limit).lean().exec()
   res.status(200).json({status: 'succes', payload: products})
      
  }catch{
    res.status(500).jsonmongodb://localhost:27017({status: 'erro', error: err.message})

    }
  })



// Obtener un producto por ID
productRouter.get('/:pid', async (req, res) => {
  const productId = req.params.pid
  try{
  const product = await productModel.findById(productId).lean().exec()
  res.status(200).json({message: 'productos solicitado' , productos: product })
} catch (error){
    res.status(404).send({message:'Producto no encontrado'})
}
});

// Agregar un nuevo producto
  productRouter.post('/', async (req, res) => {
    try {
      const newProduct = req.body;
      // Verificar que todos los campos requeridos estén presentes
      if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.stock) {
        return res.status(400).json({ error: 'Todos los campos son requeridos.' });
      }
  
      // Verificar que price y stock sean números
      if (typeof newProduct.price !== 'number' || typeof newProduct.stock !== 'number') {
        return res.status(400).json({ error: 'Los campos price y stock deben ser números.' })
      }
    
      const product = await productModel.create(newProduct)
      const products = await productModel.find().lean().exec()    
      res.status(200).json({ message: 'Producto agregado', producto: product })
    } catch (err) {

      res.status(500).json({ message: 'Ocurrió un problema en la carga de datos.', error: err.message })
    }
  })


  // Agregar nuevos productos
productRouter.post('/manyProducts', async (req, res) => {
  try {
    const newProducts = req.body; // Ahora esperamos un array de productos
    if (!Array.isArray(newProducts) || newProducts.length === 0) {
      return res.status(400).json({ error: 'Se debe proporcionar una lista de productos válida.' });
    }

    // Iterar sobre la lista de productos y verificar cada uno
    for (const newProduct of newProducts) {
      if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.stock) {
        return res.status(400).json({ error: 'Todos los campos son requeridos para cada producto.' });
      }

      if (typeof newProduct.price !== 'number' || typeof newProduct.stock !== 'number') {
        return res.status(400).json({ error: 'Los campos price y stock deben ser números para cada producto.' });
      }
    }

    // Crear y agregar cada producto a la base de datos
    const createdProducts = await productModel.create(newProducts);
    const products = await productModel.find().lean().exec();
    res.status(200).json({ message: 'Productos agregados', productos: createdProducts });
  } catch (err) {
    res.status(500).json({ message: 'Ocurrió un problema en la carga de datos.', error: err.message });
  }
});


// Actualizar un producto existente
productRouter.put('/:pid', async (req, res) => {
  try{
    const productId = req.params.pid;
    const updatedFields = req.body
    const updatedProduct = await productModel.findByIdAndUpdate(productId, updatedFields, {returnDocument: 'after'});
    if (updatedProduct === null) {
      return res.status(404).json({ status: 'error' , error: 'Producto no encontrado' })
    }
    const products = await productModel.find().lean().exec()
    res.status(200).json({status: 'success', payload: updatedProduct})
  
  }catch(err){
    res.status(500).json({ status: 'error' , error: err.message })
  }
});



// Eliminar un producto
productRouter.delete('/:id', async (req, res) => {
  try{
    const productId = req.params.id
    const result = await productModel.findByIdAndDelete(productId);
    if (result===null) {
   return res.status(404).json({ error: 'Producto no encontrado' });
    }
  
    const products = await productModel.find().lean().exec()
    res.status(200).json({status: 'success', payload: products})

  }catch(err){
    res.status(500).json({status: 'error', error: err.message})


  }
});

export default productRouter;
