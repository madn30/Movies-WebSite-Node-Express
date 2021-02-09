const AllMovies = require("../DAL/MoviesDAL")


const GetDataService = async function (obj) {

    let MoviesFromWebSevice = await AllMovies.GetTheWebServiceMovies();
    let MoviesFromWebSeviceData = MoviesFromWebSevice.data;

    let MoviesFromJson = await AllMovies.GetTheJsonMovies();
    let MoviesFromJsonData = MoviesFromJson.Movies

    let LastJson = MoviesFromWebSeviceData.slice(-1)[0]
    let GetTheID = LastJson.id
    const ID = returnlen(GetTheID, MoviesFromJsonData.length)

    obj.id = ID
    MoviesFromJsonData.push(obj)
    let resp = AllMovies.writeToMoviesFile({ "Movies": MoviesFromJsonData })
    return resp
}

const HandleMoviesSearch = async function (obj) {

    let MoviesFromWebSevice = await AllMovies.GetTheWebServiceMovies();
    let MoviesFromWebSeviceData = MoviesFromWebSevice.data;

    let MoviesFromJson = await AllMovies.GetTheJsonMovies();
    let MoviesFromJsonData = MoviesFromJson.Movies
    const resultWeb = ResultTheSearchFromWeb(obj, MoviesFromWebSeviceData)
    const resultJsonFile = ResultTheSearchFromJson(obj, MoviesFromJsonData)
    const resultBoth = [...resultWeb, ...resultJsonFile]

    return resultBoth



}

const HandleMoviesByGeners = async function (obj) {

    let MoviesFromWebSevice = await AllMovies.GetTheWebServiceMovies();
    let MoviesFromWebSeviceData = MoviesFromWebSevice.data;

    let MoviesFromJson = await AllMovies.GetTheJsonMovies();
    let MoviesFromJsonData = MoviesFromJson.Movies
    const ResultByGenresFromWeb = MoviesFromWebSeviceData.map(each => {
        if (JSON.stringify(obj.genres) == JSON.stringify(each.genres)) {
            return each
        }
    }).filter(notUndefined => notUndefined !== undefined);

    const ResultByGenresFromJson = MoviesFromJsonData.map(each => {
        if (JSON.stringify(obj.genres) == JSON.stringify(each.genres)) {
            return each
        }
    }).filter(notUndefined => notUndefined !== undefined);
    const allthesearchresult = [...ResultByGenresFromJson, ...ResultByGenresFromWeb]
    const duplicate = allthesearchresult.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
    })
    return duplicate
}

const ResultTheSearchFromWeb = (obj, MoviesFromWebSeviceData) => {

    const ResultByName = MoviesFromWebSeviceData.filter(e => obj.name && e.name.toLowerCase().includes(obj.name.toLowerCase()))
    const ResultBylanguage = MoviesFromWebSeviceData.map(each => {
        let match = obj.language.every(e => e == each.language)
        if (match) {
            return each
        }
    }).filter(notUndefined => notUndefined !== undefined)

    const ResultByGenres = MoviesFromWebSeviceData.map(each => {
        if (JSON.stringify(obj.genres) == JSON.stringify(each.genres)) {
            return each
        }
    }).filter(notUndefined => notUndefined !== undefined);

    const allthesearchresult = [...ResultByName, ...ResultBylanguage, ...ResultByGenres]
    const duplicate = allthesearchresult.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
    })

    return duplicate


}
const ResultTheSearchFromJson = (obj, JsonFile) => {

    const ResultByName = JsonFile.filter(e => obj.name && e.name.toLowerCase().includes(obj.name.toLowerCase()))

    const ResultBylanguage = JsonFile.map(each => {
        if (JSON.stringify(obj.language) == JSON.stringify(each.language)) {
            return each
        }
    }).filter(notUndefined => notUndefined !== undefined);

    const ResultByGenres = JsonFile.map(each => {
        if (JSON.stringify(obj.genres) == JSON.stringify(each.genres)) {
            return each
        }
    }).filter(notUndefined => notUndefined !== undefined);

    const allthesearchresult = [...ResultByName, ...ResultBylanguage, ...ResultByGenres]
    var duplicate = allthesearchresult.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
    })
    return duplicate



}
const ReturnExectDataSelected = async (id) => {

    let MoviesFromWebSevice = await AllMovies.GetTheWebServiceMovies();
    let MoviesFromWebSeviceData = MoviesFromWebSevice.data;

    let MoviesFromJson = await AllMovies.GetTheJsonMovies();
    let MoviesFromJsonData = MoviesFromJson.Movies
    let OneJson = {}

    if (MoviesFromWebSeviceData.some(each => each.id == id) == true) {

        OneJson = MoviesFromWebSeviceData.find(E => E.id == id)

        return OneJson
    }
    else {

        OneJson = MoviesFromJsonData.find(E => E.id == id)

        return OneJson
    }



}
const returnlen = function (lenght1, lenght2) {

    return (lenght1 + lenght2) + 1
}
module.exports = { GetDataService, HandleMoviesSearch, HandleMoviesByGeners, ReturnExectDataSelected }