<template>
<div>
	<header>
		<a class="logo" href="https://github.com/Herteby/testing">Meteor + Grapher + Vue</a class="logo">
		<div class="menu">
			<div @click="page = 'test'" :class="{active:page == 'test'}">Random colors</div>
			<div @click="page = 'infinite'" :class="{active:page == 'infinite'}">Infinite scroll</div>
		</div class="menu">
	</header>
	<main>
		<virtual-table
			v-if="page == 'infinite'"
			:fields="fields"
			:filters="filters"
			:renderers="{default:'person'}"
			:collection="$global.People"
			:click="click"
		></virtual-table>
		<test v-else></test>
	</main>
</div>
</template>

<script>
let fields = {
	number:{
		display:'#',
		sort:false
	},
	name:{
		display:'Name',
		sort:1,
		search:true
	},
	job:{
		display:'Position',
		search:true
	},
	city:{
		display:'City',
		search:true
	},
	'profile.name':{
		display:'Name',
		search:true
	},
	'extra.stuff':{
		display:'Extra',
		search:true,
		post:true
	}
}
export default {
	data(){
		return {
			page:'infinite',
			fields:{
				number:{
					display:'#',
					sort:false,
					component:'number'
				},
				name:{
					display:'Name',
					sort:1,
					search:true
				},
				job:{
					display:'Position',
					search:true
				},
				city:{
					display:'City',
					search:true
				}
			},
			include:{
				emoji:1
			},
			filters:[
				{
					display:'Only developers',
					filter:{job:{$regex:'developer',$options:'i'}},
					enabled:false
				},
				{
					display:'Only people with emoji',
					filter:{emoji:{$exists:true}},
					enabled:false
				}
			],
			click(item){
				console.log(item)
				if(item)
					Meteor.call('emojify', item._id, randInt(0,Emojis.length - 1))
			}
		}
	}
}
</script>