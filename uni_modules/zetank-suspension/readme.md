# zetank-suspension
>组件的icon使用uview,使用前请自己安装插件[uview](https://www.uviewui.com/components/install.html)
###安装
下载组件到项目即可，本组件符合[easycom](https://uniapp.dcloud.io/collocation/pages?id=easycom)规范

```html
	<zetank-suspension :scrollTop="scrollTop" :color="color"  :list="list"></zetank-suspension>

```

```json

	data() {
		return {
			color:this.$store.state.app.color,
			list:[
				{
					icon:{name:'search',customprefix:'uicon'},
					name: '搜索',
					url: '/pages/index/index',
					type:'navigate'
				},
				{
					icon:{name:'server-fill',customprefix:'uicon'},
					name: '客服',
					url: '',
					tel: '13988888888',
					type:'tel'
				},
				{
					icon:{name:'weixin-fill',customprefix:'uicon'},
					name: '二维码',
					type:'weixin',
					src:'二维码图片',
					title:'客服微信',
					content:'长按识别二维码'
				}
			],
			scrollTop:null
		}
	},
	onPageScroll: function(e) {
		this.scrollTop=e.scrollTop
	},
	
```
