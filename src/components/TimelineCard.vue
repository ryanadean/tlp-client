<template>
<v-flex
    md8>
    <material-card 
        color="orange"
        title="Timeline Overview"
        light >
        <v-tabs
            fixed-tabs
            v-model="active">
            <v-tab
                key="dmgTimeline"
                ripple>
                Damage
            </v-tab>
            <v-tab 
                key="eventTimeline" 
                ripple>
                Events
            </v-tab>
            <v-tab-item 
                key="dmgTimeline">
                <line-chart
                :data="chartData"
                :library="chartOptions"
                :discrete="true"
                :messages='{empty: "Not enough data"}'
                thousands=","
                xtitle="Time (minutes and seconds)"
                legend="bottom" />
            </v-tab-item>
            <v-tab-item 
                key="eventTimeline">
                <line-chart
                :data="chartData"
                :library="chartOptions"
                :discrete="true"
                :messages='{empty: "Not enough data"}'
                thousands=","
                xtitle="Time (minutes and seconds)"
                legend="top" />
            </v-tab-item>
        </v-tabs>
    </material-card>
    
</v-flex>
</template>
<script>
import MaterialCard from './material/Card'
import _ from 'lodash'
import moment from 'moment'
import prettyMs from'pretty-ms'
export default {
    components: {
        MaterialCard,
    },
    data: () => ({
    }),
    computed: {
        chartData() {
            return this.$store.getters.getTimelineStats(this.$route.params.id)
        },
        chartOptions() {
           return {
                scales: {
                    xAxes: [{
                        ticks: {
                            callback: (v, i, vs) => {
                                return prettyMs((v - vs[0]) * 1000)
                            }
                        }
                    }],
                    yAxes: [{
                        id: 'TOTAL',
                        ticks: {
                            callback: (v) => (_.round(v / 1000, 1) + 'k')
                        },
                        scaleLabel: {
                            labelString: "1000's of Damage",
                            display: true
                        }
                    },
                    {
                        id: 'DPS',
                        position: 'right',
                        display: 'auto',
                        scaleLabel: {
                            labelString: 'DPS',
                            display: true
                        }
                    }]

                },
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 30,
                        bottom: 0
                    }
                }
            }
          
        } 
    }
}
</script>


