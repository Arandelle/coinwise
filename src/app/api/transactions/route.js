import clientPromise from "@/lib/mongodb";

// GET method
export async function GET(){
    try{
        const client = await clientPromise;
        const db = client.db("coinwise");
        const transactions = await db.collection("transactions").find({}).toArray();
        return Response.json(transactions);
    } catch(error){
        return Response.json({error: error.message}, {status: 500});
    }
}

// PUT method
export async function POST(request){
    try{
        const client = await clientPromise;
        const db = client.db("coinwise");
        const data = await request.json(); // convert request body to JSON
        const result = await db.collection("transactions").insertOne(data);

        return Response.json({insertedId: result.insertedId}, {status: 201});
    }catch(error){
        return Response.json({error: error.message}, {status: 500});
    }
}