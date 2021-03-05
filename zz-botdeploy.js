
require('dotenv').config();

const Discord = require('discord.js');
const mysql = require('mysql');
const schedule = require('node-schedule');

// Create an instance of a Discord client
const client = new Discord.Client();
const prefix = "!";

let channels = []
let users = []

const db_config = {
    // host: process.env.HOST,
    // user: process.env.SQLUSER,
    // password: process.env.PASSWORD,
    // database: process.env.DATABASE

    host: process.env.HHOST,
    user: process.env.HSQLUSER,
    password: process.env.HPASSWORD,
    database: process.env.HDATABASE
}



client.on('ready', () => {
    setArrays();
    //every morning at 3am wipe dupes -- ' * 3 * * *'
    var j = schedule.scheduleJob('* 3 * * *', function () {
        autoDeleteDupes();
    });
    console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
    logMessage(message.id, message.author.id, message.content, message.channel.id);

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    
    if (command === 'ping') {
        message.channel.send('Pong!');
    }
    //NEW - create new category + audio/text channel
    else if (command === 'new') {
        if (!args.length) {
            return message.channel.send(`You didn't provide a channel name, ${message.author}!`);
        } else {
            newTopic(message, args);
        }
    }
    //DUPE - manually creates audio channel of specified category (DEAL WITH SHORTHAND)
    else if (command === 'dupe') {
        if (!args.length) {
            dupeTopic(message, [message.channel.name]);
        } else {
            dupeTopic(message, args);
        }
    }
    //UPDATE - either creates a brand new category, or swaps channel into existing category
    else if (command === 'update') { 
        if (!args.length) {
            return message.channel.send(`You didn't provide a channel name, ${message.author}!`);
        } else {
            //updateTopic(message, args);
            return message.channel.send(`Updating is not current setup :) Create a new topic instead`);
        }
    }
    //DEL - full deletes category + child channels
    else if (command === 'del')
        if (!args.length) {
            return message.channel.send(`You didn't provide a channel name, ${message.author}!`);
        } else {
            delTopic(message, args);
        }
});

client.on('guildMemberAdd', member => {
    logUser(member.id, member.displayName, 'GUILD_MEMBER_ADD')
});

client.on('guildMemberRemove', member => {
    logUser(member.id, member.displayName, 'GUILD_MEMBER_REMOVE')
});


client.on('channelCreate', channel => {
    //add category channel to categories
    //add channel ids + types to channels
    if( channel.type.localeCompare('voice') === 0 ){
        addChannel(channel.id, channel.name, channel.parentID);
    }
    logChannel(channel.id, channel.parentID, channel.type, channel.name, "CREATE")

    console.log(`New channel`);
});

client.on('channelDelete', channel => {
    //check if full delete or partial delete
    //if partial delete del sub channel id + type from channels
    //if full delete del channel ids + types from channels AND category from categories
    if (channel.type.localeCompare('voice') === 0) {
        removeChannel(channel.id);
    }
    logChannel(channel.id, channel.parentID, channel.type, channel.name, "DELETE") 
    console.log(`Deleted channel: ${channel}`);
});

client.on('channelUpdate', (oldChannel, newChannel) => {
    //update channel id + type + name to topics
    //destroy old channel
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
    // Here I'm storing the IDs of their voice channels, if available
    let oldChannel = oldMember.voiceChannel ? oldMember.voiceChannel.id : null;
    let newChannel = newMember.voiceChannel ? newMember.voiceChannel.id : null;
    
    if (oldChannel == newChannel) return; // If there has been no change, exit

    if (oldChannel != null) {
        // if user has disconnected from old channel
        removeUser(oldMember.id)
        logUser(oldMember.id, oldChannel, 'DISCONNECT')
    }

    if (newChannel != null) {
        // if user has connected to a new channel
        let parent = newMember.voiceChannel.parent.id;
        addUser(newMember.id, newChannel, parent )
        logUser(newMember.id, newChannel, 'CONNECT')
        //check if room is overfilled
        let population = newMember.voiceChannel.members.array().length;
        //console.log(`POPULATION: ${population}`)
        if(population >= 5) {
            if (sufficientlyFilled(parent)){
                autoDupeChannel(newMember);
            }
        }
    }
});

client.on("error", e => {
    console.log(`DISCORD.js error: ${e}`);
});

client.login(process.env.TOKEN);

//MAIN FUNCTIONS ---------------------------------------------------------------------------------

function newTopic(message, args) {
    let channelName = args.join(' '); 
    //check if topic exists 
    if (isDupe(channelName, message)){
        //is dupe - create dupe audio channel in category
        //connect user to it and the proper audio + text channel
        dupeTopic(message, args);
    }
    else {
        // is not dupe - create new category
        message.guild.createChannel(channelName, { type: 'category' }).then(r => {
            // then create new discord audio and text channel in the category
            message.guild.createChannel(channelName, { type: 'text', parent: r.id }).then(
                response => { //successfully created text channel for new topic
                }
            ).catch(e => { console.error(e); });

            message.guild.createChannel(channelName, { type: 'voice', parent: r.id }).then(
                response => {
                    //successfully created audio channel for new topic
                    addChannel(response.id, channelName, r.id);
                    response.createInvite()
                        .then(invite => message.channel.send(`Someone made a new topic! Join the voice channel here: https://discord.gg/${invite.code} \n
                        Make sure to join the text channel too.`))
                        .catch(console.error);
                }
            ).catch(e => { console.error(e); });    
        }).catch(console.error);
    }   
}

//user manually duplicates channel
function dupeTopic(message, args) {
    //create audio channel with same name as current channel
    let channelName = args.join(' '); 
    if(!isDupe(channelName, message)){
        //not a dupe - option to create new channel instead?
        message.channel.send(`${channelName} is not a valid channel to duplicate. Check your spelling or create a new one :)`);

    } else if (channelName.toLowerCase().localeCompare('general') === 0 || 
        channelName.toLowerCase().localeCompare('rules-n-stuff') === 0 ||
        channelName.toLowerCase().localeCompare('welcome') === 0 ){
        message.channel.send(`Can not duplicate SERVER INFO channels. Please !new or !dupe a custom channel`);
    } else {
        let parentID = findParentId(channelName, message);
        message.guild.createChannel(channelName, { type: 'voice', parent: parentID}).then(
            response => {
                //successfully created audio channel for new topic
                // console.log(response);
                response.createInvite()
                    .then(invite => message.channel.send(`Someone created a duplicate channel, join in! https://discord.gg/${invite.code}`))
                    .catch(console.error);
            }
        ).catch(e => { console.error(e); });    
    }  
}

//dupe current channel or overflow
function autoDupeChannel(member){
    //get current channel 
    const topic = member.voiceChannel.name;
    const parentID = member.voiceChannel.parent.id;

    if (topic.toLowerCase().localeCompare('general') === 0) {
        member.send(`Can not duplicate #general channel. Please !new or !duplicate a custom channel`);
    }
    else {
        //something like this
        member.guild.createChannel(topic, { type: 'voice', parent: parentID }).then(
            response => {
                //successfully created audio channel for new topic
                // console.log(response);
                response.createInvite()
                    .then(invite => member.send(`This room is looking a bit crowded, I made a new one :) https://discord.gg/${invite.code}`))
                    .catch(console.error);
            }
        ).catch(e => { console.error(e); });
    }
}

//if a channel has changed topics
function updateTopic(message, args) {
    //check if event already exists
    // if yes, duplicate event
    //if no, change channel name
    //update rooms object
    //notify users + invite
    message.channel.setName("testing")
        .catch(console.error);
    message.channel.send(`Channel name changed to: ${args}`);
}

//auto delete function - 72+ hours if there are messages in the text chat. 12 hours if channel never typed in or expaned.

//delete full topic - mainly for test purposes
function delTopic(message, args) {
    if (message.member.roles.find(role => role.name === "@admin") || message.member.roles.find(role => role.name === "@moderator")){
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
        message.channel.send(`You do not have the permissions to use the !del commands`);
    }
}

// HELPER FUNCTIONS ------------------------------------------------------------------------------

function isDupe(topicName, message){
    let dupe = false;
    message.guild.channels.forEach(channel => {
        if (channel.type === 'category') {
            //for all categories 
            let cName = channel.name
            // console.log(`Channel name: '${channel.name}' topic: '${topicName}'`)
            if (cName.toLowerCase().localeCompare(topicName.toLowerCase()) === 0) {
                dupe = true;
            }
        }
    }); 
    return dupe;
}

function findParentId(topicName, message){
    let id = 0;
    message.guild.channels.forEach(channel => {
        if (channel.type === 'category') {
            if(topicName.toLowerCase().localeCompare(channel.name.toLowerCase()) === 0 ){
                id = channel.id;
            }
        }
    });
    return id;
}

function autoDeleteDupes(){
    console.log(`DELETED DUPES @ ${Date.now()}`);
    let seen = [];
    client.channels.forEach(channel => {
        if (channel.type.localeCompare('voice') === 0) {
            //if voice channel
            if (seen.indexOf(channel.parentID) > -1){
                console.log(channel.members.array.length);
                if (!hasUsers(channel.id)) {
                    console.log('deleting');
                    //if no users in voice channle delete it
                    channel.delete();
                }
            } else {
                console.log(`push: ${channel.parentID}`);
                seen.push(channel.parentID)
            }
        }
    });
}

function setArrays(){
    client.channels.forEach(channel => {
        if (channel.type.localeCompare('voice') === 0) {
            //if voice channel
            addChannel(channel.id, channel.name, channel.parentID);
            channel.members.forEach(member => {
                addUser(member.id, channel.id, channel.parentID);
            })
        }
    });
    console.log(`users: ${users}`)
    console.log(`channels: ${channels}`)
}

function addChannel(channelID, topic, parentID){
    var hasDuplicates = channels.some((channel) => {
        if (channel.id === channelID){
            return true;
        }
    });
    if(!hasDuplicates) {
        channels.push({ id: channelID, topic: topic, parent: parentID });
    }
}

function removeChannel(channelID){
    for (let i=0; i<channels.length; i++){
        if (channels[i].id === channelID){
            channels.splice(i, 1);
        }
    }
}

function addUser(userID, channelID, parentID){
    // add user, remove user
    users.push({id: userID, channel: channelID, parent: parentID});
}

function removeUser(userID) {
    // add user, remove user
    for (let i = 0; i < users.length; i++) {
        if (users[i].id === userID) {
            users.splice(i, 1);
        }
    }
}

// MYSQL _____________________________________________________________________________

function connectSQL() {
    let sqlconnection;
    sqlconnection = mysql.createConnection(db_config);  // Recreate the connection, since the old one cannot be reused.
    sqlconnection.connect((err) => {   // The server is either down
        if (err) {                                  // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(connect, 10000);    // We introduce a delay before attempting to reconnect,
        }
        console.log('connected to db')                                     // to avoid a hot loop, and to allow our node script to
    });                                             // process asynchronous requests in the meantime.
    
    sqlconnection.on('error', function onError(err) {
        console.log('DATABASE ERROR HANDLER connect: ', err);
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {   // Connection to the MySQL server is usually
            connectSQL();                         // lost due to either server restart, or a
        } else {                                        // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });

    return sqlconnection;
}

function disconnectSQL(sqlconnection){
    sqlconnection.end( err => {
        if(err){
            console.log(`DISCONNECT SQL ERROR ${err}`)
        }
    });
    sqlconnection.on('error', function onError(err) {
        console.log('DATABASE ERROR HANDLE DISCONNECT: ', err);
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {   // Connection to the MySQL server is usually
            connectSQL();                         // lost due to either server restart, or a
        } else {                                        // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}


function logChannel(roomID, parentID, type, topic, action) {
    const sql = `INSERT INTO channels (id, parentID, type, topic, action) VALUES ('${roomID}', '${parentID}', '${type}', '${topic}', '${action}')`
    let sqlconnection = connectSQL()
    sqlconnection.query(sql, function (error, results, fields) {
        if(error){
            console.log(`error querying channels ${error}`)
        }; // 'ECONNREFUSED'
        disconnectSQL(sqlconnection);
    }); 
}

function logUser(userID, roomID, action) {
    const sql = `INSERT INTO users (id, roomID, action) VALUES ('${userID}', '${roomID}', '${action}')`
    let sqlconnection = connectSQL()
    sqlconnection.query(sql, function (error, results, fields) {
        if (error) {
            console.log(`error querying users ${error}`)
        }; // 'ECONNREFUSED'
        disconnectSQL(sqlconnection);    
    });
}

function logMessage(messageID, authorID, content, channelID){
    const sql = `INSERT INTO messages (id, authorID, content, channelID) VALUES ('${messageID}', '${authorID}', '${content}', '${channelID}')`
    let sqlconnection = connectSQL()
    sqlconnection.query(sql, function (error, results, fields) {
        if (error) {
            console.log(`error querying channel ${error}`)
        }; // 'ECONNREFUSED'
        disconnectSQL(sqlconnection);
    });
}

function sufficientlyFilled(parentID){
    let totalChannels = 0;
    let totalUsers = 0;

    channels.forEach(chan => {
        if (chan.parent === parentID){
            totalChannels++;
        }
    });
    users.forEach(user => {
        if (user.parent === parentID) {
            totalUsers++;
        }
    });
    let ratio = totalUsers / totalChannels
    if (ratio >= 5){
        console.log(`rooms are sufficiently filled: ${ratio}`)
        return true;
    } else {
        console.log(`rooms are NOT sufficiently filled: ${ratio}`)
        return false;
    }
}

function hasUsers(channelID){
    let hasUsers = false;
    users.forEach(user => {
        console.log(`Userchannel: ${user.channel} | passedID: ${channelID}`)
        if(Number(user.channel) == Number(channelID)){
            console.log('TRUE!')
            hasUsers = true;
        }
    });
    return hasUsers;
}

// on user server connect send them a message with commands


// stats: who is in what room when. 
// WHEN
// user: connect, disconnect, !events, (messages + media uploads)?
// channel: creation, destruction, update 
// WHAT 
// user: userID, timestamp, roomID, action('when')(!events have full command in action field)
// channel: roomID, timestamp, parentID, type, name/ topic, action('when')