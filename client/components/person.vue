<template>
<tr :class="{odd:itemIndex % 2}"> <!-- CSS nth-child does not work with virtual-scroll -->
	<td style="color:#888;width:50px">{{itemIndex + 1}}</td>
	<td :class="{ready:!!item}" v-html="item && match(item.name) || ''"></td>
	<td :class="{ready:!!item}" v-html="item && match(item.job) || ''"></td>
	<td :class="{ready:!!item}" v-html="item && match(item.city) || ''"></td>
</tr>
</template>

<script>
export default {
	props:['item','item-index'],
	data(){
		return {selected:true}
	},
	methods:{
		match(val){
			return this.$parent.$parent.match(val)
		}
	}
}
</script>