let api = require('twitch-api-v5');
api.clientID = '';

async function getChatters(streamer) {
   let result = await new Promise((resolve, reject) => {
      api.other.chatters({ channelName: streamer }, (err, res) => {
         if (err) {
            return err;
         } else {
            let currentVievers = res.chatters.viewers.concat(res.chatters.vips, res.chatters.moderators, res.chatters.broadcaster);
            resolve(currentVievers);
         };
      });
   });

   return result
}


module.exports = getChatters;