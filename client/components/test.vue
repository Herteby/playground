<template>
	<div>
		Limit: <input type="number" v-model.number="limit" min="1" max="99">
		<button @click="extra = !extra">Link {{extra ? 'on' : 'off'}}</button>
		<button @click="subscribe = !subscribe">Subscription {{subscribe ? 'on' : 'off'}}</button>
		<button @click="single = !single">{{single ? 'Single' : 'Multi'}}</button>
		<div class="list" v-if="!single">
			<item v-for="item in stuff.data" :data="item" :key="item._id"/>
		</div>
		<item v-else :data="stuff.data"/>
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
				single:false
			}
		},
		grapher:{
			stuff(){
				return {
					subscribe:this.subscribe,
					single:this.single,
					collection:Test,
					query:{
						_id:1,
						color:1,
						extra:this.extra && {
							corners:1
						},
						$options:{limit:this.limit,sort:{_id:1}}
					}
				}
			}
		}
	}
</script>