<template>
	<div>
		<button @click="force = !force">Force update: {{force}}</button>
		<virtual-scroller pageMode contentTag="table" :items="stuff" :renderers="renderers" :keyField="false" itemHeight="40" @update="indexes = $event"></virtual-scroller>
	</div>
</template>

<script>
	import Person from './person.vue'
	export default {
		data(){
			return {
				force:false,
				indexes:{},
				renderers:{
					default:Person
				},
				stuff:new Array(50000)
			}
		},
		watch:{
			people: {
				handler(result){
					if(result.ready){
						_.each(result.data, (person, index) => {
							this.stuff[index + this.indexes.startIndex] = person
						})
						console.log('people loaded:',_.filter(this.stuff, person => person && person.name).length)
						if(this.force){ //temporary workaround for virtual-scroller 'items' watcher not working
							this.$children[0].updateVisibleItems(true)
						}
					}
				},
				deep:true
			}
		},
		grapher:{
			people(){
				//console.log(this.indexes.startIndex,this.indexes.endIndex)
				return {
					collection:People,
					query:{
						name:1,
						job:1,
						city:1,
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