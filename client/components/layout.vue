<template>
	<div>
		<div class="menu">
			<a @click="page = 'test'" :class="{active:page == 'test'}">Color boxes</a>
			<a @click="page = 'infinite'" :class="{active:page == 'infinite'}">Employees</a>
		</div>
		<component :is="page" class="page"></component>
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