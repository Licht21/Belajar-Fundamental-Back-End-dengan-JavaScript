const Joi = require('joi')

//membuat objek schema
const schema = Joi.object({
    username:Joi.string().alphanum().min(3).max(30).required(),
    password:Joi.string().min(6).required(),
    repeatPassword:Joi.string().required().valid(Joi.ref('password')),
    email:Joi.string().email().required(),
})

// memvalidasi berdasarkan schema
const validationResult = schema.validate({
    username:'harry',
    password:'supersecretpassword',
    repeatPassword:'supersecretpassword',
    email:'harry@potter.com'
})

if(validationResult.error){
    console.log(`Validation Error: ${validationResult.error.message}`)
} else {
    console.log('Validasi berhasil')
}