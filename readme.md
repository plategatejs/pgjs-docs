# PlateGateJS

PlateGateJS is a gate control system that bases on registration plates' recognition.
Basically it uses images from camera, recognizes car plates on them and opens the gate if its needed.

## Summary
PlateGateJS:

* is implemented mostly in JS/Node with a few native modules  
* uses [OpenAlpr](https://github.com/openalpr/openalpr) for plate recognition
* uses [Redis](http://redis.io) pub/sub for communication
* uses [MongoDB](https://mongodb.org) for data storage
* [pgjs-camera](https://github.com/plategatejs/pgjs-camera) and [pgjs-gate](https://github.com/plategatejs/pgjs-gate) modules are adjusted for Intel Galileo

## Architecture
System consists of 6 independent modules/services. They all have clean and simple interfaces making them easy to replace by any custom implementation.

### [pgjs-camera](https://github.com/plategatejs/pgjs-camera)
Uses camera to take images and exposes the last taken one on Rest endpoint.

### [pgjs-gate](https://github.com/plategatejs/pgjs-gate)
Exposes Rest endpoint for opening the gate.

### [pgjs-console](https://github.com/plategatejs/pgjs-console)
Rest api for managing users and their cars. Also allows for manual gate control. It is the only module that talks with [MongoDB](https://mongodb.org).

### [pgjs-dashboard](https://github.com/plategatejs/pgjs-dashboard)
Web interface for [pgjs-console](https://github.com/plategatejs/pgjs-console).  

### [pgjs-recognizer](https://github.com/plategatejs/pgjs-recognizer)
Module for plate recognition. Subscribes to [Redis](http://redis.io) _images_ queue, tries to recognize plates and publishes results to _plates_ queue.

### [pgjs-controller](https://github.com/plategatejs/pgjs-controller)
System controller that binds all remaining modules together. It:

* passively requests images (in specified time intervals) from [pgjs-camera](https://github.com/plategatejs/pgjs-camera)
* publishes those images for recognition to _images_ queue by [pgjs-recognizer](https://github.com/plategatejs/pgjs-recognizer)
* subscribes to _plates_ queue for recognized plates
* checks if any recognized plate is allowed to enter by querying [pgjs-console](https://github.com/plategatejs/pgjs-console) api
* opens the gate, on success, using [pgjs-gate](https://github.com/plategatejs/pgjs-gate) api
 
## Basic setup
By default, all modules access each other by names.

To run all modules on single host, the easiest way will probably be to add _/etc/hosts_ entries:
```
127.0.0.1       pgjs-mongo
127.0.0.1       pgjs-redis
127.0.0.1       pgjs-camera
127.0.0.1       pgjs-console
127.0.0.1       pgjs-dashboard
127.0.0.1       pgjs-controller
127.0.0.1       pgjs-gate
```

[Redis](http://redis.io) and [MongoDB](https://mongodb.org) can be run, for example, with [Docker](https://www.docker.com):
```
docker run --name mongo -p 27017:27017 -d mongo:2.6
docker run --name redis -p 6379:6379 -d redis:3.0.6
```

And to run all 6 modules just clone them, install dependencies and start:
```
git clone <repo>
cd <repo>
npm install
npm start
```

## License
[MIT](license.md)
