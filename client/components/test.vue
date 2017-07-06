<template>
<div>
	<div class="controls">
		<label><input type="checkbox" v-model="link">Link</label>
		<label><input type="checkbox" v-model="subscribe">Subscribe</label>
		<label><input type="checkbox" v-model="selected">Only selected</label>
		<label><input type="checkbox" v-model="onlyRound">Only rounded</label>
		<label><input type="checkbox" v-model="single">Single result</label>
		<div v-if="!single">Limit: <input type="number" v-model.number="limit" min="1" max="99"></div>
		<input type="text" v-model="search" placeholder="Search" style="width:100px">
		<button @click="search = ''">Clear</button>
		<button @click="search = '[a-f][0-9][0-9]'">Reddish</button>
		<button @click="search = '[0-9][a-f][0-9]'">Greenish</button>
		<button @click="search = '[0-9][0-9][a-f]'">Bluish</button>
	</div>
	<h1 v-if="!stuff.readyOnce">Loading...</h1>
	<h1 v-else-if="stuff.count == 0">No results 
		<span v-if="selected">(Click items to select them)</span>
		<span v-if="onlyRound && !link">(Link must be turned on to get corners)</span>
	</h1>
	<div class="list" v-else-if="!single">
		<color v-for="item in stuff.data" :item="item" :key="item._id"/>
	</div>
	<div v-else class="list">
		<color :item="stuff.data"/>
	</div>
	Query:
	<pre>{{query}}</pre>
	Result:
	<pre>{{stuff}}</pre>
</div>
</template>

<script>
export default {
	data(){
		return {
			limit:30,
			link:true,
			subscribe:true,
			single:false,
			onlyRound:false,
			selected:false,
			search:'',
			query:{}
		}
	},
	grapher:{
		stuff(){
			let args = {
				collection:Test,
				query:{
					_id:1,
					color:1,
					selected:1
				}
			}
			//this may seem like a lot of pointless code. I'm just doing it like this to make the json display look cleaner
			if(!this.subscribe)
				args.subscribe = false
			if(this.single)
				args.single = true

			let query = args.query
			if(this.link)
				query.extra = {corners:1}
			if(this.search || this.selected){
				query.$filters = {}
				if(this.search)
					query.$filters.color = {$regex:this.search,$options:'i'}
				if(this.selected)
					query.$filters.selected = true
			}
			if(this.onlyRound){
				query.$postFilters = {'extra.corners':'rounded'} //this filter requires data from a linked collection, so it must be a postFilter
				query.$postOptions = {limit:this.limit,sort:{_id:1}} //if postFilters are used, limit will count incorrectly unless it's placed in postOptions
			} else {
				query.$options = {limit:this.limit,sort:{_id:1}}
			}

			//Create the JSON display
			let display = _.clone(args)
			display.collection = display.collection._name
			this.query = display

			return args
		}
	}
}
</script>