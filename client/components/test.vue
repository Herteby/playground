<template>
	<div>
		<button @click="toggle = !toggle">Toggle</button>{{toggle}}
		<div class="list">
			<div v-for="item in stuffings" :style="{background:'#' + item.color.toString(16),color:'#' + (4096 - item.color).toString(16)}" :key="item._id">{{item._id}} : #{{item.color.toString(16)}}</div>
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
				toggle:true
			}
		},
		beforeCreate(){
			query.subscribe()
			Tracker.autorun(()=>{
				let query2 = Test.createQuery({
					$options:{
						sort:{_id:1}
					},
					color:1,
					extra:{
						color:1
					}
				})
				query2.subscribe()
			})
		},
		computed:{
			stuffings(){
				console.log(this.stuff)
				return this.stuff
			}
		},
		watch:{
			stuff(){
				console.log('stuff changed')
			}
		},
		methods:{},
		grapher:{
			stuff:{
				collection:Test,
				query:{color:1}
			}
		},
		meteor:{
			stuff:{
				params(){
					return this.toggle
				},
				update(toggle){
					return toggle && query.fetch()	
				}
			}
		}
	}
</script>