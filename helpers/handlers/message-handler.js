const alvis_create = require("../commands/alvis-create.js");
const alvis_delete = require("../commands/alvis-delete.js");
const alvis_fork = require("../commands/alvis-fork.js");
const alvis_responses = require("../data/embeds.js");
const alvis_setup = require("../commands/alvis-setup");
const prefix = "!";

const handleMessage = (message) => {
    {
        if (message.author.bot) return;  //if alvis do nothing

        // if is alvis dm -- enter alvis dm mode
        else if (message.channel.type === 'dm') {   //enter alvis help mode
            //  message.channel.recipient  || message.channel.client (check if alvis is being dm'd ) 
            return;
        }

        // else if a !command 
        else if (message.content.startsWith(prefix)) {
            const args = message.content.slice(prefix.length).split(/ +/);
            const command = args.shift().toLowerCase();

            switch (command) {
                case 'marco':
                    return message.channel.send('polo');
                case 'new':
                    if (args.length === 0) {
                        return message.channel.send(`Looks like you didn't provide me with enough info to create a new topic. (!new topic_name)`);
                    } else {
                        return alvis_create.newTopicInCat(message, args);
                    }

                // case 'fork':
                //     //FORK - manually creates duplicate audio channel of specified topic
                //     if (!args.length) {
                //         //fork user's current voice channel
                //         alvis_fork.forkTopic(message, [message.channel.name]);
                //         return message.channel.send(`Topic ${args} has been forked, enjoy your new room`);
                //     } else {
                //         //fork selected voice channel
                //         alvis_fork.forkTopic(message, args);
                //         return message.channel.send(`Topic ${args} has been forked, enjoy your new room`);
                //     }
                
                case 'setup':
                    if (message.member.hasPermission(['MANAGE_GUILD', 'ADMINISTRATOR'])) {
                        return alvis_setup.setupNewGuild(message);
                    } else {
                        return message.reply("You need the permissions: MANAGE_GUILD and ADMINISTRATOR to run !setup.")
                    }

                case 'theme':
                    if (message.member.hasPermission(['MANAGE_GUILD', 'ADMINISTRATOR'])){
                        return alvis_setup.setupTheme(message);
                    } else {
                        return message.reply("You need the permissions: MANAGE_GUILD and ADMINISTRATOR to run !theme.")
                    }

                // DELETE THIS COMMAND AFTER DONE TESTING IT
                case 'del':
                    console.log('DAILY DELETE EVENT');
                    if (message.member.hasPermission(['MANAGE_GUILD', 'ADMINISTRATOR'])) {
                        return alvis_delete.dailyDelete(message.client);;
                    } else {
                        return message.reply("You need the permissions: MANAGE_GUILD and ADMINISTRATOR to run !del.")
                    }

                // DELETE THIS COMMAND AFTER DONE TESTING IT
                case 'devdel':
                    console.log('DEV DEL');
                    if (message.member.hasPermission(['MANAGE_GUILD', 'ADMINISTRATOR'])) {
                        return alvis_delete.devDelete(message);
                    } else {
                        return message.reply("You need the permissions: MANAGE_GUILD and ADMINISTRATOR to run !devdel.")
                    }

                case 'help':
                    return message.channel.send(alvis_responses.helpEmbed);

                default:
                    return message.channel.send(`${message.author} it seems like you wrote the wrong command. Try again or ask for some !help.`);

            }
        }
    }
}


module.exports = {
    handleMessage
}