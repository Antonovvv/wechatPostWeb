import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		code: null,
		openid: null,
		nickname: null,
		headimgurl: null,
		view: null,
		myimglist: [],
		serverurl: 'https://www.yyandii.com'
	}
})

export default store