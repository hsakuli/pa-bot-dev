const Discord = require('discord.js');

function createInviteEmbed(inv_link, topic) {
    const inviteEmbed = new Discord.MessageEmbed()
        .setColor('BLURPLE')
        .setTitle(`__NEW TOPIC__`)
        .setDescription(`Join: [**${topic}**](https://discord.gg/${inv_link})`)
        .setThumbnail('https://i.imgur.com/KYVG482.jpeg') //set this to alvis' face
        .setTimestamp()
    return inviteEmbed;
}

const rulesEmbed = new Discord.MessageEmbed()
    .setColor('DARK_NAVY')
    .setTitle('These are the rules')
    .setDescription('Follow them or else')
    .setThumbnail('https://i.imgur.com/KYVG482.jpeg') //set this to alvis' face
    

const helpEmbed = new Discord.MessageEmbed()
    .setColor('DARK_NAVY')
    .setTitle('Some title')
    .setURL('https://discord.js.org/')
    .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
    .setDescription('Some description here')
    .setThumbnail('https://i.imgur.com/KYVG482.jpeg') //set this to alvis' face
    .addFields({
        name: 'Regular field title',
        value: 'Some value here'
    }, {
        name: '\u200B',
        value: '\u200B'
    }, {
        name: 'Inline field title',
        value: 'Some value here',
        inline: true
    }, {
        name: 'Inline field title',
        value: 'Some value here',
        inline: true
    } )
    .addField('Inline field title', 'Some value here', true)
    .setImage('https://i.imgur.com/wSTFkRM.png')
    .setTimestamp()
    .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

const welcomeText = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Welcome to the project: ATLAS')
    .setDescription('INCLUDE: All official project atlas servers. project atlas website. links to rules and info on website')
    .setThumbnail('https://i.imgur.com/KYVG482.jpeg');

//const dailyWipeReadout = new Discord.MessageEmbed()

module.exports = {
    createInviteEmbed,
    helpEmbed,
    welcomeText,
    rulesEmbed
}