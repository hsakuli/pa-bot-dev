const schedule = require('node-schedule');
const {setupCaches} = require('./caches.js');
const {connectDB} = require('../db/mongo')


//MAIN FUNCTIONS -------------------------------------------------------------------------------------------------------


//connect to db, setup caches, schedule nightly cleanup, 
async function startUp() { 
    try{
        await connectDB().then((mongoose) => {
            try {
                console.log(`SETUP - connected to MongoDB`)
            } finally {
                mongoose.connection.close()
            }
        })
        await setupCaches();
    } catch (e) {
        console.log(`Error setting up ${e}`)
    }
    schedule.scheduleJob('0 3 * * *', () => {
        alvis_delete.dailyDelete(client);
        console.log('Alvis has completed his dump');
    });
    console.log('SETUP - daily delete');
    await console.log('FINISH - setup');
}


module.exports = {
    startUp
}