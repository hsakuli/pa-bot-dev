// log if someone uses a delete method to mod channel

// make alvis post previous topics in a human readable post in the category chat

const { categoriesCache } = require("../routines/caches");
const { connectDB } = require('../db/mongo');
const { customChannels } = require('../db/schemas');

const CHANNEL_TYPE = "voice";

//MAIN FUNCTIONS ---------------------------------------------------------------------------------

/***** ONLY DELETE CHANNELS MADE BY ALVIS, ADD THEM WHEN HE CREATES THEM. 
DO NOT ADD THE ONES CREATED IN SETUP. DO NOT DELETE OTHER USERS CHANNELS */

async function dailyDelete(client) {
    //fetch all custom-topic-channels in db
    // go through 1 by 1, check if they are populated and delete them
    //  should automatically delete from the db through the delete function
    
    // add deleted channels to a list and log it in discord?

    await connectDB().then(async (mongoose) => {
        try {
            await customChannels.find({}, (err, channels) => {
                if(err){
                    throw err;
                }
                channels.forEach(chan => {
                    try {
                        let curChan = client.channels.resolve(chan._id);
                        // console.log(curChan);
                        if (curChan != undefined) {
                            if (curChan.members.size === 0) {
                                curChan.delete();
                                console.log(`DELETED channel: ${chan.id}`);
                            } else {
                                console.log(`NOT DELETED - populate - id:${chan.id}`)
                            }
                        } else {
                            console.log(`NOT DELETED - DNE - id:${chan.id}`);
                        }
                    } catch (ee) {
                       throw ee;
                    }
                })
            })

        } finally {
            mongoose.connection.close()
        }
    }).catch(e => { console.log(`Error deleting from custom channels: ${e}`) });
};


//delete all atlas setup - dream function rather than mvp
function delAtlas() {
    // use channel.client to see who made the channel. if it was alvis delete that shit
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


module.exports = {
    dailyDelete,
    devDelete,
    delAtlas
}