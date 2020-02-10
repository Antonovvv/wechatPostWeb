<template>
	<div style="width: 100%; height: 100%;">
		<div id="container" style="width: 100%; height: 95%;" />
		<van-popup v-model="showList" position="bottom" style="height: 50%;">
			<van-list id="list">
				<van-card v-for="(item, index) in goods[showDorm]" :key="index"
				:thumb="item.thumburl" :title="item.imgname" :tag="item.liked" >
					<div slot="tags" style="margin-top: 2px;margin-bottom: 4px;">
						<van-tag plain type="warning" >上传者：{{item.nickname}}</van-tag>
					</div>
					<div slot="tags">
						<van-tag plain type="warning" >上传时间: {{item.uploadtime}}</van-tag>
					</div>
				</van-card>
			</van-list>
		</van-popup>
	</div>
</template>

<script>
	import {
		Popup,
		List, Card,
		Tag
	} from 'vant';
	import axios from 'axios';
	
	const qq = window.qq;
	
	export default {
		components: {
			[Popup.name]: Popup,
			[List.name]: List, [Card.name]: Card,
			[Tag.name]: Tag
		},
		
		data() {
			return {
				positions: {
					Y5: [30.514431,114.432494],
					Y9: [30.515263,114.432784],
					Y16: [30.514445,114.433900],
					Y20: [30.514778,114.434039],
					Y23: [30.515735,114.434227]
				},
				showList: false,
				showDorm: ''
			}
		},
		
		computed: {
			goods: function() {
				return {}
			}
		},
		
		methods: {
			initMap() {
				var center = new qq.maps.LatLng(30.514903,114.433186)
				var map = new qq.maps.Map(document.getElementById("container"), {
					center: center,
					zoom: 17,
					minZoom: 15
				});
				//比例尺控件
				new qq.maps.ScaleControl({
					align: qq.maps.ALIGN.BOTTOM_LEFT,
					margin: qq.maps.Size(85, 15),
					map: map
				})
				this.getLoc(map)
				this.getAll(map)
			},
			getLoc(map) {
				var geolocation = new window.qq.maps.Geolocation('L2SBZ-PC2KK-P6DJH-ACBZR-Y6XYT-W3BFW', 'map')
				geolocation.getLocation(position => {
					var myloc = new qq.maps.LatLng(position.lat, position.lng);
					//size是图标尺寸，该尺寸为显示图标的实际尺寸，origin是切图坐标，该坐标是相对于图片左上角默认为（0,0）的相对像素坐标，anchor是锚点坐标，描述经纬度点对应图标中的位置
					var anchor = new qq.maps.Point(20, 38),
						size = new qq.maps.Size(200, 200),
						origin = new qq.maps.Point(0, 0),
						scaleSize = new qq.maps.Size(40, 40);
					var icon = new qq.maps.MarkerImage(
							"./static/myloc.png",
							size,
							origin,
							anchor,
							scaleSize
						);
					//定位标记
					var mymark = new qq.maps.Marker({
						position: myloc,
						map: map
					});
					mymark.setIcon(icon);
				})
			},
			getAll(map) {
				let path = this.$store.state.serverurl + "/api/shop/posts"
				axios.get(path)
				.then(response => {
					var res = response.data
					for (let i in res.data) {
						let obj = {};
						var dorm = res.data[i].dorm
						obj['filehash'] = res.data[i].filehash
						obj['thumburl'] = this.$store.state.serverurl + '/thumbnail/' + res.data[i].filehash
						obj['imgurl'] = this.$store.state.serverurl + '/image/' + res.data[i].filehash
						obj['imgname'] = res.data[i].imgname
						obj['nickname'] = res.data[i].nickname
						obj['uploadtime'] = res.data[i].uploadtime
						obj['liked'] = res.data[i].liked.toString()
						//console.log(obj)
						if(!this.goods.hasOwnProperty(dorm)){
							this.goods[dorm] = [obj]
							//alert(Object.values(this.goods[dorm][0]))
						}
						else {
							this.goods[dorm].push(obj)
							//alert(Object.values(this.goods[dorm][0]))
						}
					}
					//console.log(this.goods)
					//alert(JSON.stringify(this.goods))
					for(var i in this.positions){
						var _this = this
						var dorm_pos = this.positions[i]
						if(this.goods.hasOwnProperty(i)){
							let dormname = i
							var marker = new qq.maps.Marker({
								position: new qq.maps.LatLng(dorm_pos[0], dorm_pos[1]),
								map: map,
								animation: qq.maps.MarkerAnimation.DOWN
							})
							marker.setZIndex(1);
							qq.maps.event.addListener(marker, 'click', function() {
								_this.showDorm = dormname
								_this.showList = true
							})
						}
					}
				})
			}
		},
		
		mounted() {
			//生成地图与获取数据先后？
			this.initMap()
		}
	}
</script>

<style>
	html, body {
		height: 100%;
	}
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
</style>
