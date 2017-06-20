import Vue from 'vue'
Vue.mixin({
	beforeCreate(){
		this._grapherQueries = {}
	},
	destroyed(){
		_.each(this._grapherQueries, query => query.unsubscribe())
		this._grapherQueries = null
	}
})