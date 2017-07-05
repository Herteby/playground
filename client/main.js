import Vue from 'vue'
import VueMeteorTracker from 'vue-meteor-tracker'
Vue.use(VueMeteorTracker)

import GrapherVue from 'meteor/herteby:grapher-vue'
Vue.use(GrapherVue)
import 'vue-clicky'
//import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

Vue.prototype.$global = window
Vue.prototype._ = _ //add Underscore to Vue
Vue.prototype.Meteor = Meteor

Vue.config.meteor.freeze = true
new Vue({
	el: '#app',
	render: h => h('layout')
})
Session = new Vue()
//Testing if Vue components can be used in <head>. Turns out they can :D
new Vue({
	el:'title',
	render(h){
		return    h('title','Meteor + Grapher + Vue')
	}
})
log = function log(...args){
	let clones = _.map(args, _.clone)
	_.each(clones, arg => {
		if(typeof arg == 'function'){
			arg = arg.toString()
		}
	})
	console.log('%c' + (log.caller ? log.caller.name : 'unknown'), 'color:#fff;font-weight:bold;background:#08f;border-radius:10px;padding:0 5px',...clones)
	return args[0]
}