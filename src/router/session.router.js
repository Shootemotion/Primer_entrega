import {Router} from 'express'
import { userModel } from '../dao/models/user.model.js'
import {  isValidPassword } from '../../utils.js'
import passport from 'passport'


const router = Router()

router.get('/',async(req,res) => {
   try{

    const users = await userModel.find()
    res.json({status: 'success', payLoad: users})
   }catch(err){
    res.status(500).json({status:'error',error:err.message})
   }
})




router.post('/register',passport.authenticate('register', {failureRedirect: '/session/failRegister'}), async (req,res) => {
res.redirect('/realtimeProducts')
})



router.get('/failRegister',(req,res) => {
  res.send({error:'Faileed'})
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



router.post('/login',passport.authenticate('login' ,{ 
  failureRedirect: '/session/failLogin'}), 
  async (req, res) => { res.redirect('/realtimeProducts')
  });

  
router.get('/failLogin',(req,res) => {
  res.send({error:'Failed Login'})
})

export default router
