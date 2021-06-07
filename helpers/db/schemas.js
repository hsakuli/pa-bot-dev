//Create mongoose schema objects


const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true
}
const bannedUserSchema = mongoose.Schema({
    _id: reqString,
    name: reqString,
    timestamp: Number,
    guild: reqString
});
const bannedUsers = mongoose.model('banned-user-schema', bannedUserSchema); 
const customChannelSchema = mongoose.Schema({
    _id: reqString,
    topicName: reqString,
    createdBy: reqString,
    timestamp: Number,
    inviteLink: reqString
});
const customChannels = mongoose.model('custom-topic-schema', customChannelSchema); 


 module.exports ={
    bannedUsers,
    customChannels
 }  