import isObject from 'lodash/isObject'

let bypassRoles = ['master']

const checkPermissions = (message, command, client) => {
  let user = message.author
  let permissions = command.permissions || []
  if (command.permissions && isObject(command.permissions)) {
    let userRoles = message.guild.member(user).roles
    if (message.content.match(command.regex)) {
      if (message.content.match(command.regex)[1] in permissions) {
        if (userRoles.exists('name', permissions[message.content.match(command.regex)[1]]) || userRoles.exists('name', bypassRoles)) {
          return true
        }
      } else {
        return true
      }
    } else {
      return true
    }
  } else {
    if (permissions.length === 0) {
      return true
    }

    let userRoles = message.guild.member(user).roles

    for (let role of userRoles) {
      if (userRoles.exists('name', permissions[message.content.match(command.regex)[1]]) || userRoles.exists('name', bypassRoles)) {
        return true
      }
    }
  }
  return false
}

export default checkPermissions
