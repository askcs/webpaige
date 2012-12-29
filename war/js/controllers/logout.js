'use strict';
/* Logout controller */

var logoutCtrl = function($scope)
{
  $.ajax(
  {
    url: host + '/logout',
  })
  .success(
  function(data)
  {
    // TODO
    // display goodbye message
    console.log('goodbye!');
  })
  .fail(function()
  {
    // TODO
    // how to handle could not logout
    console.log('logout failed')
  })
  this.cleanLocalStorage();
  window.location = "logout.html";
}

logoutCtrl.prototype = {

  constructor: logoutCtrl,

  // TODO
  // make a config item to check
  // whether to remove everything
  cleanLocalStorage: function()
  {
    for (var i in localStorage)
    {
      if ( i != 'logindata')
        localStorage.removeItem(i)
    }
  }

}

logoutCtrl.$inject = ['$scope'];