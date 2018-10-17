/*var count=0;
const { send } = require('micro');
const url = require('url');

const visits = {}

module.exports = function (request, response) {
  // Your microservice here
/*
        if(request.url = '/'){
          console.log(url.parse(request.url))
        count++;
      }
*/
/*
const { pathname } = url.parse(request.url)

    if(visits[pathname]){
      visits[pathname] = visits[pathname] + 1
    } else {
      visits[pathname] = 1
    }
  send(response, 200, '${visits[pathname]}');//request.url);//"Hey there !");
};
*/

const { send } = require('micro')
const url = require('url')
const level = require('level')
const promisify = require('then-levelup')
const db = promisify(level('visits.db',{
  valueEncoding:'json'
}))

module.exports = async function (request, response) {
  const { pathname } = url.parse(request.url)

  try {
    const currentVisits = await db.get(pathname)
    await db.put(pathname, currentVisits + 1)
  } catch (error) {
    if (error.notFound) await db.put(pathname, 1)
  }

  send(response, 200, `This page has ${await db.get(pathname)} visits!`)
}
