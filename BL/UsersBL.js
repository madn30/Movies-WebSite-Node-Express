const UsersDal=require("../DAL/UsersDAL")
const HandleUser = async function (data) {
  const resp = await UsersDal.readfromuserfile()
  console.log(resp);
  console.log(data);
  if (resp.Admin.some(code => code.Username === data.Username && code.Password === data.Password)) {
   
    return "Admin";
  }
  else if (resp.Users.some(code => code.username === data.Username && code.password === data.Password)) {
    // true
   
    return "Users"
  }
  else {
    return "not signed"
  }
}


const BeforePost = async function (obj) {
  let resp = await UsersDal.readfromuserfile()
  let DShapin = { username: obj.username, password: obj.password, create: obj.create, transaction: obj.transaction }
  if (resp.Users.length > 0) {
    let last = resp.Users.slice(-1);  //data shaping 
    DShapin.id = (last[0].id) + 1
  
  }
  else {
    DShapin.id = 1
  }
  DShapin.Priority="User"
  resp.Users.push(DShapin)
  let res = await UsersDal.writeToUsersFile(resp)
}

const DeleteUser = async function (id) {

  const AllDataJson = await UsersDal.readfromuserfile()

  OnlyUsers = AllDataJson.Users

  let index = OnlyUsers.findIndex(res => res.id == id)
  if (index !== undefined) OnlyUsers.splice(index, 1);

  AllDataJson.Users = OnlyUsers
  console.log(AllDataJson);
  let response = await UsersDal.writeToUsersFile(AllDataJson)
  console.log(response);
  return AllDataJson


}

const GetUserByID = async function (id) {
  let resp = await UsersDal.readfromuserfile()
  let findone = resp.Users.find(e => e.id == id)
  return findone
}
const UpdateUser = async function (obj,id) {
  
  let resp = await UsersDal.readfromuserfile()
 
  let findItem = await GetUserByID(id)

  findItem.username=obj.username;
  findItem.password=obj.password;
  findItem.create=obj.create;
  findItem.transaction=obj.transaction;
  
  let map =  resp.Users.map(x=>{
      if(x.id==id){
          x=findItem
          return x
      }
      else 
      return x 
  })
  resp.Users=map
  let response = await UsersDal.writeToUsersFile(resp)
  return response 

  }

module.exports = { HandleUser, BeforePost,UpdateUser,GetUserByID,DeleteUser }