const alvis_create = require("../commands/alvis-create.js");
const alvis_delete = require("../commands/alvis-delete.js");
const alvis_fork = require("../commands/alvis-fork.js");
const alvis_responses = require("../data/embeds.js");
const alvis_setup = require("../commands/alvis-setup");
const { unbanMember } = require("./guild-member-handler")
const prefix = "!";


//MAIN FUNCTIONS -------------------------------------------------------------------------------------------------------


const handleMessage = (message) => {
    {
        if (message.author.bot) return;  //if alvis do nothing
        else if (message.channel.type === 'dm') return; // if dm do nothing 
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
                case 'setup':
                    if (message.member.hasPermission(['MANAGE_GUILD'])) {
                        return alvis_setup.setupNewGuild(message);
                    } else {
                        return message.reply("You need the permission: MANAGE_GUILD to run !setup.")
                    }
                case 'theme':
                    if (message.member.hasPermission(['MANAGE_GUILD'])){
                        return alvis_setup.setupTheme(message);
                    } else {
                        return message.reply("You need the permission: MANAGE_GUILD to run !theme.")
                    }
                case 'unban':
                    if (message.member.id === "430917826694610954"){
                        return unbanMember(message, args)
                    } else {
                        return message.reply(`You need higher permissions to use this command.`)
                    }
                case 'del':
                    if (message.member.hasPermission(['MANAGE_GUILD'])) {
                        return alvis_delete.dailyDelete(message.client);;
                    } else {
                        return message.reply("You need the permissions: MANAGE_GUILD and ADMINISTRATOR to run !del.")
                    }
                case 'devdel':
                    if (message.member.id === "430917826694610954" && message.member.hasPermission(['MANAGE_GUILD'])) {
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