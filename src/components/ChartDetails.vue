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
        <DmgCard />
        <TimelineCard 
          v-if="hasTimeline" />
    </v-layout>
  </v-container>
</template>

<script>
  import DmgCard from './DmgCard'
  import TimelineCard from './TimelineCard'
  import _ from 'lodash'

  export default {
    components: {
      DmgCard,
      TimelineCard,
    },
    computed: {
      hasTimeline() {
        try {
          let parsed = JSON.parse(this.$route.params.id)

          return !_.isArray(parsed) 
        } catch (error) {
          return true
        }
      }
    }
  }
</script>