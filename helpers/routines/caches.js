const fs = require('fs');
const Keyv = require('keyv');
const path = require("path");

const bansCache = new Keyv({ namespace: "bansCache" });
const categoriesCache = new Keyv({ namespace: "categoriesCache" });
const topicsCache = new Keyv({ namespace: "topicsCache" });
const commandTimeoutCache = new Keyv({namespace: "ctCache"});

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
        const bannedUsersJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/banned_users.json")));
        for (let buser in bannedUsersJSON) {
            // console.log(buser + ": " + bannedUsersJSON[buser].name+ bannedUsersJSON[buser].name);
            await bansCache.set(buser, {
                "name": bannedUsersJSON[buser].name,
                "reason": bannedUsersJSON[buser].reason,
                "timestamp": bannedUsersJSON[buser].timestamp,
                "banned by": bannedUsersJSON[buser].banned_by
            })
        }
    } catch(e) {
        console.log(`Creating bansCache has failed with error \n: ${e}`);
    }
    // console.log(await bansCache.get("user_id1"));
    
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

    try {
        
        const topicsJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/delete_later.json")));
        for (let topic in topicsJSON) {
            // console.log(buser + ": " + bannedUsersJSON[buser].name+ bannedUsersJSON[buser].name);
            //idk what to do with the topics :/
            await topicsCache.set(topic, topicsJSON[topic].topic, )
        }
    } catch (e) {
        console.log(`Creating topicsCache has failed with error \n: ${e}`);
    }
    
    // category ids
    //const topicListJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/banned_users.json")));

    
    console.log("Caches have been setup :)")

}




// HELPER FUNCTIONS ------------------------------------------------------------------------------


module.exports = {
    setupCaches,
    bansCache,
    categoriesCache,
    topicsCache,
    commandTimeoutCache

}