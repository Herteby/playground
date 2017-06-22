function randInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

Test = new Mongo.Collection('test')
Test2 = new Mongo.Collection('test2')

Test.addLinks({
	extra:{
		collection:Test2,
		type:'one',
		field:'_id'
	}
})
if(Meteor.isServer){
	Test.expose()
	Test2.expose()
	Meteor.setInterval(()=>{
		Test.upsert(randInt(1,50),{$set:{color:'#' + randInt(256,4096).toString(16)}}) //Number as _id? Apparently okay, and doesn't get converted to String
		Test2.upsert(randInt(1,50),{$set:{corners:randInt(0,1) ? 'rounded' : 'square'}})
	},50)
}
