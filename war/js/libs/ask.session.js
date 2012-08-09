
//var host='http://sven.ask-services.appspot.com';
//var host='http://10.200.200.102:9000';
//var host='http://3rc2.ask-services.appspot.com/ns_knrm';
var host = 'http://localhost:9000';

if (ask == undefined)
  var ask = {};

/* Initialize functions */
ask.session = function(callback)
{
	//var login = JSON.parse(cache.get('login'));
	//this.uuid = login.user;
	
	/*
	if (login = this.checkLogin)
	{
		this.uuid = login.user;
	}
	*/
	
	//this.uuid = 'ulusoy.cengiz@gmail.com';
	
	/*
	this.checkLogin = function ()
	{
		if (cache.get('login') != null)
		{
			return JSON.parse(cache.get('login'));
		}
		else
		{
			return false;
		}
	}
	*/


	this.callback = callback;
	this.name="";
	this.checkSession = function()
	{
		if(this.sessionId==null)
			return false;
		var time = new Date();
		var now = time.getTime();
		if((now-this.sessionTime) > (60 * 60 * 1000))
		{		
			//console.log("Timed-out: "+(now-this.sessionTime));
			return false;
		}
		return true;
	}	
	var values;
	var pairs = document.cookie.split(";");
	for(var i=0; i<pairs.length;i++)
	{
		values=pairs[i].split("=");
		if(values[0].trim()=="ask-session")
		{
			var session=JSON.parse(values[1]);
			this.sessionId = session.id;
			this.sessionTime = session.time;
			break;
		}
	}
}

ask.session.prototype.getSession = function()
{
	if(!this.checkSession())
		this.callback();
	this.setSession(this.sessionId);
	return this.sessionId;
}

ask.session.prototype.setSession = function(sessionId)
{
	var time = new Date();
	this.sessionId=sessionId;
	this.sessionTime=time.getTime();
	var session=new Object();
	session.id = this.sessionId;
	session.time = this.sessionTime;
	document.cookie="ask-session="+JSON.stringify(session);
}

ask.session.prototype.clear = function()
{
	this.sessionId=null;
	this.sessionTime=null;
	document.cookie="ask-session='';expires=Thu, 01-Jan-1970 00:00:01 GMT";
}

ask.session.prototype.isSession = function()
{	
	return this.checkSession();
}