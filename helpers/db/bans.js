const { connectDB } = require('./mongo');
const { bannedUsers } = require('./schemas');


async function setBannedUsers(message) {
    await connectDB().then(async (mongoose) => {
        try{
            const banList = await bannedUsers.find()
            console.log(`Ban list: ${banList}`)

            if (banList.length === 0) {
                console.log('No banned users')
                return
            }
            banList.forEach(member => {
                console.log(`Banning member: ${member}`);
                message.guild.members.ban(member.id);
            });
        } catch (e) {
            console.log(`Error awaiting banList: ${e}`)
        }
    })
}

async function banUserDB(guild, user) {
    await connectDB().then(async(mongoose) => {
        try {
            await bannedUsers.findOneAndUpdate({
                _id: user.id
            }, {
                _id: user.id,
                name: user.username,
                timestamp: Number(Date.now()),
                guild: guild.id
            }, {
                upsert: true,
                useFindAndModify: false
            })
        } finally {
            mongoose.connection.close()
        }
    }).catch(e => { console.log(`Error writing to banned users: ${e}`)});
}


async function unbanUserDB(userID) {
    await connectDB().then(async (mongoose) => {
        try {
            await bannedUsers.deleteOne({_id: userID})
        } finally {
            mongoose.connection.close()
        }
    }).catch(e => { console.log(`Error writing to banned users: ${e}`) });
}

module.exports = {
    banUserDB,
    unbanUserDB,
    setBannedUsers
}