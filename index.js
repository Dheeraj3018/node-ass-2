import express from "express"
import { MongoClient } from "mongodb";
import dotenv from "dotenv"

const app = express()

dotenv.config()

// middleware
app.use(express.json());


const MONGO_URL = process.env.MONGO_URL


async function createConnection() {
    const client = new MongoClient(MONGO_URL)
    await client.connect();
    console.log("Mongodb is succussfully connected")
    return client
}





app.get('/', (req, res) => {
    res.send("Welcome to Hall Booking Website");
})


//get display the rooms
app.get('/rooms', async (req, res) => {
    const roomsData = (await client).db(DB).collection("rooms").find().toArray()
    res.send(roomsData)
})



//get display the customers
app.get('/customers', async function (req, res) {
    try {
        const connection = await mongoClient.connect(MONGO_URL);
        const db = connection.db(DB);
        let customers = await db.collection("customers").find().toArray()
        await connection.close()
        res.json(customers)
        console.log(res)
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" })
    }
})

//post insert the rooms
app.post('/room', async function (req, res) {
    try {
        const connection = await mongoClient.connect(MONGO_URL);
        const db = connection.db(DB);
        await db.collection("rooms").insertOne(req.body);
        // await connection.close();
        res.json({ message: "Room Insert" })
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" })
    }
})



// //post insert the customers
app.post('/customer', async function (req, res) {
    try {
        const connection = await mongoClient.connect(MONGO_URL);
        const db = connection.db(DB);
        await db.collection("customers").insertOne(req.body);
        await connection.close();
        res.json({ message: "Customer Insert" })
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" })
    }
})
app.listen(9000, () => console.log("Server running on port 9000"));

// // post customer booking the rooms
// app.post('/CustomerRoom', async function (req, res) {
//     try {
//         const connection = await mongoClient.connect(MONGO_URL);
//         const db = connection.db(DB);
//         await db.collection("customerroom").insertOne(req.body);
//         await connection.close();
//         res.json({ message: "booked Rooms in successfully " })
//     } catch (error) {
//         res.status(500).json({ message: "Something Went Wrong" })
//     }
// })

// // find the booking rooms in customer details
app.get('/BookingRooms', async function (req, res) {
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
        res.status(500).json({ message: "Something Went Wrong" })
    }
})