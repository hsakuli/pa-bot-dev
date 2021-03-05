require('dotenv').config();

const Discord = require('discord.js');
const schedule = require('node-schedule');

const alvis_create = require("./helpers/alvis-create.js");
const alvis_delete = require("./helpers/alvis-delete.js");
const alvis_fork = require("./helpers/alvis-fork.js");
const alvis_responses = require("./helpers/data/embeds.js");
const routines = require("./helpers/routines.js");

// Create an instance of a Discord client
const client = new Discord.Client();
const prefix = "!";



client.on('ready', () => {
    // // might change to 2-5 minute range depending on how much usage
    // schedule.scheduleJob('42 * * * * *', () => {
    //     // i think client.channels is protected with those fkin gateways
    //     routines.updateData(client.channels); 
    // });

    // schedule.scheduleJob('0 23 * * *', () => {
    //     // i think client.channels is protected with those fkin gateways
    //     console.log('Alvis has started his dump');

    //     routines.dumpData();
    //     // alvis_delete.dailyDelete(client);
    //     console.log('Alvis has completed his dump');
    // });
    console.log('I have setup!');
});

// Create an event listener for messages
client.on('message', message => {
    //if alvis do nothing
    if (message.author.bot) return;

    // if is alvis dm -- enter alvis dm mode
    // && message.channel.recipients (check if alvis is being dm ) -- does this only fire when alvis is dm or all dm?
    else if(message.channel.type === 'dm' ){
        //enter alvis help mode
    }
        
    // else if a !command || written in the terminal
    else if (message.content.startsWith(prefix) || message.channel.name === 'terminal'){

        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        // check validity of command with alvis.checkCommandValidity()
        console.log(`CMD: ${command} |||| ARGS: ${args}`);

        switch(command){
            case 'ping':
                return message.channel.send('Pong!');
                // return message.channel.send(alvis_responses.exampleEmbed);
            case 'new':
                //NEW - create new topic within a category
                if (args.length === 0) {
                    //send dm from alvis to user and bring them through the long process
                    return message.channel.send(`Looks like you didn't provide me with enough info to create a new topic. (!new topic name)`);
                } else {                
                    return alvis_create.newTopicInCat(message, args);
                }

            case 'fork':
                //FORK - manually creates duplicate audio channel of specified topic
                if (!args.length) {
                    //fork user's current voice channel
                    alvis_fork.forkTopic(message, [message.channel.name]);
                    return message.channel.send(`Topic ${args} has been forked, enjoy your new room`);
                } else {
                    //fork selected voice channel
                    alvis_fork.forkTopic(message, args);
                    return message.channel.send(`Topic ${args} has been forked, enjoy your new room`);
                }

            case 'setup':
                //SETUP - setups the categories based off of the servers themes
                //check permissions
                //proper warnings that this will erase all previous setup/ text chats/ create duplicates
            
                return message.channel.send(`Server has been setup based off of these theme settings: ____
                    if they are wrong please contact your PA dev contact`);
            

            case 'help':
                return message.channel.send(alvis_responses.helpText);

            default:
                return message.channel.send(`${message.author} it seems like you wrote the wrong command. Try again or ask for some !help.`);

        }
    }
});


client.on('guildMemberAdd', member => {
    console.log(`New user has joined ${member.name}`);
    member.send(alvis_responses.welcomeText);
    // dm the user from alvis
    // i can log that a new user has joined
});

client.on('channelCreate', channel => {
    
    if( channel.type.localeCompare('voice') === 0 ){
        //write in terminal and category chat that a new channel has been created
    }
    // only auto created channels
    console.log(`New channel: ${channel.name}`);
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
    //update user counts in the affect channel(s)
});

client.on('guildBanAdd', member => {
    // add member to global ban list
    console.log(`User banned: ${member.name}`);
});

client.on('guildBanRemove', member => {
    // remove member to global ban list
    console.log(`User unbanned: ${member.name}`);
});

client.on("error", e => {
    console.log(`DISCORD.js error: ${e}`);
    // dm the user shit has happened
});

client.login(process.env.TOKEN);



