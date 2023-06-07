import { Router } from "express";

const router = Router()

router.get('/usuarios', (req,res)   =>  {
    res.json({message: 'aqui van los usuarios'})
})


router.get('/:id', (req,res)    =>  {
    const id = req.query.id
res.json({message:`Aqui los detalles del usuario = ${id}`})
})

router.post('/',(req,res) =>    {
    const {id, name, age} = req.body
    users.push({id,name,age})
    res.json({message:'aqui va el usuario nuevo'})
})

router.put('/',(req,res) => {
    res.json({message:'aqui va el usuario nuevo'})
})

export default router