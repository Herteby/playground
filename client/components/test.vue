<template>
	<div>
		<button @click="extra = !extra">Link {{extra ? 'on' : 'off'}}</button>
		<button @click="subscribe = !subscribe">Subscription {{subscribe ? 'on' : 'off'}}</button>
		<button @click="selected = !selected">{{selected ? 'Selected' : 'All'}}</button>
		<button @click="onlyRound = !onlyRound">{{onlyRound ? 'Only rounded' : 'All types'}}</button>
		<button @click="single = !single">{{single ? 'Single' : 'Multiple'}}</button>
		<template v-if="!single">Limit: <input type="number" v-model.number="limit" min="1" max="99"></template>
		Search: <input type="text" v-model="search">
		<button @click="search = ''">Clear</button>
		<button @click="search = '[a-f][0-9][0-9]'">Reddish</button>
		<button @click="search = '[0-9][a-f][0-9]'">Greenish</button>
		<button @click="search = '[0-9][0-9][a-f]'">Bluish</button>
		<h1 v-if="!stuff.readyOnce">Loading...</h1>
		<h1 v-else-if="stuff.count == 0">No results 
			<span v-if="selected">(Click items to select them)</span>
			<span v-if="onlyRound && !extra">(Link must be turned on to get corners)</span>
		</h1>
		<div class="list" v-else-if="!single">
			<item v-for="item in stuff.data" :item="item" :key="item._id"/>
		</div>
		<item v-else :item="stuff.data"/>
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
				extra:true,
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
				let filters = {}
				if(this.search){
					filters.color = {$regex:this.search,$options:'i'}
				}
				if(this.selected){
					filters.selected = true
				}
				
				let query = {
					subscribe:this.subscribe,
					single:this.single,
					collection:Test,
					query:{
						_id:1,
						color:1,
						selected:1,
						extra:this.extra && {
							corners:1
						},
						$filters:filters,
						$options:!this.onlyRound && {limit:this.limit,sort:{_id:1}},//if postFilters are used, limit will count incorrectly unless it's placed in postOptions
						$postFilters:this.onlyRound && {'extra.corners':'rounded'}, //this filter requires data from a linked collection, so it must be a postFilter
						$postOptions:this.onlyRound && {limit:this.limit,sort:{_id:1}}//postOptions has worse performance, and should only be used if necessary
					}
				}

				//Create the JSON display
				let display = _.clone(query)
				display.collection = display.collection._name
				this.query = Object.freeze(display)

				return query
			}
		}
	}

</script>