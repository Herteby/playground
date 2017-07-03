<template>
	<div>
		<input v-model="search" placeholder="Search">
		<h1 v-if="!people.count">No results for "{{search}}"</h1>
		<virtual-scroller v-else pageMode contentTag="table" :items="stuff" :renderers="renderers" :keyField="false" itemHeight="40" @update="indexes = $event"></virtual-scroller>
	</div>
</template>

<script>
	import Person from './person.vue'
	export default {
		data(){
			return {
				indexes:{},
				renderers:{
					default:Person
				},
				stuff:new Array(50000),
				search:''
			}
		},
		watch:{
			people: {
				handler(result){
					if(result.ready){
						for(let i = 0; i <= this.indexes.endIndex - this.indexes.startIndex; i++){
							this.stuff.splice(i + this.indexes.startIndex, 1, result.data[i])
						}
						console.log('people loaded:',_.filter(this.stuff, person => person && person.name).length)
					}
				},
				deep:true
			}
		},
		grapher:{
			people(){
				console.log(this.indexes.startIndex,this.indexes.endIndex)
				let filters = {}
				if(this.search){
					filters.$text = {
						$search:this.search,
						$fields:['job','city','name']
					}
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
					}
				}
			}
		}
	}
</script>