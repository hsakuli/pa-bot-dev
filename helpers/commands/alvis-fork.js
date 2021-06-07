//MAIN FUNCTIONS ---------------------------------------------------------------------------------


//user manually duplicates voice channel
function forkTopic(message, args) {
    let channelName = args.join(' ');
    let parentID = findParentId(channelName, message);
    message.guild.createChannel(channelName, { type: 'voice', parent: parentID }).then(
        response => {
            response.createInvite()
                .then(invite => {
                    message.channel.send(`Someone created a duplicate channel, join in! https://discord.gg/${invite.code}`)
                })
                .catch( ee => {console.error(ee)});
        }
    ).catch(e => { console.error(e); });
}


//auto fork if overflow of users. overflow # = 20
function autoForkTopic(member) {
    const topic = member.voiceChannel.name;
    const parentID = member.voiceChannel.parent.id;
    member.guild.createChannel(topic, { type: 'voice', parent: parentID }).then(
        response => {
            response.createInvite()
                .then(invite => member.send(`This room is looking a bit crowded, I made a new one :) https://discord.gg/${invite.code}`))
                .catch(console.error);
        }
    ).catch(e => { console.error(e); });
}


//HELPER FUNCTIONS -------------------------------------------------------------------------------------------------------


function findParentId(topicName, message) {
    let id = 0;
    message.guild.channels.forEach(channel => {
        if (channel.type === 'category' && topicName.toLowerCase().localeCompare(channel.name.toLowerCase()) === 0) {
            id = channel.id;
        }
    });
    return id;
}

module.exports = {
    forkTopic, 
    autoForkTopic
}