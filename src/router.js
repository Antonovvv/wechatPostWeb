import Vue from 'vue'
import Router from 'vue-router'
import wx from 'weixin-js-sdk'
import axios from 'axios'

Vue.use(Router)

const routes = [
		{
			path: '/error',
			name: 'NotFound',
			component: () => import('./views/NotFound.vue'),
			meta: {
				title: 'Error'
			}
		},
		/*{
			path: '*',
			redirect: '/shop'
		},*/
		{
			path: '/wechat/map',
			name: 'map',
			component: () => import('./views/map.vue'),
			meta: {
				title: '地图'
			}
		},
		{
			path: '/wechat',
			component: () => import('./views/router_page.vue'),
			children: [
				{
					path: 'shop',
					name: 'shop',
					component: () => import('./views/shop.vue'),
					meta: {
						title: '买书'
					}
				},
				{
					path: 'sell',
					name: 'sell',
					component: () => import('./views/sell.vue'),
					meta: {
						title: '卖书'
					}
				},
				{
					path: 'cart',
					name: 'cart',
					component: () => import('./views/cart.vue'),
					meta: {
						title: '书包'
					}
				},
				{
					path: 'me',
					name: 'me',
					component: () => import('./views/me.vue'),
					meta: {
						title: '我'
					}
				}
			]
		},
	];

const router = new Router({ 
		mode: 'history',
		routes 
	});

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  next();
});

router.afterEach((to, from) => {
	if((window.__wxjs_is_wkwebview !== true) && (to.path == '/wechat/sell')){
		let path = 'https://www.yyandii.com' + '/jsapi'
		axios.get(path, {
			params: {
				url: window.location.origin + to.fullPath
			}
		})
		.then(response => {
			//console.log(response)
			wx.config({
				debug: false,
				appId: response.data.appId,
				timestamp: response.data.timestamp,
				nonceStr: response.data.nonceStr,
				signature: response.data.signature,
				jsApiList: [
					'getNetworkType',
					'chooseImage',
					'previewImage',
					'getLocalImgData',
					'uploadImage'
				]
			})
		})
	}
})

export {
  router
};