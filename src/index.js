import Discord from 'discord.js'
import chalk from 'chalk'
import checkPermissions from './utils/permissions'
import config from '../bot.config'
require('now-env')

const client = new Discord.Client()
const dev = process.env.NODE_ENV !== 'production'
let plugins = []

// setup plugins

console.log('> Loading %s plugins', config.plugins.length)

config.plugins.map(name => {
  try {
    plugins.push(require('./plugins/' + name).default)
  } catch (err) {
    console.log('> Plugin not found:', name)
  }
})

console.log('> Plugins loaded')

client.login(dev ? process.env.ETHAN_DEV_TOKEN : process.env.ETHAN_TOKEN)

client.on('ready', () => {
  if (process.env.NODE_ENV === 'development')
    console.log(
      '>',
      chalk.red.bold(config.name),
      chalk.blue('is ready to go in development mode!')
    )

  if (config.playing) {
    client.user.setPresence({
      game: {
        name: config.playing
      }
    })
  }
  for (let plugin of plugins) {
    if (plugin.onReady) plugin.onReady(client)
  }
  require('http')
    .createServer(() => {})
    .listen(3000) // zeit next workarout
})

client.on('message', message => {
  if (message.author.bot) return
  for (let plugin of plugins) {
    if (plugin.onMessage) {
      let hasPermission = checkPermissions(message, plugin, client)
      if (hasPermission) {
        plugin.onMessage(client, message.channel, message)
      } else {
        message.reply("You don't have the permission to use this command.")
      }
    }
  }

  if (message.isMentioned(client.user)) {
    for (let plugin of plugins) {
      if (plugin.onBotMention) {
        let hasPermission = checkPermissions(message, plugin, client)
        if (hasPermission) {
          plugin.onBotMention(client, message.channel, message)
        } else {
          message.reply("You don't have the permission to use this command.")
        }
      }
    }
  }
})


client.on('guildMemberAdd', member => {
  for (let plugin of plugins) {
    if (plugin.onNewMember) {
      plugin.onNewMember(member)
    }
  }
})

client.on('guildMemberRemove', member => {
  for (let plugin of plugins) {
    if (plugin.onMemberRemoved) {
      plugin.onMemberRemoved(member)
    }
  }
})


client.on('guildCreate', guild => {
  for (let plugin of plugins) {
    if (plugin.onGuildEnter) {
      plugin.onGuildEnter(guild)
    }
  }
})

client.on('guildDelete', guild => {
  for (let plugin of plugins) {
    if (plugin.onGuildLeave) {
      plugin.onGuildLeave(guild)
    }
  }
})

function shutdown() {
  if (client) {
    client.destroy()
  }
  console.log('Shutting down.')
  process.exit()
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
process.on('exit', shutdown)

export default client
