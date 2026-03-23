const { MongoClient } = require('mongodb');


const url = "mongodb+srv://Shashwat:Shashwat%402004@cluster0.3j9yhex.mongodb.net/?appName=Cluster0";
const client = new MongoClient(url);

const dbName = 'firstDB';

async function main() {
    await client.connect();
    console.log("connected to client successfully.....");
    const db = client.db(dbName);
    const collection = db.collection('user');

    // await collection.insertOne({
    //     firstName: "Rahul",
    //     lastName: "Singh",
    //     city: "Shimla"
    // })

    await collection.deleteOne({
        firstName: "Rahul"
    })
    return 'done';
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());