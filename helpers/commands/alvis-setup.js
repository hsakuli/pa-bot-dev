const Discord = require('discord.js');
const fs = require('fs');
const path = require("path");
const { rulesEmbed } = require("../data/embeds")
const { setBannedUsers } = require('../db/bans')


//MAIN FUNCTIONS -------------------------------------------------------------------------------------------------------


//shows themes list, collects response, creates static channels, inits theme, sets banned users, message response
function setupNewGuild(message) {
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
                const themeName = themes[number];
                initStaticChannels(message);
                initTheme(message, themeName);
                setBannedUsers(message);
                message.channel.send(`Setting up your server with theme: ${themeName}`)
            } else {
                message.channel.send(`\"${number}\" is not a valid option. Please try the !setup command again`)
            }

        } else {
            message.channel.send(`\"${m.content}\"is not a valid number. Please try the !setup command again`)
        }
    });
}


//show themes, collects response, init theme, message response
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
                const themeName = themes[number];
                initTheme(message, themeName);
                message.channel.send(`Setting up your server with theme: ${themeName}`)
            } else {
                message.channel.send(`\"${number}\" is not a valid option. Please try the !setup command again`)
            }

        } else {
            message.channel.send(`\"${m.content}\"is not a valid number. Please try the !setup command again`)
        }
    });
}   


//create private channels
function initStaticChannels(message) {
    let catID= "";
    message.guild.channels.create("project:ATLAS", { type: "category", position: '42069' })
    .then(response => {
        catID = response.id
        return message.guild.channels.create("project-atlas", { type: "text", position: '42069', parent: catID })
    }).then(_ => {
        return message.guild.channels.create("pa-rules-n-stuff", { type: "text", position: '42069', parent: catID })
    }).then(response => {
        return response.send("RULES AND STUFF", { embed: rulesEmbed, split: true})
    }).then(_ => {
        return message.guild.channels.create("pa-announcements", { type: "text", position: '42069', parent: catID })
    }).then(_ => {
        return message.guild.channels.create("pa-mod-comms", { type: "text", position: '42069', parent: catID})
    }).then(_ => {
        return message.reply("Add the appropriate permissions to the pa-mod-comms channel.\nTo finish the configuration follow the corresponding channels in your server.\nLINK 1\nLINK2", { split: true })
    }).then(_ => {
        return message.guild.channels.create("Custom Topics -----------------", { type: "category", position: '43000' })
    }).catch(e => { 
        console.log(`ERROR creating static channels :: ${e}`);
    });
}


//initialize a selected theme on a server
function initTheme(message, themeName){
    try {
        const themesJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/pa_themes.json")));
        const catArray = themesJSON[themeName];
        catArray.forEach(cat => {
            message.guild.channels.create(cat, { type: 'category', position: '69420', reason: 'PA_CHANNEL_SETUP' })
                .then((response) => {
                    response.clone({ type: 'text', parent: response.id, position: '69420', reason: 'PA_CHANNEL_SETUP' })
                });
        });
    } catch (e) {
        console.log(`ERROR in reading setup files :: ${e}`);
    }
}


//HELPER FUNCTIONS -------------------------------------------------------------------------------------------------------


//create readable list from pa_themes.json data
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