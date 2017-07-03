import faker from 'faker'

function randInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

Test = new Mongo.Collection('test')
Extra = new Mongo.Collection('test2')
People = new Mongo.Collection('people')

Test.addLinks({
	extra:{
		collection:Extra,
		type:'one',
		field:'_id'
	}
})
if(Meteor.isServer){
	Test.expose()
	Extra.expose()
	People.expose()
	People._ensureIndex({name: 1})
	People._ensureIndex({
		name: 'text',
		city: 'text',
		job: 'text'
	})
	
	Meteor.setInterval(()=>{
		Test.upsert(randInt(1,99),{$set:{color:'#' + randInt(256,4096).toString(16)}}) //Number as _id? Apparently okay, and doesn't get converted to String
		Extra.upsert(randInt(1,99),{$set:{corners:randInt(0,1) ? 'rounded' : 'square'}})
	},50)
	let count = 50000
	for(let i = People.find().count(); i < count; i++){
		People.insert({
			name:faker.name.findName(),
			job:faker.name.jobTitle(),
			city:faker.address.city()
		})
	}
}
Meteor.methods({
	select(id){
		let item = Test.findOne(id)
		if(item){
			Test.update(item._id,{$set:{selected:!item.selected}})
		}
	}
})