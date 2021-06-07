require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const express = require('express');
const app = express();
const startUp = require("./helpers/routines/startup.js");
const messageHandler = require("./helpers/handlers/message-handler");
const guildMemberHandler = require("./helpers/handlers/guild-member-handler")
const { requestChannelData } = require("./helpers/db/custom-channels")
const { deleteChannelDB } = require("./helpers/db/custom-channels") 


//MAIN FUNCTIONS -------------------------------------------------------------------------------------------------------


//discord js client events
client.once('ready', startUp.startUp);
client.on('message', messageHandler.handleMessage );
client.on('guildMemberAdd', guildMemberHandler.handleNewMember);
client.on('guildBanAdd', guildMemberHandler.banMember); 
client.on('channelDelete', async (channel) => { deleteChannelDB(channel.id); });
client.on("error", e => { console.log(`DISCORD.js error: ${e}`); });
client.login(process.env.TOKEN);


//api endpoint to request channel data
app.get('/pastuff', (req, res) => {
    res.send(requestChannelData());
});


//setup listener
app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`SETUP - express app @ http://localhost:${process.env.EXPRESS_PORT}`)
})