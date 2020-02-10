import Vue from 'vue';
import App from './App.vue';
import { router } from './router';
import store from './vuex/store';
import utils from './utils';

Vue.prototype.$utils = utils;

Vue.config.productionTip = false

if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) != 'micromessenger'){
	//若不为微信内核访问，则跳转至授权页
	window.location.replace('https://www.yyandii.com/oauth')
}

else {
	new Vue({
		router,
		store,
		el: '#app',
		render: h => h(App),
	})
}

