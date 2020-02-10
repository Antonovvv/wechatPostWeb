<template>
	<div id="cartIndex">
		<div id="test">
			<!--<van-button type="primary" @click="map">地图</van-button>-->
		</div>
	</div>
</template>

<script>
	import {
		Button
	} from 'vant';
	
	export default {
		components: {
			[Button.name]: Button
		},
		data() {
			return {
				
			}
		},
		methods: {
			map() {
				window.location.assign("http://www.yyandii.com/map")
			}
		}
	}
</script>

<style>
	html, body{
		height: 100%;
		margin: 0;
		padding: 0;
	}
	#cartIndex {
		background-image: url(../assets/bg.jpg);
		height: 100%;
	}
	#test {
		text-align: center;
	}
</style>
