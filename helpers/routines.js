let fs = require('fs');


// Routines every minute, and every day

// WHEN
// user: connect, disconnect, !events, (messages + media uploads)?
// channel: creation, destruction, fork 
// WHAT  
// channel: roomID, timestamp, parentID, type, name/ topic, #users

// channels: max # users in channel, topic name, current # users, time created


// Privileged Gateway Intents - look into these
// Make secure connection to website



// every minute: get information from discord.client, clean and parse, add to data_timeline.json, send payload to website
function updateData(client){
    // use client.channels 
    // send payload to website
    console.log("updated data");
}

// Daily: clean data_timeline, send to email (database@projectatlas.gg)
function dumpData(){
    console.log("dump data");
}

//what sort of things do i need to clean? 
//is storing all data every minute overkill?

module.exports = {
    updateData,
    dumpData
}