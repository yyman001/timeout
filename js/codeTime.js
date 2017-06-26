/*
 js 倒计时插件,缓存倒计时间,刷新不重新计算
 * data-state 属性验证码控制状态
 *  def  =>   发送验证码
 * reset =>   重新发送
 * countdown => 倒计时状态
 * */

var codeTime = {
	debug: false,
	_init: false,
	hasLocalStorage: false,
	localStorage: null,
	// initTimeOut: 59,
	hd: null,
	times: 60,
	initTimes: 60,
	ele: null,
	//$text: $('.code-times'),
	isPlay: !1, //是否在倒计时中
	codeText: null, //验证码
	clickTimeOut: 15,
	clickHd: null,
	clickMaxCount: 2,
	//限制一定时间内可点击次数
	clickSetTimer: function () {
		var target = this;
		target.clickHd = setInterval(function () {
			target.localStorage.setItem('click_count', 0);
		}, target.clickTimeOut * 1000)
	},
	clickClearHd: function () {
		var target = this;
		if (target.clickHd) {
			clearInterval(target.clickHd);
			target.clickHd = null;
		}
	},
	clickUpdate: function () {
		var count = this.clickGetCount('click_count');
		if (count) {
			++count;
		} else {
			count = 1;
		}
		this.localStorage.setItem('click_count', count);

	},
	clickGetCount: function () {
		return this.localStorage.getItem('click_count') !== null ? parseInt(this.localStorage.getItem('click_count'), 10) : 0;
	},
	click: function () {


	},
	getPlayState: function () {
		var state = false;
		var time_state;
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
	},
	setTimes: function (times) {
		this.times = times || 60;
		this.initTimes = times || 60;
	},
	start: function () {
		console.log('me.isPlay:', this.isPlay);
		if (!this.isPlay && this.hd === null) {
			if (typeof this.option.startBeforeCall === 'function') {
				this.option.startBeforeCall();
			}
			this.code();
		}
	},
	stop: function () {
		if (this.hd) {
			clearInterval(this.hd);
			this.hd = null;
			this.isPlay = !!0;
			this.getTimeOut();

			this.times = this.option.times;

			this.option.ele.innerHTML = '倒计时已结束';

			if (this.hasLocalStorage) {
				this.localStorage.setItem('time_state', 'stop');
			}

			if (typeof this.option.endCall === 'function') {
				this.option.endCall();
			}
		}
	},
	reset: function () {
		this.stop();
		this.option.ele.setAttribute('data-state', 'def');
	},
	code: function (goOnTimeout) {
		var me = this;

		me.isPlay = !!1;

		if (me.hasLocalStorage) {
			me.localStorage.setItem('time_state', 'play');
		}

		if (typeof goOnTimeout !== 'undefined' && typeof goOnTimeout !== null && goOnTimeout > 0) {
			me.times = goOnTimeout;
		} else {
			me.times = me.option.times;
		}


		me.option.ele.setAttribute('data-state', 'countdown');
		me.option.ele.innerHTML = me.times;
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

			me.option.ele.innerHTML = me.times;

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
	},
	getTimeOut: function () {
		if (this.hasLocalStorage) {
			this.times = localStorage.getItem('initTime');
		} else {
			this.times = this.initTimes;
		}

	},
	goOnTimeout: function () { //刷新后继续倒计时
		var time = this.localStorage.getItem('time_out');
		console.log('1-time_out:', time);
		if (typeof time !== 'undefined' && typeof time !== null) {
			this.code(parseInt(time, 10));
		} else {
			this.code(this.initTimes);
		}

	}
	, option: {}
	, clearState: function () {
		if (this.hasLocalStorage) {
		}
	}
	, init: function (optionObj) {
		var me = this;
		if (typeof optionObj !== null) {
			for (d in optionObj) {
				if (typeof optionObj[d] !== null && typeof optionObj[d] !== 'undefined') {
					me.option[d] = optionObj[d];
				}
			}
		}

		if (typeof window.localStorage.setItem !== 'undefined' && typeof window.localStorage.setItem !== null) {
			me.localStorage = window.localStorage;
			me.hasLocalStorage = true;
		}

		if (me.hasLocalStorage && me.localStorage.getItem('time_state') === 'play') {
			me.goOnTimeout();
		} else {
			console.log('optionObj.times:', optionObj.times);
			console.log('optionObj.times2:', typeof optionObj.times === 'undefined' || typeof optionObj.times === null || parseInt(optionObj.times, 10) < 0);
			if (typeof optionObj.times === 'undefined' || typeof optionObj.times === null || parseInt(optionObj.times, 10) < 0) {
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
};

//codeTime.init(59); //设置倒计时时间 默认60
//调用案例
console.log(codeTime);
const op = {
	debug: true,
	times: 50,
	ele: document.querySelector('.btn'),
	startBeforeCall: function () {
		//倒计时前回调
		console.log('倒计时前回调');
	},
	everyTimeCall: function (times) {
		//倒计时每次减少后触发回调
		console.log('倒计时每次减少后触发回调,剩余时间:' + times);
	},
	endCall: function () {
		//结束回调
		console.log('结束回调');
	}
};
codeTime.init(op);
op.ele.addEventListener('click', function () {
	// codeTime.init(op).start();
	codeTime.start();
}, !!0);

/*

 time.init({
 debug:true,
 times:60,
 ele:$('.btn')[0],
 startBeforCall:function(){
 //倒计时前回调
 },
 everytimeCall:function(){
 //倒计时每次减少后触发回调
 },
 endCall:function(){
 //结束回调
 }
 })

 */


