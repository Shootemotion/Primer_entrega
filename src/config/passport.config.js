import passport from "passport"
import local from 'passport-local'
import { userModel } from '../dao/models/user.model.js'
import { createHash, isValidPassword } from '../../utils.js'

const LocalStrategy = local.Strategy


const initializePassport = () => {

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
        }, async(req, username, password, done) =>{
            const { first_name, last_name, email, rol} = req.body
            try{
                const user = await userModel.findOne({email:username})
                if(user){
                    console.log('user already exist')
                    return done(null, false, { message: 'El usuario ya existe' });
                }
                      const newUser = {
                        first_name, 
                        last_name, 
                        email, 
                        rol, 
                        password: createHash(password)
                      }

                      const result = await userModel.create(newUser)
                      return done(null, result, { message: 'Registro exitoso' });
                      
        }catch(err){
             return done('error al obtener el usr')
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async(username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username })
            if (!user ) {
                return done(null, false)
            }

            if (!isValidPassword(user, password)) return done(null, false)
            return done(null, user)
        } catch(err) {
            return done(err);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })

}

export default initializePassport