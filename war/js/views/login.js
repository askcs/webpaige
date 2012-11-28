$(document).ready(function ()
{
  pageInit('login', 'false');
  
  var browser = (webpaige.whoami())[0].toLowerCase();  
  if (browser == 'msie')
  {
	  $('#loginForm').hide();
	  $('#browseHappy').show();
  }
  
  var login = JSON.parse(webpaige.get('login'));
  if (login != null)
  {
    $('#username').val(login.user);
    $('#remember').attr('checked', login.remember);
  }
  $("#alertClose").click(function ()
  {
    $("#alertDiv").hide();
  });
  $("#loginBtn").click(function ()
  {
    loginHandler();
  });
  window.addEventListener('keypress', KeyPressHandler);
  var local = {
    title: 'login_title',
    statics: ['login_login', 'login_enter_email', 'login_password', 'login_remember', 'login_forgot']
  }
  webpaige.i18n(local);
});

function KeyPressHandler(event)
{
  if (event.keyCode === 13)
  {
    loginHandler();
  }
}

function loginHandler()
{
  $("#ajaxLoader").show();
  var userDef = "Username";
  var passDef = "password";
  var user = $('#username').val();
  var pass = $('#password').val();
  var r = $('#remember:checked').val();
  if (user == '' || user == userDef)
  {
    $("#alertDiv").show();
    jQuery.i18n.prop('login_error_username');
    $("#alertMessage").html(login_error_username);
    $("#ajaxLoader").hide();
    return false;
  }
  if (pass == '' || pass == passDef)
  {
    $("#alertDiv").show();
    jQuery.i18n.prop('login_error_password');
    $("#alertMessage").html(login_error_password);
    $("#ajaxLoader").hide();
    return false;
  }
  loginAsk(user.toLowerCase(), pass, r);
}
// new version
function loginAs(type)
{
  var user, pass = MD5('askask');
  switch (type)
  {
    case 'planner':
      user = 'beheer';
      pass = '319fcaa585c17eff5dcc2a57e8fc853f';
      break;
    case 'teamleider':
      user = '4058fok';
      pass = '288116504f5e303e4be4ff1765b81f5d';
      break;
    case 'volunteer':
      user = '4780aldewereld';
      pass = 'd9a6c9bad827746190792cf6f30d5271';
      break;
  }
  loginAskWithOutMD5(user, pass, true);
}

function loginAsk(user, pass, r)
{
  webpaige.set('config', '{}');
  // logging in ask
  webpaige.con(
  options = {
    path: '/login?uuid=' + user + '&pass=' + MD5(pass),
    //loading: 'Logging in..'
    loading: 'Inloggen..'
  },

  function (data, label)
  {
    if (r != null)
    {
      var login = {};
      login.user = user;
      login.remember = r;
      webpaige.set('login', JSON.stringify(login));
    }
    else
    {
      webpaige.remove('login');
    }
    session.setSession(data["X-SESSION_ID"]);
    document.cookie = "sessionId=" + session;
    // loading resources
    webpaige.con(
    options = {
      path: '/resources',
      //loading: 'Loading resources..',
      loading: 'Persoonlijke gegevens aan het laden..',
      label: 'resources',
      session: session.getSession()
    },

    function (data, label)
    {
      webpaige.set(label, JSON.stringify(data));
      webpaige.config('userRole', data.role);
      var trange = {};
      now = parseInt((new Date()).getTime() / 1000);
      trange.bstart = (now - 86400 * 7 * 1);
      trange.bend = (now + 86400 * 7 * 1);
      trange.start = new Date();
      trange.start = Date.today().add(
      {
        days: -5
      });
      trange.end = new Date();
      trange.end = Date.today().add(
      {
        days: 5
      });
      webpaige.config('trange', trange);
      webpaige.config('treset', trange);
      var url = (data.role < 3) ? '/network' : '/parent';
      webpaige.con(
      options = {
        path: url,
        loading: 'Groep & contacten informatie aan het laden..',
        label: 'groups',
        session: session.getSession()
      },

      function (data, label)
      {
        for (var i in data)
        {
          if (i == 0)
          {
            webpaige.config('firstGroupUUID', data[i].uuid);
            webpaige.config('firstGroupName', data[i].name);
          }
        }
        // finally redirect
        document.location = "dashboard.html";
      });
    });
  });
}

function loginAskWithOutMD5(user, pass, r)
{
  webpaige.set('config', '{}');
  // logging in ask
  webpaige.con(
  options = {
    path: '/login?uuid=' + user + '&pass=' + pass,
    label: 'login',
    loading: 'Inloggen..'
  },

  function (data, label)
  {
    if (r != null)
    {
      var login = {};
      login.user = user;
      login.remember = r;
      webpaige.set('login', JSON.stringify(login));
    }
    else
    {
      webpaige.remove('login');
    }
    session.setSession(data["X-SESSION_ID"]);
    document.cookie = "sessionId=" + session;
    // loading resources
    webpaige.con(
    options = {
      path: '/resources',
      loading: 'Persoonlijke gegevens aan het laden..',
      label: 'resources',
      session: session.getSession()
    },

    function (data, label)
    {
      webpaige.set(label, JSON.stringify(data));
      webpaige.config('userRole', data.role);
      var trange = {};
      now = parseInt((new Date()).getTime() / 1000);
      trange.bstart = (now - 86400 * 7 * 1);
      trange.bend = (now + 86400 * 7 * 1);
      trange.start = new Date();
      trange.start = Date.today().add(
      {
        days: -5
      });
      trange.end = new Date();
      trange.end = Date.today().add(
      {
        days: 5
      });
      webpaige.config('trange', trange);
      webpaige.config('treset', trange);
      var url = (data.role < 3) ? '/network' : '/parent';
      //debugger;
      webpaige.con(
      options = {
        path: url,
        loading: 'Groep & contacten informatie aan het laden..',
        label: 'groups',
        session: session.getSession()
      },

      function (data, label)
      {
        for (var i in data)
        {
          if (i == 0)
          {
            webpaige.config('firstGroupUUID', data[i].uuid);
            webpaige.config('firstGroupName', data[i].name);
          }
        }
        // finally redirect
        document.location = "dashboard.html";
      });
    });
  });
}