<template>
	<div>
		Limit: <input type="number" v-model.number="limit" min="1" max="99">
		<button @click="extra = !extra">Link {{extra ? 'on' : 'off'}}</button>
		<button @click="subscribe = !subscribe">Subscription {{subscribe ? 'on' : 'off'}}</button>
		<div class="list">
			<div v-for="item in stuff.data" :style="style(item)" :key="item._id">{{item._id}} : #{{item.color.toString(16)}}</div>
		</div>
		<pre>{{stuff}}</pre>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				limit:20,
				extra:true,
				subscribe:true
			}
		},
		methods:{
			style(item){
				return {
					background:'#' + item.color.toString(16),
					color:'#' + (4096 - item.color).toString(16),
					borderRadius:item.extra && item.extra.corners == 'rounded' ? '50px' : '0'
				}
			}
		},
		grapher:{
			stuff(){
				return {
					subscribe:this.subscribe,
					collection:Test,
					query:{
						_id:1,
						color:1,
						extra:this.extra && {
							corners:1
						},
						$options:{limit:this.limit,sort:{_id:1}}
					}
				}
			}
		}
	}
</script>