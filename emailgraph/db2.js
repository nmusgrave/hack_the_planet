var mongodb = require('mongodb');
exports.start = function(baton,callback){
    var mongoose=baton[0];
    //do code
    //to do list: add concentration, change radius, change length
    
    console.log("second part");
    var ranks=baton[2];
    var Schema = mongoose.Schema;
    var userSchema = new Schema ({num: Number, fullname: String, email: String,pic:String},{collection: 'userdata'});
    var User = mongoose.model('Userdata', userSchema);
    var edges=[];
    //console.log(ranks);
    User.find({}, function(err, users) {
        if (err){
            console.log(err);
        }   
        var n=users.length;
        var nodesize=[];
	var connections=[];
        for (i=0;i<n;i++){
            nodesize.push(0);
	    connections.push([]);
        }
        //console.log(n);
        for (i=0;i<n;i++){
            for (j=0;j<i;j++){
                var u=ranks[users[i].email+","+users[j].email];
                var v=ranks[users[j].email+","+users[i].email];
                if (typeof u !="undefined" && typeof v!="undefined"){
                    var average=2.0/(1.0/u.score+1.0/v.score);
                    if (average>0.2){
                        edges.push([users[i].num,users[j].num,10.0+4.0/(average+0.01)]);
                        nodesize[users[i].num]+=1;
                        nodesize[users[j].num]+=1;
			connections[users[i].num].push(users[j].num);
			connections[users[j].num].push(users[i].num);
                    }
                }
            }
        }
	for (i=0;i<5;i++){
		console.log(nodesize);
		console.log(connections);
		var temp=nodesize;
		for (j=0;j<n;j++){
			var x=0;
			for (var k in connections[j]){
				x+=nodesize[k]/connections[k].length;
			}
			temp[j]=x;
		}
		var s=0;
		for (j=0;j<n;j++){
			s+=temp[j];
		}
		for (j=0;j<n;j++){
			nodesize[j]=temp[j]/s;
		}
	}
	for (j=0;j<n;j++){
		nodesize[j]*=50;
	}	
        baton.push(users);
        baton.push(edges);
        baton.push(nodesize);
        var thirdpart = require('./db3');
        thirdpart.start(baton,callback);
    
    });
}
