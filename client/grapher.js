import Vue from 'vue'
Vue.mixin({
	beforeCreate(){
		this.$grapher = {}
	},
	created(){
		if(this.$options.grapher){
			_.each(this.$options.grapher, (fn, name) => {
				this.$watch(fn, data => {
					console.log('woot')
					if(!this.$grapher[name]){
						this.$grapher[name] = data.collection.createQuery(data.query)
					}
					let query = this.$grapher[name]
					query.body = data.query
					if(data.subscribe !== false){
						query.unsubscribe()
						query.subscribe()
					}
				},{immediate:true})
			})
		}
	},
	destroyed(){
		_.each(this.$grapher, query => query.unsubscribe())
		this.$grapher = null
	}
})