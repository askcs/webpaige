'use strict';
/* Profile controller */

var profile = function($scope)
{
  document.getElementById('alertClose').addEventListener('click', this.closeAlerts, false);
  document.getElementById('updateProfileTrigger').addEventListener('click', this.updateProfile, false);
  this.renderProfile();
  this.addEventListeners();
}

//profile.prototype = $.extend({}, app.prototype, {
profile.prototype = {

	constructor: profile,
	
	closeAlerts: function()
	{
	  $("#alertDiv").hide();
	},
	
	renderProfile: function()
	{
	  webpaige.con(
	  {
	    path: '/resources',
	    loading: 'Gebruiker informatie wordt opgeladen..',
	    label: 'resources',
	    session: session.getSession()
	  },
	
	  function (data, label)
	  {
	    var name = (data.name != undefined) ? data.name : 'Er is nog geen namen toegevoegd.';
	    var email = (data.EmailAddress != undefined) ? data.EmailAddress : 'Er is nog geen adres toegevoegd.';
	    var phone = (data.PhoneAddress != undefined) ? data.PhoneAddress : 'Er is nog geen telefoonnummer toegevoegd.';
	    //var address = (data.fullPostAddress != undefined) ? data.fullPostAddress : 'Er is nog geen adres toegevoegd.';
	    var address = (data.PostAddress != undefined) ? data.PostAddress : 'Er is nog geen adres toegevoegd.';
	    var postcode = (data.PostZip != undefined) ? data.PostZip : 'Er is nog geen postcode toegevoegd.';
	    var city = (data.PostCity != undefined) ? data.PostCity : 'Er is nog geen stad toegevoegd.';
	    $('#live').remove();
	    var live = $('<div id="live"></div>');
	    var para = $('<p></p>');
	    var dl = $('<dl></dl>');
	    dl.append('<dt>Emailadres:</dt>');
	    dl.append('<dd>' + email + '</dd>');
	    dl.append('<dt>Telefoonnummer:</dt>');
	    dl.append('<dd>' + phone + '</dd>');
	    dl.append('<dt>Straat:</dt>');
	    dl.append('<dd>' + address + '</dd>');
	    dl.append('<dt>Postcode:</dt>');
	    dl.append('<dd>' + postcode + '</dd>');
	    dl.append('<dt>Stad:</dt>');
	    dl.append('<dd>' + city + '</dd>');
	    para.append(dl);
	    $(live).append(para);
	    $('#content').html(live);
	  });
	},
	
/*
	updateProfile: function()
	{
	  webpaige.con(
	  {
	    path: '/resources',
	    loading: 'Gebruiker informatie wordt opgeladen..',
	    label: 'resources',
	    session: session.getSession()
	  },
	
	  function (data, label)
	  {
	    $('#updateProfile').modal('show');
	    $('#name').val(data.name);
	    $('#email').val(data.EmailAddress);
	    $('#phone').val(data.PhoneAddress);
	    $('#address').val(data.PostAddress);
	    $('#postcode').val(data.PostZip);
	    $('#city').val(data.PostCity);
	  });
	},
*/
	
/*
	changePassword: function()
	{
	  var old_pass = $('#pass').val();
	  var pass1 = $('#pass1').val();
	  var pass2 = $('#pass2').val();
	  if (pass1 == '' || pass2 == '')
	  {
	    $("#changePassword #alertDiv").show();
	    $("#changePassword #alertMessage").html("<strong>Wachtwoord wijzigen is mislukt!</strong><br>Graag vul de alle verplichte velden.");
	    return false;
	  }
	  if (pass1 != pass2)
	  {
	    $("#changePassword #alertDiv").show();
	    $("#changePassword #alertMessage").html("<strong>Wachtwoord wijzigen is mislukt!</strong><br>Wachtwoorden komen niet overeen. Probeer het opnieuw.");
	    return false;
	  }
	  else
	  {
	    var pass = pass1;
	  }
	  webpaige.con(
	  {
	    path: '/resources',
	    loading: 'Gebruiker informatie wordt opgeladen..',
	    label: 'resources',
	    session: session.getSession()
	  },
	
	  function (data, label)
	  {
	    if (data.askPass == MD5(old_pass))
	    {
	      var tags = '{' + '"askPass":"' + MD5(pass) + '"' + '}';
	      webpaige.con(
	      {
	        type: 'post',
	        path: '/resources?tags=' + tags,
	        loading: 'Wachtwoord wordt gewijzigd..',
	        message: 'Wachtwoord is gewijzigd.',
	        label: 'resources',
	        session: session.getSession()
	      },
	
	      function (data, label)
	      {
	        var body = '{' + '"current_password":"' + MD5(old_pass) + '",' + '"new_password":"' + MD5(pass) + '"' + '}';
	        var sense = webpaige.get('sense');
	        sense = sense ? JSON.parse(sense) : undefined;
	        webpaige.con(
	        {
	          host: 'http://api.sense-os.nl',
	          path: '/change_password.json',
	          type: 'post',
	          json: body,
	          loading: 'Sense Wachtwoord wordt gewijzigd..',
	          message: 'Sense Wachtwoord is gewijzigd..',
	          session: sense.session,
	          credentials: false,
	          label: 'sensors'
	        },
	
	        function (data, label)
	        {
	          $("#changePassword #successDiv").show();
	          $("#changePassword #successMessage").html("<strong>Wachtwoord is gewijzigd!</strong><br>Uw nieuwe wachtwoord is ingesteld.");
	          $('#changePassword #changePasswordButtons').hide();
	          $('#changePassword #passwordChangedButton').show();
	        });
	      });
	    }
	    else
	    {
	      $("#changePassword #alertDiv").show();
	      $("#changePassword #alertMessage").html("<strong>Wachtwoord wijzigen is mislukt!</strong><br>U hebt een verkeerd wachtwoord getypt.");
	    }
	  });
	},
*/
	
/*
	changeResources: function()
	{
	  var name = $('#name').val();
	  var phone = $('#phone').val();
	  var address = $('#address').val();
	  var postcode = $('#postcode').val();
	  var city = $('#city').val();
	  $('#updateProfile').modal('hide');
	  var tags = '{' + '"name":"' + name + '", ' + '"PhoneAddress":"' + phone + '", ' + '"PostAddress":"' + address + '", ' + '"PostZip":"' + postcode + '", ' + '"PostCity":"' + city + '"' + '}';
	  console.log(tags);
	  webpaige.con(
	  {
	    type: 'post',
	    path: '/resources',
	    json: tags,
	    loading: 'Gebruiker informatie wordt gewijzigd..',
	    message: 'Gebruiker informatie is gewijzigd.',
	    label: 'resources',
	    session: session.getSession()
	  },
	
	  function (data, label)
	  {
	    $("#profileChanged").show();
	    renderProfile();
	  });
	}
*/




}
//)

profile.$inject = ['$scope'];