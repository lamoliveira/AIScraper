//Dependencies
const express = require('express'),
      router = express.Router(),
      db = require("../models");

//get route to retrieve all configsites
router.get('/getConfigsites', function (req,res){
  db.Configsite
    .find({})
    .then(results => res.json(results))
    .catch(err => res.json(err));
});

//get route to return a single config to view it
router.get('/getSingleConfigsite/:id', function (req,res) {
  db.Configsite
  .findOne({_id: req.params.id})
  .then( result => res.json(result))
  .catch(err => res.json(err));
});

//post route to create a new config in the database
router.post('/createConfigsite', function (req,res){
  let { 
    id, title, url, panel, link, ref, header, summary, img, imgattr, author} = req.body;
  let public = false;  
  let configsite = {
    title, url, panel, link, ref, header, summary, img, imgattr, author,public
  };
  db.Configsite
    .create(configsite)
    .then(result => res.json(result))
    .catch(err => res.json(err));
});

router.post('/updateConfigsite', function (req,res){
  let { 
    _id,title, url, panel, link, ref, header, summary, img, imgattr, author} = req.body;
  let configsite = {
    title, url, panel, link, ref, header, summary, img, imgattr, author
  };
  let updateid = {_id: req.body._id, public:false};
  console.log("id: " + req.body._id );
  db.Configsite
    .updateOne( updateid, configsite)
    .then(result => res.json(result))
    .catch(err => res.json(err));
});

//post route to delete a config
router.post('/deleteConfigsite', (req,res)=>{
  let id = req.body.id;
  db.Configsite
    .deleteMany({_id: id, public:false})
    .then(result => res.json(result))
    .catch(err => res.json(err));
});


module.exports = router;
