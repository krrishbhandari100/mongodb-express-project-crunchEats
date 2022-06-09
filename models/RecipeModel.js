const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipeSchema = new Schema({
    title: {type: String, required: true},
    subtitle: {type: String, required: true},
    slug: {type: String, required: true, unique: true},
    recipeBy: {type: String, required: true},
    image: {type: String, default: "https://www.vegrecipesofindia.com/wp-content/uploads/2020/11/pizza-recipe-2-500x375.jpg"},
    content: {type: String, required: true}
})

const Recipe = mongoose.model('Recipes', recipeSchema);
module.exports = Recipe;