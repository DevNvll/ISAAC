import math from "mathjs";

function clean(text) {
  if (typeof text === "string")
    return text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  else return text;
}

function evalMessage(message) {
  try {
    return math.eval(clean(message));
  } catch (err) {
    return "Eval error";
  }
}

export default {
  trigger: "!eval",
  onMessage(bot, channel, message) {
    if (message.content.startsWith("!eval")) {
      if (
        message.content.match(/!eval (.*)/i) &&
        message.content.match(/!eval (.*)/i)[1]
      ) {
        channel.sendMessage(
          evalMessage(message.content.match(/!eval (.*)/i)[1])
        );
        message.react("b");
      } else {
        message.reply("Usage: !eval <expression>");
      }
    }
  }
};
