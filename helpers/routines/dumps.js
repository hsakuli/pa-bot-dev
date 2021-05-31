const fs = require('fs');
const schedule = require('node-schedule');

// WHEN
// channel: creation, destruction, fork 
// WHAT  
// channel: roomID, timestamp, parentID, type, name/ topic, #users

// channels: max # users in channel, topic name, current # users, time created


// Privileged Gateway Intents - look into these
// Make secure connection to website


//MAIN FUNCTIONS ---------------------------------------------------------------------------------



//is storing all data every minute overkill?
// every minute: get information from discord.client, clean and parse, add to data_timeline.json, send payload to website
function updateData(client){
    // use client.channels 
    // send payload to website
    console.log("updated data");
}

//is storing all data every minute overkill?
// Daily: clean data_timeline, send to email (database@projectatlas.gg)
function dumpData(){
    console.log("dump data");
}




// HELPER FUNCTIONS ------------------------------------------------------------------------------



module.exports = {
    updateData,
    dumpData
}