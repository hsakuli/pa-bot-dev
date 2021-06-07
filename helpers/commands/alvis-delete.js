const { connectDB } = require('../db/mongo');
const { customChannels } = require('../db/schemas');


//MAIN FUNCTIONS -------------------------------------------------------------------------------------------------------


//fetch all custom-topic-channels in db, check if they are populated/ delete them, delete event removes from db
async function dailyDelete(client) {
    await connectDB().then(async (mongoose) => {
        try {
            await customChannels.find({}, (err, channels) => {
                if(err){
                    throw err;
                }
                channels.forEach(chan => {
                    try {
                        let curChan = client.channels.resolve(chan._id);
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
    }).catch(e => { console.log(`ERROR deleting from custom channels - daily delete: ${e}`) });
};


//delete all channels on dev server except modChannels
function devDelete(message) {
    message.guild.channels.cache.forEach(channel => {
        const modChannels = ["810344292286988348", "815749669057462322", "830911713204633601", "830938936461361152", "833521422068350987"]
        if (modChannels.includes(channel.id) === false && channel.type==="voice"){
            channel.delete()
        }
    })
}


module.exports = {
    dailyDelete,
    devDelete
}