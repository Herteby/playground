<template>
	<div>
		<div :class="'notifications'">
			<div v-if="!items.ready" class="loading">Loading...</div>
			<div class="subscribeCount">Subscribing to {{indexes.end - indexes.start}} items</div>
		</div>
		<div class="tableHead">
			<input class="search" v-if="showSearch" v-model="search" placeholder="Search">
			<label class="filter" v-for="filter in savedFilters"><input type="checkbox" v-model="filter.enabled">{{filter.display}}</label>
			<div class="count">Results: {{typeof fullCount == 'number' ? fullCount.toLocaleString() : fullCount}}</div>
			<div class="fields" ref="fields">
				<div
					v-for="field, key, n in savedFields"
					v-if="field.display"
					:key="key"
					:class="{sortable:field.sort !== false}"
					@click="changeSort(key)"
					:style="{width:$get(row,n) + 'px'}"
				>
					{{field.display}}
					<span v-if="field.sort === 1">▼</span>
					<span v-else-if="field.sort === -1">▲</span>
				</div>
			</div>
		</div>
		<virtual-scroller
			v-if="items.readyOnce && items.count"
			pageMode
			contentTag="table"
			:items="buffer"
			:keyField="false"
			itemHeight="40"
			@update="update"
			ref="scroller"
		>
			<template scope="props">
				<tr :class="{item:true, odd:props.itemIndex % 2, ready:!!props.item}" @click="$emit('click',props.item)">
					<template v-for="field, key in savedFields">
						<slot v-if="$scopedSlots[key]" :name="key" :item="props.item" :index="props.itemIndex" :match="match"></slot>
						<td v-else v-html="match($get(props, 'item.' + key))"></td>
					</template>
				</tr>
			</template>
		</virtual-scroller>
		<h1 v-else-if="items.ready">No results<template v-if="search"> for "{{search}}"</template></h1>
		<h1 v-else>Loading...</h1>
	</div>
</template>

<script>
	export default {
		props:{
			collection:{type:Mongo.Collection, required: true},
			fields:{type:Object, required:true},
			baseQuery:{type:Object, default:{}},
			filters:{type:Array},
			showSearch:{type:Boolean, default:true},
			sort2:{type:String, default:'_id'},
			minimum:{type:Number, default:30},
			regexPrefix:{type:String, default:'([^a-zA-Z]|^)'}
		},
		data(){
			return {
				savedFilters:_.clone(this.filters),
				savedFields:_.clone(this.fields),
				filter:true,
				showQuery:false,
				indexes:{
					start:0,
					end:this.minimum
				},
				buffer:[],
				search:'',
				fullCount:undefined,
				row:undefined
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
							set(this.buffer, i + this.indexes.start, items.data[i])
						}
					}
				}, deep:true
			}
		},
		methods:{
			update:_.throttle(function(indexes){ //doing some stuff to reduce the number of subscription updates
				let chunkSize = 10
				indexes = {
					start: Math.floor(indexes.startIndex / chunkSize) * chunkSize,
					end: Math.ceil(indexes.endIndex / chunkSize) * chunkSize + chunkSize
				}
				if(indexes.end < this.minimum)
					indexes.end = this.minimum
				if(this.indexes.start !== indexes.start || this.indexes.end !== indexes.end){
					this.indexes = indexes
				}
				this.$refs.scroller.updateVisibleItems()
				
				//field widths
				let row = get(this.$el.getElementsByTagName('tr'), '0.children')
				this.row = _.map(row, 'offsetWidth')
			}, 250),
			changeSort(key){
				let field = this.savedFields[key]
				if(_.isNumber(field.sort)){
					set(field, 'sort', 0 - field.sort)
				} else if(field.sort !== false){
					_.each(this.savedFields, sibling => {
						if(sibling.sort !== false)
							set(sibling, 'sort', null)
					})
					set(field, 'sort', 1)
				}
			},
			match(string){
				if(this.search){
					return string.replace(new RegExp(this.regexPrefix + this.search, 'ig'), '<mark>$&</mark>')
				} else {
					return string
				}
			}
		},
		provide(){
			return {
				match:this.match			
			}
		},
		grapher:{
			items(){
				let query = _.cloneDeep(this.baseQuery)

				query.$options = {
					sort:{},
					skip:this.indexes.start,
					limit:this.indexes.end ? this.indexes.end - this.indexes.start : 1
				}
				//go through the fields and add them to the query
				_.each(this.savedFields, (field, key) => {
					_.set(query, key, 1)
					if(typeof field.sort == 'number')
						query.$options.sort[key] = field.sort
				})
				query.$options.sort[this.sort2] = 1

				query.$filters = query.$filters || {}
				//text search
				if(this.search){
					query.$filters.$or = query.$filters.$or || []
					_.each(this.savedFields, (field, key) => {
						if(field.search)
							query.$filters.$or.push({[key]:{$regex:this.regexPrefix + this.search, $options:'i'}})
					})
				}
				//toggleable filters
				let filters = _.map(_.filter(this.savedFilters, {enabled:true}), 'filter')
				if(!_.isEmpty(filters))
					query.$filters.$and = filters

				return {
					collection:this.collection,
					query:query,
					fullCount:true
				}
			}
		}
	}
</script>