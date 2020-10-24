const fetch = require('node-fetch');
const auth = require('./auth');

async function getUser(username) {
   let response = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, auth);
   let result = await response.json();

   if (result.data.length) {
      return result.data[0].id
   } else {
      return 'User not found!'
   }
}
module.exports = getUser;