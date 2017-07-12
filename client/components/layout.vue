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
		<component :is="page"></component>
	</main>
</div>
</template>

<script>
	export default {
		data(){
			return {
				page:'infinite'
			}
		}
	}
</script>