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