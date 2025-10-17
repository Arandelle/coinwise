import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const options = {}; 

// ✅ Remove the throw - handle it with a rejected promise instead
let client;
let clientPromise;

if (!uri) {
  // Return a rejected promise instead of throwing during build
  clientPromise = Promise.reject(new Error("Please add your Mongo URI to .env.local"));
} else {
  client = new MongoClient(uri, options);
  
  if (process.env.NODE_ENV === "development"){
    // Reuse client in development to avoid multiple connections
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    clientPromise = client.connect();
  }
}

export default clientPromise;