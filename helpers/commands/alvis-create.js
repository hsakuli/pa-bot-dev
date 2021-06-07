const { createInviteEmbed } = require('../data/embeds');
const { commandTimeoutCache, categoriesCache } = require('../routines/caches');
const { createChannelDB } = require('../db/custom-channels')
const Filter = require('bad-words');
const bad_words = require('../data/bad_words.json');
const filter = new Filter({ list: bad_words.words });


//MAIN FUNCTIONS -------------------------------------------------------------------------------------------------------


//checks message to see if its valid, creates the channel, creates invite, stores info to db
async function newTopicInCat(message, args) {
    const channelName = args.join(" ");
    const author = message.author.username;
    const parentCategory = message.channel.parent;

    try{ 
        let checked = await masterChecker(message, channelName);
        if(checked){
            let messageauthorid = message.author.id ;
            message.guild.channels.create(channelName, { topic: channelName, position: 1, type: 'voice', parent: parentCategory, reason: "PA_CUSTOM_TOPIC_FLAG" }).then(
                channel => {  
                    return channel.createInvite()
                }
            ).then(invite => {
                storeIdForDeletion(invite, message, channelName);
                return message.channel.send(createInviteEmbed(invite.code, channelName, author));
            }).then(message => {
                return commandTimeoutCache.set(messageauthorid, message.createdAt, 90000); //sets for 90s {userID, timestamp}
            }).catch(e => { 
                message.reply("Sorry there was an error somewhere in creating your custom topic. Please contact the administrators if this continues")
                console.error(`ERROR: ${e}\n---> create channel, create invite, set commandTimeoutCache`); 
            });
        } else {
            console.log('did not pass master checker');
        }
    }
    catch (e) {
        console.log(`Did not pass the try catch: ${e}`);
    }
}


//HELPER FUNCTIONS -------------------------------------------------------------------------------------------------------


//checks if the message was sent in a category channel, checks for profanity, checks for command spam
async function masterChecker(message, channelName) {
    try{
        let parentCat = await categoriesCache.get(message.channel.parent.name);
        if (parentCat === undefined) {
            message.reply(`You can only use this command in a project:ATLAS category channel`)
            return false;
        }
    } catch (e) {
        console.log(`ERROR: ${e} == attempting to retrieve item from categoriesCache`);
        return false;
    }
    if (filter.isProfane(channelName)) { 
        message.channel.send(`You tried to create a new topic with a no-no word. You have n/3 strikes.\nHere is a list of all the bad words: https://github.com/web-mech/badwords/blob/master/lib/lang.json`)
        .then(console.log('baddie message sent'))
        .catch(console.error);
        return false;
    } 
    try {
        let result = await commandTimeoutCache.get(message.author.id);
        if (result === undefined) {
            return await confirmToCreate()
        } else {
            message.reply(`You're creating too many channels hold your horses. Try again in 90 seconds`)
            return false;
        }
    } catch (e) {
        console.log(`MASTER CHECKER FAILURE: ${e}\n--PROMISE REJECTED`);
    }
}  


//stores the channel data in DB. previously: stored data in cache 
async function storeIdForDeletion(invite, message, channelName) { 
    try {
        await createChannelDB(invite, message, channelName);
    } catch (e) {
        console.log(`ERROR - storeIdForDeletion: ${e}`);
    }
}


//intent: send question to user, confirm to create (n to cancel. any key to confirm.)
function confirmToCreate(){
    return true;
}


module.exports = {
    newTopicInCat
}