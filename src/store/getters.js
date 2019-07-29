import _ from 'lodash'
import constants from '../lib/constants'

function concatFights(fights) {
    // Do combination logic
    let combined = {
        dmgFromMob: 0,
        dmgToMob: 0,
        endTime: 0,
        startTime: Number.POSITIVE_INFINITY,
        duration: 0,
        healingOnMob: 0,
        healingOnOthers: 0,
        othersSlain: 0,
        attackers: {},
        spells: {},
        enemy: {},
        attacks: {},
        healers: {},
        participants: {},
    }

    // do basic stuff

    _.each(fights, (f) => {
            combined.dmgFromMob += f.dmgFromMob
            combined.dmgToMob += f.dmgFromMob
            combined.endTime = (combined.endTime > f.endTime) ? combined.endTime : f.endTime
            combined.startTime = (combined.startTime < f.startTime) ? combined.startTime : f.startTime
            combined.duration += f.duration
            combined.healingOnMob += f.healingOnMob
            combined.healingOnOthers += f.healingOnOthers
            combined.othersSlain += f.othersSlain
            // Combine the different complex data objects
            combined.attackers = _.mergeWith(combined.attackers, f.attackers, merger)
            combined.spells =_.mergeWith(combined.spells, f.spells, merger)
            combined.enemy =_.mergeWith(combined.enemy, f.enemy, merger)
            combined.attacks =_.mergeWith(combined.attacks, f.attacks, merger)
            combined.healers =_.mergeWith(combined.healers, f.healers, merger)
            combined.participants =_.mergeWith(combined.participants, f.participants, merger)

    })

    return combined
}

/** Merger combines two deep objects, adding the values */
function merger(o, s, k) {
    if (_.isNumber(o) && _.isNumber(s)) return o + s
    if (_.isObject(o) && _.isObject(s)) return _.mergeWith({}, o, s, merger)
    return
}

function getAchievements(fight, participant) {
    // Is this person MT? Did this person take DT? etc
    return [{
        color: constants.colors.tank,
        message: "Main Tank"
    }]
}

function generalDetailsGenerator(fight) {
    let attackers = _.map(fight.attackers, (attacker, name) => {
        let val = {}
        val.name = name
        val.dmg = parseInt(attacker.dmgToMob)
        if (_.isNaN(val.dmg)) val.dmg = 0

        // Now calculate dmg types, hits, and misses
        val.meleeDmg = 0
        val.spellDmg = 0
        _.each(attacker.attacks, (a) => {
            if (a.dmgToMob) val.meleeDmg += a.dmgToMob
        })
        _.each(attacker.spells, (s) => {
            if (s.dmgToMob) val.spellDmg += s.dmgToMob
        })

        val.dmgPercent = _.round((val.dmg / fight.dmgToMob) * 100, 2) + '%'
        return val
    })

    attackers = attackers.sort((a, b) => {
        return (a.dmg > b.dmg) ? -1 : 1
    })
    return _.map(attackers, (val, index) => {
        val.rank = index + 1
        return val
    })
}

function meleeDetailsGenerator(fight) {
    let attackers = _.map(fight.attackers, (attacker, name) => {
        let val = {}
        val.name = name
        // Now calculate dmg types, hits, and misses
        val.meleeDmg = 0
        val.meleeHits = 0
        val.meleeMisses = 0
        val.maxHit = 0
        _.each(attacker.attacks, (a) => {
            if (a.dmgToMob) val.meleeDmg += a.dmgToMob
            console.log(a)
        })

        return val
    })

    attackers = attackers.sort((a, b) => {
        return (a.meleeDmg > b.meleeDmg) ? -1 : 1
    })
    return _.map(attackers, (val, index) => {
        val.rank = index + 1
        return val
    })
}

function healingDetailsGenerator(fight) {
    let totalHeal = fight.healingOnOthers
    let healers = _.map(fight.healers, (healer, name) => {
        let val = {}
        val.name = name
        val.actualHeal = healer.healingOnOthers
        val.overHeal = healer.overHealingOnOthers
        val.totalHeal = healer.healingOnOthers + healer.overHealingOnOthers
        val.healShare = _.round(val.actualHeal / totalHeal * 100, 2) + '%'
        return val
    })

    healers = healers.sort((a, b) => {
        return (a.actualHeal > b.actualHeal) ? -1 : 1
    })

    return _.map(healers, (val, index) => {
        val.rank = index + 1
        return val
    })
}

function tankingDetailsGenerator(fight) {
    let totalDmgTaken = fight.dmgFromMob
    let tanks = _.compact(_.map(fight.enemy.attackers, (tank, name) => {
        if (name != fight.target) {
            let val = {}
            val.name = name
            val.dmgTaken = tank.dmgFromMob
            val.dmgTakenShare = _.round(tank.dmgFromMob / totalDmgTaken * 100, 2) + '%'
            val.hits = 0
            _.each(tank.attacks, (a) => {
                val.hits += a.hit
            })

            return val
        }
    }))

    tanks = tanks.sort((a, b) => {
        return (a.dmgTaken > b.dmgTaken) ? -1 : 1
    })

    return _.map(tanks, (val, index) => {
        val.rank = index + 1
        return val
    })
}

function spellDetailsGenerator(fight) {
    let spellDmg = 0
    let spells = _.compact(_.map(fight.spells, (spell, name) => {
        let val = {}
        if (spell.cast > 0) {
            // other spells are procs
            if (spell.dmgToMob) {
                val.name = name
                val.dmg = spell.dmgToMob
                val.casts = spell.cast
                val.sources = []
                val.dmgPercent = '0.0%'
                val.misses = spell.cast - spell.hit || spell.miss || 0
                val.hitPercent = _.round((val.casts - val.misses) / val.casts * 100, 2) + '%'
                spellDmg += spell.dmgToMob
                return val
            } else if (spell.miss) {
                val.name = name
                val.dmg = 0
                val.casts = spell.cast
                val.sources = []
                val.dmgPercent = '0.0%'
                val.misses = spell.cast - spell.hit || spell.miss || 0
                val.hitPercent = _.round((val.casts - val.misses) / val.casts * 100, 2) + '%'
                return val
            }
        }
    }))

    // get the number of sources
    _.each(spells, (spell) => {
        if (spell) {
            _.each(fight.attackers, (a, name) => {
                _.each(a.spells, (as, aSpell) => {
                    if (spell.name == aSpell) spell.sources.push(name)
                })
            })
            spell.dmgPercent = _.round(spell.dmg / spellDmg * 100, 2) + '%'
        }
    })

    spells = spells.sort((a, b) => {
        return (a.dmg > b.dmg) ? -1 : 1
    })
    return _.map(spells, (val, index) => {
        val.rank = index + 1
        return val
    })
}

export default {
    getTargetStats: (state) => (name) => {
        return _.get(state, ["stats", "targets", decodeURIComponent(name)])
    },
    getParticipantClass: (state) => (participant) => {
        return _.get(state, ["participants", participant, "class"], 'unknown')
    },
    getParticipantStats: (state) => (ids, participant) => {
        let fight
        try {
            let parsed = JSON.parse(ids)
            if (_.isArray(parsed)) {
                fight = concatFights(_.filter(state.stats.calculated, (v) => {
                    return _.find(parsed, (id) => (decodeURIComponent(v.id) == id.id))
                }))
            } 
        } catch(error) {
            fight = _.find(state.stats.calculated, (v) => (decodeURIComponent(v.id) == ids))
        }

        let out = {
            general: {
                duration: 0
            },
            spells: {},
            damage: {
                dmgToMob: 0,
                attacksOnMob: 0,
                hitsOnMob: 0,
                attacks: {}
            },
            tanking: {
                dmgFromMob: 0,
                attacksFromMob: 0,
                missesByMob: 0,
                attacks: {}
            },
            healing: {
                actualHeal: 0,
                overHeal: 0,
                spells: {}
            },
            achievements: getAchievements(fight, participant)
        }

        // General
        out.general.duration = fight.endTime - fight.startTime
        out.general.dmgToMob = fight.dmgToMob

        // Tanking
        _.each(_.get(fight, ["enemy", "attackers", participant, "attacks"]), (a, attack) => {
            out.tanking.dmgFromMob += _.get(a, "dmgFromMob", 0)
            out.tanking.attacksFromMob += _.get(a, "attack", 0)
            out.tanking.missesByMob += _.get(a, "attack", 0) - _.get(a, "hit", 0)
            _.set(out.tanking.attacks, [attack, "dmgFromMob"], _.get(out.tanking.attacks, [attack, "dmgFromMob"], 0) + _.get(a, "dmgFromMob", 0))
            _.set(out.tanking.attacks, [attack, "attacksFromMob"], _.get(out.tanking.attacks, [attack, "attacksFromMob"], 0) + _.get(a, "attack", 0))
            _.set(out.tanking.attacks, [attack, "missesByMob"], _.get(out.tanking.attacks, [attack, "missesByMob"], 0) + _.get(a, "attack", 0) - _.get(a, "hit", 0))
        })

        // Damage
        _.set(out.damage, "dmgToMob", _.get(fight, ["attackers", participant, "dmgToMob"], 0))
        _.each(_.get(fight, ["attackers", participant, "attacks"]), (a, attack) => {
            out.damage.attacksOnMob += _.get(a, "attempts", 0)
            out.damage.hitsOnMob += _.get(a, "hit", 0)
            _.set(out.damage.attacks, [attack, "dmgToMob"], _.get(out.damage.attacks, [attack, "dmgToMob"], 0) + a.dmgToMob)
            _.set(out.damage.attacks, [attack, "attacksOnMob"], _.get(out.damage.attacks, [attack, "attacksOnMob"], 0) + a.attemps)
            _.set(out.damage.attacks, [attack, "hitsOnMob"], _.get(out.damage.attacks, [attack, "hitsOnMob"], 0) + a.hit)
        })

        // Healing
        out.healing.actualHeal = _.get(fight, ["healers", participant, "healingOnOthers"], 0)
        out.healing.overHeal = _.get(fight, ["healers", participant, "overHealingOnOthers"], 0)
        out.healing.spells = _.get(fight, ["healers", participant, "spells"])

        // Spells
        out.spells = _.get(fight, ["attackers", participant, "spells"])
        console.log(fight)
        return out
    },
    getTimelineStats: (state) => (id) => {
        let fight = _.find(state.stats.calculated, (v) => (decodeURIComponent(v.id) == id))
        let chartData = {}
        let dmgTo = {
            name: 'Raid Damage',
            data: {},
            total: 0,
            dataset: {
                yAxisID: 'TOTAL',
            }
        }
        let dmgFrom = {
            name: `${fight.target} Damage`,
            data: {},
            total: 0,
            dataset: {
                yAxisID: 'TOTAL',
            }
        }
        let raidHealing = {
            name: 'Raid Healing',
            data: {},
            total: 0,
            dataset: {
                yAxisID: 'TOTAL',
            }
        }
        let dpsTo = {
            name: 'Raid DPS',
            data: {},
            dataset: {
                yAxisID: 'DPS'
            }
        }

        // get data from the fight timeline
        _.each(fight.frames, (frame, time) => {

            let x = time
            dmgTo.total += (frame.dmgToMob) ? frame.dmgToMob : 0
            _.set(dmgTo, ["data", x], (frame.dmgToMobTotal) ? frame.dmgToMobTotal : dmgTo.total)
            dmgFrom.total = (frame.dmgFromMobTotal) ? frame.dmgFromMobTotal : dmgFrom.total
            _.set(dmgFrom, ["data", x], (frame.dmgFromMobTotal) ? frame.dmgFromMobTotal : dmgFrom.total)
            raidHealing.total += (frame.healingOnOthers) ? frame.healingOnOthers : 0
            _.set(raidHealing, ["data", x], (frame.healingOnOthersTotal) ? frame.healingOnOthersTotal : raidHealing.total)
            _.set(dpsTo, ["data", x], (frame.dmgToMob) ? frame.dmgToMob / 15 : 0)
        })

        chartData = [dmgTo, dmgFrom, dpsTo]
        return chartData
    },
    getFightDmgStats: (state) => (ids) => {
        let data
        try {
            let parsed = JSON.parse(ids)
            if (_.isArray(parsed)) {
                data = concatFights(_.filter(state.stats.calculated, (v) => {
                    return _.find(parsed, (id) => (decodeURIComponent(v.id) == id.id))
                }))
            } 
        } catch(error) {
            data = _.find(state.stats.calculated, (v) => (decodeURIComponent(v.id) == ids))
        }

        let chartData = {
            Spells: 0
        }
        let total = data.dmgToMob
        _.each(data.spells, (spell) => {
            if (spell.dmgToMob) chartData.Spells += spell.dmgToMob
        })

        _.each(data.attacks, (a, attack) => {
            if (a.dmgToMob && a.dmgToMob / total > .03) {
                _.set(chartData, [_.capitalize(attack)], _.get(chartData, [_.capitalize(attack)], 0) + a.dmgToMob)
            }
        })

        return chartData
    },
    getPersonalDmgStats: (state) => (player, ids) => {
        let data
        try {
            let parsed = JSON.parse(ids)
            if (_.isArray(parsed)) {
                data = concatFights(_.filter(state.stats.calculated, (v) => {
                    return _.find(parsed, (id) => (decodeURIComponent(v.id) == id.id))
                }))
            } 
        } catch(error) {
            data = _.find(state.stats.calculated, (v) => (decodeURIComponent(v.id) == ids))
        }

        let chartData = {}
        let total = _.get(data, ["attackers", player, "dmgToMob"])
        let attacker = _.get(data, ["attackers", player])
        _.each(attacker.attacks, (a, attack) => {
            if (a.dmgToMob && a.dmgToMob / total > .03) {
                _.set(chartData, [_.capitalize(attack)], _.get(chartData, [_.capitalize(attack)], 0) + a.dmgToMob)
            }
        })

        _.each(attacker.spells, (s, spell) => {
            if (s.dmgToMob && s.dmgToMob / total > .03) {
                _.set(chartData, [_.capitalize(spell)], _.get(chartData, [_.capitalize(spell)], 0) + s.dmgToMob)
            }
        })

        return chartData
    },
    getPersonalHealStats: (state) => (player, ids) => {
        let data
        try {
            let parsed = JSON.parse(ids)
            if (_.isArray(parsed)) {
                data = concatFights(_.filter(state.stats.calculated, (v) => {
                    return _.find(parsed, (id) => (decodeURIComponent(v.id) == id.id))
                }))
            } 
        } catch(error) {
            data = _.find(state.stats.calculated, (v) => (decodeURIComponent(v.id) == ids))
        }

        let chartData = {}
        let total = _.get(data, ["healers", player, "healingOnOthers"])
        let healer = _.get(data, ["healers", player])


        _.each(healer.spells, (s, spell) => {
            
            _.set(chartData, [_.capitalize(spell)], _.get(chartData, [_.capitalize(spell)], 0) + s.healingOnOthers)
            _.set(chartData, [_.capitalize(spell + ' (overheal)')], _.get(chartData, [_.capitalize(spell + ' (overheal)')], 0) + s.overHealingOnOthers)
            
        })

        return chartData
    },
    getFights: (state) => {
        return _.get(state, ["stats", "calculated"])
    },
    getFightDetails: (state) => (ids, type) => {
        let data
        try {
            let parsed = JSON.parse(ids)
            if (_.isArray(parsed)) {
                data = concatFights(_.filter(state.stats.calculated, (v) => {
                    return _.find(parsed, (id) => (decodeURIComponent(v.id) == id.id))
                }))
            } 
        } catch(error) {
            data = _.find(state.stats.calculated, (v) => (decodeURIComponent(v.id) == ids))
        }
        if (data) {
            if (!type || type == "general") return generalDetailsGenerator(data)
            else if (type == "melee") return meleeDetailsGenerator(data)
            else if (type == "spells") return spellDetailsGenerator(data)
            else if (type == "healing") return healingDetailsGenerator(data)
            else if (type == "tanking") return tankingDetailsGenerator(data)
        }
        return []
    },
}