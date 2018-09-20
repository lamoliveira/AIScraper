//Dependencies
const express = require('express'),
  cheerio = require('cheerio'),
  rp = require('request-promise'),
  router = express.Router(),
  db = require('../models');

//route to scrape new articles
router.get("/newArticles/:id", function (req, res) {
  //set variables to scrape any site
  let a = [];
  /* examples [{
     title: 'NYTimes',
     url: 'https://www.nytimes.com/section/us',
     panel: "#latest-panel article.story.theme-summary",
     link: '.story-body>.story-link',
     ref: 'href',
     header: 'h2.headline',
     summary: 'p.summary',
     img: 'img',
     imgattr: "src",
     author: 'p.byline'
   },    {      title: 'Globo',
     url: 'http://www.globo.com',
     panel: "div.hui-premium",
     link: 'a.hui-premium__link',
     ref: 'href',
     header: 'p.hui-premium__title',
     summary: '',
     img: 'a.hui-premium__link',
     imgattr: "data-img",
     author: ''
   }  ];*/
  console.log("scrapenewarticle");
  let id = req.params.id;
  // Grab a specific site configuration to scrape
  db.Configsite
    .findOne({
      _id: req.params.id
    })
    .then(config => {
      console.log("configidscrape" + config._id);
      //configuring options object for request-promise
      const options = {
        uri: config.url,
        transform: function (body) {
          return cheerio.load(body);
        }
      };
      //remove unsaved articles before refresh
      db.Article.remove({
          saved: false
        })
        .then(result => {
          console.log(result); //returning count of deleted

          //calling the database to return all saved articles
          db.Article
            .find({})
            .then((savedArticles) => {
              //creating an array of saved article headlines
              let savedHeadlines = savedArticles.map(article => article.headline);
              //calling request promise with options object
              rp(options)
                .then(function ($) {
                  let newArticleArr = [];
                  //iterating over returned articles, and creating a newArticle object from the data
                  $(config.panel).each((i, element) => {
                    console.log($(element));
                    let newArticle = new db.Article({
                      storyUrl: $(element).find(config.link).attr(config.ref),
                      headline: $(element).find(config.header).text().trim(),
                      summary: $(element).find(config.summary).text().trim(),
                      imgUrl: $(element).find(config.img).attr(config.imgattr),
                      byLine: $(element).find(config.author).text().trim()
                    });
                    //checking to make sure newArticle contains a storyUrl
                    if (newArticle.storyUrl) {
                      //checking if new article matches any saved article, if not add it to array
                      //of new articles
                      if (!savedHeadlines.includes(newArticle.headline)) {
                        newArticleArr.push(newArticle);
                      }
                    }
                  }); //end of each function
                  //adding all new articles to database
                  db.Article
                    .create(newArticleArr)
                    .then(result => res.json({
                      count: newArticleArr.length
                    })) //returning count of new articles to front end
                    .catch(err => {});
                })
                .catch(err => console.log(err)); //end of rp method
            })
            .catch(err => console.log(err))
        })
        .catch(err => {});
    })
    .catch(err => res.json(err));

}); // end of get request to /scrape
module.exports = router;