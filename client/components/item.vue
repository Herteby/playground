<template>
	<div class="item" :style="style" class="item">{{data._id}} : #{{data.color.toString(16)}}</div>
</template>

<script>
	export default {
		props:['data'],
		computed:{
			style(){
				return {
					background:'#' + this.data.color.toString(16),
					color:'#' + (4096 - this.data.color).toString(16),
					borderRadius:this.data.extra && this.data.extra.corners == 'rounded' ? '50px' : '0'
				}
			}
		}
	}
</script>