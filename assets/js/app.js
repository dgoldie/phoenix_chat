// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"
import {Socket, Presence} from "phoenix"

// Socket
let user = document.getElementById("User").innerText
console.log('user = ', user);

let socket = new Socket("/socket", {params: {user: user}})
socket.connect()

let channel = socket.channel("room:lobby", {})
let presence = new Presence(channel)

function renderOnlineUsers(presence) {
  console.log('renderOnlineUsers', presence)
  let response = ""

  presence.list((id, {metas: [first, ...rest]}) => {
    let count = rest.length + 1
    response += `<br>${id} (count: ${count})</br>`
  })

  // document.querySelector("main[role=main]").innerHTML = response
  document.getElementById("UserList").innerHTML = response

}

socket.connect()

presence.onSync(() => renderOnlineUsers(presence))

channel.join()


let formatTimestamp = (timestamp) => {
  let date = new Date(timestamp * 1000)
  return date.toLocaleTimeString()
}
// let listBy = (user, {metas: metas}) => {
//   return {
//     user: user,
//     onlineAt: formatTimestamp(metas[0].online_at)
//   }
// }

// let userList = document.getElementById("UserList")
// let render = (presences) => {
//   console.log('render presences', presences);

//   userList.innerHTML = Presence.list(presences, listBy)
//     .map(presence => `
//       <li>
//         <b>${presence.user}</b>
//         <br><small>online since ${presence.onlineAt}</small>
//       </li>
//     `)
//     .join("")
// }

// Channels


// room.on("presence_state", state => {
//   console.log('room on state', state);
//   presences = Presence.syncState(presences, state)
//   render(presences)
// })

// room.on("presence_diff", diff => {
//   console.log('room on diff', diff);
//   presences = Presence.syncDiff(presences, diff)
//   render(presences)
// })

// room.join()

// Chat
let messageInput = document.getElementById("NewMessage")
messageInput.addEventListener("keypress", (e) => {
  if (e.keyCode == 13 && messageInput.value != "") {
    channel.push("message:new", messageInput.value)
    messageInput.value = ""
  }
})

let messageList = document.getElementById("MessageList")
let renderMessage = (message) => {
  let messageElement = document.createElement("li")
  messageElement.innerHTML = `
    <b>${message.user}</b>
    <i>${formatTimestamp(message.timestamp)}</i>
    <p>${message.body}</p>
  `
  messageList.appendChild(messageElement)
  messageList.scrollTop = messageList.scrollHeight;
}

channel.on("message:new", message => renderMessage(message))


