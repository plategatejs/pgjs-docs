/*
Script for counting PlateGateJS (C++ and Javascript) lines of code
*/

var exec = require('child_process').exec;

var path = '~/Projects/',
    data = [],
    completed = 0,
    projects = [
      'pgjs-camera',
      'pgjs-console',
      'pgjs-controller',
      'pgjs-gate',
      'pgjs-recognizer'
    ];

var summary = function () {
  var loc = {
    cpp: 0,
    js: 0
  };

  data.forEach(function (entry) {
    entry
      .split('\n')
      .filter(function (line) {
        return !!~line.indexOf('Javascript') || !!~line.indexOf('C++');
      })
      .map(function (line) {
        return line.split(' ').filter(function (chunk) {
          return chunk.length > 0;
        });
      })
      .forEach(function (line) {
        loc.cpp += line[0] == 'C++' ? parseInt(line[4]) : 0;
        loc.js += line[0] == 'Javascript' ? parseInt(line[4]) : 0;
      });
  });

  console.log('C++: ' + loc.cpp + ', Javascript: ' + loc.js + '.');
};

var callback = function (err, stdout) {
  data.push(stdout);

  if (++completed == projects.length) {
    summary();
  }
};

projects.forEach(function (project, i) {
  exec('cloc --exclude-dir=node_modules ' + path + project, callback);
});

