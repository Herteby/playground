//in need of refactoring 😓
export default {
	install(Vue, options){
		Vue.mixin({
			beforeCreate(){
				this._grapher = {}
				let args = typeof this.$options.grapher == 'function' ? this.$options.grapher() : this.$options.grapher
				_.each(this.$options.grapher, (fn, name) => {
					Vue.util.defineReactive(this, name, { //Initial "dummy result"
						ready:false,
						readyOnce:false,
						data:[]
					})
				})
			},
			created(){
				if(this.$options.grapher){
					_.each(this.$options.grapher, (fn, name) => {
						let computation
						let readyOnce = false
						let nonreactive
						//Run this function once, and every time the query parameters change
						let unwatch = this.$watch(fn, params => {
							if(typeof params !== 'object'){
								throw new Error('Parameters must be an object')
							}
							nonreactive = params.reactive === false
							let start = new Date(), time
							if(!this._grapher[name]){ //Create the query
								this._grapher[name] = params.collection.createQuery(params.query)
							}
							let query = this._grapher[name]
							query.body = params.query

							if(params.countOnly){
								this[name] = false
								query.getCount((err, count) => {
									this[name] = count
								})
								return
							}

							if(params.single){
								if(!query.body.$options){
									query.body.$options = {}
								}
								query.body.$options.limit = 1
							}

							if(params.subscribe === false){ //"Method style" fetch
								if(query.subscriptionHandle){ //Handle switching from subscription-based
									this.$stopHandle(computation)
									query.unsubscribe()
								}
								this[name].ready = false 
								query.fetch((err, data) => {
									if(err){
										console.err(err)
									} else {
										if(params.single){
											data = data[0]
										}
										let result = {
											ready:true,
											readyOnce:true,
											count:params.single ? undefined : data.length,
											time:new Date() - start,
											data:data
										}
										if(params.fullCount){
											result.fullCount = false
										}
										this[name] = result
									}
								})
							} else { //Subscribe and fetch
								let oldSub = query.subscriptionHandle
								query.subscribe()
								if(oldSub){
									oldSub.stop()
								} else { //Handle switching from method-based
									readyOnce = false
								}
								if(computation){
									this.$stopHandle(computation)
								}
								computation = this.$autorun(()=>{
									if(!query.subscriptionHandle){
										return
									}									
									let ready = query.subscriptionHandle.ready()
									if(ready && !readyOnce){
										readyOnce = true
									}
									if(ready && !time){
										time = new Date() - start
									}
									let data = query.fetch()
									if(params.single){
										data = data[0]
									}
									let result = {
										ready:ready,
										readyOnce:readyOnce,
										count:params.single ? undefined : data.length,
										time:time,
										data:data,
									}
									if(params.fullCount){
										result.fullCount = this[name].fullCount || false
									}
									this[name] = result
								})
							}

							if(params.fullCount){
								query.getCount((err, count) => {
									this.$set(this[name], 'fullCount', count)
								})
							}
						}, {immediate:true})
						if(nonreactive){
							unwatch() //stop the watcher after the first run if the user specified reactive:false
						}
					})
				}
			},
			destroyed(){
				_.each(this._grapher, query => query.unsubscribe())
				this._grapher = null
			}
		})
	}
}
