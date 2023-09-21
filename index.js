const express = require("express");
const app = express();
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const dotenv = require("dotenv").config();
const URL  = process.env.DB
const DB = "hallbooking"
app.listen(process.env.PORT || 3001)

// middleware
app.use(express.json());

app.get('/', function(req,res){
    res.send("Welcome to Hall Booking Website");
})

//get display the rooms
app.get('/Rooms',async function(req,res){
    try {
        const connection = await mongoClient.connect(URL); 
        const db = connection.db(DB);
        let rooms = await db.collection("rooms").find().toArray();
        await connection.close()
        res.json(rooms)
        //console.log(res)
    } catch (error) {
        res.status(500).json({message:"Something Went Wrong"})
    }
})

// get display the customers
app.get('/Customers', async function(req,res){
    try {
        const connection = await mongoClient.connect(URL);
        const db = connection.db(DB);
        let customers = await db.collection("customers").find().toArray()
        await connection.close()
        res.json(customers)
        console.log(res)
    } catch (error) {
        res.status(500).json({message:"Something Went Wrong"})
    }
})

//post insert the rooms
app.post('/room', async function(req,res){
    try {
        const connection = await mongoClient.connect(URL);
        const db = connection.db(DB); 
        await db.collection("rooms").insertOne(req.body);
        await connection.close();
        res.json({message:"Room Insert"})
    } catch (error) {
        res.status(500).json({message:"Something Went Wrong"})
    }
})

//post insert the customers
app.post('/Customer', async function(req,res){
    try {
        const connection = await mongoClient.connect(URL);
        const db = connection.db(DB);
        await db.collection("customers").insertOne(req.body);
        await connection.close();
        res.json({message:"Customer Insert"})
    } catch (error) {
        res.status(500).json({message:"Something Went Wrong"})
    }
})

// post customer booking the rooms
app.post('/CustomerRoom', async function(req,res){
    try {
        const connection = await mongoClient.connect(URL);
        const db = connection.db(DB);
        await db.collection("customerroom").insertOne(req.body);
        await connection.close();
        res.json({message:"booked Rooms in successfully "})
    } catch (error) {
        res.status(500).json({message:"Something Went Wrong"})
    }
})

// find the booking rooms in customer details
app.get('/BookingRooms', async function(req,res){
    try {
        const pipline = [
            {
              '$lookup': {
                'from': 'rooms', 
                'localField': 'room no', 
                'foreignField': 'room_no', 
                'as': 'rooms'
              }
            }, {
              '$addFields': {
                'reservation': {
                  '$cond': [
                    {
                      '$eq': [
                        '$0.customerroom', []
                      ]
                    }, 'Not Booked', 'Booked'
                  ]
                }
              }
            }
          ]
        const connection = await mongoClient.connect(URL);
        const db = connection.db(DB);
        let bookingrooms = await db.collection("customerroom").aggregate(pipline).toArray();
        await connection.close();
        res.json(bookingrooms)
    } catch (error) {
        res.status(500).json({message:"Something Went Wrong"})
    }
})