'use strict';

const request = require('superagent');
module.exports.process = function process(intentData, registry, log, cb){

    console.log(intentData);

    if(intentData.intent[0].value !== 'elevation')
        return cb(new Error('expected elevation intent but got '+ intentData.intent[0].value));

    const location = intentData.location[0].value;

    const service = registry.get('elevation');
    if(!service) return cb(false, 'no service available');


    //request.get('http://127.0.0.1:3001/service/'+location)
    request.get(`http://${service.ip}:${service.port}/service/${location}`)
    .then((res) => {
        if(!res.body.result) return cb('Error with elevation service');
        return cb(null, `${location} is at the elevation of ${res.body.result} metres`);
    })
}