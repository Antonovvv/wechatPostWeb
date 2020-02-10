<template>
	<router-view></router-view>
</template>

<script>
	import axios from 'axios';
	import Vue from 'vue';
	import wx from 'weixin-js-sdk';
	import Meta from 'vue-meta';
	Vue.use(Meta)

	

	export default {
		metaInfo: {
			meta: [
			]
		},
		

		methods: {
			getUser() {
				let path = this.$store.state.serverurl + '/api/user/'
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


</style>
