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
})
const bannedUsers = mongoose.model('banned-user-schema', bannedUserSchema); 
 
const customTopicSchema = mongoose.Schema({
    _id: reqString,
    topicName: reqString,
    createdBy: reqString,
    timestamp: Number,
    inviteLink: reqString
})
const customTopics = mongoose.model('custom-topic-schema', customTopicSchema); 



 module.exports ={
    bannedUsers,
    customTopics
 }  