<template>
	<div>
		<button @click="toggle = !toggle">{{toggle ? 'On' : 'Off'}}</button> Limit: <input type="number" v-model.number="limit" min="0" max="50">
		<button @click="extra = !extra">{{extra ? 'Link on' : 'Link off'}}</button>
		<div class="list">
			<div v-for="item in stuff" :style="style(item)" :key="item._id">{{item._id}} : #{{item.color.toString(16)}}</div>
		</div>
		<pre>{{json}}</pre>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				limit:20,
				toggle:true,
				extra:true
			}
		},
		computed:{
			json(){
				return this.stuff[0] && JSON.stringify(this.stuff[0]).replace(/,|{|}/g, match => match + '\n')
			}
		},
		methods:{
			style(item){
				return {
					background:'#' + item.color.toString(16),color:'#' + (4096 - item.color).toString(16),
					borderRadius:item.extra && item.extra.corners == 'rounded' ? '50px' : '0'
				}
			}
		},
		grapher:{
			stuff(){
				return {
					collection:Test,
					query:{
						_id:1,
						color:1,
						extra:this.extra && {
							corners:1
						},
						$options:{limit:this.limit}
					}
				}
			}
		},
		meteor:{
			stuff:{
				params(){
					return this.toggle
				},
				update(toggle){
					console.log('update')
					console.log(this.$grapher.stuff.fetch())
					return toggle && this.$grapher.stuff.fetch()
				}
			}
		}
	}
</script>