const mongoose = require('mongoose');


async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGO_PATH, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        return mongoose
    } catch(e) {
        console.log(`ERROR connecting to Mongoose: ${e}`);
    }
}

module.exports = {
    connectDB
    
}