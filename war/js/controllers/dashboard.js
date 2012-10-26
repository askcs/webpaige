'use strict';
/* Dashboard controller */

function dashboard($scope)
{
	// 1.grab data from localStorage
	// 2.process data
	// 3.publish data
	// 4.fetch live data from server
	// 5.process data (again)
	// 6.publish data (again)
	// 7.update localStorage with live data
	
	//var networks 	= $scope.networks 	= webpaige.networks();
	//var slots 		= $scope.slots 			= webpaige.slots();
	//var resources = $scope.resources 	= webpaige.resources();
	
	
	//var networks = $scope.networks = webpaige.networks();
	//var slots = webpaige.slots();
	
	
	
	//var trange = '{"bstart":1350630639,"bend":1351840239,"start":"2012-10-20T22:00:00.000Z","end":"2012-10-30T23:00:00.000Z"}';
	//var treset = '{"bstart":1350630639,"bend":1351840239,"start":"2012-10-20T22:00:00.000Z","end":"2012-10-30T23:00:00.000Z"}';
  //window.range =	'start=' + trange.bstart + '&end=' + trange.bend;
  
  
  
  
  function grabLocal()
  {
		return {
			networks: webpaige.networks(),
			slots: webpaige.slots()
		}
  }
  
  function processData()
  {
	  
  }
  
  function publishData()
  {
	  
  }
  
  function fetchLiveData()
  {
	  
  }
  
  function updateLocal()
  {
	  
  }
  
  
  var datas = grabLocal();
  $scope.networks = datas.networks;
  
  var processed = processData(data);
  
  
  var data;
  
  // Create a JSON data table
  data = [
      {
          'start': new Date(2010,7,23),
          'content': 'Conversation'
      },
      {
          'start': new Date(2010,7,23,23,0,0),
          'content': 'Mail from boss'
      },
      {
          'start': new Date(2010,7,24,16,0,0),
          'content': 'Report'
      },
      {
          'start': new Date(2010,7,26),
          'end': new Date(2010,8,2),
          'content': 'Traject A'
      },
      {
          'start': new Date(2010,7,28),
          'content': 'Memo'
      },
      {
          'start': new Date(2010,7,29),
          'content': 'Phone call'
      },
      {
          'start': new Date(2010,7,31),
          'end': new Date(2010,8,3),
          'content': 'Traject B'
      },
      {
          'start': new Date(2010,8,4,12,0,0),
          'content': 'Report'
      }
  ];

  // Instantiate our timeline object.
  
  var timeline;
  timeline = new links.Timeline(document.getElementById('mytimeline'));
  timeline.draw(data,
  {
    'width':  '100%',
    'height': '300px',
    'editable': true,
    'style': 'box'
  });
	
}
dashboard.$inject = ['$scope'];