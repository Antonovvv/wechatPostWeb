<template>
	<div id="shopIndex">
		<div id="top">
			<form action="/">
				<van-search
					v-model="value"
					placeholder="请输入搜索内容"
					shape="round"
					@search="onSearch"
				/>	
			</form>
			<van-swipe :autoplay="3000" style="height: 160px;margin-bottom: 0px;">
				<van-swipe-item>
					<img src="../assets/pig.jpeg" height="160px"/>
				</van-swipe-item>
				<van-swipe-item>
					<img src="../assets/ji.jpeg" height="160px"/>
				</van-swipe-item>
				<van-swipe-item>
					<img src="../assets/jiji.jpeg" height="160px"/>
				</van-swipe-item>
			</van-swipe>
			<van-button color="linear-gradient(to right, #ffff99, #ff6633)" text='地图' @click="map" class="button"/>
		</div>
		<div>
			<!--<van-tabs v-model="active" sticky >
				<van-tab title="图片">-->
					<van-list v-model="loading" :finished="finished" 
					:error.sync="error" error-text="请求失败，点击重新加载" @load="onLoad" id="list">
						<van-card v-for="(item, index) in imglist" :key="index"
						:thumb="item.thumburl" :title="item.imgname" :tag="item.liked" @click-thumb="imgPreview(index)" >
							<div slot="tags" style="margin-top: 2px;margin-bottom: 4px;">
								<van-tag plain type="warning" >上传者：{{item.nickname}}</van-tag>
							</div>
							<div slot="tags">
								<van-tag plain type="warning" >上传时间: {{item.uploadtime}}</van-tag>
							</div>
							<div slot="footer">
								<van-button size="mini" @click="likeIt(item.filehash, index)" >like</van-button>
							</div>
						</van-card>
						<p>{{emptyText}}</p>
					</van-list>
				<!--</van-tab>
				<van-tab title="随便什么"></van-tab>
			</van-tabs>-->
		</div>
	</div>
</template>

<script>
	import { 
		Button,
		Toast,
		Divider,
		Search,
		Swipe, SwipeItem,
		Sticky,
		Panel,
		Tab, Tabs,
		List, Card,
		Tag,
		ImagePreview
		} from 'vant';
	import axios from 'axios';
	
	export default {
		components: {
			[Button.name]: Button,
			[Divider.name]: Divider,
			[Search.name]: Search,
			[Swipe.name]: Swipe, [SwipeItem.name]: SwipeItem,
			[Sticky.name]: Sticky,
			[Panel.name]: Panel,
			[Tab.name]: Tab, [Tabs.name]: Tabs,
			[List.name]: List, [Card.name]: Card,
			[Tag.name]: Tag,
			[ImagePreview.name]: ImagePreview
		},
		
		data() {
			return {
				value: "",
				active: 0,
				imglist: [],
				previewlist: [],
				loading: false,
				finished: false,
				error: false,
				emptyText: null
			}
		},
		
		methods: {
			onSearch() {
				Toast('不给搜')
			},
			map() {
				//window.location.assign("http://www.yyandii.com/map")
				this.$router.push({ path: '/wechat/map' })
			},
			imgPreview(index) {
				ImagePreview({
					images: this.previewlist,
					startPosition: index
				})
			},
			likeIt(target, index) {
				var formData = new FormData
				formData.set("action", "like")
				formData.set("filehash", target)
				let path = this.$store.state.serverurl + '/api/user/actions'
				//配置请求头
				let config = {
					headers: {"Content-Type": "multipart/form-data;"}
				}
				axios.patch(path, formData, config)
				.then(response => {
					if (response.data.liked == 'true'){
						Toast.success('收到')
						this.imglist[index].liked = (parseInt(this.imglist[index].liked) + 1).toString()
					}
					else{
						Toast.fail('失败')
					}
				})
			},
			onLoad() {
				let path = this.$store.state.serverurl + '/api/shop/posts'
				axios.get(path, {
					params: {
						sortby: 'liked'
					}
				})
				.then(response => {
					var res = response.data
					for (let i in res.data) {
						let obj = {};
						obj['filehash'] = res.data[i].filehash
						obj['thumburl'] = this.$store.state.serverurl + '/thumbnail/' + res.data[i].filehash
						obj['imgurl'] = this.$store.state.serverurl + '/image/' + res.data[i].filehash
						this.previewlist[i] = this.$store.state.serverurl + '/image/' + res.data[i].filehash
						obj['imgname'] = res.data[i].imgname
						obj['nickname'] = res.data[i].nickname
						obj['uploadtime'] = res.data[i].uploadtime
						obj['liked'] = res.data[i].liked.toString()
						this.imglist.push(obj)
					}
					this.loading = false
					this.finished = true
				})
				.catch(() => {
					this.error = true
					this.loading = false
				})
			}
		}
	};
</script>

<style>
	html, body{
		height: 100%;
		margin: 0;
		padding: 0;
	}
	#shopIndex {
		background-color: #fafafa;
		background-image: url(../assets/bg.jpg);
	}
	#top {
		text-align: center;
	}
	#list {
		margin-bottom: 50px;
	}
	.button{
		width: 20%;
		margin-top: 10px;
		margin-bottom: 10px;
	}
	.card{
		background-color: #eeffff;
	}
</style>
