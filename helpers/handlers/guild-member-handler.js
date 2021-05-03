const alvis_responses = require("../data/embeds.js");
const { banUserDB, unbanUserDB } = require("../db/bans");

const handleNewMember = (member) => {
    console.log(`New user, ${member.username} -- ${member.id}, has joined`);
    return member.send(alvis_responses.welcomeText);
    // dm the user from alvis
    // i can log that a new user has joined
}

//change the way this works later. fires every guildbanmember event (aka # of servers)
const banMember = (guild, user) => {
    // add user to ban list cache and to ban list json / db 
    //make sure to ban user on all other PA servers. the handle new member event will not fire :/
    try{
        banUserDB(guild, user);
    } catch (e) {
        console.log(`DB ERROR-ban member handler: ${e}`)
        //retry to ban the member later?
    }
    guild.client.guilds.cache.forEach(guild => {
        guild.members.ban(user).catch( e => { console.log(`Error banning user: ${user} in server ${guild.id}\nE-- ${e}`) })
    });
    console.log(`User banned: ${user.username} - ${user.id} from guildID: ${guild.id}`);
    return;
}

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