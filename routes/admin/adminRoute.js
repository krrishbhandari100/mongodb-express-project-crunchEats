const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const Recipes = require('../../models/RecipeModel');
require("dotenv").config();


router.use(express.urlencoded({extended: true}));
router.use(express.json());
router.use(cookieParser());

router.get('/', (req, res)=>{
    res.render('login')
})

router.post('/', (req, res)=>{
    let { username, password } = req.body;
    if(username == 'admin' && password == 'admin'){
        let token = jwt.sign({username, password}, process.env.JWT_SECRET);
        res.cookie('jwt_user_token', token);
        res.redirect('/admin/dashboard');
    }
    else {
        res.json({message: "Incorrect Username and Password"});
    }
})

router.get('/logout', (req, res)=>{
    res.clearCookie('jwt_user_token');
    res.redirect('/admin');
})

router.get('/dashboard', (req, res)=>{
    if(req.cookies.jwt_user_token){
        jwt.verify(req.cookies.jwt_user_token, process.env.JWT_SECRET, async (err, user)=>{
            if(!err){
                let recipes = await Recipes.find({});
                res.render('dashboard', {user, recipes});
            }
            else {
                res.redirect("/admin");
            }
        })
    }
    else {
        res.redirect("/admin");
    }
})

router.get('/edit/:slug', async (req, res)=>{
    if(req.cookies.jwt_user_token){
        jwt.verify(req.cookies.jwt_user_token, process.env.JWT_SECRET, async (err, user)=>{
            if(!err){
                let recipe = await Recipes.findOne({slug: req.params.slug});
                res.render('edit', { recipe, user });
            }
            else {
                res.redirect("/admin");
            }
        })
    }
    else {
        res.redirect("/admin");
    }
})

router.post('/edit/:slug', async (req, res)=>{
    if(req.cookies.jwt_user_token){
        jwt.verify(req.cookies.jwt_user_token, process.env.JWT_SECRET, async (err, user)=>{
            if(!err){
                let { slug, title, subtitle, content } = req.body;
                
                Recipes.findOneAndUpdate({slug: slug}, {title, subtitle, content}, (err, recipe)=>{
                    if(!err){
                        res.redirect('/admin/dashboard');
                    }
                });
            }
            else {
                res.redirect("/admin");
            }
        })
    }
    else {
        res.redirect("/admin");
    }
})


router.post('/delete', (req, res)=>{
    let { slug } = req.body;
    Recipes.findOneAndDelete({slug}, (err, recipe)=>{
        if(!err){
            res.json({recipe})
        }
        else {
            res.json({message: "Some Error"});
        }
    })
})



router.get('/add', (req, res)=>{
    if(req.cookies.jwt_user_token){
        jwt.verify(req.cookies.jwt_user_token, process.env.JWT_SECRET, async (err, user)=>{
            if(!err){
                res.render('add', { user });
            }
            else {
                res.redirect("/admin");
            }
        })
    }
    else {
        res.redirect("/admin");
    }
})

router.post('/add', (req, res)=>{
    if(req.cookies.jwt_user_token){
        jwt.verify(req.cookies.jwt_user_token, process.env.JWT_SECRET, async (err, user)=>{
            if(!err){
                let { title, subtitle, slug, recipeBy, image, content } = req.body

                let recipe = new Recipes({ title, subtitle, slug, recipeBy, image, content });
                await recipe.save();
                
                // console.log({ title, subtitle, slug, recipeBy, image, content });
                res.redirect("/admin/dashboard");
            }
            else {
                res.redirect("/admin");
            }
        })
    }
    else {
        res.redirect("/admin");
    }
})
module.exports = router