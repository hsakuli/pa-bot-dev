// this file is built for things alvis can do
// how do i make atlas only affect PA channels and not fuck with other things on the server
const {categoryList, serverList} = require('./data/themes.js');

let bannedUsers = {
    "user": {
        "timestamp": "reason",
        "or id ": "timestamp"
    },
    "user2": {
        "timestamp": "reason",
        "or id ": "timestamp"
    }

}

let bannedWords = [];
// https://github.com/web-mech/badwords


//MAIN FUNCTIONS ---------------------------------------------------------------------------------

function startUp(){
    // load data from servers file
    // run an update to check guild_ids
    //check all guilds for PA categories -- if there are some missing set them up from themesList
    //add cat_ids to servers objects
    // add channels to servers objects
}

function setupNewGuild(guild_id){
    // add channls + cats to guild based off theme data -- store resulting data in temp obj
    // add guild + cats + channels to objects
}


// HELPER FUNCTIONS ------------------------------------------------------------------------------



function addChannel(channelID, topic, parentID) {
    var hasDuplicates = channels.some((channel) => {
        if (channel.id === channelID) {
            return true;
        }
    });
    if (!hasDuplicates) {
        channels.push({ id: channelID, topic: topic, parent: parentID });
    }
}

function removeChannel(channelID) {
    for (let i = 0; i < channels.length; i++) {
        if (channels[i].id === channelID) {
            channels.splice(i, 1);
        }
    }
}

function addUser(userID, channelID, parentID) {
    // add user, remove user
    users.push({ id: userID, channel: channelID, parent: parentID });
}

function removeUser(userID) {
    // add user, remove user
    for (let i = 0; i < users.length; i++) {
        if (users[i].id === userID) {
            users.splice(i, 1);
        }
    }
}







module.exports = {
    startUp, 
    setupNewGuild
}