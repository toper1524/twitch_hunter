const fetch = require('node-fetch');
const auth = require('./auth');

async function getFollows(id) {
   let response = await fetch(`https://api.twitch.tv/helix/users/follows?from_id=${id}&first=100`, auth);
   let result = await response.json();

   if (Object.keys(result.pagination).length === 0) {
      return result.data;
   } else {
      return main(result.data, result.pagination.cursor, id);
   }
}


async function main(base, pagination, id) {
   let result = base;
   let res = await fetch(`https://api.twitch.tv/helix/users/follows?from_id=${id}&first=100&after=${pagination}`, auth);
   let json = await res.json();
   result.push(...json.data);

   if (Object.keys(json.pagination).length === 0) {
      return result;
   } else {
      main(result, json.pagination.cursor, id);
   }
}

module.exports = getFollows;