const { Client } = require('pg')

const client = new Client({
    user:'developer',
    host:'localhost',
    database:'companydb',
    password:'supersecretpassword',
    port:5432
})