const fs = require('fs');
const Keyv = require('keyv');
const path = require("path");

const categoriesCache = new Keyv({ namespace: "categoriesCache" });
const commandTimeoutCache = new Keyv({namespace: "ctCache"});
// const channelsCache = new Keyv({ namespace: "categoriesCache" });

// WHEN
// channel: creation, destruction, fork 
// WHAT  
// channel: roomID, timestamp, parentID, type, name/ topic, #users

// channels: max # users in channel, topic name, current # users, time created


// Privileged Gateway Intents - look into these
// Make secure connection to website


//MAIN FUNCTIONS ---------------------------------------------------------------------------------

//read data from db/ files and add data to caches
async function setupCaches() {
    
    try{
        const catListJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/pa_categories.json")));
        for (let cat in catListJSON) {
            await categoriesCache.set(cat, catListJSON[cat]);
        }
    } catch(e) {
        console.log(`Creating categoriesCache has failed with error \n: ${e}`);
    }
    // categoriesCache.get("🗿 Religion").then((result) => {
    //     console.log(result)
    // })


    // try{
    //     //request data from about what is pa from db
    //     // then get updated population info from discord (later feature)
    //     let cannels = updateChannelData()
    //     for (let chan in channels) {
    //         await channelsCache.set('chan_id', {
    //             topic: '',
    //             inv: '',
    //             population: ''
    //         });
    //     }
    // } catch(e) {
    //     console.log(`Creating channelCache has failed with error \n: ${e}`);
    // }
    
    console.log("SETUP - caches")

}




// HELPER FUNCTIONS ------------------------------------------------------------------------------


module.exports = {
    setupCaches,
    categoriesCache,
    commandTimeoutCache

}