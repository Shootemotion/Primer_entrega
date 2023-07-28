import {Router} from 'express'
import { userModel } from '../dao/models/user.model.js'
import bcrypt from 'bcrypt';


const router = Router()

router.get('/',async(req,res) => {
   try{

    const users = await userModel.find()
    res.json({status: 'success', payLoad: users})
   }catch(err){
    res.status(500).json({status:'error',error:err.message})
   }
})




router.post('/register', async (req,res) => {
    const user = req.body
    console.log('Datos recibidos del formulario:', user); 
try{
  

      // Verificar si req.session está definido
      if (!req.session) {
        throw new Error('req.session no está definido');
      }
  
    const existingUser = await userModel.findOne({ email: user.email });
    if (existingUser) {
        return res.status(409).json({ error: 'El usuario ya está registrado' });
      }

        // Hashear la contraseña usando bcrypt
    const hashedPassword = await bcrypt.hash(user.password, 10); // 10 es el número de rondas de cifrado (cost factor)
    user.password = hashedPassword
    const newUser = await userModel.create(user)

       // Almacenar información del usuario en la sesión
       req.session.user = user


    res.json({status:'success', payload:newUser})
}
catch(err){
    res.status(500).json({status:'error',error: err.message})
 }
})



router.post('/', async (req,res) => {
    const user = req.body
try{
    const result = await userModel.create(user)
    res.json({status:'success', payload:result})
}
catch(err){
    res.status(500).json({status:'error',error: err.message})
 }
})



router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Verificar si el usuario existe en la base de datos
      const existingUser = await userModel.findOne({ email });
  console.log(existingUser)
      if (!existingUser) {
        // Si el usuario no existe, redirigirlo a la página de registro
        return res.redirect('/users/register');
      }
  
      // Si el usuario existe, comparar la contraseña ingresada con la almacenada en la base de datos
      const passwordMatch = await bcrypt.compare(password, existingUser.password);
  
      if (!passwordMatch) {
        // Si la contraseña es incorrecta, redirigirlo a la página de inicio de sesión con un mensaje de error
        return res.render('login', { message: 'Contraseña incorrecta' });
      }
  
      // Si el usuario existe y la contraseña es correcta, almacenar la información del usuario en la sesión
      req.session.user = {
        first_name: existingUser.first_name,
        email: existingUser.email,
  
      };
  
      // Redirigir al usuario a la página que deseas mostrar después de iniciar sesión (por ejemplo, la página protegida)
      return res.redirect('/realtimeproducts');
    } catch (err) {
      res.status(500).json({ status: 'error', error: err.message });
    }
  });

export default router
