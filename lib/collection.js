function randInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

Test = new Mongo.Collection('test')
Test2 = new Mongo.Collection('test2')

Test.addLinks({
	corners:{
		collection:Test2,
		type:'one',
		field:'_id'
	}
})
if(Meteor.isServer){
	Test.expose()
	Test2.expose()
	Test.remove({})
	Meteor.setInterval(()=>{
		for(let i = 1; i <= 50; i++){
			Test.upsert(i,{$set:{color:randInt(256,4096)}}) //Number as _id? Apparently okay, and doesn't get converted to String
			Test2.upsert(i,{$set:{corners:randInt(0,1) ? 'rounded' : 'square'}})
		}
	},2000)
}
