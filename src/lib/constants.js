/* eslint-disable */
export default {
    patterns: {
        // You cannot see your target.
        "cannot-see": /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]?( ?)You cannot see your target./,
        // You cannot see your target.
        "too-far-away": /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]?( ?)Your target is too far away, get closer!/,

        /* CHAT, GROUPS, AND WHO */
        // Any private chat (group, gould, tell, raid, etc)
        "pc-chat": /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]?( ?)(?<sender>[A-Za-z]*) (tells?|says?|told)( to )? ((the|your) )?(?<recipient>(guild|raid|group)|(.*)), '(?<message>.*)'/,
        // Joined guild group raid etc
        "joined": /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]?( ?)(?<joiner>[A-Za-z]*) (has ?)joined ((the|your) )?(?<grouptype>(guild|raid|group)|(.*))[.,\/#!$%\^&\*;:{}=\-_`~()]/,
        // /who results
        "who": /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]?( ?)\[\d+ (?<playerClass>.*)\] (?<player>[A-Za-z])/,
        // dumpfile
        "dumpfile":  /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]? Outputfile Complete: (\<a file="(?<file>.*)">)/,
        "dumpfile_new":  /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]? Outputfile Complete: (?<file>.*)/,

        /* DEATHS */
        "slain": /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]?( ?)(?<subject>.*) (has|have) (?<slain>slain) (?<target>.*)!/,
        "slain-by": /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]?( ?)(?<target>.*) (has|have) been (?<slain>slain) by (?<subject>.*)!/,
        "deathtouch": /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]?( ?)(?<subject>.*) shouts,'(?<target>.*)'s corpse0!'/,
        /* MELEE */
        // You hit other (melee)
        // You crush a mob for 12 points of damage.
        "you-hit-other-melee": /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]?( ?)(?<subject>[A-Za-z]*) (?<attack>(slice|shoot|claw|pierce|backstab|crush|slash|kick|punch|bash|strike)) (?<target>.*?) for (?<amount>\d*) points? of damage[.,\/#!$%\^&\*;:{}=\-_`~()]( \((?<ability>\w*?)\))?/,
        // You miss other (melee)
        // You try to crush a mob, but miss!
        "you-miss-other-melee": /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]?( ?)(?<subject>[A-Za-z]*) try to (?<attack>(slice|shoot|claw|pierce|backstab|crush|slash|kick|punch|bash|strike)) (?<target>.*?), but (\k<target>|\k<subject>)? ?(?<circumstance>\w*)[.,\/#!$%\^&\*;:{}=\-_`~()]( \((?<ability>\w*?)\))?/,
        // Other misses you (melee)
        // A mob tries to hit YOU, but misses!
        "other-miss-other-melee": /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]?( ?)(?<subject>.*) tries to (?<attack>(slice|shoot|hit|smash|bite|kick|bash|claw|pierce|backstab|crush|punch|strike|slash)) (?<target>.*?), but (\k<target>|\k<subject>)? ?(?<circumstance>.*)[.,\/#!$%\^&\*;:{}=\-_`~()]( \((?<ability>\w*?)\))?/,
        // Other hits other (melee)
        // Guildy slashes a mob for 18 points of damage.
        "other-hit-other-melee": /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]?( ?)(?<subject>.*) (?<attack>(slices|shoots|hits|smashes|bites|kicks|bashes|claws|pierces|backstabs|crushes|punches|strikes|slashes)) (?<target>.*) for (?<amount>\d*) points? of damage[.,\/#!$%\^&\*;:{}=\-_`~()]( \((?<ability>\w*?)\))?/,
        // Incorrect position (backstab)
        // You must be behind your opponent to backstab!
        "incorrect-position-backstab": /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]?( ?)You must be behind your opponent to backstab!/,

        /* SPELLS/SONGS */
        // You begin casting
        // You begin casting Illusion: Dark Elf.
        "begin-casting": /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]?( ?)(?<subject>.*) begins? casting (?<spell>.*)[.,\/#!$%\^&\*;:{}=\-_`~()]/,
        // Other regains concentration
        // Guildy regains concentration and continues casting.
        "regains-casting": /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]?( ?)(?<subject>.*) regains? concentration and continues? casting/,
        // Your spell interrupted
        // Your Lifedraw spell is interrupted.
        "spell-interrupted": /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]?( ?)(?<subject>(Your|.*'s)) (?<spell>.*) spell is (?<circumstance>interrupted)/,
        // Hit other (spell)
        // Guildy hit a mob for 19 points of cold damage by Ice Comet.
        "spell-hit": /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]?( ?)(?<subject>.*) hit (?<target>.*) for (?<amount>\d*) points? of (?<type>\w*) damage by (?<spell>.*)[.,\/#!$%\^&\*;:{}=\-_`~()]/,
        // Spell resisted
        // A mob resisted guildy's Clinging Darkness
        "spell-resist": /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]?( ?)(?<target>.*) (?<circumstance>resisted) (?<subject>(your)|(.*))('s)? (?<spell>.*)[.,\/#!$%\^&\*;:{}=\-_`~()]/,
        // DS (spell)
        // A mob is pierced by Guildy's thorns for 29 points of damage.
        "dmg-shield": /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]?( ?)(?<target>.*) (is|are) (?<damageshield>(clawed|pierced|burned|frozen)) by (?<subject>(.*))('s) (?<dmgshieldtype>\w*) for (?<amount>\d*) points? of (?<type>.*) damage/,
        // DOT (spell)
        // A mob has taken 42 damage from Stinging Swarm by Guildy.
        "spell-dot-tick": /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]?( ?)(?<target>.*) (has|have) taken (?<amount>\d*) (?<type>.*)? ?damage (from (?<spell>.*?))( by (?<subject>.*?))('s corpse)?[.,\/#!$%\^&\*;:{}=\-_`~()]/,
        // You fizzle
        // Kilgore's Clinging Darkness spell fizzles!
        "spell-fizzles": /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]?( ?)(?<subject>(Your|.*'s)) (?<spell>.*) spell (?<circumstance>fizzles)/,
        // Heal
        // Guildy healed herself for 367 hit points by Greater Healing
        "healed": /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]?.*\. (?<subject>.*) healed (?<target>.*)( over time)? for (?<actualheal>\d*) (\((?<totalheal>\d*)\))? ?hit points by (?<spell>.*)[.,\/#!$%\^&\*;:{}=\-_`~()]/,
        // Other begins casting
        // Guildy begins casting Banestrike.
        "other-begins-singing": /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]?( ?)(?<subject>.*) begins singing (?<spell>.*)[.,\/#!$%\^&\*;:{}=\-_`~()]/,
        // You begin singing
        // You begin singing Elemental Rhythms.
        "you-begin-singing": /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]?( ?)(?<subject>.*) begin singing (?<spell>.*)[.,\/#!$%\^&\*;:{}=\-_`~()]/,
        // Song fizzle
        // A missed note brings Guild's Niv's Melody of Perservation to a close!
        "song-fizzle": /\[?(?<timestamp>\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4})\]?( ?)A missed note brings (?<subject>[A-Za-z ]*)'s (?<spell>.*) to a close!/,
    },
    dumpPatterns: {
        "raid-dump" : {},
        "guild-dump": {},
    },
    attacks: {
        single: [
            "hit",
            "slice",
            "shoot",
            "claw",
            "pierce",
            "backstab",
            "crush",
            "slash",
            "kick",
            "punch",
            "bash",
            "strike",
            "bite",
            "dodge",
            "parr", // parry / parries
        ]
    },
    colors: {
        attack: "orange",
        heal: "green",
        deaths: "red",
        tank: "blue"
    },
    raidRoles: {
        raidLeader: "Raid Leader",
        groupLeader: "Group Leader",
    }
}