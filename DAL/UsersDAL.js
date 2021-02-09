

const jfile = require('jsonfile')

const readfromuserfile = function () {
    return new Promise((resolve, reject) => {
        jfile.readFile('./JSONFILE/Users.json', function (err, data) {
            if (err) {
                reject(err)
            }
            else {

                resolve(data);
            }
        })
    })
}
const writeToUsersFile = function (obj) {
    return new Promise((resolve, reject) => {
        jfile.writeFile("./JSONFILE/Users.json", obj, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve('Created!')
            }
        })
    });

}
module.exports = { readfromuserfile, writeToUsersFile }
