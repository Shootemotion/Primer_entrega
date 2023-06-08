import express, { json } from 'express'
import productRouter from './router/products.router.js'
import cartRouter from './router/carts.router.js'




const app = express()
app.use(express.json())


app.get('/', (req,res)=> res.send('OK'))
app.get('/status',(req,res)=>res.send({message: 'Server UP'}))

//endpoints
app.use('/products', productRouter);
app.use('/carts', cartRouter);
  

  app.listen(8080, () => {
    console.log(`Server running on port ${8080}`)
  })



