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
const assert = require('assert');
const npm = require('../');
const path = require('path');

describe('npm', () => {
    describe('test', function() {
        this.timeout(5e3);
        it('should', done => {
            npm('./node_modules/', (err, files) => {
                console.log(files);
                done();
            });
        });
    });
});