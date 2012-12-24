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
    console.log('goodbye!');
  })
  .fail(function()
  {
    // TODO
    console.log('logout failed')
  })
  window.location = "logout.html";
}

logout.$inject = ['$scope'];