<template>
	<div class="item" :style="style" class="item">{{data._id}} : {{data.color}}</div>
</template>

<script>
	export default {
		props:['data'],
		computed:{
			style(){
				return {
					background:this.data.color,
					borderRadius:this.data.extra && this.data.extra.corners == 'rounded' ? '50px' : '0'
				}
			}
		}
	}
</script>