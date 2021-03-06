'use strict';

const config = require('../config');
const log = config.log();
const service = require('../server/service')(config);
const serviceRegistry = service.get('serviceRegistry');
const SlackClient = require('../server/SlackClient');
const WitClient = require('../server/WitClient');
const http = require('http');
// create server
const server = http.createServer(service);
const witClient = new WitClient(config.witToken);
const slackClient = new SlackClient(config.slackToken, witClient, config.botName, 'info', log, serviceRegistry);

slackClient.start(() =>{
    // listen event
    server.listen(process.env.PORT || 3000);
});

server.on('listening', function(){
    log.info(`Slackbot is listen on ${server.address().port} in ${service.get('env')} mode`);
});
