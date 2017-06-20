<template>
	<div>
		<button @click="toggle = !toggle">{{toggle ? 'On' : 'Off'}}</button> Limit: <input type="number" v-model.number="limit" min="0" max="50">
		<div class="list">
			<div v-for="item in stuff" :style="{background:'#' + item.color.toString(16),color:'#' + (4096 - item.color).toString(16)}" :key="item._id">{{item._id}} : #{{item.color.toString(16)}}</div>
		</div>
	</div>
</template>

<script>
	let query = Test.createQuery({
		color:1
	})
	export default {
		props:[],
		data(){
			return {
				limit:20,
				toggle:true
			}
		},
		methods:{},
		grapher:{
			stuff2(){
				let limit = this.limit
				return {
					collection:Test,
					query:{color:1, $options:{limit:limit}}
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
					return toggle && this.$grapher.stuff2
				}
			}
		}
	}
</script>