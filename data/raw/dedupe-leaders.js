const fs = require("fs")
const leaders = require("../leaders.json")
let uniqueLeaders = [];
leaders.forEach(l => {
    if (uniqueLeaders.some(ul => ul.guid == l.guid)) return
    uniqueLeaders.push(l)
})

fs.writeFileSync("./data/leaders.json", JSON.stringify(uniqueLeaders, null, 4), "utf8")