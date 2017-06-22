<template>
	<div>
		<button @click="extra = !extra">Link {{extra ? 'on' : 'off'}}</button>
		<button @click="subscribe = !subscribe">Subscription {{subscribe ? 'on' : 'off'}}</button>
		<button @click="onlyRound = !onlyRound">{{onlyRound ? 'Only rounded' : 'All types'}}</button>
		<button @click="single = !single">{{single ? 'Single' : 'Multiple'}}</button>
		<template v-if="!single">Limit: <input type="number" v-model.number="limit" min="1" max="99"></template>
		Search: <input type="text" v-model="search">
		<div class="list" v-if="!single">
			<item v-for="item in stuff.data" :data="item" :key="item._id"/>
		</div>
		<item v-else :data="stuff.data"/>
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
				limit:20,
				extra:true,
				subscribe:true,
				single:false,
				onlyRound:false,
				search:'',
				query:{}
			}
		},
		grapher:{
			stuff(){
				let query = {
					subscribe:this.subscribe,
					single:this.single,
					collection:Test,
					query:{
						_id:1,
						color:1,
						extra:this.extra && {
							corners:1
						},
						$filters:this.search &&{
							color:{$regex:this.search}
						},
						$options:{limit:this.limit,sort:{_id:1}}
					},
					where:this.onlyRound && {
						'extra.corners':'rounded'
					}
				}
				let display = _.clone(query)
				display.collection = display.collection._name
				this.query = Object.freeze(display)
				return query
			}
		}
	}

</script>