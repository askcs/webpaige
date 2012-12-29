'use strict';
/* Groups controller */

var groups = function($scope)
{


	$('a[href=#dashboard]').parent().removeClass('active');
	$('a[href=#messages]').parent().removeClass('active');
	$('a[href=#groups]').parent().addClass('active');

	//$scope.fetchGroups();
	//$scope.fetchMembers();

	console.log('groups')

}

//groups.prototype = $.extend({}, app.prototype, {
groups.prototype = {

	constructor: groups,

}
//)

groups.$inject = ['$scope'];