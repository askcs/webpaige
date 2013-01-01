'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.

/*
angular.module('App.services', []).
  value('version', '0.1');
*/


angular.module('App.services', []).
    service('sharedProperties', function () {
        var property = "First ";

        return {
            getProperty:function () {
                return property;
            },
            setProperty:function (value) {
                property = value;
            }
        };
    }).
    service('secondOne', function () {

        return {
            getProperty:function () {
                return 'working fine from second one';
            },
            setProperty:function (value) {
                property = value;
            }
        };
    });
