<template>
	<tr :class="{odd:itemIndex % 2}"> <!-- CSS nth-child does not work with virtual-scroll -->
		<td style="color:#888;width:50px">{{itemIndex + 1}}</td>
		<td :class="{ready:!!item}" v-html="item && match(item.name, search) || ''"></td>
		<td :class="{ready:!!item}" v-html="item && match(item.job, search) || ''"></td>
		<td :class="{ready:!!item}" v-html="item && match(item.city, search) || ''"></td>
	</tr>
</template>

<script>
	export default {
		props:['item','item-index'],
		data(){
			return {selected:true}
		},
		computed:{
			search(){
				return this.$parent.$parent.search
			}
		},
		methods:{
			match(string, search){
				if(search){
					return string.replace(new RegExp(search,'ig'), '<span class="match">$&</span>')
				} else {
					return string
				}
			}
		}
	}
</script>