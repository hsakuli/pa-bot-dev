const { connectDB } = require('./mongo');
const { bannedUsers } = require('./schemas');


//MAIN FUNCTIONS -------------------------------------------------------------------------------------------------------


//creates a list of all banned users
async function setBannedUsers(message) {
    await connectDB().then(async (mongoose) => {
        try{
            const banList = await bannedUsers.find()
            if (banList.length === 0) {
                return
            }
            banList.forEach(member => {
                console.log(`Banning member: ${member}`);
                message.guild.members.ban(member.id);
            });
        } catch (e) {
            console.log(`Error awaiting banList: ${e}`)
        }
    });
}


//adds a banned user to db
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


//removes a banners user from db
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