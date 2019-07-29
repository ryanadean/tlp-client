<template>
    <v-container
    fill-height
    fluid
    grid-list-xl
  >
        <v-layout
        justify-center
        wrap
        >
            <v-snackbar
             v-model="snackbar"
                value="snackbar"
                top
                color="blue-grey darken-3"
                :timeout="0"
            >
            
                <router-link
                    :to="'/fight/' + JSON.stringify(selected)" 
                    tag="v-btn">
                    <v-btn
                        color="info"
                        flat
                        value="fight">
                        Combine Fights
                    </v-btn>
                </router-link>

            <v-btn
                color="pink"
                flat
                @click="snackbar = false; selected = []"
            >
                Close
            </v-btn>
            </v-snackbar>
            <v-flex
                md12>
                <material-card 
                color="green"
                    title="Fights"
                    text=""
                    >
                    <v-data-table
                        v-model="selected"
                        :headers="headers"
                        :items="fights"
                        :loading="false"
                        select-all
                        class="elevation-1"
                        hide-actions>
                        <template v-slot:items="props">
                                <td>
                                    <v-checkbox
                                    v-model="props.selected"
                                    secondary
                                    hide-details
                                    ></v-checkbox>
                                </td>
                                <td>
                                    <router-link :to="'fight/' + encodeURIComponent(props.item.id)"  class="blue--text text--lighten-2">
                                        {{ props.item.name }}
                                    </router-link>
                                </td>
                                <td>{{ props.item.dmg }}</td>
                                <td>{{ props.item.time }}</td>
                                <td>{{ props.item.duration}}</td>
                                <td>{{ props.item.raidLeader }}</td>
                        </template>
                    </v-data-table>
                </material-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
import MaterialCard from './material/Card'
import _ from 'lodash'
import moment from 'moment'
import prettyMs from 'pretty-ms'
export default {
    components: {
        MaterialCard
    },
    data: function() {
        return {
            "headers": [
                {
                    text: "Enemy",
                    value: "name",
                    sortable: true,
                },
                {
                    text: "Damage",
                    value: "dmg",
                    sortable: true,
                },
                {
                    text: "Date",
                    value: "hits",
                    sortable: true,
                },
                {
                    text: "Duration",
                    value: "defenses",
                    sortable: false,
                },
                {
                    text: "Raid Leader",
                    value: "raidLeader",
                    sortable: false,
                }
            ],
            "selected": [],
            "snackbar": false
        }
    },
    computed: {
        fights() {
            let fs = this.$store.getters.getFights
            let fights = _.map(fs, (f) => {
                return  {
                    id: f.id,
                    name: f.target,
                    dmg: f.dmgToMob,
                    time:  moment(f.startTime * 1000).format("ddd. MMM DD, hh:mma"),
                    duration: prettyMs(moment(f.endTime*1000).diff(moment(f.startTime*1000))),
                    raidLeader: f.raidLeader,
                }
            })

            fights = fights.filter((v) => (v.dmg > 0)).sort((a, b) => {
                return (a.dmg > b.dmg) ? -1 : 1
            })
            
            return fights
            
        }
    },
    watch: {
        selected(newVal, oldVal) {
            this.snackbar = newVal.length > 0
        }
    }
}
</script>