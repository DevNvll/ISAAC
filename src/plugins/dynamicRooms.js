const REFRESH_RATE = 1000
const GAMES_CATEGORY_NAME = 'Games'

export default {
  onReady(client) {
    setInterval(() => {
      const voiceChannels = client.channels.filter(
        channel =>
          channel.parent &&
          channel.parent.name === GAMES_CATEGORY_NAME &&
          channel.type === 'voice'
      )
      const nonEmptyVoiceChannels = voiceChannels.filter(
        channel => channel.members.array().length >= 1
      )
      const emptyVoiceChannels = voiceChannels.filter(
        channel => channel.members.array().length === 0
      )
      if (emptyVoiceChannels.array().length === 0) {
        client.guilds
          .first()
          .createChannel('🔁·', 'voice')
          .then(createdChannel => {
            createdChannel
              .setParent(
                client.guilds
                  .first()
                  .channels.find(c => c.name === GAMES_CATEGORY_NAME).id
              )
              .catch(err => console.log(channel.name))
          })
          .catch(err => console.log(channel.name))
      }
      if (
        emptyVoiceChannels.array().length > 1 &&
        voiceChannels.array().length > 1
      ) {
        if (emptyVoiceChannels.last()) emptyVoiceChannels.last().delete()
      }
    }, REFRESH_RATE)
  }
}

