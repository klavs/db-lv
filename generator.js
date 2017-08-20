const fs = require("fs")
const del = require("delete")
const copy = require("copy")
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

const generateIndex = () => {
    const template = Handlebars.compile(readTemplate("./views/index.html"))
    const gs = danceGroups
        .map(g => ({
            guid: g.guid,
            fullName: g.fullName,
            shortName: g.shortName || g.fullName,
            leaders: g.leaders.map(gl => leaders.find(l => l.guid == gl)),
            totalPoints: g.totalPoints,
            group: groups.find(r => r.guid == g.group).name
        }))
    const classes = gs.reduce((prev, curr) => {
        if (!prev[curr.group]){
            prev[curr.group] = []
        }
        prev[curr.group].push(curr)
        return prev
    }, {})
    let cls = [];
    Object.keys(classes).forEach(cl => cls.push({class: cl, groups: classes[cl]}))
    fs.writeFileSync(`./docs/index.html`, template({classes: cls}))
}
generateIndex()

const generateDanceGroups = () => {
    fs.mkdirSync("./docs/kolektivi")
    const template = Handlebars.compile(readTemplate("./views/dance-group.html"))
    danceGroups
        .map(g => ({
            guid: g.guid,
            title: g.shortName || g.fullName,
            shortName: g.shortName,
            fullName: g.fullName,
            leaders: g.leaders.map(gl => leaders.find(l => l.guid == gl)),
            totalPoints: g.totalPoints,
            result: results.find(r => r.guid == g.result).name,
            group: groups.find(r => r.guid == g.group).name
        }))
        .forEach(g => fs.writeFileSync(`./docs/kolektivi/${g.guid}.html`, template(g)))
}
generateDanceGroups()

const generateLeaders = () => {
    fs.mkdirSync("./docs/vaditaji")
    const template = Handlebars.compile(readTemplate("./views/leader.html"))
    leaders
        .map(l => ({
            guid: l.guid,
            fullName: l.fullName,
            groups: danceGroups.filter(g => g.leaders.includes(l.guid))
        }))
        .forEach(g => fs.writeFileSync(`./docs/vaditaji/${g.guid}.html`, template(g)))
}
generateLeaders()

const generateSitemap = () => {
    const template = Handlebars.compile(readTemplate("./views/sitemap.xml"))
    let urls = [
        {
            loc: "https://lvdb.lv/",
            changefreq: "hourly",
            priority: "1.0",
            lastmod: (new Date()).toISOString()
        }
    ].concat(danceGroups.map(g => ({
        loc: "https://lvdb.lv/kolektivi/"+g.guid,
        changefreq: "hourly",
        priority: "0.8",
        lastmod: (new Date()).toISOString()
    }))).concat(leaders.map(l => ({
        loc: "https://lvdb.lv/vaditaji/"+l.guid,
        changefreq: "hourly",
        priority: "0.6",
        lastmod: (new Date()).toISOString()
    })))

    fs.writeFileSync("./docs/sitemap.xml", template({urls}))
}
generateSitemap()

fs.mkdirSync("./docs/static")
copy("./static/*.*", "./docs/static", () => {})

copy("./CNAME", "./docs", () => {})