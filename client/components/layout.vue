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
		<infinite v-if="page == 'infinite'" :fields="fields" :renderers="{default:'person'}" :collection="$global.People"></infinite>
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
					name:'#'
				},
				name:{
					name:'Name',
					sort:1,
					search:true
				},
				job:{
					name:'Position',
					sort:null,
					search:true
				},
				city:{
					name:'City',
					sort:null,
					search:true
				}
			}
		}
	}
}
</script>