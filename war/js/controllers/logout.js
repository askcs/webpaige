'use strict';
/* Logout controller */

var logout = function($scope)
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

logout.prototype = {

  constructor: logout,

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

logout.$inject = ['$scope'];