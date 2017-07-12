<template>
	<td style="color:#888;width:50px">{{index + 1}}</td>
</template>

<script>
	export default {
		props:['item','index'],
		created(){
			console.log(this.props)
		}
	}
</script>