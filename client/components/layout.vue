<template>
<div>
	<header>
		<div class="logo">Meteor + Grapher + Vue</div class="logo">
		<nav>
			<a @click="page = 'test'" :class="{active:page == 'test'}">Color boxes</a>
			<a @click="page = 'infinite'" :class="{active:page == 'infinite'}">Infinite scroll</a>
		</nav>
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
				}
			},
			filters:[
				{
					display:'Only show developers',
					filter:{job:{$regex:'developer',$options:'i'}},
					enabled:false
				}
			]
		}
	}
}
</script>