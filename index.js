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
const extend = require('lodash/extend');
const isString = require('lodash/isString');
const isFunction = require('lodash/isFunction');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const nodeResolve = require('antiaris-node-resolve');
const cjs = require('antiaris-transform-commonjs-modules-systemjs');

module.exports = function (cwd, opts, cb) {

    if (arguments.length < 3) {
        cb = opts;
        opts = {};
    }

    const options = extend({
        pattern: '**/*.js',
        exclude: null,
        dest: 'output',
        moduleId: file => file,
        moduleDep: dep => dep
    }, opts);

    cb = cb || (() => {});

    if (!isString(cwd)) {
        return cb(new Error(`"cwd" must be a string`));
    }

    if (!isFunction(cb)) {
        return cb(new Error(`"cb" must be a function`));
    }

    new Promise((resolve, reject) => {
        glob(options.pattern || '**/*.js', {
            cwd: cwd
        }, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    }).then(files => {
        const resourceMap = {};

        const tasks = files.map(file => {
            return new Promise((resolve, reject) => {
                const moduleId = options.moduleId(file);

                cjs.transformFile(path.join(cwd, file), {
                    moduleId: moduleId,
                    translateDep: dep => {
                        return options.moduleDep(nodeResolve.resolve(path.join(
                            cwd, file), dep));
                    }
                }, (err, result) => {

                    if (err) {
                        // Ignore
                        resolve();
                        //reject(err);
                    } else {
                        let targetDir = options.dest;

                        const fileName = file.replace(/\//mg,
                            '_');
                        const filePath = path.join(targetDir, fileName);

                        if (!fs.existsSync(targetDir)) {
                            mkdirp.sync(targetDir);
                        }
                        let stat = fs.statSync(targetDir);
                        if (!stat.isDirectory()) {
                            reject(new Error(`"${targetDir}" is not a directory`));
                        }

                        resourceMap[moduleId] = {
                            deps: result.deps,
                            uri: fileName
                        }

                        fs.writeFile(filePath,
                            result.code, err => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            });

                    }
                });
            });
        });


        return Promise.all(tasks).then(function () {
            return Promise.resolve(resourceMap);
        });
    }).then(resourceMap => {
        cb(null, resourceMap);
    }).catch(cb);
};