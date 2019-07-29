<template>
<v-flex
    md8>
    <material-card 
        color="orange"
          title="Damage Overview"
          light
         >
        <v-tabs
            fixed-tabs
            v-model="active">
            <v-tab
             key="dmgAttack"
             ripple> 
                By Attack Type 
             </v-tab>
             <v-tab
             key="dmgClass"
             ripple> 
                By Class 
             </v-tab>
             <v-tab-item
                key="dmgAttack">
                <pie-chart
                :data="chartData"
                :donut="true"
                legend="bottom"
                :messages='{empty: "Not enough data"}'
                :library="chartOptions" />
             </v-tab-item>
             <v-tab-item
                key="dmgClass">
                <pie-chart
                :data="chartData"
                :donut="true"
                legend="top"
                :messages='{empty: "Not enough data"}'
                :library="chartOptions" />
             </v-tab-item>
        </v-tabs>
    </material-card>
    
</v-flex>
</template>



<script>
import MaterialCard from './material/Card'
import _ from 'lodash'
export default {
    components: {
        MaterialCard
    },
    data: () => ({
    }),
    computed: {
        chartData() {
            return this.$store.getters.getFightDmgStats(this.$route.params.id)
        },
        chartOptions() {
           return {
               layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 30,
                        bottom: 0
                    }
                }
            };
        }
    }
}
</script>