const fs = require("fs")
const slug = require("slug")

const leaders = require("../leaders.json")
const leadersWithSlugs = leaders.map(l => Object.assign({}, l, {slug: slug(l.fullName)}))
const leaderSlugIndex = {};
leadersWithSlugs.forEach(l => {
    let index = leaderSlugIndex[l.slug]
    leaderSlugIndex[l.slug] = index ? leaderSlugIndex[l.slug]++ : 1
    l.slug = `${l.slug}${index ? "-"+index : ""}`
})

fs.writeFileSync("./data/leaders.json", JSON.stringify(leadersWithSlugs, null, 4))

const groups = require("../danceGroups.json")
const groupsWithSlugs = groups.map(g => Object.assign({}, g, {slug: slug(g.shortName || g.guid)}))
const groupSlugIndex = {}
groupsWithSlugs.forEach(g => {
    let index = groupSlugIndex[g.slug]
    groupSlugIndex[g.slug] = index ? groupSlugIndex[g.slug]+1 : 1
    g.slug = `${g.slug}${index ? "-"+index : ""}`
})

fs.writeFileSync("./data/danceGroups.json", JSON.stringify(groupsWithSlugs, null, 4))