<template>
	<div>
		<div :class="{loading:true,ready:people.ready}">Loading . . .</div>
		<div class="subscribeCount">Subscribing to {{indexes.end - indexes.start}} items</div>
		<input v-model="search" placeholder="Search"> Results: {{typeof fullCount == 'number' ? fullCount.toLocaleString() : fullCount}}
		<h1 v-if="!people.readyOnce">Loading...</h1>
		<h1 v-else-if="!people.count">No results for "{{search}}"</h1>
		<virtual-scroller v-else pageMode contentTag="table" :items="buffer" :renderers="renderers" :keyField="false" itemHeight="40" @update="update"></virtual-scroller>
	</div>
</template>

<script>
	import Person from './person.vue'
	export default {
		label:'infinite',
		data(){
			return {
				indexes:{},
				renderers:{
					default:Person
				},
				buffer:[],
				search:'',
				fullCount:undefined
			}
		},
		watch:{
			people:{
				handler(people){
					if(people.ready){
						if(people.fullCount !== false && people.fullCount !== this.fullCount){
							this.fullCount = people.fullCount
							this.buffer = new Array(people.fullCount)
						}
						for(let i = 0; i <= this.indexes.end - this.indexes.start && i < people.data.length; i++){
							console.log(i + this.indexes.start)
							this.buffer.splice(i + this.indexes.start, 1, people.data[i])
						}
					}
				},deep:true
			}
		},
		methods:{
			update:_.throttle(function(indexes){ //doing some stuff to reduce the number of subscription updates
				indexes = {
					start: Math.floor(indexes.startIndex / 10) * 10,
					end: Math.ceil(indexes.endIndex / 10) * 10 + 10
				}
				if(this.indexes.start !== indexes.start || this.indexes.end !== indexes.end){
					this.indexes = indexes
				}
				console.log(this.indexes.start,this.indexes.end)
			},500)
		},
		grapher:{
			people(){
				let filters = {}
				if(this.search){
					filters.$or = [
						{name:{$regex:this.search, $options:'i'}},
						{job:{$regex:this.search, $options:'i'}},
						{city:{$regex:this.search, $options:'i'}}
					]
				}
				return {
					collection:People,
					query:{
						name:1,
						job:1,
						city:1,
						$filters:filters,
						$options:{
							sort:{name:1},
							skip:this.indexes.start,
							limit:this.indexes.end ? this.indexes.end - this.indexes.start : 1
						}
					},
					fullCount:true
				}
			}
		}
	}
</script>