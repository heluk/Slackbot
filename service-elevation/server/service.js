'use strict';

const express = require('express');
const service = express();
const request = require('superagent');
const moment = require('moment');

module.exports = (config) => {
    const log = config.log();
    service.get('/service/:location', (req, res, next) => {
        request.get(`https://maps.googleapis.com/maps/api/geocode/json`)
        .query({address: req.params.location})
        .query({key: config.googleGeoApiKey})
        .end((err, geoResult) => {
            if(err){
                return next(err);
            }
            const location = geoResult.body.results[0].geometry.location;

            console.log(location);

            request.get('https://maps.googleapis.com/maps/api/elevation/json')
            .query({locations: `${location.lat}, ${location.lng}`})
            .query({key: config.googleElevationApiKey})
            .end((err, elevationRes) => {
                if(err){
                    return next(err);
                }
                const elevation = Math.floor(elevationRes.body.results[0].elevation);
                console.log("elevation ", elevation);
                
                return res.json({result: elevation});
            })
            //log.info(`New request for ${req.params.location}`);
            //return res.json({result: req.params.location});
        });
    });
    return service;
};