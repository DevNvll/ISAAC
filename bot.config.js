import os from 'os'

export default {
  name: 'ISAAC',
  playing: `Uptime: ${Math.floor(os.uptime() / 60 / 60)} hours`,
  plugins: [
    'echo',
    'steamtime',
    'divisionTracker',
    'gameChannelRename',
    'dynamicRoom',
    'invoke'
  ]
}

