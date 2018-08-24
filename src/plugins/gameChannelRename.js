import { countBy, sortBy, max } from 'lodash'


import genericList from '../utils/genericNames'


const REFRESH_RATE = 500

const GAMES_CATEGORY_NAME = 'Games'

const PREFIX = '🎮'


function getGeneric(id) {

  return genericList[id - 1]

}


function renameGame(name) {

  //rename game to a shorter name if necessary

  switch (name) {

    case "PLAYERUNKNOWN'S BATTLEGROUNDS":

      return 'PUBG'

      break

    default:

      return name

  }

}


export default {

  onReady(client) {

    setInterval(() => {

      const channelList = client.channels.filter(

        channel =>

          channel.parent &&

          channel.parent.name === GAMES_CATEGORY_NAME &&

          channel.type === 'voice'

      )


      channelList.map(channel => {

        let gameList = []

        const roomIndex =

          channelList.array().indexOf(channelList.find('id', channel.id)) + 1

        channel.members.map(member => {

          if (member.presence.game) gameList.push(member.presence.game.name)

        })

        if (gameList.length >= 1) {

          let occur = countBy(gameList)

          let mostPlayed = Object.keys(occur).reduce(

            (a, b) => (occur[a] > occur[b] ? a : b)

          )

          if (occur[mostPlayed] >= 2) {

            channel.setName(PREFIX + renameGame(mostPlayed))

            channel.playing = true

          }

        } else if (genericList[roomIndex - 1] !== channel.name) {

          channel.playing = false

          channel.setName(getGeneric(roomIndex))

        }

        if (genericList[roomIndex - 1] !== channel.name && !channel.playing)

          channel.setName(getGeneric(roomIndex))

      })

    }, REFRESH_RATE)

  }

}

