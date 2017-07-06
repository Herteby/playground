<template>
<tr :class="{odd:itemIndex % 2}" @click="emojify(item)"> <!-- CSS nth-child does not work with virtual-scroll -->
	<td style="color:#888;width:50px">{{itemIndex + 1}}</td>
	<td :class="{ready:!!item}" v-html="item && match(item.name) + (item.emoji || '')"></td>
	<td :class="{ready:!!item}" v-html="item && match(item.job)"></td>
	<td :class="{ready:!!item}" v-html="item && match(item.city)"></td>
</tr>
</template>

<script>
export default {
	props:['item','item-index'],
	inject:['match'],
	methods:{
		emojify(item){
			if(item && item._id)
				Meteor.call('emojify',item._id)
		}
	}
}
</script>