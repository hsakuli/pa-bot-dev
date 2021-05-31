const { connectDB } = require('./mongo');
const { customChannels } = require('./schemas');

const util = require('util')


async function createChannelDB(invite, message, channelName) {
    // console.log(util.inspect(invite, { showHidden: false, depth: null }))
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
}