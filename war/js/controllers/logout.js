'use strict';
/* Logout controller */

var logout = function($scope)
{
  // clear session
  $scope.clearSession();

  // TODO
  // clear localStorage

  // logout from back-end
  $.ajax(
  {
    url: host + '/logout',
  })
  .success(
  function(data)
  {
    console.log('goodbye');
    window.location = "index.html#/login";
  })
  .fail(function()
  {
    // TODO
    console.log('logout failed')
  })
}

// logout.prototype = $.extend({}, app.prototype, {

// 	constructor: logout,

// })

logout.$inject = ['$scope'];