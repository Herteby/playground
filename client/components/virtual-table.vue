<template>
<div>
	<div class="notifications">
		<div :class="{loading:true,ready:items.ready}">Loading . . .</div>
		<div class="subscribeCount">Subscribing to {{indexes.end - indexes.start}} items</div>
	</div>
	<div class="tableHead">
		<input class="search" v-if="showSearch" v-model="search" placeholder="Search">
		<label class="filter" v-for="filter in savedFilters"><input type="checkbox" v-model="filter.enabled">{{filter.display}}</label>
		<div class="count">Results: {{typeof fullCount == 'number' ? fullCount.toLocaleString() : fullCount}}</div>
		<div class="fields">
			<div v-for="field, key in savedFields" :key="key" :class="{sortable:field.sort !== false}"@click="changeSort(key)">
				{{field.display}}
				<span v-if="field.sort === 1">▼</span>
				<span v-else-if="field.sort === -1">▲</span>
			</div>
		</div>
	</div>
	<h1 v-if="!items.readyOnce">Loading...</h1>
	<template v-else-if="!items.count">
		<h1 v-if="items.ready">No results for "{{search}}"</h1>
		<h1 v-else="!items.count">Loading...</h1>
	</template>
	<virtual-scroller v-else pageMode contentTag="table" :items="buffer" :renderers="renderers" :keyField="false" itemHeight="40" @update="update"></virtual-scroller>
</div>
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
		filters: {
			type: Array
		},
		renderers:{
			type: Object,
			required: true
		},
		showSearch: {
			type: Boolean,
			default: true
		},
		sort2: {
			type: String,
			default: '_id'
		}
	},
	data(){
		return {
			savedFilters:_.clone(this.filters),
			savedFields:_.clone(this.fields),
			filter:true,
			showQuery:false,
			indexes:{},
			buffer:[],
			search:'',
			fullCount:undefined
		}
	},
	watch:{
		items:{
			handler(items){
				if(items.ready){
					if(items.fullCount !== false && items.fullCount !== this.fullCount){
						this.fullCount = items.fullCount
						this.buffer = new Array(items.fullCount)
					}
					for(let i = 0; i <= this.indexes.end - this.indexes.start && i < items.data.length; i++){
						this.buffer.splice(i + this.indexes.start, 1, items.data[i])
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
			let field = this.savedFields[key]
			if(_.isNumber(field.sort)){
				field.sort = 0 - field.sort
			} else if(field.sort !== false){
				_.each(this.savedFields, sibling => {
					if(sibling.sort !== false)
						sibling.sort = null
				})
				Vue.set(field, 'sort', 1)
			}
			console.log(_.clone(this.savedFields))
		}
	},
	grapher:{
		items(){
			let fields = {}
			let sort = {}
			_.each(this.savedFields, (field, key) => {
				fields[key] = 1
				if(typeof field.sort == 'number')
					sort[key] = field.sort
			})
			sort[this.sort2] = 1

			let $filters = {}
			if(this.search){
				$filters.$or = []
				_.each(this.savedFields, (field, key) => {
					if(field.search)
						$filters.$or.push({[key]:{$regex:this.search, $options:'i'}})
				})
			}
			$filters.$and = _.pluck(_.where(this.savedFilters, {enabled:true}), 'filter')
			if(_.isEmpty($filters.$and))
				delete $filters.$and
			console.log($filters)

			return {
				collection:this.collection,
				query:{
					$filters,
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