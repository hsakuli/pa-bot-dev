require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

const alvis_responses = require("./helpers/data/embeds.js");
const startUp = require("./helpers/routines/startup.js");
const messageHandler = require("./helpers/handlers/message-handler");
const guildMemberHandler = require("./helpers/handlers/guild-member-handler")

const { deleteChannelDB } = require("./helpers/db/custom-channels") 

// DELETE HELPER -- fix later
const { connectDB } = require('./helpers/db/mongo');
const { customChannels } = require('./helpers/db/schemas');


//https://www.npmjs.com/package/wokcommands#custom-dynamic-help-menu

client.once('ready', startUp.startUp);

client.on('message', messageHandler.handleMessage );
client.on('guildMemberAdd', guildMemberHandler.handleNewMember);

//change the way this works later. fires every guildbanmember event (aka # of servers)
client.on('guildBanAdd', guildMemberHandler.banMember);
// client.on('guildBanRemove', guildMemberHandler.unbanMember);


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

client.on('channelDelete', async (channel) => {
    deleteChannelDB(channel.id);
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
    //update user counts in the affect channel(s)
});



client.on("error", e => {
    console.log(`DISCORD.js error: ${e}`);
    // dm the user shit has happened
});

client.login(process.env.TOKEN);



