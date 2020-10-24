const express = require('express');
const app = express();
const config = require('./config');
const getUser = require('./get_id.js');
const getFollows = require('./get_follows');
const getChatters = require('./get_chatters.js');

app.use('/getid', async (req, res, next) => {
   let username = req.path.replace(/[^a-zA-Z0-9_-]/ig, '').toString().toLowerCase().trim();
   res.set('Access-Control-Allow-Origin', '*');

   if (!username || username.length === 0) {
      res.end('Empty request');
      return
   };

   let result = await getUser(username);
   res.send(result);

   next()
})

app.use('/getfollows', async (req, res, next) => {
   let id = req.path.replace(/[^0-9]/g, '').trim();
   res.set('Access-Control-Allow-Origin', '*');

   if (isNaN(id) || id.length === 0) {
      res.end('Invalid id');
      return
   }

   let result = await getFollows(id);
   res.send(result);

   next()
})

app.use('/getchatters', async (req, res) => {
   let username = req.path.replace(/[^a-zA-Z0-9_-]/ig, '').toString().toLowerCase().trim();
   res.set('Access-Control-Allow-Origin', '*');

   if (!username || username.length === 0) {
      res.end('Empty request');
      return
   };

   let result = await getChatters(username);
   res.send(result);
})

app.listen(process.env.PORT || config.port, () => {
   console.log(`Example app listening at http://localhost:${process.env.PORT || config.port}`)
})