import minimist from "minimist";

export default {
  name: "Echo",
  description: "Echoes the message",
  command: "!echo <message>",
  trigger: "!echo",
  permissions: [],
  onMessage(bot, channel, message) {
    if (message.content.startsWith("!echo")) {
      if (
        message.content.match(/!echo (.*)/i) &&
        message.content.match(/!echo (.*)/i)[1]
      ) {
        let args = minimist(message.content.match(/!echo (.*)/i)[1].split(" "));
        let msg = message.content.match(/!echo (.*)/i)[1];
        channel.sendMessage(
          Object.keys(args).length > 1 ? JSON.stringify(args) : msg
        );
      } else {
        message.reply("Usage: !echo message");
      }
    }
  }
};
