import mongoose from "mongoose";


export function dbConnection() {
    mongoose.connect(process.env.DB_CONNECTION as string, { serverSelectionTimeoutMS: 30000 }).then(() => {
        console.log("Connected to database");
    })
}