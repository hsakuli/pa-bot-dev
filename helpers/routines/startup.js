const fs = require('fs');
const schedule = require('node-schedule');

const {setupCaches} = require('./caches.js');
const dumps = require('./dumps.js')
const alvis_delete = require('../commands/alvis-delete.js')
const {connectDB} = require('../db/mongo')
// WHEN
// channel: creation, destruction, fork 
// WHAT  
// channel: roomID, timestamp, parentID, type, name/ topic, #users

// channels: max # users in channel, topic name, current # users, time created


// Privileged Gateway Intents - look into these
// Make secure connection to website


//MAIN FUNCTIONS ---------------------------------------------------------------------------------

async function startUp() {
    // load data from servers file
    // run an update to check guild_ids
    //check all guilds for PA categories -- if there are some missing set them up from themesList
    //add cat_ids to servers objects
    // add channels to servers objects
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
   
    // // I dont think this needs to exist. every minute the BROWSER requests a updated list
    // // might change to 2-5 minute range depending on how much usage
    // schedule.scheduleJob('42 * * * * *', () => {
    //     // i think client.channels is protected with those fkin gateways
    //     dumps.updateData(client.channels);
    // });
    // console.log('SETUP - minuteley dump');


    schedule.scheduleJob('0 3 * * *', () => {
        // i think client.channels is protected with those fkin gateways
        console.log('Alvis has started his dump');

        // alvis_delete.dailyDelete(client);
        console.log('Alvis has completed his dump');
    });
    console.log('SETUP - daily delete');

    //how do i wait to call this or return from the setup. 
    await console.log('FINISH - setup');
}




module.exports = {
    startUp
}