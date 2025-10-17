import sampleListings from "./data.js"
import mongoose from 'mongoose';
import listing from "../models/listening.js"

main()
  .then(() => console.log("Connected to Database"))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}

const initData = async () => {
    await listing.deleteMany({});
    await listing.insertMany(sampleListings);
    console.log("Data Saved");
};

initData()
  .then(() => mongoose.connection.close())
  .catch(err => console.log(err));