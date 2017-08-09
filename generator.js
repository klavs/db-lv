const fs = require("fs")
const del = require('delete')
const Handlebars = require("handlebars")

const readData = path => JSON.parse(fs.readFileSync(path, {encoding: "utf8"}))
const danceGroups = readData("./data/danceGroups.json")
const adminDistricts = readData("./data/adminDistricts.json")
const danceDistricts = readData("./data/danceDistricts.json")
const groups = readData("./data/groups.json")
const leaders = readData("./data/leaders.json")
const results = readData("./data/results.json")

fs.existsSync("./docs") && del.sync(["./docs"])
fs.mkdirSync("./docs")

const readTemplate = path => fs.readFileSync(path, {encoding: "utf-8"})

const generateDanceGroups = () => {
    fs.mkdirSync("./docs/kolektivi")
    const template = Handlebars.compile(readTemplate("./views/dance-group.html"))
    danceGroups
        .map(g => ({
            guid: g.guid,
            title: g.shortName || g.fullName,
            shortName: g.shortName,
            fullName: g.fullName,
            leader: leaders.find(l => l.guid == g.leader).fullName,
            totalPoints: g.totalPoints,
            result: results.find(r => r.guid == g.result).name
        }))
        .forEach(g => fs.writeFileSync(`./docs/kolektivi/${g.guid}`, template(g)))
}
generateDanceGroups()