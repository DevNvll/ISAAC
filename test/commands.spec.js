/* eslint-env and, mocha */

const client = require('../lib/app')
let testingChannel = '208557085951000576'

describe('Commands', function () {
  describe('!echo', function () {
    it('bot should send the echoed message', function (done) {
      this.timeout(10000)
      client.on('ready', () => {
        client.sendMessage(testingChannel, '!echo test has passed')
      })
      client.on('message', (message) => {
        if (message.content.match(/!echo (.*)/i) && message.channel.id === testingChannel) done()
      })
    })
  })
})
