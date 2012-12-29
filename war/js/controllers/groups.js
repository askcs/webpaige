'use strict';
/* Groups controller */

var groupsCtrl = function($scope)
{


	$('a[href=#dashboard]').parent().removeClass('active');
	$('a[href=#messages]').parent().removeClass('active');
	$('a[href=#groups]').parent().addClass('active');

	//$scope.fetchGroups();
	//$scope.fetchMembers();

}

//groups.prototype = $.extend({}, app.prototype, {
groupsCtrl.prototype = {

	constructor: groupsCtrl,

}
//)

groupsCtrl.$inject = ['$scope'];