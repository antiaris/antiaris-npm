/**
 * Copyright (C) 2016 yanni4night.com
 * index.js
 *
 * changelog
 * 2016-06-13[22:07:03]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
'use strict';
const extend = require('lodash/fp/extend');
const isString = require('lodash/isString');
const isFunction = require('lodash/isFunction');
const glob = require('glob');
const path = require('path');
const babel = require('babel-core');

module.exports = function(cwd, opts, cb) {

    if (arguments.length < 3) {
        cb = opts;
        opts = {};
    }

    const options = extend({
        exclude: null
    }, opts);

    cb = cb || (() => {});

    if (!isString(cwd)) {
        return cb(new Error(`"cwd" must be a string`));
    }

    if (!isFunction(cb)) {
        return cb(new Error(`"cb" must be a function`));
    }

    new Promise((resolve, reject) => {
        glob('**/*.js', {
            cwd: cwd
        }, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    }).then(files => {
        return new Promise(resolve => {
            resolve(files.map(file => {
                return path.join(cwd, file);
            }));
        });
    }).then(files => {
        cb(null, files);
    }, cb);
};