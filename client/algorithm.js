let sendButton = document.querySelector('[data-send]');
let htmlres = document.querySelector('.results');

sendButton.addEventListener('click', async () => {
   let nickname = document.querySelector('[data-username]').value;
   if (!nickname || nickname === '') return
   sendButton.disabled = true;
   htmlres.textContent = '';
   let followList = await getFollowList(nickname.trim().toLowerCase());

   followList.forEach(async (stramer) => {
      let res = await fetch(`https://floating-tor-14733.herokuapp.com/getchatters/${stramer.to_name}`);
      let data = await res.json();

      data.forEach(user => {
         if (user == nickname) {
            let strelement = document.createElement('div');
            strelement.className = 'result-element';

            let link = document.createElement('a');
            link.href = `https://www.twitch.tv/${stramer.to_name}`
            link.textContent = stramer.to_name;

            strelement.append(link);
            htmlres.append(strelement);
         }
      })
   });

   sendButton.disabled = false;
});

async function getFollowList(name) {
   let id = await (await fetch(`https://floating-tor-14733.herokuapp.com/getid/${name}`)).text();
   let followList = await (await fetch(`https://floating-tor-14733.herokuapp.com/getfollows/${id}`)).json();
   return followList;
}