<template>
	<tr>
		<template v-if="item">
			<td style="color:#888;width:50px">{{itemIndex}}</td>
			<td v-html="match(item.name, search)"></td>
			<td v-html="match(item.job, search)"></td>
			<td v-html="match(item.city, search)"></td>
		</template>
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