// this file is built for things alvis can do
// how do i make atlas only affect PA channels and not fuck with other things on the server
const {categoryList, serverList} = require('./data/servers.js');


//MAIN FUNCTIONS -------------------------------------------------------------------------------------------------------


//chain promises together, one single catch block at then end. https://stackoverflow.com/questions/34795381/using-same-catch-block-for-multiple-then-methods
function newTopicInCat(message, args) {
    let channelName = args.join(" ");
    //checkForSwears()
    message.guild.channels.create(channelName, { topic: channelName, position: 1, type: 'voice', parent: message.channel.parent }).then(
        response => { //successfully created voice channel for new topic in category
            return response.createInvite()
        }
    ).then(invite => {
        //sends invite link back into cahnnel it was created in
        message.channel.send(`Someone made a new topic! Join the voice channel here: https://discord.gg/${invite.code}.`);
        // also respond in the servers terminal, eventually also in the other category chats
    }).catch(e => { console.error(e); });

    console.log('creating a new channel');
    
}

function newTopicDM(message, args){
    const category = args.shift().toLowerCase();
    //check if category is valid + is server able to make this cat/ topic

}

//HELPER FUNCTIONS -------------------------------------------------------------------------------------------------------

// might use this later for a 'terminal'
function findCatSnowflake( message, catName) {
    // message.guild.id
    if (catName.toLowerCase().localeCompare(channel.name.toLowerCase()) === 0 && channel.type === 'category' ) {
        return channel;
    }

    return false;
}

    

function confirmToCreate(){
    // send question to user, confirm to create (n to cancel. any key to confirm.)
    // read
}

function checkCategory(category) {
    // check if actual category, then check against server's theme    
    if (categoryList.hasOwnProperty(category)) {
        //success - category is in the catList
        //check if server can validly make the category. return true or false

    }
    else {
        console.log('error in alvis.checkCategory - invalid category');
        return false;
    }
}

function checkForSwears(topic){
    //https://github.com/web-mech/badwords
}


module.exports = {
    newTopicInCat
}