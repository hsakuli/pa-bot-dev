
// this file is built for things alvis can do
// how do i make atlas only affect PA channels and not fuck with other things on the server

// make alvis post previous topics in a human readable post in the category chat
const {categoryList, serverList} = require('./data/themes.js');
const fs = require('fs');


//MAIN FUNCTIONS ---------------------------------------------------------------------------------

function dailyDelete(client){
    // delete all audio channels that arent the offical category channels.
    //load category data
    const cats = require('./data/');
    client.channels.forEach((channel) => {
        //if (channel.type === 'audio' && !)
        // channel can not be the official cat channels
        //  later must also be PA channels
    });
}


//delete all atlas setup - dream function rather than mvp
function delAtlas() {

}

//delete full topic - mainly for test purposes
function delCat(message, args) {
    if (message.member.roles.find(role => role.name === "Atlas Team") || message.member.roles.find(role => role.name === "Alvis")) {
        let channelName = args.join(' ');
        // if topic exists
        if (channelName.toLowerCase().localeCompare('general') === 0) {
            message.channel.send(`Can not delete #general channel. Please !del a custom channel`);
        } else if (isDupe(channelName, message)) {
            let ids = []
            message.guild.channels.forEach(channel => {
                if (channel.type === 'category') {
                    if (channel.name.toLowerCase().localeCompare(channelName) === 0) {
                        // if the name of the channel is the same as args
                        ids.push(channel.id);
                        channel.delete().catch(console.error);
                    }
                }
            });
            message.guild.channels.forEach(channel => {
                if (ids.includes(channel.parentID)) {
                    channel.delete().catch(console.error);
                }
            });
        }
    } else {
        message.channel.send(`You do not have the permissions to use the !delCat command`);
    }
}

function delTopic(message, args) {
    if (message.member.roles.find(role => role.name === "Atlas Team") || message.member.roles.find(role => role.name === "Alvis")) {
        let channelName = args.join(' ');
        // if topic exists
        if (channelName.toLowerCase().localeCompare('general') === 0) {
            message.channel.send(`Can not delete #general channel. Please !del a custom channel`);
        } else if (isDupe(channelName, message)) {
            let ids = []
            message.guild.channels.forEach(channel => {
                if (channel.type === 'category') {
                    if (channel.name.toLowerCase().localeCompare(channelName) === 0) {
                        // if the name of the channel is the same as args
                        ids.push(channel.id);
                        channel.delete().catch(console.error);
                    }
                }
            });
            message.guild.channels.forEach(channel => {
                if (ids.includes(channel.parentID)) {
                    channel.delete().catch(console.error);
                }
            });
        }
    } else {
        message.channel.send(`You do not have the permissions to use the !del command`);
    }
}

//HELPER FUNCTIONS -------------------------------------------------------------------------------------------------------

function checkTopic() {
    //also double check permissions, make sure its empty
    return true;
}



module.exports = {
    dailyDelete,
    delTopic,
    delAtlas,
    delCat
}