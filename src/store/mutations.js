import Parser from '../lib/parser'
import $socket from '../lib/socket-instance'
import settings from 'electron-settings'

export const mutations = {
  SOCKET_CONNECT(state) {
    if (!state.connection.connected) {
      state.connection = {
        connected: true,
        connectionEstablished: Date.now()
      }
      $socket.emit('time-sync', Date.now())
      if (!state.parser) state.parser = new Parser(settings.get('logpath'), $socket)
    } else {
      state.connection.connectionEstablished = Date.now()
      state.parser.setSocket($socket)
    }
  },
  SOCKET_DISCONNECT(state) {
    state.connection.connected = false
  },
  SOCKET_UPDATE_STATS(state, stats) {
    state.stats = stats
  },
  SOCKET_UPDATE_RAIDS(state, raids) {
    state.raids = raids
  },
  SOCKET_UPDATE_RAID_DUMP_REQUEST() {
    console.log("UPDATE YOUR RAID DUMMY")
  },
  SOCKET_HEARTBEAT(state) {
    $socket.emit('time-sync', Date.now() )
  }
}