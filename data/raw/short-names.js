const fs = require("fs")
const groups = require("../danceGroups.json")
const rx = /"([^\"]+)"[^\"]*$/
groups.forEach(g => {
    const res = rx.exec(g.fullName)
    if (!res || res.length == 0){
        console.log(g.fullName)
    } else {
        g.shortName = res[1]
    }
})

fs.writeFileSync("./data/danceGroups.json", JSON.stringify(groups, null, 4))