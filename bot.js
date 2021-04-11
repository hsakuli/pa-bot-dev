require('dotenv').config();

const Discord = require('discord.js');

const alvis_responses = require("./helpers/data/embeds.js");
const startUp = require("./helpers/routines/startup.js");

const messageHandler = require("./helpers/handlers/message-handler");
const guildMemberHandler = require("./helpers/handlers/guild-member-handler")
const client = new Discord.Client();

//https://www.npmjs.com/package/wokcommands#custom-dynamic-help-menu

client.once('ready', startUp.startUp);

client.on('message', messageHandler.handleMessage );
client.on('guildMemberAdd', guildMemberHandler.handleNewMember);
client.on('guildBanAdd', guildMemberHandler.banMember);
client.on('guildBanRemove', guildMemberHandler.unbanMember);


client.on("guildCreate", guild => {
    //joined a server
    // on new server join send annoucnement ?? or send announcement when new cats get made 
})

client.on("guildDelete", guild => {
    //removed from a server
    // maybe not necessary - can run a command to delete all alvis data
})

client.on('channelCreate', channel => {
    console.log(`channelCreate Event Listener --> CHANNEL NAME: ${channel.name}`);
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
    //update user counts in the affect channel(s)
});



client.on("error", e => {
    console.log(`DISCORD.js error: ${e}`);
    // dm the user shit has happened
});

client.login(process.env.TOKEN);



