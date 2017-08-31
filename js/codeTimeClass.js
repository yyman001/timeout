"use strict";
/**
 * Created by Administrator on 2017/8/31.
 */
var CodeTime = (function () {
    function CodeTime(option) {
        this.debug = false;
        this.option = {};
        this._init = false;
        this.hasLocalStorage = false;
        this.localStorage = null;
        this.initTimes = 60;
        this.DOM = null;
        this.hd = null;
        this.isPlay = false;
        this.codeText = null;
        this.clickTimeOut = 15;
        this.clickHd = null;
        this.clickMaxCount = 2;
        this.option = option;
        this.debug = option.debug || false;
        this.times = Math.abs(option.times) || 60;
        this.DOM = option.DOM || null;
        this.init(option);
    }
    CodeTime.prototype.clickSetTimer = function () {
        var target = this;
        target.clickHd = setInterval(function () {
            target.localStorage.setItem('click_count', 0);
        }, target.clickTimeOut * 1000);
    };
    CodeTime.prototype.clickClearHd = function () {
        var target = this;
        if (target.clickHd) {
            clearInterval(target.clickHd);
            target.clickHd = null;
        }
    };
    CodeTime.prototype.clickUpdate = function () {
        var count = this.clickGetCount('click_count');
        if (count) {
            ++count;
        }
        else {
            count = 1;
        }
        this.localStorage.setItem('click_count', count);
    };
    CodeTime.prototype.clickGetCount = function () {
        return this.localStorage.getItem('click_count') !== null ? parseInt(this.localStorage.getItem('click_count'), 10) : 0;
    };
    CodeTime.prototype.getPlayState = function () {
        var state = false;
        var time_state;
        if (this.hasLocalStorage) {
            time_state = this.localStorage.getItem('time_state');
            console.log('time_state::::::', time_state);
            if (time_state === 'stop') {
                state = !!0;
            }
            else if (time_state === 'play') {
                state = !!1;
            }
            else {
                state = this.isPlay;
            }
        }
        else {
            state = this.isPlay;
        }
        return state;
    };
    CodeTime.prototype.setTimes = function (times) {
        this.times = times || 60;
        this.initTimes = times || 60;
    };
    CodeTime.prototype.start = function () {
        console.log('me.isPlay:', this.isPlay);
        if (!this.isPlay && this.hd === null) {
            if (typeof this.option.startBeforeCall === 'function') {
                this.option.startBeforeCall();
            }
            this.code();
        }
    };
    CodeTime.prototype.stop = function () {
        if (this.hd) {
            clearInterval(this.hd);
            this.hd = null;
            this.isPlay = !!0;
            this.getTimeOut();
            this.times = this.option.times;
            this.option.DOM.innerHTML = '倒计时已结束';
            if (this.hasLocalStorage) {
                this.localStorage.setItem('time_state', 'stop');
            }
            if (typeof this.option.endCall === 'function') {
                this.option.endCall();
            }
        }
    };
    CodeTime.prototype.reset = function () {
        this.stop();
        this.option.DOM.setAttribute('data-state', 'def');
    };
    CodeTime.prototype.code = function (goOnTimeout) {
        var me = this;
        me.isPlay = !!1;
        if (me.hasLocalStorage) {
            me.localStorage.setItem('time_state', 'play');
        }
        if (typeof goOnTimeout !== 'undefined' && typeof goOnTimeout !== null && goOnTimeout > 0) {
            me.times = goOnTimeout;
        }
        else {
            me.times = me.option.times;
        }
        me.option.DOM.setAttribute('data-state', 'countdown');
        me.option.DOM.innerHTML = me.times;
        if (typeof me.option.everyTimeCall === 'function') {
            me.option.everyTimeCall(me.times);
        }
        if (me.hd) {
            console.log('clear');
            clearInterval(me.hd);
            me.hd = null;
        }
        me.hd = setInterval(function () {
            me.times--;
            me.option.DOM.innerHTML = me.times;
            if (me.hasLocalStorage) {
                me.localStorage.setItem('time_out', me.times);
            }
            if (typeof me.option.everyTimeCall === 'function') {
                me.option.everyTimeCall(me.times);
            }
            if (me.times <= 0) {
                me.stop();
            }
        }, 1000);
    };
    CodeTime.prototype.getTimeOut = function () {
        if (this.hasLocalStorage) {
            this.times = localStorage.getItem('initTime');
        }
        else {
            this.times = this.initTimes;
        }
    };
    CodeTime.prototype.goOnTimeout = function () {
        var time = this.localStorage.getItem('time_out');
        console.log('1-time_out:', time);
        if (typeof time !== 'undefined' && typeof time !== null) {
            this.code(parseInt(time, 10));
        }
        else {
            this.code(this.initTimes);
        }
    };
    CodeTime.prototype.init = function (optionObj) {
        var me = this;
        if (typeof optionObj !== null) {
            for (d in optionObj) {
                if (typeof optionObj[d] !== null && typeof optionObj[d] !== 'undefined') {
                    me.option[d] = optionObj[d];
                }
            }
        }
        if (typeof window.localStorage.setItem !== 'undefined' && window.localStorage.setItem !== null) {
            me.localStorage = window.localStorage;
            me.hasLocalStorage = true;
        }
        if (me.hasLocalStorage && me.localStorage.getItem('time_state') === 'play') {
            me.goOnTimeout();
        }
        else {
            console.log('optionObj.times:', optionObj.times);
            console.log('optionObj.times2:', typeof optionObj.times === 'undefined' || optionObj.times === null || parseInt(optionObj.times, 10) < 0);
            if (typeof optionObj.times === 'undefined' || optionObj.times === null || parseInt(optionObj.times, 10) < 0) {
                // this.setTimes(parseInt(me.times, 10));
                // optionObj.times = me.times;
                console.log('wtf');
                console.log('wtf');
                me.option.times = me.initTimes;
            }
            console.log('me.times:', me.times);
            console.log('me.me.option.times:', me.option.times);
            me.setTimes(parseInt(me.option.times, 10));
            if (me.hasLocalStorage) {
                me.localStorage.setItem('initTime', parseInt(me.option.times, 10));
            }
        }
        // console.log('initTimeOut:', this.initTimes);
        //提交限制
        if (!me._init) {
            me._init = !!1;
            me.clickSetTimer();
        }
        else {
            console.warn(new Error('请勿重复初始化!'));
        }
        return this;
    };
    return CodeTime;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CodeTime;
