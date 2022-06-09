const express = require('express');
const router = express.Router();
const conn = require('../db_connect');
const Recipe = require('../models/RecipeModel');

router.get('/', async (req, res)=>{
    let recipes = await Recipe.find({});
    res.render('recipe', {
        recipes: recipes
    })
})


router.get('/:slug', async (req, res)=>{
    let recipe = await Recipe.findOne({slug: req.params.slug});
    res.render('content', {
        title: recipe.title,
        content: recipe.content
    })
})

module.exports = router