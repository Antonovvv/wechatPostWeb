<template>
	<div id="meIndex">
		<div id="me">
			<van-image id="headimg" round width="8rem" height="8rem" :src=headimgurl fit="cover"></van-image>
			<p>{{ nickname }}</p>
		</div>
		<div id="myImg">
			<van-collapse v-model="activeNames" @change="query" >
				<van-collapse-item title="我上传的" name="myImg" >
					<van-list v-model="loading" :finished="finished"
					:error.sync="error" error-text="请求失败，点击重新加载" @load="onLoad" id="myImgList">
						<van-card v-for="(item, index) in imgList" :key="index" :thumb="item.thumburl" 
						:title="item.imgname" :desc="item.uploadtime" :tag="item.liked" @click-thumb="imgPreview(index)" >
							<div slot="footer">
								<van-button size="mini" @click="deleteImg(item, index)" >删除</van-button>
							</div>
						</van-card>
						<p>{{emptyText}}</p>
					</van-list>
				</van-collapse-item>
			</van-collapse>
		</div>
	</div>
</template>

<script>
	import {
		Button,
		Panel,
		Image,
		Tab, Tabs,
		Collapse, CollapseItem,
		List, Card,
		ImagePreview,
		Toast
	} from 'vant';

	import axios from 'axios';

	export default {
		components: {
			[Button.name]: Button,
			[Panel.name]: Panel,
			[Image.name]: Image,
			[Tab.name]: Tab, [Tabs.name]: Tabs,
			[Collapse.name]: Collapse, [CollapseItem.name]: CollapseItem,
			[List.name]: List, [Card.name]: Card,
			[ImagePreview.name]: ImagePreview,
			[Toast.name]: Toast
		},
		data() {
			return {
				activeNames: [],
				imgList: [],
				previewList: [],
				error: false,
				loading: false,
				emptyText: null,
				finished: false
			}
		},
		computed: {
			nickname: function() {
				return this.$store.state.nickname
			},
			headimgurl: function() {
				return this.$store.state.headimgurl
			}
		},
		methods: {
			query() {
				
			},
			imgPreview(index) {
				ImagePreview({
					images: this.previewList,
					startPosition: index
				})
			},
			deleteImg(target, index) {
				let path = this.$store.state.serverurl + '/api/user/my'
				axios.delete(path, {
					params: {
						filehash: target.filehash
					}
				})
				.then(response => {
					if (response.data.deleted == 'true'){
						Toast.success('已删除')
						this.imgList.splice(index, 1)
						this.previewList.splice(index, 1)
					}
					else {
						Toast.fail('删除失败')
					}
				})
			},
			onLoad() {
				if(this.activeNames == 'myImg'){
					
					let path = this.$store.state.serverurl + '/api/user/my'
					axios.get(path, {
						params: {
							openid: this.$store.state.openid
						}
					})
					.then(response => {
						//console.log(response)
						if (response.data.empty == 'true'){
							this.emptyText = '你还没上传过呢'
						}
						else {
							this.emptyText = null
							var res = response.data
							for (let i in res.data) {
								let obj = {};
								obj['filehash'] = res.data[i].filehash
								obj['thumburl'] = this.$store.state.serverurl + '/thumbnail/' + res.data[i].filehash
								obj['imgurl'] = this.$store.state.serverurl + '/image/' + res.data[i].filehash
								this.previewList[i] = this.$store.state.serverurl + '/image/' + res.data[i].filehash
								obj['imgname'] = res.data[i].imgname
								obj['uploadtime'] = res.data[i].uploadtime
								obj['liked'] = res.data[i].liked.toString()
								this.imgList.push(obj)
							}
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
		}
	}
</script>

<style>
	html, body{
		height: 100%;
		margin: 0;
		padding: 0;
	}
	#meIndex {
		background-image: url(../assets/bg.jpg);
		height: 100%;	
	}
	#me {
		text-align: center;
		margin-bottom: 5%;
	}
	#headimg {
		margin-top: 2rem;
	}
	#myImgList {
		margin-bottom: 30px;
	}
</style>
