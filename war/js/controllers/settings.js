'use strict';
/* Settings controller */

var settings = function($scope)
{
  this.renderGroupsList();
  
  var dtoptions = {
		closeText: 'Sluiten',
		prevText: '< Vorige',
		nextText: 'Volgende >',
		currentText: 'Nu',
		monthNames: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
		monthNamesShort: ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"],
		dayNames: ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"],
		dayNamesShort: ["zo", "ma", "di", "wo", "do", "vr", "za"],
		dayNamesMin: ["zo", "ma", "di", "wo", "do", "vr", "za"],
		weekHeader: 'ma',
		dateFormat: 'dd-mm-yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''
	};

  $('#from').datetimepicker(dtoptions);
  $('#till').datetimepicker(dtoptions);
  $('#efrom').datetimepicker(dtoptions);
  $('#etill').datetimepicker(dtoptions);
  this.wishesTimelineInit();


	var timeline;
	var timeline_selected = null;
		
}

settings.prototype = {

	constructor: settings,
	
/*
	wishSubmit: function()
	{
	  $('#newWish').modal('hide');
	  var group = $('#groupsList option:selected').val();
	  var from = $('#from').val();
	  var till = $('#till').val();
	  var wish = $('#wish').val();
	  var from = Date.parse(from, "dd-MMM-yyyy HH:mm");
	  var from = from.getTime();
	  var till = Date.parse(till, "dd-MMM-yyyy HH:mm");
	  var till = till.getTime();
	  this.addWish(from, till, wish, group);
	  $('#newWishForm')[0].reset();
	},
*/
	
/*
	editPlanSubmit: function()
	{
	  $('#editEvent').modal('hide');
	  var enewType = $('input#eplanningType[name="eplanningType"]:checked').val();
	  var enewFrom = $('#eplanningFrom').val();
	  var enewTill = $('#eplanningTill').val();
	  var enewReoccuring = $('input#eplanningReoccuring:checkbox:checked').val();
	  if (enewReoccuring == "true") enewReoccuring = "true";
	  else enewReoccuring = "false";
	  var enewFrom = Date.parse(enewFrom, "dd-MMM-yyyy HH:mm");
	  var enewFrom = enewFrom.getTime();
	  var enewTill = Date.parse(enewTill, "dd-MMM-yyyy HH:mm");
	  var enewTill = enewTill.getTime();
	  window.newslot = {
	    from: Math.round(enewFrom / 1000),
	    till: Math.round(enewTill / 1000),
	    reoc: enewReoccuring,
	    type: enewType
	  };
	  this.updateSlotModal();
	  $('#editEventForm')[0].reset();
	},
*/
	
/*
	deletePlanSubmit: function()
	{
	  $('#editEvent').modal('hide');
	  this.deleteSlotModal(oldslot.from, oldslot.till, oldslot.reoc, oldslot.type);
	  $('#editEventForm')[0].reset();
	},
*/
	
/*
	editWishModal: function(start, end, group, wish)
	{
	  $('#editWish').modal('show');
	  $('#editWish span#groupName').html(group);
	  start = new Date(start.getTime());
	  start = start.toString("dd-MMM-yyyy HH:mm");
	  $('#editWish #efrom').val(start);
	  end = new Date(end.getTime());
	  end = end.toString("dd-MMM-yyyy HH:mm");
	  $('#editWish #etill').val(end);
	  $('#editWish #ewish').val(wish);
	},
*/
	
/*
	editWishSubmit: function()
	{
	  $('#editWish').modal('hide');
	  var group = $('#editWish span#groupName').html();
	  var start = $('#editWish #efrom').val();
	  var end = $('#editWish #etill').val();
	  var wish = $('#editWish #ewish').val();
	  start = Date.parse(start, "dd-MMM-yyyy HH:mm");
	  start = start.getTime();
	  end = Date.parse(end, "dd-MMM-yyyy HH:mm");
	  end = end.getTime();
	  var groups = JSON.parse(webpaige.get('groups'));
	  for (var i in groups)
	  {
	    if (groups[i].name == group)
	    {
	      var guuid = groups[i].uuid;
	    }
	  }
	  this.addWish(start, end, wish, guuid);
	},
*/
	
/*
	addWish: function(from, till, wish, group)
	{
	  var body = '{"end":' + (till / 1000) + ',"start":' + (from / 1000) + ',"wish":"' + wish + '"}';
	  webpaige.con(
	  {
	    type: 'put',
	    path: '/network/' + group + '/wish',
	    json: body,
	    loading: 'Nieuwe beschiekbaarheid wordt toegevoegd..',
	    session: session.getSession()
	  },
	
	  function (data)
	  {
	    this.getWishes();
	  });
	},
*/
	
	// Timneline initators
	wishesTimelineInit: function()
	{
	  var timeline_data = [];
	  var options = {};
	  var timeline = new links.Timeline(document.getElementById('wishesTimeline'));
	  // Add event listeners
	  google.visualization.events.addListener(timeline, 'edit', timelineOnEdit);
	  google.visualization.events.addListener(timeline, 'add', timelineOnAdd);
	  google.visualization.events.addListener(timeline, 'delete', timelineOnDelete);
	  google.visualization.events.addListener(timeline, 'change', timelineOnChange);
	  google.visualization.events.addListener(timeline, 'select', timelineOnSelect);
	  this.getWishes();
	},
	
	getWishes: function()
	{
	  var now = parseInt((new Date()).getTime() / 1000);
	  var range = 'start=' + (now - 86400 * 7 * 4 * 4) + '&end=' + (now + 86400 * 7 * 4 * 4);
	  timeline_data = new google.visualization.DataTable();
	  timeline_data.addColumn('datetime', 'start');
	  timeline_data.addColumn('datetime', 'end');
	  timeline_data.addColumn('string', 'content');
	  timeline_data.addColumn('string', 'group');
	  webpaige.con(
	  {
	    path: '/network',
	    loading: 'Groepen worden opgeladen..',
	    label: 'groups',
	    session: session.getSession()
	  },
	
	  function (data, label)
	  {
	    for (var i in data)
	    {
	      webpaige.con(
	      {
	        path: '/network/' + data[i].uuid + '/wish?' + range,
	        loading: data[i].name + ' beschiekbaarheid wordt opgeladen..',
	        label: data[i].name,
	        session: session.getSession()
	      },
	
	      function (data, label)
	      {
	        for (var i in data)
	        {
	          var content = '<div class="wishslot c-' + data[i].count + '">' + data[i].count + '</div>';
	          timeline_data.addRow([
	          new Date(data[i].start * 1000),
	          new Date(data[i].end * 1000),
	          content,
	          label]);
	        }
	        var options = {
	          'selectable': true,
	          'editable': true,
	          'groupsWidth': '100px'
	        };
	        timeline.draw(timeline_data, options);
	      });
	    }
	  });
	},
	
	// Timeline events
	timelineOnAdd: function()
	{},
	
	timelineOnEdit: function()
	{
	  var sel = timeline.getSelection();
	  var row = sel[0].row;
	  var item = timeline.getItem(row);
	  var wish = timeline_data.getValue(row, 2).split('>')[1].split('<')[0];
	  this.editWishModal(item.start, item.end, item.group, wish);
	},
	
	timelineOnDelete: function()
	{
	  timeline.cancelChange();
	},
	
	timelineOnSelect: function()
	{
	  var sel = timeline.getSelection();
	  var row = sel[0].row;
	  timeline_selected = timeline.getItem(row);
	},
	
	timelineOnChange: function()
	{
	  timeline.cancelChange();
	},
	
	goToday: function()
	{
	  var trange = webpaige.config('treset');
	  window.range = 'start=' + trange.bstart + '&end=' + trange.bend;
	  webpaige.config('trange', trange);
	  this.wishesTimelineInit();
	},
	
	// Timeline navigations
	timelineZoomIn: function()
	{
	  links.Timeline.preventDefault(event);
	  links.Timeline.stopPropagation(event);
	  timeline.zoom(0.4);
	  timeline.trigger("rangechange");
	  timeline.trigger("rangechanged");
	},
	
	timelineZoomOut: function()
	{
	  links.Timeline.preventDefault(event);
	  links.Timeline.stopPropagation(event);
	  timeline.zoom(-0.4);
	  timeline.trigger("rangechange");
	  timeline.trigger("rangechanged");
	},
	
	timelineMoveLeft: function()
	{
	  links.Timeline.preventDefault(event);
	  links.Timeline.stopPropagation(event);
	  timeline.move(-0.2);
	  timeline.trigger("rangechange");
	  timeline.trigger("rangechanged");
	},
	
	timelineMoveRight: function()
	{
	  links.Timeline.preventDefault(event);
	  links.Timeline.stopPropagation(event);
	  timeline.move(0.2);
	  timeline.trigger("rangechange");
	  timeline.trigger("rangechanged");
	},
	
	// Group list producers
	renderGroupsList: function()
	{
	  webpaige.con(
	  {
	    path: '/network',
	    loading: 'Loading groups..',
	    label: 'groups',
	    session: session.getSession()
	  },
	
	  function (data, label)
	  {
	    webpaige.set(label, JSON.stringify(data));
	    for (var i in data)
	    {
	      $('#groupsList').append('<option value="' + data[i].uuid + '">' + data[i].name + '</option>');
	    }
	  });
	}


}
settings.$inject = ['$scope'];