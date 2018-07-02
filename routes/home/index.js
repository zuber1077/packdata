const express = require('express');
const bcrypt = require("bcryptjs");
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');

router.all('/*', (req, res, next)=>{ 
    req.app.locals.layout = 'home';
    next();
});

router.get('/', (req,res)=>{

    const perPage = 6;
    const page = req.query.page || 1;

    // render All Post on Home
    Post.find({})
    
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .then(posts=>{

        Post.count().then(postCount=>{

            Category.find({}).then(categories=>{
            res.render('home/index', {
                posts: posts, 
                categories: categories,
                current: parseInt(page),
                pages: Math.ceil(postCount / perPage)
            });
        });
    });

  });
});

// routes for pack data

router.get('/companyProfile', (req,res)=>{

    const perPage = 5;
    const page = req.query.page || 1;

    Post.find({})

    .skip((perPage * page) - perPage)
    .limit(perPage)
    .sort({date: 'desc'})
    .then(posts=>{

         Post.count().then(postCount=>{
             Category.find({}).then(categories=>{
                 res.render('home/companyProfile', {
                     posts: posts, 
                     categories: categories,
                     current: parseInt(page),
                     pages: Math.ceil(postCount / perPage)
                });
            });
         });

    }).catch(error=>console.log(error));

    
});


router.get('/companyProfile2/:id', (req,res)=>{
    Post.findOne({_id: req.params.id}).then(post =>{
        Post.find({}).then(posts => {

        Category.find({}).then(categories=>{
            res.render("home/companyProfile2", { post: post, categories: categories, posts: posts, categories: categories});
         });
        });   
    });
});

router.get('/PDataDesensitization', (req,res)=>{
    res.render('home/PDataDesensitization');
});
router.get('/Solution', (req,res)=>{
    res.render('home/Solution');
});
router.get('/successCase', (req,res)=>{
    res.render('home/successCase');
});
router.get('/contactus', (req,res)=>{
    res.render('home/contactus');
});
router.get('/News/:id', (req,res)=>{

    Post.findOne({_id: req.params.id}).then(post =>{
        Post.find({}).then(posts => {

        Category.find({}).then(categories=>{
            res.render("home/News", { post: post, categories: categories, posts: posts, categories: categories});
        });
        });   
    });
});


router.get('/about', (req,res)=>{
    res.render('home/about');
});

router.get('/post/:id', (req,res)=>{
    Post.findOne({_id: req.params.id}).then(post =>{

        Category.find({}).then(categories=>{
            res.render("home/post", {post: post, categories: categories});
        });   
    });
    
});

module.exports = router;