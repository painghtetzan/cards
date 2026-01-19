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


app.post('/addcard',async(req,res)=>{
    const {name,pic} = req.body
    try{
        let connection = await sql.createConnection(dbConfig)
        await connection.execute('INSERT INTO card (card_name,card_pic) VALUES (?,?)',[name,pic])
        res.status(201).send(`added ${name} to database successfully!`)
    }catch(error){
        console.error(error,"error adding card")
        res.status(500).send('error adding card')
    }
})

app.put('/editcard/:id',async(req,res)=>{
    const {name,pic} = req.body
    const id = req.params.id

    try{
        let connection = await sql.createConnection(dbConfig)
        await connection.execute('UPDATE card SET card_name =?, card_pic=?  WHERE id=?',[name,pic,id])
        res.status(202).send(`Updated card ${name} Successfully!`)
    }catch(error){
        console.error(error)
        res.status(500).send('error updating card')
    }
})

app.delete('/deletecard/:id',async(req,res)=>{
    const id = req.params.id
    
    try{
        let connection = await sql.createConnection(dbConfig)
        await connection.execute('DELETE FROM card WHERE id =?',[id])
        res.status(203).send('Successfully deleted')
    }catch(error){
        console.error(error)
        res.status(500).send('error deleting card.')
    }
})