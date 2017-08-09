const csv = require("csv")
const fs = require("fs")
const Guid = require("guid")

const ADMIN_DISTRICT = 0
const DANCE_DISTRICT = 1
const GROUP = 2
const FULL_NAME = 3
const LEADER = 4
const TOTAL_POINTS = 5
const RESULT = 6
const JURY_POINTS = 7
const BONUS_POINTS = 8

const transformProperty = 
    prop => prop
        .split(" ").filter(w => w != "").join(" ")
        .replace("“", "\"")
        .replace("”", "\"")
        .replace("“", "\"")
        .replace("„", "\"")
        .replace("„", "\"")
        .replace("„", "\"")
        .replace("”", "\"")
        .replace("”", "\"")
        .replace(",,", "\"")

const transformEntry = entry => ({
    adminDistrict: transformProperty(entry[ADMIN_DISTRICT]),
    danceDistrict: transformProperty(entry[DANCE_DISTRICT]),
    group: transformProperty(entry[GROUP]),
    fullName: transformProperty(entry[FULL_NAME]),
    leader: transformProperty(entry[LEADER]),
    totalPoints: transformProperty(entry[TOTAL_POINTS]),
    result: transformProperty(entry[RESULT]),
    juryPoints: transformProperty(entry[JURY_POINTS]),
    bonusPoints: transformProperty(entry[BONUS_POINTS])
})

const save = (kind, data) => fs.writeFileSync(`${__dirname}/${kind}.json`, JSON.stringify(data, null, 4))

const rawData = fs.readFileSync(`${__dirname}/data.csv`)

const getSet = (arr, cb) => new Set(arr.map(cb))

const guidCache = {}
const getGuid = val => {
    if (!guidCache[val]){
        guidCache[val] = Guid.raw()
    }
    return guidCache[val]
}

csv.parse(rawData, (err, data) => {
    const danceGroups = data.map(transformEntry)
    const leaders = getSet(danceGroups, g => g.leader)
    const adminDistricts = getSet(danceGroups, g => g.adminDistrict)
    const danceDistricts = getSet(danceGroups, g => g.danceDistrict)
    const groups = getSet(danceGroups, g => g.group)
    
    const tDanceGroups = danceGroups.map(g => Object.assign({}, g, {
        guid: Guid.raw(),
        shortName: undefined,
        slug: undefined,
        leader: getGuid(g.leader),
        adminDistrict: getGuid(g.adminDistrict),
        danceDistrict: getGuid(g.danceDistrict),
        group: getGuid(g.group),
        result: getGuid(g.result)
    }))
    const tLeaders = danceGroups
        .map(g => ({
            guid: getGuid(g.leader),
            fullName: g.leader
        }))
    const tAdminDistricts = danceGroups
        .map(g => ({
            guid: getGuid(g.adminDistrict),
            fullName: g.adminDistrict
        }))
    const tDanceDistricts = danceGroups
        .map(g => ({
            guid: getGuid(g.danceDistrict),
            fullName: g.danceDistrict
        }))
    const tGroups = danceGroups
        .map(g => ({
            guid: getGuid(g.group),
            name: g.group
        }))
    const tResults = danceGroups
        .map(g => ({
            guid: getGuid(g.result),
            name: g.result
        }))
    save("danceGroups", tDanceGroups)
    save("leaders", tLeaders)
    save("adminDistricts", tAdminDistricts)
    save("danceDistricts", tDanceDistricts)
    save("groups", tGroups)
    save("results", tResults)
})