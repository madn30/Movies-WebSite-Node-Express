var express = require('express');
var router = express.Router();
const HandleUsers = require("../BL/UsersBL")
const GetTheJsonFile = require("../DAL/UsersDAL")

var sess;
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render("login", {});
});
router.post('/getuserlogin', async function (req, res, next) {
  const resp = await HandleUsers.HandleUser(req.body)
  const data = await GetTheJsonFile.readfromuserfile()
  sess = req.session;
  let Allusers =data.Users
  if(resp!="not signed"){
    if(resp == "Users"){
     let obj = Allusers.find (e=>e.username ==req.body.Username && e.password ==req.body.Password )
     sess.transaction=obj.transaction
    }
  sess.Username = req.body.Username;
  sess.Priority = resp;

  res.redirect(`menu`); }
  else {
    res.redirect("/");
  }
});

module.exports = router;
