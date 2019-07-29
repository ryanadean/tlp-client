<template>
  <v-dialog v-model="dialog" :max-width="options.width" @keydown.esc="cancel" v-bind:style="{ zIndex: options.zIndex }">
    <v-card dense light>
      <v-card-title class="headline blue lighten-2 elevation-3">
        {{ participant }}
      </v-card-title>
      <v-card-text>
        <ParticipantDetails
         :participant="this.participant"
         :fights="this.fights"
         />
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" flat="flat" @click.native="agree">Done</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  /**
   * Vuetify Confirm Dialog component
   *
   * Insert component where you want to use it:
   * <confirm ref="confirm"></confirm>
   *
   * Call it:
   * this.$refs.confirm.open('Delete', 'Are you sure?', { color: 'red' }).then((confirm) => {})
   * Or use await:
   * if (await this.$refs.confirm.open('Delete', 'Are you sure?', { color: 'red' })) {
   *   // yes
   * }
   * else {
   *   // cancel
   * }
   *
   * Alternatively you can place it in main App component and access it globally via this.$root.$confirm
   * <template>
   *   <v-app>
   *     ...
   *     <confirm ref="confirm"></confirm>
   *   </v-app>
   * </template>
   *
   * mounted() {
   *   this.$root.$confirm = this.$refs.confirm.open
   * }
   */

  import ParticipantDetails from './ParticipantDetails'

  export default {
    components: {
      ParticipantDetails
    },
    data: () => ({
      dialog: false,
      resolve: null,
      message: null,
      title: null,
      options: {
        color: 'blue lighten-2',
        width: 800,
        zIndex: 200
      }
    }),
    methods: {
      open(participant, fights, options) {
        this.dialog = true
        this.participant = participant
        this.fights = fights
        this.options = Object.assign(this.options, options)
      },
      agree() {
        this.dialog = false
      },
    }
  }
</script>