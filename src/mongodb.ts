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
    const events = await collection.find({timestamp: {$gt: lastTimestamp}})
                                   .toArray();
    console.log("Events retrieved successfully!");
    return events;
  } catch (error) {
    console.error("Error retrieving the events:", error);
    return [];
  } finally {
    await client.close();
  }
}

const databaseEvent = {
  "_id": {"$oid": "64d58fac0b8054c1eac0264d"},
  "destinationChain": "ARBITRUM_GOERLI",
  "eventName": "CCIPSendRequested",
  "message": {
    "sourceChainSelector": "2664363617261496610",
    "sequenceNumber": "7290",
    "feeTokenAmount": "99790498461538461",
    "sender": "0x2Af63f50Fa3F97f4AA94D28327A759ca86B33BF8",
    "nonce": "2625",
    "gasLimit": "200000",
    "strict": false,
    "receiver": "0x57C0059Fc3f98aA0a5CE4Fb5d2882d81D839E74F",
    "data": "0x0000000000000000000000000000000000000000000000000000000000000282",
    "tokenAmounts": [],
    "feeToken": "0xdc2CC710e42857672E7907CF474a69B63B93089f",
    "messageId": "0xc7b22b9d813993386874de616066e4336e37f0d33aea4fc77570ad8226fa7e68"
  },
  "senderChain": "OPTIMISM_GOERLI",
  "timestamp": 1691717548.984
}

export const getEventWithMessageIdFromMongoDb = async (messageId: string) => {
  await client.connect();
  console.log('Connected to MongoDB');

  const db = client.db('ccip');

  try {
    const collection = db.collection('events');  // "events" is the name of the collection where we'll save our events
    const events = await collection.findOne({"message.messageId": messageId});
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
