const Discord = require('discord.js');
const fs = require('fs');
const path = require("path");
const {rulesEmbed} = require("../data/embeds")

//MAIN FUNCTIONS ---------------------------------------------------------------------------------


function setupNewGuild(message) {
    // add guild + cats + channels to objects
    const filter = (m) => { return m.author.id === message.author.id };
    const collector = new Discord.MessageCollector(message.channel, filter, { max: 1, time: 1000 * 120 })
    const themelist = displayThemes();
    message.channel.send(`PROJECT ATLAS NEW SERVER SETUP\nPress the corresponding number + enter to activate theme\nTHEME LIST:${themelist}`).catch((e) => {
        console.log(`ERROR -- can not send reply :: ${e}`);
    });

    collector.on('collect', (m) => {
        if (!isNaN(m.content)) {
            let number = Number(m.content)
            const themes = themelist.split(/\n[0-9]+:- /);
            if (number > 0 && number < themes.length) {
                console.log(`THEMES SPLIT: ${themes}`)
                const themeName = themes[number];
                console.log(`Theme name: ${themeName}`);
                initStaticChannels(message)
                // initTheme(message, themeName)
                message.channel.send(`Setting up your server with theme: ${themeName}`)
            } else {
                message.channel.send(`\"${number}\" is not a valid option. Please try the !setup command again`)
            }

        } else {
            message.channel.send(`\"${m.content}\"is not a valid number. Please try the !setup command again`)
        }
    });
}

function setupTheme(message){
    const filter = (m) => { return m.author.id === message.author.id };
    const collector = new Discord.MessageCollector(message.channel, filter, { max: 1, time: 1000 * 120 })
    const themelist = displayThemes();
    message.channel.send(`PROJECT ATLAS THEME SETUP\nPress the corresponding number + enter to activate theme\nTHEME LIST:${themelist}`).catch((e) => {
        console.log(`ERROR -- can not send reply :: ${e}`);
    });

    collector.on('collect', (m) => {
        if (!isNaN(m.content)) {
            let number = Number(m.content)
            const themes = themelist.split(/\n[0-9]+:- /);
            if (number > 0 && number < themes.length) {
                console.log(`THEMES SPLIT: ${themes}`)
                const themeName = themes[number];
                console.log(`Theme name: ${themeName}`);
                initStaticChannels(message)
                message.channel.send(`Setting up your server with theme: ${themeName}`)
            } else {
                message.channel.send(`\"${number}\" is not a valid option. Please try the !setup command again`)
            }

        } else {
            message.channel.send(`\"${m.content}\"is not a valid number. Please try the !setup command again`)
        }
    });
}   

//how the f do i add private chanells
function initStaticChannels(message) {
    let catID= "";

    // const everyoneRole = message.guild.roles.find('name', '@everyone');

    message.guild.channels.create("project:ATLAS", { type: "category", position: '42069' })
    .then(response => {
        catID = response.id
        return message.guild.channels.create("PROJECT-ATLAS", { type: "text", position: '42069', parent: catID })
        
    }).then( _ => {
        return message.guild.channels.create("rules-n-stuff", { type: "text", position: '42069', parent: catID })
    }).then(response => {
        return response.send("RULES AND STUFF", { embed: rulesEmbed, split: true})
    }).then(_ => {
        return message.guild.channels.create("pa-announcements", { type: "text", position: '42069', parent: catID })
    }).then(_ => {
        return message.guild.channels.create("pa-mod-only", { type: "text", position: '42069', parent: catID})
    }).then(response => {
        return response.send("Make this a private channel, with whatever permissions are applicable.\nTo finish the configuration follow the corresponding channels in your server.\nLINK 1\nLINK2", { split: true })
    })
    // .then(response => {
    //     //this shit is fucked
    //     return response.overwritePermissions(everyoneRole, { VIEW_CHANNEL: false });
    // })
    .catch(e => { console.log(`ERROR: creating channel :: ${e}`); })
    message.guild.channels.create("Custom Topics -----------------", { type: "category", position: '43000' }).catch(e => { console.log(`ERROR: creating channel :: ${e}`); })

}

function initTheme(message, themeName){
    try {
        const themesJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/pa_themes.json")));
        const catArray = themesJSON[themeName];
        catArray.forEach(cat => {
            //create category
            message.guild.channels.create(cat, { type: 'category', position: '69420', reason: 'PA_CHANNEL_SETUP' })
                .then((response) => {
                    //create text chanel
                    response.clone({ type: 'text', parent: response.id, position: '69420', reason: 'PA_CHANNEL_SETUP' })
                });

        });
    } catch (e) {
        console.log(`ERROR in reading setup files :: ${e}`);
    }
}

function displayThemes() {
    let response = "";
    let iterator = 1;
    try {
        const themesJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/pa_themes.json")));
        for (let theme in themesJSON) {
            response += `\n${iterator}:- ${theme}`;
            iterator++;
        }
        return response;
    } catch (e) {
        console.log(`ERROR in reading setup files :: ${e}`);
    }
}

module.exports = {
    setupNewGuild,
    setupTheme
}