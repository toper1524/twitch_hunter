"use strict"

const body = document.querySelector("body"); // Your interface
const url = 'https://floating-tor-14733.herokuapp.com'; // Link to your server

class TwitchFinder {
   constructor(uscreen, url) {
      this.screen = uscreen;
      this.url = url;
   }

   enter = (e) => {
      const inputList = document.querySelectorAll(".comandline__input");
      const value = inputList[inputList.length - 1].value.toLowerCase();
      const shortcommand = value.split(' ')[0];

      if (e.key == 'Tab') e.preventDefault();
      if (e.key != 'Enter' || value.length == 0) return

      switch (shortcommand) {
         case 'help':
            this.transfer(value, this.help);
            break
         case 'find':
            this.transfer(value, this.find);
            break
         case 'clear':
            this.transfer(value, this.clear);
            break
         default:
            this.transfer(value, this.nomatches);
      }
   }

   transfer = async (lcommand, callback) => {
      const comandline = document.querySelector('.comandline:last-of-type');
      comandline.innerHTML = `~/hunter [<span class="comandline__status">user</span>] <span class="comandline__sing">$</span> <span class="comandline__input">${lcommand}</span>`;
      await callback(lcommand);
      this.sendMessage('<p class="comandline">~/hunter [<span class="comandline__status">user</span>] <span class="comandline__sing">$</span> <input type="text" class="comandline__input" placeholder="help" autofocus></p>');
      document.querySelector('.comandline__input:first-of-type').focus();
   }

   help = () => {
      this.sendMessage('<p class="message">* find &lt;username&gt; - search \n* clear - clear the console \n* help - this inscription</p>');
   }

   nomatches = () => {
      this.sendMessage('<p class="message">We don\'t know such a command</p>');
   }

   clear = () => {
      this.screen.innerHTML = '';
   }

   loaded = () => {
      this.sendMessage('<p class="comandline">~/hunter [<span class="comandline__status">user</span>] <span class="comandline__sing">$</span> <input type="text" class="comandline__input" placeholder="help" autofocus></p>');
   }

   find = async (icomand) => {
      let name = icomand.split(' ')[1];
      if (!name || name.length === 0) return this.sendMessage(`You didn't enter a username.`);

      let follows = await this.getFollows(name);

      if (follows.length != 0) {
         this.sendMessage(`<p class="message">${follows.join(', ')}.</p>`);
      } else {
         return this.sendMessage(`The user was not found or has no subscriptions.`);
      }

      let status = await this.getStatus(name, follows);

      if (status.length === 0) {
         this.sendMessage('The user was not detected in any of the chats.');
      } else {
         let output = status.map(element => `<a href="https://www.twitch.tv/${element}" target="_blank">${element}</a>`).join(', ');
         this.sendMessage(`<p class="message">${name} found in the chat rooms: ${output}.</p>`);
      }
   }

   getFollows = async (nickname) => {
      let id = await (await fetch(`${this.url}/getid/${nickname}`)).text();

      try {
         let followList = await (await fetch(`${this.url}/getfollows/${id}`)).json();
         return followList.map(streamer => streamer.to_name);
      } catch {
         return [];
      }
   }

   getStatus = async (nickname, followList) => {
      let result = [];

      let promises = followList.map(async streamer => {
         let data = await (await fetch(`${this.url}/getchatters/${streamer}`)).json();
         data.map(user => (user == nickname) ? result.push(streamer) : null);
      });

      await Promise.all(promises);

      return result;
   }

   sendMessage = (message) => {
      this.screen.insertAdjacentHTML('beforeend', message);
   }
}

const finder = new TwitchFinder(body, url);

document.onmousedown = (e) => e.preventDefault();
document.onkeydown = finder.enter;
window.onload = finder.loaded;