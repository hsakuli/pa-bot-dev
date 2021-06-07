const alvis_responses = require("../data/embeds.js");
const { banUserDB, unbanUserDB } = require("../db/bans");


//MAIN FUNCTIONS -------------------------------------------------------------------------------------------------------


//sends welcome text to new member
const handleNewMember = (member) => {
    console.log(`New user, ${member.username} -- ${member.id}, has joined`);
    return member.send(alvis_responses.welcomeText);
}


//adds banned user to db, bans user in all pa servers, 
const banMember = (guild, user) => {
    try{
        banUserDB(guild, user);
    } catch (e) {
        console.log(`DB ERROR-ban member handler: ${e}`)
    }
    guild.client.guilds.cache.forEach(guild => {
        guild.members.ban(user).catch( e => { console.log(`Error banning user: ${user} in server ${guild.id}\nE-- ${e}`) })
    });
    console.log(`User banned: ${user.username} - ${user.id} from guildID: ${guild.id}`);
    return;
}


//unbans user from db, unbans them from each server
async function unbanMember(message, args) {
    //check if message has correct mention
    const userID = args.join(" ");
    try {
        await unbanUserDB(userID);
    } catch (e) {
        console.log(`DB ERROR-ban member handler: ${e}`)
    }
    message.client.guilds.cache.forEach(guild => {
        guild.members.unban(userID).catch(e => { console.log(`Error unbanning banning user: ${userID} in server ${guild.id}\nE-- ${e}`) })
    })
    console.log(`User unbanned: ${userID}`);
    return;
}


module.exports = {
    handleNewMember,
    banMember,
    unbanMember
}