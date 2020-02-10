<template>
	<div id="sellIndex">
		<van-divider id="divider">上传图片</van-divider>
		<van-cell-group id="inputPanel">
			<van-field v-model="postName" clearable label="名称" 
				placeholder="请输入名称" />
			
			<van-field readonly clickable label="宿舍" :value="dormName"
				placeholder="选择宿舍" @click="showPicker = true" />
			<van-popup v-model="showPicker" position="bottom">
				<van-picker show-toolbar :columns="columns" @change="areaChange"
					@cancel="showPicker = false" @confirm="dormConfirm"></van-picker>
			</van-popup>
			
			<van-cell title="添加图片" clickable @click="loadImage" >
				<!--<van-uploader v-model="fileList" :preview-image="false" >
					<van-button plain style="height: 100%;width: 100%;" ></van-button>
				</van-uploader>-->
				<van-icon slot="right-icon" name="plus" style="line-height: inherit;"></van-icon>
			</van-cell>
		</van-cell-group>
		<van-uploader v-model="fileList" :max-count="6" @delete="delPreview"
			disabled style="margin-left: 5%;" preview-size="100px"/>
			
		<!--<div style="position: absolute;bottom: 30%;width: 100%;text-align: center;">
			<van-button @click="test" >test</van-button>
		</div>-->
		
		<div id="uploadButton">
			<van-button :disabled="isUploading" :loading="isUploading" 
				type="primary" loading-text="上传中..." loading-type="spinner"
				@click="upload" >上传图片</van-button>
		</div>
		
	</div>
</template>

<script>
	import { 
		Cell, CellGroup,
		Field, Popup, Picker,
		Uploader, Image,
		Button,
		Divider,
		Toast,
		Icon
	} from 'vant';
	import axios from 'axios';
	import wx from 'weixin-js-sdk';
	
	export default {
		components: {
			[Cell.name]: Cell, [CellGroup.name]: CellGroup,
			[Field.name]: Field, [Popup.name]: Popup, [Picker.name]: Picker,
			[Divider.name]: Divider,
			[Uploader.name]: Uploader, [Image.name]: Image,
			[Button.name]: Button,
			[Icon.name]: Icon
		},
		
		data () {
			return {
				postName: '',
				showPicker: false,
				dorms: {
					'韵苑': ['5栋', '9栋', '16栋', '20栋', '23栋'],
					'紫菘': ['0栋']
				},
				dormName: '',
				dorm: '',
				isUploading: false,
				fileList: [],
				localIds: [],
				serverIds: [],
				formData: new FormData
			}
		},
		
		computed: {
			nickname: function() {
				return this.$store.state.nickname
			},
			openid: function() {
				return this.$store.state.openid
			},
			imageNum: function() {
				return this.localIds.length
			},
			columns: function() {
				return [
					{ values: Object.keys(this.dorms), className: 'column1'},
					{ values: this.dorms['韵苑'], className: 'column2'}
				]
			}
		},
		
		methods: {
			/*afterRead(file) {
				this.formData.set("file", file)
				this.formData.set("filename", file.file.name)
				console.log(file)
			},*/
			dormConfirm(value) {
				this.dormName = value[0] + value[1]
				switch (value[0]) {
					case '韵苑': 
						this.dorm = 'Y' + value[1].slice(0, -1);
						break;
					case '紫菘':
						this.dorm = 'Z' + value[1].slice(0, -1);
						break;
					default:
						this.dorm = 'None'
				}
				this.showPicker = false
			},
			areaChange(picker, values) {
				//第1列（0开始）设为dorms[第0列选中值]
				picker.setColumnValues(1, this.dorms[values[0]])
			},
			loadImage() {
				//拉起jssdk选择图片，localIds尾部加入res.localIds，getPreview获取已选图片base64编码
				var _this = this //success回调函数中this作用域不同，所以赋给_this
				wx.chooseImage({
					count: 6 - this.imageNum,
					success: function(res) {
						//console.log('res: ', res.localIds)
						var trans_index = _this.imageNum //当前图片数量，作为转换base64的索引
						_this.localIds = _this.localIds.concat(res.localIds)
						//console.log('local: ', _this.localIds)
						_this.getPreview(trans_index, trans_index + res.localIds.length)
						//console.log('filelist: ', _this.fileList)
					}
				})
			},
			test() {
				//alert(this.localIds.length)
				//console.log(this.formData.get("serverids"))
			},
			delPreview(index) {
				//点击图片预览右下角删除，在localIds和预览列表fileList中分别删除记录
				this.localIds.splice(index, 1)
				//console.log(this.localIds)
				//console.log(this.fileList)
			},
			getPreview(index, count) {
				var _this = this
				wx.getLocalImgData({
					localId: this.localIds[index],
					success: function(res) {
						var localData = res.localData
						if(localData.indexOf('data:image') != 0){
							//若头部不为data:image,则添加base64头部
							localData = 'data:image/jpeg;base64,' + localData
						}
						_this.fileList.push({url: localData, isImage: true})
						
						index = index + 1
						if(index < count){
							_this.getPreview(index, count)
						}
					}
				})
			},
			upload() {
				this.isUploading = true
				if(this.$store.state.openid == null) {
					Toast.fail('微信登陆信息为空，请重新进入')
					this.isUploading = false
				}
				else {
					if(this.postName == ''){
						Toast('请输入名称')
						this.isUploading = false
					}
					else if(this.dorm == ''){
						Toast('请选择宿舍')
						this.isUploading = false
					}
					else if(this.imageNum == 0){
						Toast('请添加图片')
						this.isUploading = false
					}
					else {
						this.uploadToWx(0)
					}
				}
			},
			uploadToWx(index) {
				var _this = this
				wx.uploadImage({
					localId: this.localIds[index],
					isShowProgressTips: 1,
					success: function (res) {
						_this.serverIds.push(res.serverId)
						index = index + 1
						if(index < _this.imageNum) {
							//递归上传下一张图片
							_this.uploadToWx(index)
						}
						else {
							//上传至服务器
							_this.uploadToServer()
						}
					}
				})
			},
			uploadToServer() {
				this.formData.set("postname", this.postName)
				this.formData.set("nickname", this.nickname)
				this.formData.set("openid", this.openid)
				this.formData.set("dorm", this.dorm)
				for(let serverid of this.serverIds){
					this.formData.append("serverids[]", serverid)
				}
				let path = this.$store.state.serverurl + '/api/user/my'
				let config = {
					headers: {"Content-Type": "multipart/form-data;"}
				}
				axios.post(path, this.formData, config)
				.then(response => {
					//console.log(response)
					if(response.data.openid == this.openid){
						Toast.success('上传成功')
						//清空信息
						this.formData = new FormData
						this.postName = ''
						this.dormName = ''
						this.dorm = ''
						this.fileList = []
						this.localIds = []
						this.serverIds = []
					}
					else if(response.data.error == 'failed'){
						Toast.fail('上传失败')
					}
					else {
						Toast.fail('未知错误')
					}
					this.isUploading = false
				})
				.catch(error => {
					//console.log(error)
					alert(error)
					Toast.fail('上传失败')
					this.isUploading = false
				})
			}
			/*upload() {
				this.isUploading = true
				if(this.$store.state.openid == null) {
					Toast.fail('微信登陆信息为空，请重新进入')
					this.isUploading = false
				}
				else {
					if(this.postName == ''){
						Toast('请输入名称')
						this.isUploading = false
						return
					}
					if(this.imageNum == 0){
						Toast('请添加图片')
						this.isUploading = false
						return
					}
					
					this.formData.set("postname", this.postName)
					this.formData.set("nickname", this.nickname)
					this.formData.set("openid", this.openid)
					var files = []
					for(let i = 0; i < this.imageNum; i++){
						files.push(this.fileList[i].url)
					}
					this.formData.append("files", files)
					let path = this.$store.state.serverurl + '/api/upload'
					let config = {
						headers: {"Content-Type": "multipart/form-data;charset=UTF-8"}
					}
					console.log(this.formData.getAll('files'), this.formData.getAll('openid'))
					axios.post(path, this.formData, config)
					.then(response => {
						//console.log(response)
						if(response.data.openid == this.openid){
							Toast.success('上传成功')
							this.postName = ''
							this.fileList = []
							this.localIds = []
						}
						else if(response.data.error == 'failed'){
							Toast.fail('上传失败')
						}
						else {
							Toast.fail('未知错误')
						}
						this.isUploading = false
					})
					.catch(error => {
						//console.log(error)
						alert(error)
						Toast.fail('上传失败')
						this.isUploading = false
					})
				}
			}*/
		},
		
		watch: {
			
		},
		
		mounted() {
			
		}
	};
</script>

<style>
	html, body{
		height: 100%;
		margin: 0;
		padding: 0;
	}
	#sellIndex {
		background-image: url(../assets/bg.jpg);
		height: 100%;
	}
	#divider {
		padding-top: 5px;
		padding-bottom: 5px;
		margin-top: 0;
		color: #1989FA;
		border-color: #1989fa;
		background-color: #f8f8f8;
	}
	#inputPanel {
		margin-bottom: 10px;
	}
	#uploadButton {
		width: 100%;
		position: absolute;
		bottom: 20%;
		text-align: center;
	}
	.shownImg {
		margin-top: 10px;
		margin-left: 10px;
	}
</style>
