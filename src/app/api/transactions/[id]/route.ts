import {NextResponse} from "next/server";
import {MongoClient, ObjectId} from "mongodb";

// Don't create client here - it will fail if MONGO_URI is undefined during build
const uri = process.env.MONGO_URI;

// GET method to fetch a specific data by ID
export async function GET(
    request: Request, 
    { params }: { params: Promise<{ id: string }> }
) {
    if (!uri) {
        return NextResponse.json({error: "Database connection not configured"}, {status: 500});
    }
    
    const client = new MongoClient(uri); // ✅ Create client here
    
    try{
        const { id } = await params;
        await client.connect(); 
        const db = client.db("coinwise");
        const transaction = await db.collection("transactions").findOne({_id: new ObjectId(id)});

        if(!transaction){
            return NextResponse.json({error: "Transaction not found"}, {status: 404});
        }

        return NextResponse.json(transaction);
    } catch(error){
        return NextResponse.json({error: (error as Error).message}, {status: 500});
    } finally{
        await client.close();
    }
}

export async function PUT(
    request: Request, 
    { params }: { params: Promise<{ id: string }> }
) {
    if (!uri) {
        return NextResponse.json({error: "Database connection not configured"}, {status: 500});
    }
    
    const client = new MongoClient(uri); // ✅ Create client here
    
    try{
       const { id } = await params;
       const data = await request.json();
       await client.connect();
       const db = client.db("coinwise");
       const result = await db.collection("transactions").updateOne(
        {_id: new ObjectId(id)},
        {$set: data}
       );
       
       if(result.matchedCount === 0){
        return NextResponse.json({error: "Transaction not found"}, {status: 404});
       }

       return NextResponse.json({message: "Transaction updated successfully"});
       
    }catch(error){
        return NextResponse.json({error: (error as Error).message}, {status: 500});
    } finally{
        await client.close();
    }
}

export async function DELETE(
    request: Request, 
    { params }: { params: Promise<{ id: string }> }
) {
    if (!uri) {
        return NextResponse.json({error: "Database connection not configured"}, {status: 500});
    }
    
    const client = new MongoClient(uri); // ✅ Create client here
    
    try{
        const { id } = await params;
        await client.connect();
        const db = client.db("coinwise");
        const result = await db.collection("transactions").deleteOne({_id: new ObjectId(id)});

        if(result.deletedCount === 0){
            return NextResponse.json({error: "Transaction not found"}, {status: 404});
        }

        return NextResponse.json({message: "Transaction deleted successfully"});
    }catch(error){
        return NextResponse.json({error: (error as Error).message}, {status: 500});
    } finally{
        await client.close()
    }
}