'use strict';

const http = require('http');
const config = require('../config');
const log = config.log();
const request = require('superagent');
const service = require('../server/service')(config);
const server = http.createServer(service);
//server.listen(process.env.port || 3001);
server.listen();

server.on('listening', function() {
    log.info(`Elevation Service is listening on ${server.address().port} in ${service.get('env')} mode`);

    const mainUrl = 'http://127.0.0.1:3000';

    const announce = () => {
        request.put(`${mainUrl}/service/elevation/${server.address().port}`)
        .end((err) => {
            if(err) log.error(err);
        })
    }

    announce();
    setInterval(announce, 20 * 1000);
});