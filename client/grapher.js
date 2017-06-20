import Vue from 'vue'
Vue.mixin({
	beforeCreate(){
		this._grapher = {}
	},
	created(){
		if(this.$options.grapher){
			_.each(this.$options.grapher, (fn, name) => {
				this.$data[name] = []
				Vue.util.defineReactive(this, name, null)
				let computation
				this.$watch(fn, data => {
					console.log('woot')
					if(!this._grapher[name]){
						this._grapher[name] = data.collection.createQuery(data.query)
					}
					let query = this._grapher[name]
					query.body = data.query
					if(data.subscribe !== false){
						query.unsubscribe()
						query.subscribe()
					}
					if(computation){
						this.$stopHandle(computation)
					}
					computation = this.$autorun(()=>{
						this[name] = query.fetch()
					})
				},{immediate:true})
			})
		}
	},
	destroyed(){
		_.each(this._grapher, query => query.unsubscribe())
		this._grapher = null
	}
})