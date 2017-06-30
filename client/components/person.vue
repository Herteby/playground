<template>
	<tr>
		<td>{{itemIndex}}</td>
		<td>{{item && item.name || '?'}}</td>
		<td>{{item && item.job || '?'}}</td>
		<td>{{item && item.city || '?'}}</td>
	</tr>
</template>

<script>
	export default {
		props:['item','item-index'],
		data(){
			return {selected:true}
		},
		computed:{
			name(){
				return this.item.firstName + ' ' + this.item.lastName 
			}
		}		
	}
</script>