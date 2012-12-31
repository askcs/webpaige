'use strict';
/* Dashboard controller */

var dashboardCtrl = function($scope)
{	  
  $scope.preventDeepLink();
  
  var planboard = this;
  this.callbacks = {};
  
  $scope.validLogin = true;

  $('a[href=#dashboard]').parent().addClass('active');
  $('a[href=#messages]').parent().removeClass('active');
  $('a[href=#groups]').parent().removeClass('active');

  // TODO: some checks ?
  /*
  if (!localStorage.getItem('slots') &&
      !localStorage.getItem('wishes') &&
      !localStorage.getItem('aggs'))
  {
    //this.sync();
  }
  else
  {
    //this.load();
  }
  */

  //this.render();  


  this.register('planboard', this.render);

  var planboardTimer = $.timer(function()
  {
    planboard.sync.call(planboard)
  })

  planboardTimer.set(
  {
    time : config.data.planboard.syncInterval,
    autostart : config.data.planboard.autoStart 
  })

  /*
  timer.set(options);
  timer.play(reset);  // Boolean. Defaults to false.
  timer.pause();
  timer.stop();  // Pause and resets
  timer.toggle(reset);  // Boolean. Defaults to false.
  timer.once(time);  // Number. Defaults to 0.
  timer.isActive  // Returns true if timer is running
  timer.remaining // Remaining time when paused
  */


  /*
    var planboard = this;
    setInterval(function()
    {
      planboard.sync.call( planboard )
    }, config.data.planboard.sync);
  */



  //var root = $scope.$parent.$parent;

  if (!localStorage.getItem('slots') // &&
      //!localStorage.getItem('wishes') &&
      //!localStorage.getItem('aggs')
    )
  {
    //this.register( 'planboard', this.render );
    //$scope.fetchPlanboards();
  }
  else
  {
    //this.render();
  }
  
  /*
  this.callbacks = {};

  var that = this;
  setInterval(function() { that.sync.call( that ); }, config.data.planboard.sync);
  */



}

dashboardCtrl.prototype = {

	constructor: dashboardCtrl,
	
	callbacks: {},
	
	register: function(key, callback)
	{
		if (!this.callbacks[key])
		{
			this.callbacks[key] = [];
		}
		this.callbacks[key].push(callback);
	},

	
	render: function()
	{
		var timedata = [];
		
		//var slots = JSON.parse(localStorage.getItem('slots'));
    var slots = databank.slots;
		
		$.each(slots, function(name, member)
		{	
			$.each(member.both, function(index2, slot)
			{
				timedata.push({
					start: Math.round(slot.start * 1000),
					end: Math.round(slot.end * 1000),
					group: name,
					content: slot.text,
					className: states[slot.text].className,
					editable: true
				})	
			})
		})
		
		window.app.timedata = timedata;
		
		// sorter comes here in play?
	
	  // TODO
    // optimize
	  var timeline;
	  timeline = new links.Timeline( document.getElementById('mytimeline') );
	  timeline.draw(timedata, config.timeline.options);
		
	},
	


	sync: function()
	{	
		var sync = this,	
		    trigger = 'planboard';
		
		async.series({
		    
	    parent: function(callback)
	    {
        var url = host + '/parent';
	      setTimeout(function()
	      {
				  $.ajax(
					{
						url: url,
					})
					.success(
					function(data)
					{
            console.log('-> data:', data);
		    		callback(null, 'done');
					})
					.fail(function()
					{
					})
	      }, 200);
	    },
	    
		},

		function(err, results)
		{
      //
      // core callback registerer     
      var callback = sync.callbacks[trigger];
      if (callback)
      {
        $.each(callback, function(key, value)
        {
          value.apply(this, arguments);
        })
      }
      // end callback registerer
      //
			console.log('-> results of calls: ', results);
		})
		
	}






}

dashboardCtrl.$inject = ['$scope'];