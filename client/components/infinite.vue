<template>
	<div>
		<input v-model="search" placeholder="Search"> Count: {{fullCount}}
		<h1 v-if="!people.count">No results for "{{search}}"</h1>
		<virtual-scroller v-else pageMode contentTag="table" :items="buffer" :renderers="renderers" :keyField="false" itemHeight="40" @update="indexes = $event"></virtual-scroller>
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
				handler(result){
					console.log(result)
					if(result.ready){
						for(let i = 0; i <= this.indexes.endIndex - this.indexes.startIndex; i++){
							this.buffer.splice(i + this.indexes.startIndex, 1, result.data[i])
						}
						console.log('people loaded:',_.filter(this.buffer, person => person && person.name).length)
					}
					if(result.fullCount !== false){
						this.fullCount = result.fullCount
						this.buffer.splice(result.fullCount)
					}
				},deep:true
			}
		},
		grapher:{
			people(){
				console.log(this.indexes.startIndex,this.indexes.endIndex)
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
							skip:this.indexes.startIndex,
							limit:this.indexes.endIndex ? this.indexes.endIndex - this.indexes.startIndex : 1
						}
					},
					fullCount:true
				}
			}
		}
	}
</script>