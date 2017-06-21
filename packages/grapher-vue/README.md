#Grapher + Vue

##Installation
```
meteor add herteby:grapher-vue
```
##Setup
```
import GrapherVue from 'meteor/herteby:grapher-vue'
Vue.use(GrapherVue)
```
##Usage
```
<template>
	<div v-if="users.ready">
		Users: {{users.count}}
		<ul>
			<li v-for="user in users">{{user.username}} : <pre>{{user.profile}}</pre></li>
		</ul>
	</div>
	<div v-else>Loading...</div>
</template>

<script>
	export default {
		data(){
			return {
				limit:20,
			}
		},
		grapher:{
			users(){
				return {
					subscribe:true, //defaults to true
					collection:Meteor.users,
					query:{
						username:1,
						profile:1,
						$options:{limit:this.limit}
					}
				}
			}
		}
	}
</script>
```