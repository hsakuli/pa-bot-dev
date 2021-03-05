
// this file is built for the ALVIS interactive builder functionality (dm)


//MAIN FUNCTIONS ---------------------------------------------------------------------------------

function newTopicChat(message, args) {
    let channelName = args.join(' ');
    //check if topic exists 

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

//user manually duplicates channel
function forkTopicChat(message, args) {
    //create audio channel with same name as current channel
    //check if spelling is correct
    // user must be in audio channel
    let channelName = args.join(' ');
    if (channelName.toLowerCase().localeCompare('general') === 0 ||
        channelName.toLowerCase().localeCompare('rules-n-stuff') === 0 ||
        channelName.toLowerCase().localeCompare('welcome') === 0) {
        message.channel.send(`Can not duplicate SERVER INFO channels. Please !new or !dupe a custom channel`);
    } else {
        let parentID = findParentId(channelName, message);
        message.guild.createChannel(channelName, { type: 'voice', parent: parentID }).then(
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

function helpChat(message, args) {
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

// HELPER FUNCTIONS ------------------------------------------------------------------------------


function findParentId(topicName, message) {
    let id = 0;
    message.guild.channels.forEach(channel => {
        if (channel.type === 'category') {
            if (topicName.toLowerCase().localeCompare(channel.name.toLowerCase()) === 0) {
                id = channel.id;
            }
        }
    });
    return id;
}


module.exports = {
    newTopicChat,
    forkTopicChat,
    helpChat
}