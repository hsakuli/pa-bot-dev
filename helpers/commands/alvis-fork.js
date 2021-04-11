// this file is built for things alvis can do
// how do i make atlas only affect PA channels and not fuck with other things on the server


//MAIN FUNCTIONS ---------------------------------------------------------------------------------

//user manually duplicates channel
function forkTopic(message, args) {
    // create audio channel with same name as current channel
    // check if spelling is correct / the topic exists
    // check if a PA channel or on the server
    // only dupe audio channels

    let channelName = args.join(' ');
   
    let parentID = findParentId(channelName, message);
    message.guild.createChannel(channelName, { type: 'voice', parent: parentID }).then(
        response => {
            //successfully created audio channel for new topic
            // console.log(response);
            response.createInvite()
                .then(invite => {
                    message.channel.send(`Someone created a duplicate channel, join in! https://discord.gg/${invite.code}`)
                    //send dupe creation to terminal, send to category chat
                })
                .catch( ee => {console.error(ee)});
        }
    ).catch(e => { console.error(e); });
    
}


//auto fork if overflow of users. overflow # = 20
//this is more of a dream rather than mvp feature
function autoForkTopic(member) {
    //get current channel 
    const topic = member.voiceChannel.name;
    const parentID = member.voiceChannel.parent.id;
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


//HELPER FUNCTIONS -------------------------------------------------------------------------------------------------------

function checkTopic() {
    return true;
}

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