const alvis_responses = require("../data/embeds.js");
const { bansCache } = require('../routines/caches');


const handleNewMember = (member) => {
    //check to see if user is banned -- kick if they are on the global ban list wiht reason
    bansCache.get(member.id)
    .then((bannedUser) => {
        //this user is banned

    })
    .catch((e) => {
        //this user doesnt exist in the ban
    });
    console.log(`New user has joined ${member.name}`);
    return member.send(alvis_responses.welcomeText);
    // dm the user from alvis
    // i can log that a new user has joined
}

const banMember = (member) => {
    // add user to ban list cache and to ban list json / db 
    //make sure to ban user on all other PA servers. the handle new member event will not fire :/
    console.log(`User banned: ${member.name}`);
    return;
}

const unbanMember = (member) => {
    console.log(`User unbanned: ${member.name}`);
    return;
}



module.exports = {
    handleNewMember,
    banMember,
    unbanMember
}