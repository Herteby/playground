import Vue from 'vue'
import VueMeteorTracker from 'vue-meteor-tracker'
Vue.use(VueMeteorTracker)
import GrapherVue from 'meteor/herteby:grapher-vue'
Vue.use(GrapherVue)
Vue.prototype._ = _ //add Underscore to Vue
Vue.prototype.Meteor = Meteor
Vue.config.meteor.freeze = true
import test from './components/test.vue'
new Vue({
	el: '#app',
	render: h => h('test')
})

//Testing if Vue components can be used in <head>. Turns out they can :D
new Vue({
	el:'title',
	render(h){
		return	h('title','Meteor + Grapher + Vue')
	}
})

//Handy debugging function
document.oncontextmenu = function clicky(e, v){
	let vue = e && e.target.__vue__ || v
	if(vue){
		console.group(vue.$options.name)
		let proto = new function vue(){}
		console.log(_.extend(proto,vue))
		if(!_.isEmpty(vue._data)){
			let proto = new function data(){}
			console.log(_.extend(proto,vue._data))
		} else {
			console.log('data',null)
		}
		let computed = {}
		_.each(vue._computedWatchers, (watcher, key) => computed[key] = watcher.value)
		if(!_.isEmpty(computed)){
			let proto = new function computed(){}
			console.log(_.extend(proto,computed))
		} else {
			console.log('computed',null)
		}
		if(!_.isEmpty(vue._props)){
			let proto = new function props(){}
			console.log(_.extend(proto,vue._props))
		} else {
			console.log('props',null)
		}
		if(vue.$parent){
			let proto = new function parent(){}
			let link = {get LINK(){
				clicky(false, vue.$parent)
				return null
			}}
			link.__proto__ = proto.__proto__
			console.log(link)
		} else {
			console.log('parent',null)
		}
		console.groupEnd()
	} else if(e.target.parentNode){
		clicky({target:e.target.parentNode})
	}
}