$(document).ready(function()
{
 	pageInit('profile', 'true');
  renderProfile();
});

var session = new ask.session();

function renderProfile()
{ 
	webpaige.con(
		options = {
			path: '/resources',
			loading: 'Loading resources..',
			label: 'resources',
			session: session.getSession()	
		},
		function(data, label)
	  {  	
		 	var name = (data.name != undefined) ? data.name : 'No name is given yet.';
		 	var email = (data.EmailAddress != undefined) ? data.EmailAddress : 'No email address is given yet.';
		 	var phone = (data.PhoneAddress != undefined) ? data.PhoneAddress : 'No phone number is set.';
		 	var address = (data.fullPostAddress != undefined) ? data.fullPostAddress : 'No address is set.';
		 	$('#live').remove();
			var live = $('<div id="live"></div>');
			var para = $('<p></p>');
			var dl = $('<dl></dl>');
			dl.append('<dt>Email address:</dt>');
			dl.append('<dd>'+email+'</dd>');
			dl.append('<dt>Telephone number:</dt>');
			dl.append('<dd>'+phone+'</dd>');
			dl.append('<dt>Street:</dt>');
			dl.append('<dd>'+data.PostAddress+'</dd>');
			dl.append('<dt>Postcode:</dt>');
			dl.append('<dd>'+data.PostZip+'</dd>');
			dl.append('<dt>City:</dt>');
			dl.append('<dd>'+data.PostCity+'</dd>');
			dl.append('<dt>Country:</dt>');
			dl.append('<dd>'+data.PostCountry+'</dd>');
			para.append(dl);
			$(live).append(para);
			$('#content').html(live);
		}
	);	
}

function updateProfile()
{
	webpaige.con(
		options = {
			path: '/resources',
			loading: 'Loading resources..',
			label: 'resources',
			session: session.getSession()	
		},
		function(data, label)
	  {  	
  		$('#updateProfile').modal('show');
		  $('#name').val(data.name); 
		  $('#email').val(data.EmailAddress); 
		  $('#phone').val(data.PhoneAddress); 
		  $('#address').val(data.PostAddress); 
		  $('#postcode').val(data.PostZip); 
		  $('#city').val(data.PostCity); 
		  $('#country').val(data.PostCountry); 
		}
	);	
}

function changePassword()
{
  $('#changePassword').modal('show');
}

function changeResources()
{
  var name = $('#name').val(); 
  var phone = $('#phone').val(); 
  var address = $('#address').val(); 
  var postcode = $('#postcode').val(); 
  var city = $('#city').val(); 
  var country = $('#country').val(); 
  $('#updateProfile').modal('hide');
  var tags = '{' +
  	'"name":"' + name + '", ' +
  	'"PhoneAddress":"' + phone + '", ' +
  	'"PostAddress":"' + address + '", ' +
  	'"PostZip":"' + postcode + '", ' +
  	'"PostCity":"' + city + '", ' +
  	'"PostCountry":"' + country + '"' +
  	'}';
	webpaige.con(
		options = {
			type: 'post',
			path: '/resources?tags=' + tags,
			loading: 'Changing resources..',
			message: 'Successfully change a resource',
			label: 'resources'
			,session: session.getSession()	
		},
		function(data, label)
	  {  
    	renderProfile();
		}
	);
}