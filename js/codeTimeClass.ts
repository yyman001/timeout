/**
 * Created by Administrator on 2017/8/31.
 */
export default class CodeTime {
	public debug: Boolean = false;
	private option: Object = {};
	private _init:Boolean = false;
	private hasLocalStorage: Boolean = false;
	private localStorage: Object = null;
	private times: Number;
	private initTimes: Number = 60;
	private DOM: Object = null;
	private hd: Object = null;
	private isPlay: Boolean = false;
	private codeText: Object = null;
	private clickTimeOut: Number = 15;
	private clickHd: Object = null;
	private clickMaxCount: Number = 2;

	constructor(option: Object) {
		this.option = option;
		this.debug = option.debug || false;
		this.times = Math.abs(option.times ) || 60;
		this.DOM = option.DOM || null;
		this.init(option);
	}

	clickSetTimer() {
		let target = this;
		target.clickHd = setInterval(function () {
			target.localStorage.setItem('click_count', 0);
		}, target.clickTimeOut * 1000)
	}

	clickClearHd() {
		let target = this;
		if (target.clickHd) {
			clearInterval(target.clickHd);
			target.clickHd = null;
		}
	}

	clickUpdate() {
		let count = this.clickGetCount('click_count');
		if (count) {
			++count;
		} else {
			count = 1;
		}
		this.localStorage.setItem('click_count', count);
	}

	clickGetCount() {
		return this.localStorage.getItem('click_count') !== null ? parseInt(this.localStorage.getItem('click_count'), 10) : 0;

	}

	getPlayState() {
		let state = false;
		let time_state;
		if (this.hasLocalStorage) {
			time_state = this.localStorage.getItem('time_state');
			console.log('time_state::::::', time_state);
			if (time_state === 'stop') {
				state = !!0;
			} else if (time_state === 'play') {
				state = !!1;
			} else {
				state = this.isPlay;
			}

		} else {
			state = this.isPlay;
		}

		return state;
	}

	setTimes(times) {
		this.times = times || 60;
		this.initTimes = times || 60;
	}

	start() {
		console.log('me.isPlay:', this.isPlay);
		if (!this.isPlay && this.hd === null) {
			if (typeof this.option.startBeforeCall === 'function') {
				this.option.startBeforeCall();
			}
			this.code();
		}
	}

	stop() {
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
	}

	reset() {
		this.stop();
		this.option.DOM.setAttribute('data-state', 'def');
	}

	code(goOnTimeout) {
		let me = this;

		me.isPlay = !!1;

		if (me.hasLocalStorage) {
			me.localStorage.setItem('time_state', 'play');
		}

		if (typeof goOnTimeout !== 'undefined' && typeof goOnTimeout !== null && goOnTimeout > 0) {
			me.times = goOnTimeout;
		} else {
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
	}

	getTimeOut() {
		if (this.hasLocalStorage) {
			this.times = localStorage.getItem('initTime');
		} else {
			this.times = this.initTimes;
		}

	}

	goOnTimeout  () { //刷新后继续倒计时
		let time = this.localStorage.getItem('time_out');
		console.log('1-time_out:', time);
		if (typeof time !== 'undefined' && typeof time !== null) {
			this.code(parseInt(time, 10));
		} else {
			this.code(this.initTimes);
		}

	}

   init (optionObj) {
		let me = this;
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
		} else {
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
				me.localStorage.setItem('initTime', parseInt(me.option.times, 10))
			}
		}

		// console.log('initTimeOut:', this.initTimes);

		//提交限制
		if (!me._init) {
			me._init = !!1;
			me.clickSetTimer();
		} else {
			console.warn(new Error('请勿重复初始化!'));
		}

		return this;
	}







}