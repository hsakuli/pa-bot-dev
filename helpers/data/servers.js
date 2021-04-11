// server # is probably the guild id
// store other server data in here? administraor names/ info, special 
// --maybe reference themes from the theme list above?
let serverlist2 = {
    "server 1 id": {
        "name": "maybe not necessary",
        "themes": ["theme 1, theme 2"],
        "cat name 1":{
            "id": "cat_id_1",
            "topics": {
                "topic 1 id": "topic 1 name",
                "topic 2 id": "topic 2 name",
                "topic 3 id": "topic 3 name"
            }
        },
        "cat 2 name":{
            "name" : "cat 2 name",
            "topic" : {
                "topic 4 id": "topic 4 name",
                "topic 5 id": "topic 5 name"
            }
        }
    }
}



//this list is for wiping dupes - sending data to servers is a different list?
// i need: guild_id, cat_names, cat_ids, 
//checking if audio channel is inside PA or outside - channel.parent_id === cat_id
let serverList = {
    "server 1": {
        "themes": ["theme 1, theme 2"],
        "cat_id_1": "cat 1 name",
        "cat_id_2": "cat 2 name"
    },
    "server 2": {
        "themes": ["theme 3", "theme 2"],
        "cat_id_3": "cat 3 name",
        "cat_id_4": "cat 2 name"
    },
    "server 3": {
        "themes": ["theme 4"],
        "cat_id_5": "cat 4 name"
    }
}

module.exports = {
    serverList
}