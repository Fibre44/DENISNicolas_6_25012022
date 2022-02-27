const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({

    userId: { type: String, required: true},
    name : { type : String, required : true},
    manufacturer : { type : String, required : true},
    description : {type : String, required : true},
    mainPepper : { type: String, required : true},
    imageUrl : { type : String, required : true},
    heat : {type : String, required : true},
    likes : {type : Number, required : true},
    dislikes : {type : Number, required : true},
    usersLiked : { type : [], required : true},
    usersDisliker : { type : [], required : true}


});

module.exports = mongoose.model('Sauce', sauceSchema);

