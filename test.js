'use strict';

const test = require("tap").test;

const clarify = require('./clarify.js');

test("node internal call sites should be ignored", function (t) {

  process.nextTick(function () {
    var lines = (new Error('trace')).stack.split('\n');

    t.equal(lines.length, 2);
    t.end();
  });
});

test("no filename dosn't break", function (t) {
  process.nextTick(function () {
    var err = null;
    eval("err = new Error('trace');");
    var lines = err.stack.split('\n');

    t.equal(lines.length, 2);
    t.end();
  });
});

test("custom filters can be applied via exports.filter", function (t) {
  Promise = require('bluebird')
  
  process.nextTick(function () {
    t.equal(typeof clarify.filter, 'function');
    
    Promise.resolve()
      .then(()=> {
        var lines = (new Error('trace')).stack.split('\n');
        t.ok(lines.some((line)=> line.includes('bluebird')))
      })
      .then(()=> clarify.filter(['bluebird']))
      .then(()=> {
        var lines = (new Error('trace')).stack.split('\n');
        t.notOk(lines.some((line)=> line.includes('bluebird')))
        t.equal(lines.length, 2);
        t.end();
      })
  });
});
