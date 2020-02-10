<template>
	<div id="route">
		<router-view></router-view>
		<van-tabbar v-model="active" >
			<van-tabbar-item name="shop" icon="shop-o" to="/wechat/shop">买书</van-tabbar-item>
			<van-tabbar-item name="sell" icon="bookmark-o" to="/wechat/sell">卖书</van-tabbar-item>
			<van-tabbar-item name="cart" icon="bag-o" to="/wechat/cart">书包</van-tabbar-item>
			<van-tabbar-item name="me" icon="contact" to="/wechat/me">我</van-tabbar-item>
		</van-tabbar>
	</div>
</template>

<script>
	import {
		Tabbar,
		TabbarItem,
		Divider
	} from 'vant';
	
	export default {
		components: {
			[Tabbar.name]: Tabbar,
			[TabbarItem.name]: TabbarItem,
			[Divider.name]: Divider
		},
		
		data() {
			return {
				active: ''
			}
		},
		
		methods: {
			
		},
		
		watch: {
			$route() {
				//路由改变时改变底部标签选中状态
				this.active = this.$route.name;
			}
		},
		
		mounted() {
			//挂载时选中标签
			this.active = this.$route.name;
		}
	}
</script>

<style>
	html,
	body {
		height: 100%;
		margin: 0;
		padding: 0;
	}
	
	#route {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		background-color: #ffffff;
		height: 100%;
		padding-bottom: 50px;
	}
</style>
