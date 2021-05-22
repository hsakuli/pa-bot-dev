// log if someone uses a delete method to mod channel

// make alvis post previous topics in a human readable post in the category chat

const {topicsCache, categoriesCache} = require("../routines/caches")
const CHANNEL_TYPE = "voice";

//MAIN FUNCTIONS ---------------------------------------------------------------------------------

/***** ONLY DELETE CHANNELS MADE BY ALVIS, ADD THEM WHEN HE CREATES THEM. 
DO NOT ADD THE ONES CREATED IN SETUP. DO NOT DELETE OTHER USERS CHANNELS */

//happens from the cached topics not db
async function dailyDelete(client){
    // delete all audio channels that arent the offical category channels.
    //load category data
    //MUST BE ABLE TO HANDLE WHEN A SERVER IS OFFLINE - if channels cant be deleted they stay in the custom_topics.json
    
    topicsCache.opts.store.forEach((val, key) => {
        let currentSnowflake;
        const keyStripped = key.slice(12); //only works when namespace is topicsCache
        client.channels.fetch(keyStripped)
        .then((channel) =>{
            //the key exists delete it
            //typeof channel === "VoiceChannel" && 
            if (channel.type === CHANNEL_TYPE && channel.members.length === (0 || undefined)){
                console.log(`DELETING CHANNEL: ${channel.name}`)
                return channel.delete(`${channel.id} - Nightly deletion of unoccupied voice channels`);
            } else {
                console.log(`${channel.name} has active users\nChannel Type: ${channel.type} `)
            }
            
        }).then((deletedChannel) =>{
            currentSnowflake = deletedChannel.id
            //channel successfully deleted
            console.log("Successfully Deleted Channel in Discord")
            return topicsCache.delete(currentSnowflake);
        }).then({
            //could be true or false depending on if the key existed
            //return database.delete(currentSnowflake);
        })
        .catch(e =>{
            //the key can not be found? Where could it be?
            console.log(`ERROR: ${e} \n--key is not found in discord\n--channel not deleted from: discord, cache, db`)
        })
    })
}


//delete all atlas setup - dream function rather than mvp
function delAtlas() {
    // use channel.client to see who made the channel. if it was alvis delete that shit
}

//delete full topic - mainly for test purposes
function delCat(message, args) {
    let channelName = args.join(' ');
    // if topic exists
    if (channelName.toLowerCase().localeCompare('general') === 0) {
        message.channel.send(`Can not delete #general channel. Please !del a custom channel`);
    } else if (isDupe(channelName, message)) {
        let ids = []
        message.guild.channels.forEach(channel => {
            if (channel.type === 'category') {
                if (channel.name.toLowerCase().localeCompare(channelName) === 0) {
                    // if the name of the channel is the same as args
                    ids.push(channel.id);
                    channel.delete().catch(console.error);
                }
            }
        });
        message.guild.channels.forEach(channel => {
            if (ids.includes(channel.parentID)) {
                channel.delete().catch(console.error);
            }
        });
    }
}

function devDelete(message) {
    message.guild.channels.cache.forEach(channel => {
        const modChannels = ["810344292286988348", "815749669057462322", "830911713204633601", "830938936461361152", "833521422068350987"]
        if (modChannels.includes(channel.id) === false && channel.type==="voice"){
            channel.delete()
        }
    })
}

//HELPER FUNCTIONS -------------------------------------------------------------------------------------------------------

function checkTopic() {
    //also double check permissions, make sure its empty
    return true;
}


function removeFromTopicsCache(channelID) {
    for (let i = 0; i < channels.length; i++) {
        if (channels[i].id === channelID) {
            channels.splice(i, 1);
        }
    }
}



module.exports = {
    dailyDelete,
    devDelete,
    delAtlas,
    delCat
}