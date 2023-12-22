const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken')
// const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;



app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.laemifb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const userCollection = client.db('taskManager').collection('user');
    const addTaskCollection = client.db('taskManager').collection('addTask');


    //create user
    app.post('/user', async (req, res) => {
        const user = req.body;
        console.log(user);
        const result = await userCollection.insertOne(user);
        res.send(result);
    });


    //add task
    app.post('/addTask', async(req, res) =>{
        const newAddTask = req.body;
        const result = await addTaskCollection.insertOne(newAddTask)
        res.send(result);
  
      })

    
    //get task  in todo list
    app.get('/addTask', async(req, res) =>{
        const curser = addTaskCollection.find()
        const result = await curser.toArray()
        res.send(result);
      })



    //get task on updated task page
    app.get('/addTask/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
        const result = await addTaskCollection.findOne(query)
        res.send(result)
  });


    
    //update task
app.put('/addTask/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updatedTask = req.body;
    const update = {
      $set: {
        title: updatedTask.title,
        description: updatedTask.description,
        datelines: updatedTask.datelines,
        priority: updatedTask.priority,
      },
    };

    const result = await addTaskCollection.updateOne(filter, update, options);
    res.json(result);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).send('Internal Server Error');
  }
});

  //   app.put('/addTask/:id', async (req, res) => {
  //     try {
  //         const id = req.params.id;
  //         console.log('Task ID:', id);
  
  //         const filter = { _id: new ObjectId(id) };
  //         const options = { upsert: true };
  //         const updatedTask = req.body;
  //         console.log('Updated Task Data:', updatedTask);
  
  //         // Rest of your code...
  //     } catch (error) {
  //         console.error('Error updating task:', error);
  //         res.status(500).send('Internal Server Error');
  //     }
  // });
  
      
  //delete task
  app.delete('/addTask/:id', async(req, res) =>{
    const id = req.params.id;
    const query = { _id: new ObjectId(id)}
    const result = await addTaskCollection.deleteOne(query)
    res.send(result)
  })



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) =>{
    res.send('task management server is running');
})

app.listen(port, () =>{
    console.log(`task management server is running on port ${port}`);
})