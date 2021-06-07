const { connectDB } = require('./mongo');
const { customChannels } = require('./schemas');


//MAIN FUNCTIONS -------------------------------------------------------------------------------------------------------


//gets all channels
async function requestChannelData() {
    await connectDB().then(async (mongoose) => {
        try {
            const query = await customChannels.find({}); 
            return query;
        } finally {
            mongoose.connection.close()
        }
    }).catch(e => { console.log(`Error deleting from custom channels: ${e}`) });
}


//add a channel to the db
async function createChannelDB(invite, message, channelName) {
    await connectDB().then(async (mongoose) => {
        try {
            await customChannels.findOneAndUpdate({
                _id: invite.channel.id
            }, {
                _id: invite.channel.id,
                topicName: channelName,
                createdBy: message.author.id,
                timestamp: Number(Date.now()),
                inviteLink: invite.url
            }, {
                upsert: true,
                useFindAndModify: false
            })
        } finally {
            mongoose.connection.close()
        }
    }).catch(e => { console.log(`Error writing to banned users: ${e}`) });
}


//remove a channel from the db
async function deleteChannelDB(channelID) {
    await connectDB().then(async (mongoose) => {
        try {
            await customChannels.deleteOne({ _id: channelID })
        } finally {
            mongoose.connection.close()
        }
    }).catch(e => { console.log(`Error deleting from custom channels: ${e}`) });
}


module.exports = {
    createChannelDB,
    deleteChannelDB,
    requestChannelData
}