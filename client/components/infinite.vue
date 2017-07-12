<template>
	<virtual-table :fields="fields" :include="include" :filters="filters" :collection="$global.People" :click="click">
		<template slot="name" scope="props">
			<td><span v-html="props.match($get(props,'item.name'))"></span> <div class="emoji">{{$get(props,'item.emoji')}}</div></td>
		</template>
		<template slot="number" scope="props">
			<td style="color:#aaa">{{props.index}}</td>
		</template>
	</virtual-table>
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
				fields:{
					number:{
						display:'#',
						sort:false,
						//component:'number'
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