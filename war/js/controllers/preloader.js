'use strict'; /* Preloader controller */
var preloaderCtrl = function($scope)
  {

  	//console.log($scope.getSession());

    this.setupRanges();

	  window.app.calls = {};

    async.waterfall([

      function(callback)
    	{
	      $('#preloader span')
	      	.text('Loading user information..');

	      $.ajax(
	      {
	        url: host + '/resources',
	      })
	      .success(
	      function(user)
	      {

	        window.app.resources = user;
	        localStorage.setItem('resources', JSON.stringify(user));
	        $('#preloader .progress .bar')
	        	.css({
	          	width: '20%'
	        });
	        window.app.calls.resources = true;
	        callback(null, user);

	      }).fail(function()
	      {
	        window.app.calls.resources = false;
	      })
    	},

      function(user, callback)
    	{
	      async.series(
	      {

	        // network: function(callback)
	        // {
	        //   setTimeout(function()
	        //   {
	        //     $('#preloader span')
	        //     	.text('Loading groups..');

	        //     $.ajax(
	        //     {
	        //       url: host + '/network',
	        //     }).success(
	        //     function(data)
	        //     {

	        //       window.app.groups = data;

	        //       localStorage.setItem('groups', JSON.stringify(data));

	        //       window.app.calls.network = true;

	        //       $('#preloader .progress .bar').css(
	        //       {
	        //         width: '40%'
	        //       });

	        //       var params = [];

	        //       if (divisions.length > 0)
	        //       {
	        //         $.each(divisions, function(index, value)
	        //         {
	        //           var param = '&stateGroup=' + value;
	        //           params.push(param);
	        //         })
	        //       }

	        //       params.unshift(null);

	        //       var groups = {},
	        //         tmp = {},
	        //         aggs = {},
	        //         key, stateGroup, ikey;

	        //       $.each(window.app.groups, function(index, group)
	        //       {
	        //         aggs[group.uuid] = {};
	        //         window.app.calls.aggs = {};
	        //         $.each(params, function(index, param)
	        //         {
	        //           if (param)
	        //           {
	        //             var key = param.substr(12);
	        //             var stateGroup = param;
	        //           }
	        //           else
	        //           {
	        //             var key = 'default';
	        //             var stateGroup = '';
	        //           }
	        //           ikey = group.uuid + "_" + key;
	        //           (function(ikey, stateGroup, key, index)
	        //           {
	        //             tmp[ikey] = function(callback, index)
	        //             {
	        //               setTimeout(function()
	        //               {
	        //                 $('#preloader span').text('Loading aggregrated timelines.. (' + group.name + ')');
	        //                 $.ajax(
	        //                 {
	        //                   url: host 	+ '/calc_planning/' 
	        //                   						+ group.uuid 
	        //                   						+ '?start=' 
	        //                   						+ window.app.settings.ranges.period.bstart 
	        //                   						+ '&end=' 
	        //                   						+ window.app.settings.ranges.period.bend 
	        //                   						+ stateGroup
	        //                 }).success(
	        //                 function(data)
	        //                 {
	        //                   aggs[group.uuid][key] = data;
	        //                   window.app.calls.aggs[group.uuid] = true;
	        //                   callback(null, true);
	        //                 }).fail(function()
	        //                 {
	        //                   window.app.calls.aggs[group.uuid] = false;
	        //                 })
	        //               }, (index * 100) + 100)
	        //             }
	        //             $.extend(groups, tmp)
	        //           })(ikey, stateGroup, key, index)
	        //         })
	        //       })

	        //       async.series(groups, function(err, results)
	        //       {
	        //         window.app.aggs = aggs;
	        //         localStorage.setItem('aggs', JSON.stringify(aggs));
	        //         callback(null, 'done');
	        //       });
	              
	        //     }).fail(function()
	        //     {
	        //       window.app.calls.network = false;
	        //     })
	        //   }, 100)
	        // },

	        // wishes: function(callback)
	        // {
	        //   $('#preloader span').text('Loading wishes..');
	        //   $('#preloader .progress .bar').css(
	        //   {
	        //     width: '50%'
	        //   });
	        //   var wishes = {},
	        //     tmp = {},
	        //     key;
	        //   $.each(window.app.groups, function(index, group)
	        //   {
	        //     window.app.calls.wishes = {};
	        //     (function(index)
	        //     {
	        //       tmp[group.uuid] = function(callback, index)
	        //       {
	        //         setTimeout(function()
	        //         {
	        //           $('#preloader span').text('Loading wishes.. (' + group.name + ')');
	        //           $.ajax(
	        //           {
	        //             url: host 	+ '/network/' 
	        //             						+ group.uuid 
	        //             						+ '/wish?start=' 
	        //             						+ window.app.settings.ranges.period.bstart 
	        //             						+ '&end=' 
	        //             						+ window.app.settings.ranges.period.bend
	        //           }).success(
	        //           function(data)
	        //           {
	        //             wishes[group.uuid] = data;
	        //             window.app.calls.wishes[group.uuid] = true;
	        //             callback(null, true);
	        //           }).fail(function()
	        //           {
	        //             window.app.calls.wishes[group.uuid] = false;
	        //           })
	        //         }, (index * 100) + 100)
	        //       }
	        //       $.extend(wishes, tmp)
	        //     })(index)
	        //   })
	        //   async.series(wishes, function(err, results)
	        //   {
	        //     window.app.wishes = wishes;
	        //     localStorage.setItem('wishes', JSON.stringify(wishes));
	        //     callback(null, 'done');
	        //   })
	        // },

	        parent: function(callback)
	        {
	          setTimeout(function()
	          {
	            $('#preloader span').text('Loading parent group..');
	            $.ajax(
	            {
	              url: host + '/parent',
	            }).success(
	            function(data)
	            {
	              window.app.parent = data;
	              localStorage.setItem('parent', JSON.stringify(data));
	              $('#preloader .progress .bar').css(
	              {
	                width: '60%'
	              });
	              window.app.calls.parent = true;
	              callback(null, 'done');
	            }).fail(function()
	            {
	              window.app.calls.parent = false;
	            })
	          }, 200)
	        },

	        messages: function(callback)
	        {
	          $('#preloader span').text('Loading messages..');
	          setTimeout(function()
	          {
	            $.ajax(
	            {
	              url: host + '/question?0=dm',
	            }).success(
	            function(data)
	            {
	              window.app.messages = data;
	              localStorage.setItem('messages', JSON.stringify(data));
	              $('#preloader .progress .bar').css(
	              {
	                width: '80%'
	              });
	              window.app.calls.messages = true;
	              callback(null, 'done');
	            }).fail(function()
	            {
	              window.app.calls.messages = false;
	            })
	          }, 300)
	        },

	        // members: function(callback)
	        // {
	        //   $('#preloader span').text('Loading members..');
	        //   setTimeout(function()
	        //   {
	        //     var members = {},
	        //       tmp = {};
	        //     // TODO: here or later should be checked
	        //     // if the user already in the list ?
	        //     $.each(window.app.groups, function(index, group)
	        //     {
	        //       window.app.calls.members = {};
	        //       (function(index)
	        //       {
	        //         tmp[group.uuid] = function(callback, index)
	        //         {
	        //           setTimeout(function()
	        //           {
	        //             $('#preloader span').text('Loading members.. (' + group.name + ')');
	        //             $.ajax(
	        //             {
	        //               url: host + '/network/' + group.uuid + '/members?fields=[role]',
	        //             }).success(

	        //             function(data)
	        //             {
	        //               localStorage.setItem(group.uuid, JSON.stringify(data));
	        //               window.app.calls.members[group.uuid] = true;
	        //               callback(null, true);
	        //             }).fail(function()
	        //             {
	        //               window.app.calls.members[group.uuid] = false;
	        //             })
	        //           }, (index * 100) + 100)
	        //         }
	        //         $.extend(members, tmp)
	        //       })(index)
	        //     })
	        //     async.series(members, function(err, results)
	        //     {
	        //       var members = {};
	        //       $.each(window.app.groups, function(index, group)
	        //       {
	        //         var groupList = JSON.parse(localStorage.getItem(group.uuid));
	        //         if (groupList.length > 0 || groupList != null || groupList != undefined)
	        //         {
	        //           $.each(groupList, function(index, member)
	        //           {
	        //             members[member.uuid] = member;
	        //           })
	        //         }
	        //       })
	        //       window.app.members = members;
	        //       localStorage.setItem('members', JSON.stringify(members));
	        //       $('#preloader .progress .bar').css(
	        //       {
	        //         width: '90%'
	        //       });
	        //       var members = {},
	        //         tmp = {},
	        //         slots = {},
	        //         key, itype, ikey, params = ['&type=both'];
	        //       params.unshift(null);
	        //       $.each(window.app.members, function(index, member)
	        //       {
	        //         slots[member.uuid] = {};
	        //         window.app.calls.slots = {};
	        //         $.each(params, function(index, param)
	        //         {
	        //           if (param)
	        //           {
	        //             key = param.substr(6);
	        //             itype = param;
	        //           }
	        //           else
	        //           {
	        //             key = 'default';
	        //             itype = '';
	        //           }
	        //           ikey = member.uuid + "_" + key;
	        //           (function(ikey, itype, key, index)
	        //           {
	        //             tmp[ikey] = function(callback, index)
	        //             {
	        //               setTimeout(function()
	        //               {
	        //                 $('#preloader span').text('Loading timeslots.. (' + member.name + ')');
	        //                 $.ajax(
	        //                 {
	        //                   url: host 	+ '/askatars/' 
	        //                   						+ member.uuid 
	        //                   						+ '/slots?start=' 
	        //                   						+ window.app.settings.ranges.period.bstart 
	        //                   						+ '&end=' 
	        //                   						+ window.app.settings.ranges.period.bend 
	        //                   						+ itype
	        //                 }).success(
	        //                 function(data)
	        //                 {
	        //                   slots[member.uuid][key] = data;
	        //                   window.app.calls.slots[member.uuid] = true;
	        //                   callback(null, true);
	        //                 }).fail(function()
	        //                 {
	        //                   window.app.calls.slots[member.uuid] = false;
	        //                 })
	        //               }, (index * 100) + 100)
	        //             }
	        //             $.extend(members, tmp)
	        //           })(ikey, itype, key, index)
	        //         })
	        //       })
	        //       async.series(members, function(err, results)
	        //       {
	        //         window.app.slots = slots;
	        //         localStorage.setItem('slots', JSON.stringify(slots));
	        //         $('#preloader .progress .bar').css(
	        //         {
	        //           width: '100%'
	        //         });
	        //         document.location = "#/dashboard";
	        //       })
	        //     })
	        //   }, 400);
	        // }

	      }, function(err, results)
	      {
	        // TODO: perform some checks
	        // 1. network
	        // 2. wishes
	        // 3. parent
	        // 4. messages
	        // 5. members
	      })
    	}

    ], function(err, results)
    {
      // TODO: what to do here?
      // results of first two calls
      // 1. resources
      // 2. dependent calls
    })
    
  }
preloaderCtrl.prototype = {
  constructor: preloaderCtrl,
  // TODO: make this one efficient working
  setupRanges: function()
  {
    var now = parseInt((new Date()).getTime() / 1000);
    var period = {
      bstart: (now - 86400 * 7 * 1),
      bend: (now + 86400 * 7 * 1),
      start: Date.today().add(
      {
        days: -5
      }),
      end: Date.today().add(
      {
        days: 5
      })
    }
    window.app.settings = {
      ranges: {
        period: period,
        reset: period
      }
    }
  }
}
preloaderCtrl.$inject = ['$scope'];