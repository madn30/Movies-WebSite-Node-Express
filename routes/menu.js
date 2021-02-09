var express = require('express');
var router = express.Router();
const MoviesHandleBL = require("../BL/MoviesBL")
const UsersBL = require("../BL/UsersBL")
const UsersDAL = require("../DAL/UsersDAL")
var sess;
/* GET home page. */
router.get('/', function (req, res, next) {
  sess = req.session;
  if(sess.Priority=="User"){
  if(sess.transaction<=0){
    res.redirect("/")
  }}
  res.render('menu', { name: req.session.Username, Priority: req.session.Priority });
});
router.get('/Searchformovies', function (req, res, next) {
  res.render('Searchformovies', {});
});


router.post('/GetTheMoviesSearch', async function (req, res, next) {
  let GenersArray = []
  let LenguageArray = []
  sess = req.session;
  if (!Array.isArray(req.body.genres)) {
    GenersArray.push(req.body.genres)
    req.body.genres = GenersArray
  }
  if (!Array.isArray(req.body.language)) {
    LenguageArray.push(req.body.language)
    req.body.language = LenguageArray;
  }
  req.body.genres.sort()
  req.body.language.sort()
  const Searchresp = await MoviesHandleBL.HandleMoviesSearch(req.body)
  const Genersresp = await MoviesHandleBL.HandleMoviesByGeners(req.body)

  let DataShapin = { search: Searchresp, genres: Genersresp }
  if(sess.Priority=="User"){
  sess.transaction-=1
  }
  res.render('searchresults', { DataShapin });


});
router.get('/MovieDataPage', async function (req, res, next) {

  if(sess.Priority=="User"){
  sess = req.session;
  sess .transaction-=1
  }
  let resp = await MoviesHandleBL.ReturnExectDataSelected(req.query.id)
 
  res.render('moviedatapage', { resp });
});
router.get('/Createnewmovie', function (req, res, next) {
  res.render('Createnewmovie', {});

});

router.post('/HandleMovie', async function (req, res, next) {

  let array = []
  sess = req.session;
  let CheckIfLanguageArray = Array.isArray(req.body.genres)
  if (CheckIfLanguageArray == false) {
    array.push(req.body.genres)
    req.body.genres = array
  }
  array = [];
  let CheckIfLanguageGenres = Array.isArray(req.body.language)
  if (CheckIfLanguageGenres == false) {
    array.push(req.body.language)
    req.body.language = array
  }
  req.body.genres.sort()
  req.body.language.sort()
  const resp = await MoviesHandleBL.GetDataService(req.body)
  console.log(sess.Priority);
 
  if (resp == "Created!") {
    if(sess.Priority=="Users"){
    sess.transaction-=1
    }
    res.redirect("/menu")
}
  else {
    res.write("Not success")
  }

});
router.get('/EditUsers', async function (req, res, next) {
  let allusers = await UsersDAL.readfromuserfile()
  let Users = allusers.Users
  res.render('EditUsers', { Users });
});
router.get('/UserDataPage', async function (req, res, next) {

  let Action = req.query.action
  let id = req.query.id

  if (Action == "delete") {
    let response = await UsersBL.DeleteUser(id)
    res.redirect("/menu")
  }

  if (Action == "update") {
    let resp = await UsersBL.GetUserByID(id)
    res.render('UserData', { Action, resp, id });
  }


  if (Action == "new") {
    res.render('UserData', { Action, id });
  }


});
router.post('/UserInfo', async function (req, res, next) {
  let action = req.query.action

  let id = req.query.id
  if (action == "new") {
    let result = await UsersBL.BeforePost(req.body)
  }
  if (action == "update") {
    let resp = await UsersBL.UpdateUser(req.body, id)
  }

  res.redirect("/menu")
});
module.exports = router;
