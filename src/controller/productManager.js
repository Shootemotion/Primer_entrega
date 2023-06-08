import fs from 'fs'

class ProductManager {
  constructor(path) {
    this.path = path
  }

  async addProduct(product) {
    // busco el array de productos, espero con el await el metodo getproduct
    const products = await this.getProducts()
    // Asignar id autoincrementable   -  Uso ternario para Luke
    const UltimoId = products.length > 0 ? products[products.length - 1].id : 0
    const NuevoID = UltimoId + 1

    const newProduct = {
      id: NuevoID,
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail,
      code: product.code,
      stock: product.stock
    }

    // Agrego al array
    products.push(newProduct)

    // Guardar el array con el producto agregado usando fs
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
    return newProduct
  }

  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8')
  
      // si hay Data, lo cargo en products
      const products = JSON.parse(data)
  
      return products
    } catch (error) {
      console.log('Error al leer el archivo:', error);
      return []
    }
  }
  

  async getProductById(id) {
    const products = await this.getProducts()
    // con find busco en el array el mismo id
    const product = products.find((p) => p.id == id)
    if (product) {
      return product
    } else {
      throw new Error("No se encontró ningún producto con el ID especificado")
    }
  }

  async updateProduct(id, campoUpdate) {
    const products = await this.getProducts()
    // Buscar el producto con el id especificado
    const productId = await this.getProductById(id)
    // Actualizar los campos del producto
    const updateProduct = {
      //con el spread ... saco las propiedades del producto en el array y las nuevas enviadas al metodo con campoUpdate(las ultimas pisan a las de product)
      ...products[productId],
      ...campoUpdate,
      id //aseguro el ID
    }

    // cambio el producto en el array products con el nuevo producto modificado
    products[productId] = updateProduct
    // Guardar los productos actualizados en el archivo
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
    return updateProduct
  }

  async deleteProduct(id) {
    const products = await this.getProducts()
    const productId = parseInt(id, 10);
    // Filtro los productos y elimino el que tenga el id especificado (podia usar el getElementbyId con el Find pero esto es para probar)
    const newProducts = products.filter((p) => p.id !== productId)
  
    // Verificar si se eliminó algún producto
    if (newProducts.length === products.length) {
      console.log(`No se encontró el producto con el ID ${id}`)
      return false // No se encontró el producto con el id especificado
    }
  
    await fs.promises.writeFile(this.path, JSON.stringify(newProducts, null, '\t'))
  
    console.log(`Se eliminó el producto con el ID ${id} y se guardó el cambio.`)
  
    return true 
  }
}
  

export default ProductManager;