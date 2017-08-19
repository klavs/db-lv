const fs = require("fs")
const resources = [
    "leaders",
    "adminDistricts",
    "danceDistricts",
    "danceGroups",
    "groups",
    "leaders",
    "results"
]
resources.forEach(res => {
    const resource = require(`../${res}.json`)
    let uniqueResource = [];
    resource.forEach(l => {
        if (uniqueResource.some(ul => ul.guid == l.guid)) return
        uniqueResource.push(l)
    })

    fs.writeFileSync(`./data/${res}.json`, JSON.stringify(uniqueResource, null, 4), "utf8")
})