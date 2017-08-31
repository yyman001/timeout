/**
 * Created by Administrator on 2017/8/31.
 */
import CodeTime from './codeTimeClass';

const op = {
	debug: true,
	times: 50,
	DOM: document.querySelector('.btn'),
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
let codeTime = new CodeTime(op);
op.DOM.addEventListener('click', function () {
	// codeTime.init(op).start();
	codeTime.start();
}, !!0);
