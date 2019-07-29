<template>
    <v-container>
        <v-layout>
            <ChartDetails />
        </v-layout>
        <v-container
        fill-height
        fluid
        grid-list-xl>
            <v-layout
                justify-center
                wrap
                >
                <v-flex
                    md12>
                    <material-card 
                        color="green"
                        :title="target"
                        text="Detailed Fight Breakdown"
                        >
                            <v-tabs>
                                <v-tab
                                    ripple
                                    key="basicInfo">
                                    Basic </v-tab>
                                <v-tab
                                    ripple
                                    key="healing">
                                    Healing </v-tab>
                                <v-tab
                                    ripple
                                    key="tanking">
                                    Tanking </v-tab>
                                <v-tab
                                    ripple
                                    key="spells">
                                    Spell Info</v-tab>   
                                <v-tab-item
                                    key="basicInfo">
                                    <v-data-table
                                        :headers="basicHeaders"
                                        :items="details('general')"
                                        :loading="true"
                                        class="elevation-1"
                                        hide-actions
                                        :rows-per-page-items='[10, 25,{"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}]'>
                                        <v-progress-linear v-slot:progress color="green" :indeterminate="true" />
                                        <template v-slot:items="props">
                                            <td class="caption">{{props.item.rank}}</td>
                                            <td class="caption"><a @click="openDialog(props.item.name, [fightId])" class="blue--text text--lighten-2">{{ props.item.name }}</a></td>
                                            <td class="caption">{{ props.item.dmg }}</td>
                                            <td class="caption">{{ props.item.dmgPercent }}</td>
                                            <td class="caption">{{ props.item.meleeDmg}}</td>
                                            <td class="caption">{{ props.item.spellDmg}}</td>
                                        </template>
                                    </v-data-table>
                                </v-tab-item>
                                <v-tab-item
                                    key="healing">
                                    <v-data-table
                                        :headers="healingHeaders"
                                        :items="details('healing')"
                                        :loading="true"
                                        class="elevation-1"
                                        hide-actions
                                        :rows-per-page-items='[10, 25,{"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}]'>
                                        <v-progress-linear v-slot:progress color="green" :indeterminate="true" />
                                        <template v-slot:items="props">
                                            <td class="caption">{{props.item.rank}}</td>
                                            <td class="caption">{{ props.item.name }}</td>
                                            <td class="caption">{{ props.item.actualHeal }}</td>
                                            <td class="caption">{{ props.item.healShare }}</td>
                                            <td class="caption">{{ props.item.overHeal}}</td>
                                            <td class="caption">{{ props.item.totalHeal}}</td>
                                        </template>
                                    </v-data-table>
                                </v-tab-item> 
                                <v-tab-item
                                    key="tanking">
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
                                            <td class="caption">{{ props.item.name }}</td>
                                            <td class="caption">{{ props.item.dmgTaken }}</td>
                                            <td class="caption">{{ props.item.dmgTakenShare }}</td>
                                            <td class="caption">{{ props.item.hits}}</td>
                                        </template>
                                    </v-data-table>
                                </v-tab-item>
                                <v-tab-item
                                    key="spells">
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
                                            <td class="caption">{{ props.item.name }}</td>
                                            <td class="caption">{{ props.item.dmg }}</td>
                                            <td class="caption">{{ props.item.dmgPercent }}</td>
                                            <td class="caption">{{ props.item.casts}}</td>
                                            <td class="caption">{{ props.item.misses}}</td>
                                            <td class="caption">{{ props.item.hitPercent}}</td>
                                            <td class="caption">{{ props.item.sources.length }}</td>
                                        </template>
                                    </v-data-table>
                                </v-tab-item>
                            </v-tabs>
                        </material-card>
                </v-flex>
            </v-layout>
        </v-container>
        <ParticipantModal ref="partModal"/>
    </v-container>
</template>

<script>
import MaterialCard from './material/Card'
import ChartDetails from './ChartDetails'
import ParticipantModal from './ParticipantModal'
import _ from 'lodash'
export default {
    components: {
        MaterialCard,
        ChartDetails,
        ParticipantModal
    },
    data: () => ({
        "basicHeaders": [
            {
                text: "Rank",
                value: "rank", 
                sortable: true,
            },
            {
                text: "Attacker",
                value: "name",
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
                text: "Melee Dmg",
                value: "meleeDmg",
                sortable: true,
            },
            {
                text: "Spell Dmg",
                value: "spellDmg",
                sortable: true,
            }
        ],
        "spellHeaders": [
            {
                text: "Rank",
                value: "rank", 
                sortable: true,
            },
            {
                text: "Spell",
                value: "name",
                sortable: true,
            },
            {
                text: "Dmg",
                value: "dmg",
                sortable: true,
            },
            {
                text: "Magic Dmg %",
                value: "dmgPercent",
                sortable: true,
            },
            {
                text: "Spellcasts",
                value: "casts",
                sortable: true,
            },
            {
                text: "Spell Failures",
                value: "misses",
                sortable: true,
            },
             {
                text: "Spell Hit %",
                value: "hitPercent",
                sortable: true,
            },
            {
                text: "Sources",
                value: "sources",
                sortable: true,
            }
        ],
        "healingHeaders": [
            {
                text: "Rank",
                value: "rank", 
                sortable: true,
            },
            {
                text: "Healer",
                value: "name",
                sortable: true,
            },
            {
                text: "Actual Healing",
                value: "actualHeal",
                sortable: true,
            },
            {
                text: "Healing %",
                value: "healShare",
                sortable: true,
            },
            {
                text: "Overhealing",
                value: "overHeal",
                sortable: true,
            },
            {
                text: "Total Healing",
                value: "totalHeal",
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
                text: "Tank",
                value: "name",
                sortable: true,
            },
            {
                text: "Dmg Taken",
                value: "dmgTaken",
                sortable: true,
            },
            {
                text: "Dmg Taken %",
                value: "dmgTakenShare",
                sortable: true,
            },
            {
                text: "Hits",
                value: "hits",
                sortable: true,
            }
        ]
    }),
    computed: {
        details: (state) => (type) =>  {
            return state.$store.getters.getFightDetails(state.$route.params.id, type)            
        },
        target() {
            try {
                let parsed = JSON.parse(decodeURIComponent(this.$route.params.id))
                if (_.isArray(parsed)) {
                    return "Combined Fights [" + _.map(parsed, (p) => {
                        
                       return _.first(_.split(decodeURIComponent(p.id), "|"))
                    }).join(', ') + "]"
                }
                else return decodeURIComponent(this.$route.params.id)
            } catch (error) {
                return _.first(_.split(decodeURIComponent(this.$route.params.id), "|"))
            }
            return _.first(_.split(decodeURIComponent(this.$route.params.id), "|"))
        },
        fightId() {
            return this.$route.params.id
        }
    },
    methods: {
        openDialog(participant, fights, options) {
            this.$refs.partModal.open(participant, fights, options)
        }
    }
}
</script>