<template>
  <v-app id="inspire" dark>
    <v-navigation-drawer
      v-model="drawer"
      clipped
      fixed
      app
    >
      <v-list two-line>
        <v-list-tile to="/">
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              Dashboard
          </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/settings">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              Settings
              </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-group
         no-action
         value="true"
         v-if="getRaids">
         <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>list</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                Raids
                </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
         </template>
         
         <v-list-tile
          v-for="(raid, raidLeader) in getRaids"
          v-bind:key="raidLeader">
          <v-list-tile-content>
            <v-list-tile-title>
              {{ raidLeader }}'s Raid
            </v-list-tile-title>
            <v-list-tile-sub-title>
              <span class="text--success">Active</span> {{ raid.length }} Members
            </v-list-tile-sub-title>
          </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>
        The Last Parser
      </v-toolbar-title>
    </v-toolbar>
    <v-content>

      <v-container fill-width>
        <v-layout justify-center align-center>
           <router-view></router-view>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer app fixed>
      <span>&copy; 2017</span>
      <v-icon v-if="connected">wifi</v-icon>
      <v-icon v-else>wifi_off</v-icon>
    </v-footer>
  </v-app>
</template>

<script>
  import FightList from './components/FightList'
  // renderer process
  export default {
    name: 'the-last-parser',
    components: {
      FightList
    },
    data: () => ({
      drawer: null,
    }),
    props: {
      source: String
    },
    computed: {
      connected () {
        return this.$store.state.connection.connected
      },
      getRaids() {
        return this.$store.state.raids
      }
    }
  }
</script>
<style lang="scss">
@import '@/styles/index.scss';

/* Remove in 1.2 */
.v-datatable thead th.column.sortable i {
  vertical-align: unset;
}
</style>