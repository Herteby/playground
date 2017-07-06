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
		<virtual-table v-if="page == 'infinite'" :fields="fields" :filters="filters" :renderers="{default:'person'}" :collection="$global.People"></virtual-table>
		<test v-else></test>
	</main>
</div>
</template>

<script>
export default {
	data(){
		return {
			page:'infinite',
			fields:{
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
				emoji:{}
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
			]
		}
	}
}
</script>