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
<v-flex
    md4>
    <material-card 
        color="orange"
          title="Basic Stats"
        light >
        <pie-chart
        :data="chartData"
        :options="chartOptions" />
    </material-card>
    
</v-flex>
    </v-layout>
</v-container>
</template>



<script>
import MaterialCard from './material/Card'
import { PieChart } from 'vue-chartisan'
import _ from 'lodash'
export default {
    components: {
        MaterialCard,
        PieChart
    },
    data: () => ({
    }),
    computed: {
        chartData() {
            let data = this.$store.getters.getDetailedStats("Lady vox")
            let chartData = {
                labels: [],
                series: [],
            }
            let total = _.get(data, "meta.dmgTaken", 0)
            _.each(data, (val, key) => {
                if (_.isObject(val) && key != "meta") {
                    if (val.dmg / total > .03) {
                        chartData.labels.push(key)
                        chartData.series.push(val.dmg)
                    }
                }
            })

            return chartData
        },
        chartOptions() {
           return {
                labelInterpolationFnc: function(value) {
                    return _.capitalize(value)
                },
                chartPadding: 20,
                labelDirection: "explode", 
                labelOffset: 20,
                donut: true,
                donutWidth: 20,
            };
        }
    }
}
</script>

<style lang="scss">
    .ct-label {
        color: #81c784
    }
</style>
