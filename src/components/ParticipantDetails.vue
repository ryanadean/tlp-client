<template>
            <v-tabs>
                <v-tab
                    ripple
                    key="basicInfo">
                    Basic </v-tab>
                <v-tab
                    ripple
                    key="dps"
                    v-if="details('damage').length">
                    Melee </v-tab>
                <v-tab
                    ripple
                    key="tanking"
                    v-if="details('tanking').length">
                    Tanking </v-tab>
                <v-tab
                    ripple
                    key="spells"
                    v-if="details('spells').length">
                    Spell Info</v-tab>   
                <v-tab-item
                    key="basicInfo">
                    <v-container  grid-list-md>
                        <v-layout row>
                            <v-flex md6>
                                <v-card>
                                    <v-card-title>
                                        General Info
                                    </v-card-title>
                                    <v-card-text>
                                        <v-list subheader>
                                             <v-list-tile >
                                                <v-list-tile-title>Class</v-list-tile-title>
                                                <v-list-tile-sub-title>{{ details('basic').class}}</v-list-tile-sub-title>
                                            </v-list-tile>
                                            <v-list-tile v-if="details('basic').dmgDealt">
                                                <v-list-tile-title>Damage</v-list-tile-title>
                                                <v-list-tile-sub-title>{{ details('basic').dmgDealt }}</v-list-tile-sub-title>
                                            </v-list-tile>
                                            <v-list-tile v-if="details('basic').dps">
                                                <v-list-tile-title>DPS</v-list-tile-title>
                                                <v-list-tile-sub-title>{{ details('basic').dps }}</v-list-tile-sub-title>
                                            </v-list-tile>
                                            <v-list-tile v-if="details('basic').attacksFromMob">
                                                <v-list-tile-title>Damage Taken</v-list-tile-title>
                                                <v-list-tile-sub-title>{{ details('basic').dmgTaken }}</v-list-tile-sub-title>
                                            </v-list-tile>
                                            <v-list-tile v-if="details('basic').attacksFromMob">
                                                <v-list-tile-title>Attacks On</v-list-tile-title>
                                                <v-list-tile-sub-title>{{ details('basic').attacksFromMob }}</v-list-tile-sub-title>
                                            </v-list-tile>
                                            <v-list-tile v-if="details('basic').actualHeal">
                                                <v-list-tile-title>Actual Healing</v-list-tile-title>
                                                <v-list-tile-sub-title>{{ details('basic').actualHeal }}</v-list-tile-sub-title>
                                            </v-list-tile>
                                            <v-list-tile v-if="details('basic').overHeal">
                                                <v-list-tile-title>Over Healing</v-list-tile-title>
                                                <v-list-tile-sub-title>{{ details('basic').overHeal }}</v-list-tile-sub-title>
                                            </v-list-tile>
                                        </v-list>
                                        <v-container>
                                            <v-layout row wrap>
                                                <v-flex sm12>
                                                    <span class="subheading">Achievements</span>
                                                    <span>Coming Soon</span>
                                                </v-flex>
                                            </v-layout>
                                            <!-- <v-layout row wrap>
                                                    <v-chip small label color="green lighten-2">Highest Dmg</v-chip>
                                                    <v-badge
                                                    overlap>
                                                        <template v-slot:badge>
                                                            <span>4</span>
                                                        </template>
                                                        <v-chip label small color="red lighten-2">Deathtouch</v-chip>
                                                    </v-badge>
                                                    <v-chip small label color="blue lighten-2">Main Tank</v-chip>
                                            </v-layout> -->
                                        </v-container>
                                    </v-card-text>
                                </v-card>
                            </v-flex>
                            <v-flex md6>
                                 <pie-chart
                                    :data="healingChartData"
                                    legend="top"
                                    :donut="true"
                                    :messages='{empty: "Not enough data"}'
                                    :library="chartOptions"
                                    v-if="details('basic').actualHeal > details('basic').dmgDealt"
                                     />
                                <pie-chart
                                    :data="dmgChartData"
                                    :donut="true"
                                    legend="top"
                                    :messages='{empty: "Not enough data"}'
                                    :library="chartOptions"
                                    v-else />
                            </v-flex>
                            
                        </v-layout>
                    </v-container>
                </v-tab-item>
                <v-tab-item
                    key="damage"
                    v-if="details('damage').length">
                    <v-data-table
                        :headers="dmgHeaders"
                        :items="details('damage')"
                        :loading="true"
                        class="elevation-1"
                        hide-actions
                        :rows-per-page-items='[10, 25,{"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}]'>
                        <v-progress-linear v-slot:progress color="green" :indeterminate="true" />
                        <template v-slot:items="props">
                            <td class="caption">{{props.item.rank}}</td>
                            <td class="caption">{{ props.item.attack }}</td>
                            <td class="caption">{{ props.item.dmg }}</td>
                            <td class="caption">{{ props.item.dmgPercent }}</td>
                            <td class="caption">{{ props.item.attempts}}</td>
                            <td class="caption">{{ props.item.hits}}</td>
                            <td class="caption">{{ props.item.hitPercent}}</td>
                            <td class="caption">{{ props.item.dps}}</td>
                        </template>
                    </v-data-table>
                </v-tab-item>
                <v-tab-item
                    key="tanking"
                    v-if="details('tanking').length">
                    <v-data-table
                        :headers="tankingHeaders"
                        :items="details('tanking')"
                        :loading="true"
                        class="elevation-1"
                        hide-actions
                        :rows-per-page-items='[10, 25,{"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}]'>
                        <v-progress-linear v-slot:progress color="green" :indeterminate="true" />
                        <template v-slot:items="props">
                            <td class="caption">{{props.item.rank}}</td>
                            <td class="caption">{{ props.item.attack }}</td>
                            <td class="caption">{{ props.item.dmgTaken }}</td>
                            <td class="caption">{{ props.item.attempts }}</td>
                            <td class="caption">{{ props.item.defended}}</td>
                            <td class="caption">{{ props.item.defendedPercent}}</td>
                            <td class="caption">{{ props.item.dtps}}</td>
                        </template>
                    </v-data-table>
                </v-tab-item>
                <v-tab-item
                    key="spells"
                    v-if="details('spells').length">
                    <v-data-table
                        :headers="spellHeaders"
                        :items="details('spells')"
                        :loading="true"
                        class="elevation-1"
                        hide-actions
                        :rows-per-page-items='[10, 25,{"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}]'>
                        <v-progress-linear v-slot:progress color="green" :indeterminate="true" />
                        <template v-slot:items="props">
                            <td class="caption">{{props.item.rank}}</td>
                            <td class="caption">{{ props.item.spell }}</td>
                            <td class="caption">{{ props.item.dmg }}</td>
                            <td class="caption">{{ props.item.dps }}</td>
                            <td class="caption">{{ props.item.casts}}</td>
                            <td class="caption">{{ props.item.successes}}</td>
                            <td class="caption">{{ props.item.failures}}</td>
                            <td class="caption">{{ props.item.interrupts}}</td>
                            <td class="caption">{{ props.item.type}}</td>
                        </template>
                    </v-data-table>
                </v-tab-item>
            </v-tabs>
</template>

<script>
import MaterialCard from './material/Card'
import _ from 'lodash'
export default {
    props: [  "participant", "fights" ],
    data: () => ({
        "dmgHeaders": [
            {
                text: "Rank",
                value: "rank", 
                sortable: true,
            },
            {
                text: "Attack Type",
                value: "attack",
                sortable: true,
            },
            {
                text: "Dmg",
                value: "dmg",
                sortable: true,
            },
            {
                text: "Dmg %",
                value: "dmgPercent",
                sortable: true,
            },
            {
                text: "Attempts",
                value: "attempts",
                sortable: true,
            },
            {
                text: "Hits",
                value: "hits",
                sortable: true,
            },
             {
                text: "Hit %",
                value: "hitPercent",
                sortable: true,
            },
            {
                text: "DPS",
                value: "dps",
                sortable: true,
            }
        ],
        "tankingHeaders": [
            {
                text: "Rank",
                value: "rank", 
                sortable: true,
            },
            {
                text: "Attack Type",
                value: "attack",
                sortable: true,
            },
            {
                text: "Dmg Taken",
                value: "dmgTaken",
                sortable: true,
            },
            {
                text: "Attempts",
                value: "attempts",
                sortable: true,
            },
            {
                text: "Defended",
                value: "defended",
                sortable: true,
            },
            {
                text: "Hit %",
                value: "maxDmg",
                sortable: true,
            },
             {
                text: "Dmg Taken / Sec",
                value: "dtps",
                sortable: true,
            },
        ],
        "spellHeaders": [
            {
                text: "Rank",
                value: "rank", 
                sortable: true,
            },
            {
                text: "Spell",
                value: "spell",
                sortable: true,
            },
            {
                text: "Dmg",
                value: "dmg",
                sortable: true,
            },
            {
                text: "DPS",
                value: "dps",
                sortable: true,
            },
            {
                text: "Casts",
                value: "casts",
                sortable: true,
            },
            {
                text: "Successes",
                value: "successes",
                sortable: true,
            },
            {
                text: "Failures",
                value: "failures",
                sortable: true,
            },
            {
                text: "Interrupts",
                value: "interrupts",
                sortable: true,
            },
            {
                text: "Spell Type",
                value: "type",
                sortable: true,
            },
        ],
    }),
    computed: {
        details: (state) => (type) =>  {
            let data = state.$store.getters.getParticipantStats(state._props.fights, state._props.participant)
            let partClass = state.$store.getters.getParticipantClass(state._props.participant)
            switch(type) {
                case 'basic':
                    return {
                        class: _.capitalize(partClass),
                        dmgDealt: (data.damage.dmgToMob > 1000) ? _.round(data.damage.dmgToMob / 1000, 1) + 'k' : data.damage.dmgToMob,
                        dps: _.round(data.damage.dmgToMob / data.general.duration, 2),
                        dmgTaken: (data.tanking.dmgFromMob > 1000) ? _.round(data.tanking.dmgFromMob / 1000, 1) + 'k' : data.tanking.dmgFromMob,
                        attacksFromMob: data.tanking.attacksFromMob,
                        actualHeal: (data.healing.actualHeal > 1000) ? _.round(data.healing.actualHeal / 1000, 1) + 'k' : data.healing.actualHeal,
                        overHeal: (data.healing.overHeal > 1000) ? _.round(data.healing.overHeal / 1000, 1) + 'k' : data.healing.overHeal,
                        achievements: data.achievements
                    }
                    break
                case 'damage':
                    let attacks = _.map(data.damage.attacks, (a, attack) => {
                        let val = {}
                        val.attack = _.capitalize(attack)
                        val.dmg = a.dmgToMob
                        val.dmgPercent = _.round(a.dmgToMob / data.damage.dmgToMob * 100, 2) + '%'
                        val.attempts = _.get(a, "attacksOnMob", 0)
                        val.hits = a.hitsOnMob
                        val.hitPercent = _.round((val.hits / val.attempts * 100), 2) + '%'
                        val.dps = _.round(a.dmgToMob / data.general.duration, 2)
                        return val
                    }).sort((a,b) => {
                        return (a.dmg > b.dmg) ? -1 : 1
                    })

                    return _.map(attacks, (val, index) => {
                        val.rank = index + 1
                        return val
                    })
                    break
                case 'tanking':
                    let tAttacks = _.map(data.tanking.attacks, (a, attack) => {
                        let val = {}
                        val.attack = _.capitalize(attack)
                        val.dmgTaken = a.dmgFromMob
                        val.attempts = _.get(a, "attacksFromMob", 0)
                        val.defended =_.get(a, "missesByMob", 0)
                        val.defendedPercent = _.round((val.defended / val.attempts * 100), 2) + '%'
                        val.dtps = _.round(a.dmgFromMob / data.general.duration, 2)
                        return val
                    }).sort((a,b) => {
                        return (a.dmgTaken > b.dmgTaken) ? -1 : 1
                    })

                    return _.map(tAttacks, (val, index) => {
                        val.rank = index + 1
                        return val
                    })
                    break
                case 'spells':
                    let spells = _.map(data.spells, (s, spell) => {
                        let val = {}
                        val.spell = spell
                        val.dmg = s.dmgToMob || s.actualHeal || '--'
                        val.dps = _.round(s.dmgToMob / data.general.duration, 2) || _.round(s.actualHeal / data.general.duration, 0) || '--'
                        val.casts = s.cast
                        val.successes = (s.hit > s.cast) ? s.cast : s.hit || s.cast
                        val.failures = (s.cast - s.hit > s.miss) ? s.cast - s.hit : s.miss || 0
                        val.interrupts = s.interrupted || 0
                        val.type = (s.dmgToMob) ? "Damage" : (s.actualHeal | s.overHeal) ? "Heal": "Other"
                        return val
                    }).sort((a,b) => {
                        return (a.casts > b.casts) ? -1 : 1
                    })

                    return _.map(spells, (val, index) => {
                        val.rank = index + 1
                        return val
                    })
                    break
            }
            return []     
        },
        target() {
            return this.participant
        },
        dmgChartData() {
            return this.$store.getters.getPersonalDmgStats(this.participant, this.fights)
        },
        healingChartData() {
            console.log('healing')
            return this.$store.getters.getPersonalHealStats(this.participant, this.fights)
        }
        
    },
    methods: {
        showDps() {
            return true
        },
        showHealing() {
            return true
        },
        showTanking() {
            return true
        },
        showSpells() {
            return true
        },
        chartOptions() {
           return {
               layout: {
                    padding: {
                        left: 45,
                        right: 45,
                        top: 45,
                        bottom: 45
                    }
                }
            };
        }
    }
}
</script>