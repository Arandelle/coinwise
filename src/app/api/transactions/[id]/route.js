import {NextResponse} from "next/server"; // used to send response
import {MongoClient, ObjectId} from "mongodb"; // used to interact with MongoDB

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri); 

// GET method to fetch a specific data by ID
export async function GET(request, {params}){ // params contains the dynamic route parameters
    try{
        await client.connect(); 
        const db = client.db("coinwise");
        const transaction = await db.collection("transactions").findOne({_id: new ObjectId(params.id)});

        if(!transaction){
            return NextResponse.json({error: "Transaction not found"}, {status: 404});
        }

        return NextResponse.json(transaction);
    } catch(error){
        return NextResponse.json({error: error.message}, {status: 500});
    } finally{
        await client.close(); // ensure the client is closed after operation
    }
}

export async function PUT(request, {params}){
    try{
       const data = await request.json();
       await client.connect();
       const db = client.db("coinwise");
       const result = await db.collection("transactions").updateOne(
        {_id: new ObjectId(params.id)},
        {$set: data}
       );
       
       if(result.matchedCount === 0){
        return NextResponse.json({error: "Transaction not found"}, {status: 404});
       }

       return NextResponse.json({message: "Transaction updated successfully"});
       
    }catch(error){
        return NextResponse.json({error: error.message}, {status: 500});
    } finally{
        await client.close(); // ensure the client is closed after operation
    }
}

export async function DELETE(request, {params}){
    try{
        await client.connect();
        const db = client.db("coinwise");
        const result = await db.collection("transactions").deleteOne({_id: new ObjectId(params.id)});

        if(result.deletedCount === 0){
            return NextResponse.json({error: "Transaction not found"}, {status: 404});
        }

        return NextResponse.json({message: "Transaction deleted successfully"});
    }catch(error){
        return NextResponse.json({error: error.message}, {status: 500});
    } finally{
        await client.close()
    }
}