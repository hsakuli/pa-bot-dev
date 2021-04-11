// this file is built for things alvis can do
// how do i make atlas only affect PA channels and not fuck with other things on the server
const { createInviteEmbed } = require('../data/embeds');
const { topicsCache, commandTimeoutCache, categoriesCache } = require('../routines/caches');
const Filter = require('bad-words');
const bad_words = require('../data/bad_words.json');
const filter = new Filter({ list: bad_words.words });


//MAIN FUNCTIONS -------------------------------------------------------------------------------------------------------


//chain promises together, one single catch block at then end. https://stackoverflow.com/questions/34795381/using-same-catch-block-for-multiple-then-methods
// add the topic to cache and write it to db
async function newTopicInCat(message, args) {
    const channelName = args.join(" ");
    const parentCategory = message.channel.parent;

    try{ 
        let checked = await masterChecker(message, channelName);
        if(checked){
            let messageauthorid = message.author.id ;
            message.guild.channels.create(channelName, { topic: channelName, position: 1, type: 'voice', parent: parentCategory, reason: "PA_CUSTOM_TOPIC_FLAG" }).then(
                response => { //successfully created voice channel for new topic in category
                    storeIdForDeletion(response);
                    return response.createInvite()
                }
            ).then(invite => {
                //sends invite link back into cahnnel it was created in
                // message.channel.send(`Someone made a new topic! Join the voice channel here: https://discord.gg/${invite.code}.`);
                return message.channel.send(createInviteEmbed(invite.code, channelName));
                // also respond in the servers terminal, eventually also in the other category chats
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


async function masterChecker(message, channelName) {
    // later -- check if correct category (must be under approved category_channel_id in servers data)
    try{
        let parentCat = await categoriesCache.get(message.channel.parent.name);
        console.log(`${parentCat} is the theme`);
        if (parentCat === undefined) {
            message.reply(`You can only use this command in a project:ATLAS category channel`)
            return false;
        }
    } catch (e) {
        console.log(`ERROR: ${e} == attempting to retrieve item from categoriesCache`);
        return false;
    }

    if (filter.isProfane(channelName)) {
        //https://github.com/web-mech/badwords
        // add points to ban list
        
        message.channel.send(`You tried to create a new topic with a no-no word. You have n/3 strikes.\nHere is a list of all the bad words: https://github.com/web-mech/badwords/blob/master/lib/lang.json`)
        .then(console.log('baddie message sent'))
        .catch(console.error);
        return false;
    } 
    try {
        // https://npm.io/package/discord-anti-spam
        // https://top.gg/bot/356831787445387285 - giselle bot anti raid
        let result = await commandTimeoutCache.get(message.author.id);
        if (result === undefined) {
            return await confirmToCreate()
        } else {
            message.reply(`You're creating too many channels hold your horses. Try again in 90seconds`)
            return false;
        }
    } catch (e) {
        console.log(`MASTER CHECKER FAILURE: ${e}\n--PROMISE REJECTED`);
    }
}  

async function storeIdForDeletion(channel) {
    //store the (id: {topic, {data}) in a db or filesystem
    //probably an async function

    //---- ~ WRITE TO DB BOIS ~ -----

    try {
        await topicsCache.set(channel, Date.now())
    } catch (e) {
        console.log(`ERROR: ${e}`);
    }
}


function confirmToCreate(){
    // send question to user, confirm to create (n to cancel. any key to confirm.)
    // read
    return true;
}



// might use this later for a 'terminal'
function findCatSnowflake(message, catName) {
    // message.guild.id
    // wrong
    if (catName.toLowerCase().localeCompare(channel.name.toLowerCase()) === 0 && channel.type === 'category') {
        return channel;
    }

    return false;
}



function addToTopicsCache(channelID, topic, parentID) {
    var hasDuplicates = channels.some((channel) => {
        if (channel.id === channelID) {
            return true;
        }
    });
    if (!hasDuplicates) {
        channels.push({
            id: channelID,
            topic: topic,
            parent: parentID
        });
    }
}



module.exports = {
    newTopicInCat
}