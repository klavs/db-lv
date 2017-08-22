const fs = require("fs")
const slug = require("slug")
const leaders = require("../leaders.json")
const leadersWithSlugs = leaders.map(l => Object.assign({}, l, {slug: slug(l.fullName)}))
const slugIndex = {};
leadersWithSlugs.forEach(l => {
    let index = slugIndex[l.slug]
    slugIndex[l.slug] = index ? index++ : 0
    l.slug = `${l.slug}${index ? "-"+index : ""}`
})

fs.writeFileSync("./data/leaders.json", JSON.stringify(leadersWithSlugs, null, 4))