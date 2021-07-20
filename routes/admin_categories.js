var express = require('express');
var router = express.Router();
var Category = require('../models/category');
var auth=require('../config/auth');
var isAdmin=auth.isAdmin;
// GET Pages Index
router.get('/', function (req, res) {
  //res.send('Category AREA');
  Category.find(function(err,categories){
       if(err)
       return console.log(err);

       res.render('admin/categories',{
         categories:categories,

       });
  });
});

// GET ADD CATEGORY
router.get('/add-category',isAdmin, function (req, res) {
  var title = "";
  res.render('admin/add_category', {
    title: title
  });
});

//POST ADD CATEGORY
router.post('/add-category', function (req, res) {

  req.checkBody('title', 'Title must have a value.').notEmpty();

  var title = req.body.title;
  var slug = title.replace(/\s+/g, '-').toLowerCase();

  var errors = req.validationErrors();

  if (errors) {
    console.log('errors');
    res.render('admin/add_category', {
      errors: errors,
      title: title,
      slug: slug,
    });
  }
  else {
    //console.log('Success');
    Category.findOne({ slug: slug }, function (err, category) {
      if (category) {
        req.flash('danger', 'Category title exists,choose another.');

        res.render('admin/add_category', {
          title: title,
        });
      }
      else {
        var category = new Category ({
          title: title,
          slug: slug
        });
        category.save(function (err) {
          if (err) {
            return console.log(err);
          }
          Category.find(function (err, categories) {
            if(err)
            {
              console.log(err);
            }
            else
            {
              req.app.locals.categories=categories;
            }
          });
          req.flash('success', 'Category added succefully');
          res.redirect('/admin/categories');
        });
      }
    });
  }
});
// GET EDIT CATEGORY
router.get('/edit-category/:id',isAdmin, function (req, res) {
    Category.findById (req.params.id, function (err, category) {
    if (err)
      return console.log(err);
    else
      res.render('admin/edit_category', {
        title: category.title,
        id: category._id
      });
  });

});

//POST EDIT CATEGORY
router.post('/edit-category/:id', function (req, res) {

  req.checkBody('title', 'Title must have a value.').notEmpty();
  var title = req.body.title;
  var slug = title.replace(/\s+/g, '-').toLowerCase();

  var id = req.params.id;
  var errors = req.validationErrors();
  if (errors) {
    console.log('errors');
    res.render('admin/edit_category', {
      errors: errors,
      title: title,
      id: id
    });
  }
  else {
    //console.log('Success');
    Category.findOne({ slug: slug,  _id: { '$ne': id } }, function (err, category) {
      if (category) {
        req.flash('danger', 'Category title exists,choose another.');

        res.render('admin/edit_category', {
          title: title,
          id: id
        });
      }
      else {
        Category.findById(id, function (err, category) {
          if (err)
            return console.log(err);

          category.title = title;
          category.slug = slug;

          category.save(function (err) {
            if (err) {
              return console.log(err);
            }
            Category.find(function (err, categories) {
              if(err)
              {
                console.log(err);
              }
              else
              {
                req.app.locals.categories=categories;
              }
            });
            req.flash('success', 'Category edited succefully');
            res.redirect('/admin/categories/edit-category/'+id );
          });
        });
      }
    });
  }
});

//GET DELETE CATEGORY
router.get('/delete-category/:id',isAdmin, function (req, res) {
        Category .findByIdAndRemove(req.params.id,function(err){
                if(err)
                return console.log(err);
                Category.find(function (err, categories) {
                  if(err)
                  {
                    console.log(err);
                  }
                  else
                  {
                    req.app.locals.categories=categories;
                  }
                }); 
                req.flash('success','Page deleted!');
                res.redirect('/admin/categories/');
  });
});
//Exports
module.exports = router;