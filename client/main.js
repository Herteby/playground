import Vue from 'vue'
import VueMeteorTracker from 'vue-meteor-tracker'
Vue.use(VueMeteorTracker)
Vue.config.meteor.freeze = true
import test from './components/test.vue'
new Vue({
	el: '#app',
	render: h => h('test')
})

//Testing if Vue can be used in <head>. Turns out it can :D
new Vue({
	el:'title',
	meteor:{
		title(){
			return 'Meteor + Vue + Grapher = ' + ((Test.findOne() || {}).color || '')
		}
	},
	render(h){
		return	h('title',this.title)
	}
})