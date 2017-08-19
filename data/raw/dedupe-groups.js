const fs = require("fs")
const groups = require("../groups.json")
let uniqueGroups = [];
groups.forEach(g => {
    if (uniqueGroups.some(ug => ug.guid == g.guid)) return
    uniqueGroups.push(g)
})

fs.writeFileSync("./data/groups.json", JSON.stringify(uniqueGroups, null, 4), "utf8")