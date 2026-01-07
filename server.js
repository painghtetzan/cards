const express = require("express")
const sql = require('mysql2/promise')
require('dotenv').config()
const port = 3000

const dbConfig ={
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    port:process.env.DB_PORT,
    waitForConnection:true,
    connectionLimit:100,
    queueLimit:0
}

const app = express()
app.use(express.json())



app.listen(port,()=>{
    console.log("server has started.")
})

app.get('/allcards',async(req,res)=>{
    try{
        let connection = await sql.createConnection(dbConfig)
        const [rows] = await connection.execute('SELECT * FROM defaultdb.card');
        res.json(rows)
        console.log(rows)
    }catch(err){
        console.error(err)
        res.status(500).json({message:'Server error for all cards.'})
    }
})