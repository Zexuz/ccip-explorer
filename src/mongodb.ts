import {MongoClient} from 'mongodb';

const MONGO_URI = 'mongodb://localhost:27017';  // E.g., "mongodb://localhost:27017"
// Create a new MongoClient
const client = new MongoClient(MONGO_URI);

export const saveToMongoDb = async (event: any) => {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('ccip');

    try {
        const collection = db.collection('events');  // "events" is the name of the collection where we'll save our events
        await collection.insertOne(event);
        console.log("Event saved successfully!");
    } catch (error) {
        console.error("Error saving the event:", error);
    }{
        await client.close();
    }
}
