import mongoose from "mongoose";

async function databaseConnection() {
  try {
    await mongoose.connect(process.env.DATABASE_URL ?? "");
    console.log("connected to DB");
  } catch (e) {
    console.log("got error at database connection");
    console.log(e);
  }
}
export default databaseConnection;
