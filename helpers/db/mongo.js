const mongoose = require('mongoose');


//MAIN FUNCTIONS -------------------------------------------------------------------------------------------------------


//creates a connection to the db
async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGO_DEV_PATH, {
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