<template>
<div :class="{item:true,selected:data.selected}" :style="style" @click="Meteor.call('select',data._id)">{{data._id}} : {{data.color}}</div>
</template>

<script>
export default {
	props:['item'],
	computed:{
		data(){
			return this.item.item || this.item
		},
		style(){
			return {
				background:this.data.color,
				borderRadius:this.data.extra && this.data.extra.corners == 'rounded' ? '50px' : '0',
				border:this.data.selected ? '2px solid #fff' : 'none',
				margin:this.data.selected ? '3px' : '5px'
			}
		},
	}
}
</script>