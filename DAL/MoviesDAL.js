const jsonfile = require('jsonfile');
const axios = require("axios")

const writeToMoviesFile = function (obj) {
    return new Promise((resolve, reject) => {
        jsonfile.writeFile("./JSONFILE/NewMovies.json", obj, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve('Created!')
            }
        })
    });

}

const GetTheJsonMovies = function () {
    return new Promise((resolve, reject) => {
        jsonfile.readFile('./JSONFILE/NewMovies.json', function (err, data) {
            if (err) {
                reject(err)
            }
            else {
                resolve(data);
            }
        })
    })


}
const GetTheWebServiceMovies = function () {
    return (
        axios.get("https://api.tvmaze.com/shows")
    )
}
module.exports = { writeToMoviesFile, GetTheWebServiceMovies, GetTheJsonMovies }