/**
 * Copyright (C) 2016 yanni4night.com
 * test.js
 *
 * changelog
 * 2016-06-13[22:13:46]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
'use strict';
const assert = require('assert');
const npm = require('../');
const path = require('path');
const fs = require('fs');

describe('npm', () => {
    describe('test', function () {
        this.timeout(5e3);
        it('should', done => {
            npm(path.join(__dirname, '..', 'node_modules'), {
                moduleId: function (file) {
                    return 'namespace:node_modules/' + file
                },
                moduleDep: function (dep) {
                    if (!dep) return dep;
                    return 'namespace:node_modules/' + path.relative(path.join(
                        __dirname, '..', 'node_modules'), dep)
                }
            }, (err, resourceMap) => {
                console.error(err);
                fs.writeFileSync('resource-map.json', JSON.stringify(resourceMap, null,
                    4));
                done();
            });
        });
    });
});