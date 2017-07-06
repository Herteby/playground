<template>
<section>
	<div class="notifications">
		<div :class="{loading:true,ready:people.ready}">Loading . . .</div>
		<div class="subscribeCount">Subscribing to {{indexes.end - indexes.start}} items</div>
	</div>
	<div class="tableHead">
		<input v-if="showSearch" v-model="search" placeholder="Search"> Results: {{typeof fullCount == 'number' ? fullCount.toLocaleString() : fullCount}}
		<div class="fields">
			<div v-for="field, key in fields" :key="key" :class="{sortable:field.sort !== undefined}"@click="changeSort(key)">
				{{field.name}}
				<span v-if="field.sort === 1">▼</span>
				<span v-else-if="field.sort === -1">▲</span>
			</div>
		</div>
	</div>
	<h1 v-if="!people.readyOnce">Loading...</h1>
	<template v-else-if="!people.count">
		<h1 v-if="people.ready">No results for "{{search}}"</h1>
		<h1 v-else="!people.count">Loading...</h1>
	</template>
	<virtual-scroller v-else pageMode contentTag="table" :items="buffer" :renderers="renderers" :keyField="false" itemHeight="40" @update="update"></virtual-scroller>
</section>
</template>

<script>
export default {
	props: {
		collection: {
			type: Mongo.Collection,
			required: true
		},
		fields: {
			type: Object,
			required: true,
		},
		renderers:{
			type: Object,
			required: true
		},
		showSearch: {
			type: Boolean,
			default: true
		}
	},
	data(){
		return {
			showQuery:false,
			indexes:{},
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
						this.buffer.splice(i + this.indexes.start, 1, people.data[i])
					}
				}
			},deep:true
		}
	},
	methods:{
		update:_.throttle(function(indexes){ //doing some stuff to reduce the number of subscription updates
			let chunkSize = 10
			indexes = {
				start: Math.floor(indexes.startIndex / chunkSize) * chunkSize,
				end: Math.ceil(indexes.endIndex / chunkSize) * chunkSize + chunkSize
			}
			if(this.indexes.start !== indexes.start || this.indexes.end !== indexes.end){
				this.indexes = indexes
			}
		},500),
		match(string){
			if(this.search){
				return string.replace(new RegExp(this.search,'ig'), '<span class="match">$&</span>')
			} else {
				return string
			}
		},
		changeSort(key){
			let field = this.fields[key]
			if(field.sort === null){
				_.each(this.fields, field => field.sort !== undefined ? field.sort = null : '')
				field.sort = 1
			} else if(typeof field.sort == 'number'){
				field.sort = 0 - field.sort
			}
		}
	},
	grapher:{
		people(){
			let fields = {}
			let sort = {}
			_.each(this.fields, (field, key) => {
				fields[key] = 1
				if(typeof field.sort == 'number')
					sort[key] = field.sort
			})

			let filters = {}
			if(this.search){
				filters.$or = []
				_.each(this.fields, (field, key) => {
					if(field.search)
						filters.$or.push({[key]:{$regex:this.search, $options:'i'}})
				})
			}

			return {
				collection:this.collection,
				query:{
					$filters:filters,
					$options:{
						sort:sort,
						skip:this.indexes.start,
						limit:this.indexes.end ? this.indexes.end - this.indexes.start : 1
					},
					...fields
				},
				fullCount:true
			}
		}
	}
}
</script>