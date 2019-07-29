const Tail = require('tail').Tail
const constants = require('./constants').default
const _ = require('lodash')
const settings = require('electron-settings')
const fs = require('fs')

let you

function sanitizeName(name) {
    // First look for variations of you
    if(/(^you$|^your$|(.*)?(herself|itself|himself)(.*)?)/i.test(name)) {
        name = you
    }
    if (_.endsWith(name, "'s")) name = name.substring(0, name.length - 2)
    return name
}

function sanitizePlayerClass(playerClass) {
    // extract the class when above 50
    let val = /\((?<playerClass>\w*)\)/
    let parsed = val.exec(playerClass)
    if (parsed && parsed.groups.playerClass)  {
        playerClass = parsed.groups.playerClass
    }
    return playerClass
}

function sanitizeNumber(val) {
    return parseInt(val)
}

function sanitizeAttack(attack) {
    for (var i in constants.attacks.single) {
        if (attack.indexOf(constants.attacks.single[i]) > -1) return constants.attacks.single[i]
    }
    return attack
}

function sanitizeSpell(spell) {
    return spell
}

function sanitizeDS(ds) {
    return ds
}

function sanitizeCircumstance(circumstance) {
    return circumstance
}

function sanitizeAbility(ability) {
    return ability
}

function parseMessage(message, recipient) {
    let colons = recipient.indexOf(':') > -1
    switch (recipient) {
        case 'guild':
        case 'group':
        case 'raid':
            break
        default:
            if (colons) break
            recipient = "private"
    }
    return {
        chars: message.length,
        words: _.words(message).length,
        recipient: recipient
    }
}


class Parser {
    constructor(file, socket) {
        this.file = file
        this.patterns = this.initPatterns()
        you = this.file.split("_")[1]
        this.tail = this.initTail(this.file)
        this.socket = socket
        this.constants = constants 
        console.log("parser initialized: ", file)
    }

    setSocket(socket) {
        this.socket = socket
    }

    parseLine(line) {
        let out
        _.each(this.constants.patterns, (val, key) => {
            if (!out) {
                let parsed = val.exec(line)
                if (parsed) {
                    out =  {
                        type: key,
                        data: parsed.groups,
                    }
                }
            }
        })
    
        return out
    }

    initTail(fileName) {
        this.tail =  new Tail(fileName, {fromBeginning:false});
        let ctx = this
        this.tail.on("line", function(data) {
            let res = ctx.parseLine(data)
            if (res) {
                let prepared = ctx.prepareData(res)
                // Send to server
                if (prepared) {
                    ctx.socket.emit('logline', prepared)
                }
            } 
        });
         
        this.tail.on("error", function(error) {
            console.log('ERROR: ', error);
        });
    
    }

    initPatterns() {
        this.patterns = new Map()
        /* GENERAL */
        _.each(constants.patterns, (pattern, key) => {
            this.patterns.set(key, pattern)
        })
    }

    prepareData(data) {
        let prepared = {
            private: null,
            public: null,
        }
        switch(data.type) {
            case "healed":
            case 'pc-chat':
            case "you-hit-other-melee":
            case "other-hit-you-melee":
            case "you-miss-other-melee":
            case "other-hit-other-melee":
            case "other-miss-other-melee":
            case "incorrect-position-backstab":
            case "slain":
            case "slain-by":
            case "begin-casting":
            case "spell-hit":
            case "spell-dot-tick":
            case "spell-interrupted":
            case "spell-fizzles":
            case "spell-resist":
            case "dmg-shield":
                if (data.data.subject) data.data.subject = sanitizeName(data.data.subject)
                if (data.data.target) data.data.target = sanitizeName(data.data.target)
                if (data.data.attack) data.data.attack = sanitizeAttack(data.data.attack)
                if (data.data.spell) {
                    data.data.spell = sanitizeSpell(data.data.spell)
                    data.data.attack = "spell"
                }
                if (data.data.damageshield) { 
                    data.data.attack = "Damage shield"
                    data.data.subject = "Damage Shield"
                    data.data.damageshield = sanitizeDS(data.data.damageshield)
                }
                if (data.data.circumstance) data.data.circumstance = sanitizeCircumstance(data.data.circumstance)
                if (data.data.ability) data.data.ability = sanitizeAbility(data.data.ability)
                if (data.data.amount) data.data.amount = sanitizeNumber(data.data.amount)
                if (data.data.totalheal) data.data.totalheal = sanitizeNumber(data.data.totalheal)
                if (data.data.actualheal) data.data.actualheal = sanitizeNumber(data.data.actualheal)
                if (data.data.sender) data.data.sender = sanitizeName(data.data.sender)
                if (data.data.recipient) data.data.recipient = sanitizeName(data.data.recipient)
                if (data.data.message) {
                    prepared.private = _.cloneDeep(data.data)
                    data.data.message = parseMessage(data.data.message, data.data.recipient)
                }
                if (data.data.joiner) data.data.joiner = sanitizeName(data.data.joiner)
                data.data.type = data.type
                prepared.public = data.data
                return prepared
            case "who":
                data.data.player = sanitizeName(data.data.player)
                data.data.playerClass = sanitizePlayerClass(data.data.playerClass)
                data.data.type = data.type
                prepared.public = data.data
                return prepared
            case "dumpfile":
            case "dumpfile_new":
                // Open the file, read it, and parse it's data on its own
                this.parseDumpFile(data.data.file)
        }
        return null
    }

    parseDumpFile(file) {
        let raidDump = false
        let raiders = []
        let socket = this.socket
        
        
        if (file.indexOf("RaidRoster") > -1) {
            let path = settings.get('logpath').split('\\')
            path = _.take(path, path.length - 2)

            path = path.join('/')
            file = path + '/' + file
            raidDump = true
        }

        console.log("FILE", file, "RAIDDUMP", raidDump)
        // Read the file
        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream(file)
        });
            
        // Read a line
        lineReader.on('line', line => {
            let split = line.split(`\t`)
            let playerClass = split[2]
            let player = split[1]
            let raidRole = split[4]
            // fake a "who" message to the server
            socket.emit("logline", { public: { type: "who", playerClass: playerClass, player: player }})
            if (raidDump) {
                let p = {
                    name: player,
                    role: raidRole
                }
                if (raidRole == constants.raidRoles.raidLeader) socket.emit('update_raid_leader', player)
                if (!p.role) delete p.role
                raiders.push(p)
            }
        });
    
        // Do whatever now that at end of file
        lineReader.on('close', () => {
            // Maybe delete
            if (settings.get("autoDeleteDumps")) {
                fs.unlink(file, () => {
                    console.log("deleted:", file)
                })
            }

            if (raidDump) {
                // emit a raid event
                socket.emit("raiddump", raiders)
            }
        })
    }
}

export default Parser