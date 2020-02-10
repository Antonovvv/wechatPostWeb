<template>
	<div id="app">
		<router-view style="margin-bottom: 50px;" />
		<van-tabbar v-model="active" >
			<van-tabbar-item name="shop" icon="shop-o" to="/wechat/shop">买书</van-tabbar-item>
			<van-tabbar-item name="sell" icon="bookmark-o" to="/wechat/sell">卖书</van-tabbar-item>
			<van-tabbar-item name="cart" icon="bag-o" to="/wechat/cart">书包</van-tabbar-item>
			<van-tabbar-item name="me" icon="contact" to="/wechat/me">我</van-tabbar-item>
		</van-tabbar>
	</div>
</template>

<script>
	import axios from 'axios';
	import Vue from 'vue';
	import wx from 'weixin-js-sdk';
	import Meta from 'vue-meta';
	Vue.use(Meta)

	import {
		Tabbar,
		TabbarItem,
		Divider
	} from 'vant';

	export default {
		metaInfo: {
			meta: [{
					charset: 'utf-8'
				},
				{
					name: 'viewport',
					content: 'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no'
				}
			]
		},
		components: {
			[Tabbar.name]: Tabbar,
			[TabbarItem.name]: TabbarItem,
			[Divider.name]: Divider
		},

		data() {
			return {
				active: 'shop'
			}
		},

		methods: {
			getUser() {
				let path = this.$store.state.serverurl + '/api/user'
				if(this.$store.state.code){
					axios.get(path, {
						params: {
							code: this.$store.state.code
						}
					})
					.then(respons => {
						if (!respons.data.openid){
							alert('获取用户信息失败')
						}
						this.$store.state.headimgurl = respons.data.headimgurl
						this.$store.state.nickname = respons.data.nickname
						this.$store.state.openid = respons.data.openid
					})
					.catch(() => {
						alert('获取用户信息失败')
					})
				}
			},
			getJsSdk() {
				//console.log(wx)
				if(window.__wxjs_is_wkwebview === true){
					let path = this.$store.state.serverurl + '/jsapi'
					axios.get(path, {
						params: {
							url: window.location.href
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
			}
		},
		
		watch: {
			$route() {
				this.active = this.$route.name;
			}
		},
		
		beforeCreate() {
			
			/*if (this.$utils.getUrlParam('code')){
				alert('get code!')
				console.log('code', this.$utils.getUrlParam('code'))
			}*/
		},
		created() {
			this.$store.state.code = this.$utils.getUrlParam('code')
			let user = JSON.parse(sessionStorage.getItem('user'))
			if(user && user.nickname){
				//sessionStorage中有user数据，直接读取
				this.$store.replaceState(Object.assign({}, this.$store.state, user))
			}
			else {
				//否则从服务器请求，用code换取
				this.getUser()
			}
			window.addEventListener('pagehide', () => {
				sessionStorage.setItem('user', JSON.stringify(this.$store.state))
			})
		},
		mounted() {
			this.getJsSdk()
		}
	};
</script>

<style>
	html,
	body {
		height: 100%;
		margin: 0;
		padding: 0;
	}

	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		background-color: #ffffff;
		height: 100%;
		padding-bottom: 50px;
	}
</style>
