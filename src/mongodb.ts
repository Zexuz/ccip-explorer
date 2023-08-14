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
    } finally {
        await client.close();
    }
}

export const getEventsFromMongoDb = async (lastTimestamp: number) => {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('ccip');

    try {
        const collection = db.collection('events');  // "events" is the name of the collection where we'll save our events
        const events = await collection.find({timestamp: {$gt: lastTimestamp}}).toArray();
        console.log("Events retrieved successfully!");
        return events;
    } catch (error) {
        console.error("Error retrieving the events:", error);
        return [];
    } finally {
        await client.close();
    }
}

interface Contract {
    chain: string;
    address: string;
    abi: string | null;
    haveCheckedExplorer: boolean;
}


export const getAbiFromMongoDb = async (chain: string, address: string): Promise<Contract | null> => {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('ccip');

    try {
        const collection = db.collection('abis');  // "abis" is the name of the collection where we'll save our abis
        const abi = await collection.findOne({chain, address});
        console.log("Abi retrieved successfully!");
        return abi as Contract | null;
    } catch (error) {
        console.error("Error retrieving the abi:", error);
        return null;
    } finally {
        await client.close();
    }
}

export const saveAbiToMongoDb = async (chain: string, address: string, abi: string | null, haveCheckedExplorer: boolean) => {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('ccip');

    try {
        const collection = db.collection('abis');  // "abis" is the name of the collection where we'll save our abis
        await collection.insertOne({chain, address, abi, haveCheckedExplorer});
        console.log("Abi saved successfully!");
    } catch (error) {
        console.error("Error saving the abi:", error);
    } finally {
        await client.close();
    }
}
