//import 'loggy'
import 'vue-clicky'
Vue = require('vue')

import VueMeteorTracker from 'vue-meteor-tracker'
Vue.use(VueMeteorTracker)

import GrapherVue from 'meteor/herteby:grapher-vue'
Vue.use(GrapherVue)

store = new Vue({
	data(){
		return {state:{}}
	}
})
_.extend(Vue.prototype, {
	$global:window,
	_,
	store,
	Meteor
})


Vue.config.meteor.freeze = true
new Vue({
	el: '#app',
	render: h => h('layout')
})

//Testing if Vue components can be used in <head>. Turns out they can :D
new Vue({
	el:'title',
	render(h){
		return h('title','Meteor + Grapher + Vue')
	}
})