//'use strict';
/* Dashboard controller */

var dashboard = function($scope)
{
	var timeline;
	var timeline2;
	var timeline3;
	var timeline_selected = null;
  
  webpaige.config('inited', false);
  
  var trange = webpaige.config('trange');
  window.range = 'start=' + trange.bstart + '&end=' + trange.bend;
  
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

  $('#planningFrom').datetimepicker(dtoptions);
  $('#planningTill').datetimepicker(dtoptions);
  $('#eplanningFrom').datetimepicker(dtoptions);
  $('#eplanningTill').datetimepicker(dtoptions);
  
  this.timelineInit();
  var guuid = webpaige.config('firstGroupUUID');
  var gname = webpaige.config('firstGroupName');
  webpaige.config('guuid', guuid);
  webpaige.config('gname', gname);
  
  this.groupTimelineInit(guuid, gname);
  this.membersTimelineInit(guuid);
  
  $('#groupAvBtn').addClass('active');
  
  $("#groupsList").change(function ()
  {
	webpaige.config('inited', false);
    $('#divisions option[value="both"]').attr('selected', 'selected');
    this.timelineInit();
    var guuid = $(this).find(":selected").val();
    var gname = $(this).find(":selected").text();
    webpaige.config('guuid', guuid);
    webpaige.config('gname', gname);
    this.groupTimelineInit(guuid, gname);
    this.membersTimelineInit(guuid);
  });
  
  $('#newEventBtn').click(function ()
  {
    
    var row = $('#mytimeline .timeline-groups-text').html();
    
	  var user = $.trim(row.split('>')[3].split('<')[0]);
	  user = user.split(':');
	  var real = {
	    uuid: user[0],
	    reoc: user[1]
	  };
    
    //console.log('user: ', user);
    $('#userWho').val(real.uuid);
    
    $('#newEvent').modal('show');
  });
  $(window).bind('resize', function ()
  {
    timeline.redraw();
    timeline2.redraw();
    timeline3.redraw();
  });
  
  $("#divisions").change(function ()
  {
    var division = $(this).find(":selected").val();
    timeline2.draw(webpaige.config(division));
  });
}

dashboard.prototype = {

	constructor: dashboard,

	reRenderMembers: function(mid, mname)
	{
	  var guuid = $("#groupsList").find(":selected").val();
	  var gname = $("#groupsList").find(":selected").text();
	  this.timelineInit(mid);
	  
	  $('#mytimeline .timeline-frame').append('<span id="tmlabel" class="label label-info" style="position:absolute; top:10px; left:10px; z-index:2000;">' + mname + '</span>');
	  
	  this.groupTimelineInit(guuid, gname);
	  this.membersTimelineInit(guuid, mid);	
	},
	  
	//var timeline,
	//var timeline2,
	//var timeline3,
	//var timeline_selected = null,
	
	// Submitters
/*
	planSubmit: function()
	{
	  $('#newEvent').modal('hide');
	  var planningType = $('input#planningType[name="planningType"]:checked').val();
	  var planningFrom = $('#planningFrom').val();
	  var planningTill = $('#planningTill').val();
	  var planningReoccuring = $('input#planningReoccuring:checkbox:checked').val();
	  var planningAllDay = $('input#planningAllDay:checkbox:checked').val();
	  if (planningReoccuring == "true") planningReoccuring = "true";
	  else planningReoccuring = "false";
	  
	  
	  console.log('1:', 'planningFrom',planningFrom, 'planningTill', planningTill);
	  
	  
	  var planningFrom = Date.parseExact(planningFrom, "d-M-yyyy HH:mm");
	  var planningFrom = planningFrom.getTime();
	  var planningTill = Date.parseExact(planningTill, "d-M-yyyy HH:mm");
	  var planningTill = planningTill.getTime();
	  
	  
	  console.log('2:', 'planningFrom',planningFrom, 'planningTill', planningTill);
	  
	  
	  var state = '';
	  switch (planningType)
	  {
	    case 'available':
	      state = 'com.ask-cs.State.Available';
	      break;
	    case 'availableN':
	      state = 'com.ask-cs.State.KNRM.BeschikbaarNoord';
	      break;
	    case 'availableZ':
	      state = 'com.ask-cs.State.KNRM.BeschikbaarZuid';
	      break;
	    case 'schipper':
	      state = 'com.ask-cs.State.KNRM.SchipperVanDienst';
	      break;
	    case 'unavailable':
	      state = 'com.ask-cs.State.Unavailable';
	      break;
	    case 'unreachable':
	      state = 'com.ask-cs.State.Unreached';
	      break;
	  }
	  var userWho = $('#userWho').val();
	  this.addSlot(planningFrom, planningTill, planningReoccuring, state, userWho);
	  $('#newEventForm')[0].reset();
	},
*/
	
/*
	editPlanSubmit: function()
	{
	  $('#editEvent').modal('hide');
	  var enewType = $('input#eplanningType[name="eplanningType"]:checked').val();
	  var state = '';
	  switch (enewType)
	  {
	    case 'available':
	      state = 'com.ask-cs.State.Available';
	      break;
	    case 'availableN':
	      state = 'com.ask-cs.State.KNRM.BeschikbaarNoord';
	      break;
	    case 'availableZ':
	      state = 'com.ask-cs.State.KNRM.BeschikbaarZuid';
	      break;
	    case 'schipper':
	      state = 'com.ask-cs.State.KNRM.SchipperVanDienst';
	      break;
	    case 'unavailable':
	      state = 'com.ask-cs.State.Unavailable';
	      break;
	    case 'unreachable':
	      state = 'com.ask-cs.State.Unreached';
	      break;
	  }
	  var enewFrom = $('#eplanningFrom').val();
	  var enewTill = $('#eplanningTill').val();
	  var enewReoccuring = $('input#eplanningReoccuring:checkbox:checked').val();
	  if (enewReoccuring == "true") enewReoccuring = "true";
	  else enewReoccuring = "false";
	  var enewFrom = Date.parseExact(enewFrom, "d-M-yyyy HH:mm");
	  var enewFrom = enewFrom.getTime();
	  var enewTill = Date.parseExact(enewTill, "d-M-yyyy HH:mm");
	  var enewTill = enewTill.getTime();
	  window.newslot = {
	    from: Math.round(enewFrom / 1000),
	    till: Math.round(enewTill / 1000),
	    reoc: enewReoccuring,
	    //type: enewType,
	    type: state
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
	
	// Timeline initators
	timelineInit: function(uuid)
	{
	  timeline_data = [];
	  timeline = new links.Timeline(document.getElementById('mytimeline'));
	  // Add event listeners
	  google.visualization.events.addListener(timeline, 'edit', this.timelineOnEdit);
	  google.visualization.events.addListener(timeline, 'add', this.timelineOnAdd);
	  google.visualization.events.addListener(timeline, 'delete', this.timelineOnDelete);
	  google.visualization.events.addListener(timeline, 'change', this.timelineOnChange);
	  google.visualization.events.addListener(timeline, 'select', this.timelineOnSelect);
	  google.visualization.events.addListener(timeline, 'rangechange', this.onRangeChanged1);
	  this.getSlots(uuid);
	},
	
	groupTimelineInit: function(guuid, gname)
	{
	  this.getGroupSlots(guuid, gname);
	},
	
	membersTimelineInit: function(uuid, mid)
	{
	  timeline_data3 = [];
	  var options = {
	    'groupsWidth': '150px'
	  };
	  timeline3 = new links.Timeline(document.getElementById('memberTimeline'));
	  if (webpaige.getRole() == 1)
	  {
	    // Add event listeners
	    google.visualization.events.addListener(timeline3, 'edit', this.timelineOnEdit2);
	    google.visualization.events.addListener(timeline3, 'add', this.timelineOnAdd2);
	    google.visualization.events.addListener(timeline3, 'delete', this.timelineOnDelete2);
	    google.visualization.events.addListener(timeline3, 'change', this.timelineOnChange2);
	    google.visualization.events.addListener(timeline3, 'select', this.timelineOnSelect2);
	  }
	  google.visualization.events.addListener(timeline3, 'rangechange', this.onRangeChanged3);
	  timeline3.setVisibleChartRange(window.tstart, window.tend);
	  timeline3.draw(timeline_data3, options);
	  this.getMemberSlots(uuid, mid);
	},
	
	onRangeChanged1: function()
	{
	  var range = timeline.getVisibleChartRange();
	  timeline2.setVisibleChartRange(range.start, range.end);
	  timeline3.setVisibleChartRange(range.start, range.end);
	},
	
	onRangeChanged2: function()
	{
	  var range = timeline2.getVisibleChartRange();
	  timeline.setVisibleChartRange(range.start, range.end);
	  timeline3.setVisibleChartRange(range.start, range.end);
	},
	
	onRangeChanged3: function()
	{
	  var range = timeline3.getVisibleChartRange();
	  timeline.setVisibleChartRange(range.start, range.end);
	  timeline2.setVisibleChartRange(range.start, range.end);
	},
	
	// Timeline events
	timelineOnAdd: function()
	{
	  timeline.cancelAdd();
	  
	  //var resources = JSON.parse(webpaige.get('resources'));
	  //$('#userWho').val(resources.uuid);
	  
	  var sel = timeline.getSelection();
	  var row = sel[0].row;
	  var curItem = timeline.getItem(row);
	  var user = $.trim(timeline.getItem(row).group.split('>')[3].split('<')[0]);
	  user = user.split(':');
	  var real = {
	    uuid: user[0],
	    reoc: user[1]
	  };
	  $('#userWho').val(real.uuid);
	  
	  $('#newEvent').modal('show');
	  $('#tmlabel').hide();
	},
	
	timelineOnEdit: function()
	{
	  var sel = timeline.getSelection();
	  var row = sel[0].row;
	  var curItem = timeline.getItem(row);
	  var content = timeline_data.getValue(row, 2);
	  var user = $.trim(timeline.getItem(row).group.split('>')[3].split('<')[0]);
	  user = user.split(':');
	  var real = {
	    uuid: user[0],
	    reoc: user[1]
	  };
	  this.editSlotModal(curItem.start, curItem.end, trimSpan(curItem.group), html2state(content), real);
	  $('#tmlabel').hide();
	},
	
	timelineOnDelete: function()
	{
	  var sel = timeline.getSelection();
	  var row = sel[0].row;
	  var oldItem = timeline.getItem(row);
	  var user = $.trim(timeline.getItem(row).group.split('>')[3].split('<')[0]);
	  user = user.split(':');
	  var real = {
	    uuid: user[0],
	    reoc: user[1]
	  };
	  this.deleteSlot(oldItem.start / 1000, oldItem.end / 1000, oldItem.group, oldItem.content, real);
	  timeline.cancelDelete();
	  $('#tmlabel').hide();
	},
	
	timelineOnSelect: function()
	{
	  var sel = timeline.getSelection();
	  var row = sel[0].row;
	  timeline_selected = timeline.getItem(row);
	},
	
	timelineOnChange: function()
	{
	  var sel = timeline.getSelection();
	  var row = sel[0].row;
	  var newItem = timeline.getItem(row);
	  var user = $.trim(timeline.getItem(row).group.split('>')[3].split('<')[0]);
	  user = user.split(':');
	  var real = {
	    uuid: user[0],
	    reoc: user[1]
	  };
	  //console.log(timeline_selected, newItem, real);
	  this.updateSlot(timeline_selected, newItem, real);
	  $('#tmlabel').hide();
	},
	
	// Timeline Members events
	timelineOnAdd2: function()
	{
	  timeline3.cancelAdd();
	  var sel = timeline3.getSelection();
	  var row = sel[0].row;
	  var user = $.trim(timeline3.getItem(row).group.split('>')[1].split('<')[0]);
	  user = user.split(':');
	  $('#userWho').val(user[0]);
	  $('#newEvent').modal('show');
	},
	
	timelineOnEdit2: function()
	{
	  var sel = timeline3.getSelection();
	  var row = sel[0].row;
	  var curItem = timeline3.getItem(row);
	  var content = timeline_data3.getValue(row, 2);
	  var user = $.trim(timeline3.getItem(row).group.split('>')[1].split('<')[0]);
	  user = user.split(':');
	  var real = {
	    uuid: user[0],
	    reoc: user[1],
	    lock: user[2]
	  };
	  
	  if (!user[2])
	  {
	  	this.editSlotModal(curItem.start, curItem.end, trimSpan(curItem.group), html2state(content), real);
	  }
	  else
	  {
		  timeline3.cancelChange();
	  }
	},
	
	timelineOnDelete2: function()
	{
	  var sel = timeline3.getSelection();
	  var row = sel[0].row;
	  var oldItem = timeline3.getItem(row);
	  var user = $.trim(timeline3.getItem(row).group.split('>')[1].split('<')[0]);
	  user = user.split(':');
	  var real = {
	    uuid: user[0],
	    reoc: user[1],
	    lock: user[2]
	  };
	  
	  //console.log(real);
	  
	  if (!user[2])
	  {
	  	deleteSlot(oldItem.start / 1000, oldItem.end / 1000, oldItem.group, oldItem.content, real);
	  	timeline.cancelDelete();
	  }
	  else
	  {
		  timeline3.cancelChange();
	  }
	},
	
	timelineOnSelect2: function()
	{
	  var sel = timeline3.getSelection();
	  var row = sel[0].row;
	  var user = $.trim(timeline3.getItem(row).group.split('>')[1].split('<')[0]);
	  user = user.split(':');
	  var real = {
	    uuid: user[0],
	    reoc: user[1],
	    lock: user[2]
	  };
	  
	  //console.log(user);
	  
	  if (!user[2])
	  {
	  	timeline_selected = timeline3.getItem(row);
	  }
	  else
	  {
		  timeline3.cancelChange();
	  }
	},
	
	timelineOnChange2: function()
	{
	  var sel = timeline3.getSelection();
	  var row = sel[0].row;
	  var newItem = timeline3.getItem(row);
	  var user = $.trim(timeline3.getItem(row).group.split('>')[1].split('<')[0]);
	  user = user.split(':');
	  var real = {
	    uuid: user[0],
	    reoc: user[1],
	    lock: user[2]
	  };
	  
	  //console.log('value:', real.lock);
	  
	  if (real.lock === "false")
	  {
	  
	  	//console.log('action is allowed');
	  
			//console.log(timeline_selected, newItem, real); 
	  
			this.updateSlot(timeline_selected, newItem, real); 
	  }
	  else
	  {
	  
	  	//console.log('not allowed');
	  
		  timeline3.cancelChange();
	  }
	},
	
	// Timeline CRUD's
/*
	addSlot: function(from, till, reoc, value, user)
	{
	  // resources ?
	  var resources = JSON.parse(webpaige.get('resources'));
	  var now = parseInt((new Date()).getTime());
	  console.log('passed values', from, till, reoc, value, user, now);
	  
	  
	  if (from < now && till < now)
	  {
	    alert('Het is niet toegestaan ​​om gebeurtenissen in het verleden te toevoegen.');
	  }
	  else
	  {
	    var label = {
	      gname: webpaige.config('gname'),
	      guuid: webpaige.config('guuid')
	    };
	    var body = '{"end":' + (till / 1000) + ',"recursive":' + reoc + ',"start":' + (from / 1000) + ',"text":"' + value + '"}';
	    webpaige.con(
	    {
	      type: 'post',
	      path: '/askatars/' + user + '/slots',
	      json: body,
	      label: label,
	      loading: 'Nieuwe beschikbaarheid aan het toevoegen..',
	      session: session.getSession()
	    },
	
	    function (data, label)
	    {
	      this.getSlots();
	      this.getGroupSlots(label.guuid, label.gname);
	      this.getMemberSlots(label.guuid);
	    });
	  }
	},
*/
	
	// check delete slot
/*
	deleteSlot: function(from, till, reoc, value, user)
	{
	  var now = parseInt((new Date()).getTime() / 1000);
	  var label = {
	    gname: webpaige.config('gname'),
	    guuid: webpaige.config('guuid')
	  };
	  if (till > now)
	  {
	    var path = '/askatars/' + user.uuid + '/slots?start=' + from + '&end=' + till + '&text=' + timeline_helper_html2state2(value) + '&recursive=' + user.reoc;
	    webpaige.con(
	    {
	      type: 'delete',
	      path: path,
	      label: label,
	      loading: 'De beschikbaarheid wordt verwijderd..',
	      session: session.getSession()
	    },
	    function (data, label)
	    {
	      this.getSlots();
	      this.getGroupSlots(label.guuid, label.gname);
	      this.getMemberSlots(label.guuid);
	    });
	  }
	  else
	  {
	    timeline.cancelChange();
	    alert('Het is niet toegestaan ​​om gebeurtenissen uit het verleden te veranderen.');
	  }
	},
*/
	
/*
	deleteSlotModal: function(from, till, reoc, value)
	{
	  var user = {
	    uuid: $('#userWhoEdit').val(),
	    reoc: $('#userReocEdit').val()
	  };
	  var now = parseInt((new Date()).getTime() / 1000);
	  var label = {
	    gname: webpaige.config('gname'),
	    guuid: webpaige.config('guuid')
	  };
	  if (till > now)
	  {
	    var resources = JSON.parse(webpaige.get('resources'));
	    var path = '/askatars/' + user.uuid + '/slots?start=' + from + '&end=' + till + '&text=' + value + '&recursive=' + user.reoc;
	    webpaige.con(
	    {
	      type: 'delete',
	      path: path,
	      label: label,
	      loading: 'De beschikbaarheid wordt verwijderd..',
	      session: session.getSession()
	    },
	
	    function (data, label)
	    {
	      this.getSlots();
	      this.getGroupSlots(label.guuid, label.gname);
	      this.getMemberSlots(label.guuid);
	    });
	  }
	  else
	  {
	    timeline.cancelChange();
	    alert('Het is niet toegestaan ​​om gebeurtenissen uit het verleden te veranderen.');
	  }
	},
*/
	
/*
	updateSlotModal: function()
	{
	  var endof = Math.round(oldslot.till / 1000);
	  var now = parseInt((new Date()).getTime() / 1000);
	  if (oldslot.till > now)
	  {
	    var resources = JSON.parse(webpaige.get('resources'));
	    var query = 'start=' + newslot.from + '&end=' + newslot.till + '&text=' + newslot.type + '&recursive=' + newslot.reoc;
	    var body = '{"color":null' + ',"count":0' + ',"end":' + oldslot.till + ',"recursive":' + oldslot.reoc + ',"start":' + oldslot.from + ',"text":"' + oldslot.type + '","wish":0}';
	    var user = (oldslot.uuid != 'own') ? oldslot.uuid : resources.uuid;
	    var label = {
	      gname: webpaige.config('gname'),
	      guuid: webpaige.config('guuid')
	    };
	    webpaige.con(
	    {
	      type: 'put',
	      path: '/askatars/' + user + '/slots?' + query,
	      json: body,
	      label: label,
	      loading: 'De beschikbaarheid wordt gewijzigd..',
	      session: session.getSession()
	    },
	
	    function (data, label)
	    {
	      if (data)
	      {
	        webpaige.message("De beschikbaarheid is gewijzigd!");
	      }
	      this.getSlots();
	      this.getGroupSlots(label.guuid, label.gname);
	      this.getMemberSlots(label.guuid);
	    });
	  }
	  else
	  {
	    timeline.cancelChange();
	    alert('Het is niet toegestaan ​​om gebeurtenissen uit het verleden te veranderen.');
	  }
	},
*/
	
/*
	updateSlot: function(oldSlot, newSlot, user)
	{
	  var startof = Math.round(oldSlot.start / 1000);
	  var endof = Math.round(oldSlot.end / 1000);
	  var now = parseInt((new Date()).getTime() / 1000);
	  if (endof > now)
	  {
	    var oldState = oldSlot.content.split('>')[1].split('<')[0];
	    var newState = newSlot.content.split('>')[1].split('<')[0];
	    var query = 'start=' + Math.round(newSlot.start / 1000) + '&end=' + Math.round(newSlot.end / 1000) + '&text=' + newState + '&recursive=' + user.reoc;
	    var body = '{"color":null' + ',"count":0' + ',"end":' + Math.round(oldSlot.end / 1000) + ',"recursive":' + user.reoc + ',"start":' + Math.round(oldSlot.start / 1000) + ',"text":"' + oldState + '"' + ',"wish":0}';
	    var label = {
	      gname: webpaige.config('gname'),
	      guuid: webpaige.config('guuid')
	    };
	    webpaige.con(
	    {
	      type: 'put',
	      path: '/askatars/' + user.uuid + '/slots?' + query,
	      json: body,
	      label: label,
	      loading: 'De beschikbaarheid wordt gewijzigd..',
	      session: session.getSession()
	    },
	
	    function (data, label)
	    {
	      this.getSlots();
	      this.getGroupSlots(label.guuid, label.gname);
	      this.getMemberSlots(label.guuid);
	    });
	  }
	  else
	  {
	    timeline.cancelChange();
	    alert('Het is niet toegestaan ​​om gebeurtenissen uit het verleden te veranderen.');
	  }
	},
*/
	
/*
	editSlotModal: function(efrom, etill, ereoc, evalue, user)
	{
	  $('#userWhoEdit').val(user.uuid);
	  $('#userReocEdit').val(user.reoc);
	  var eoldSlotValue;
	  var eoldRecursive;
	  var eoldSlotFrom;
	  var eoldSlotTill;
	  $('#editEvent').modal('show');
	  switch (evalue)
	  {
	    case 'com.ask-cs.State.Available':
	      $('input#eplanningType')[0].checked = true;
	      eoldSlotValue = 'com.ask-cs.State.Available';
	      break;
	    case 'com.ask-cs.State.KNRM.BeschikbaarNoord':
	      $('input#eplanningType')[1].checked = true;
	      eoldSlotValue = 'com.ask-cs.State.KNRM.BeschikbaarNoord';
	      break;
	    case 'com.ask-cs.State.KNRM.BeschikbaarZuid':
	      $('input#eplanningType')[2].checked = true;
	      eoldSlotValue = 'com.ask-cs.State.KNRM.BeschikbaarZuid';
	      break;
	    case 'com.ask-cs.State.KNRM.SchipperVanDienst':
	      $('input#eplanningType')[3].checked = true;
	      eoldSlotValue = 'com.ask-cs.State.KNRM.SchipperVanDienst';
	      break;
	    case 'com.ask-cs.State.Unavailable':
	      $('input#eplanningType')[4].checked = true;
	      eoldSlotValue = 'com.ask-cs.State.Unavailable';
	      break;
	    case 'com.ask-cs.State.Unreached':
	      eoldSlotValue = 'com.ask-cs.State.Unreached';
	      break;
	  }
	  efrom = new Date(efrom.getTime());
	  eoldSlotFrom = Math.round(efrom / 1000);
	  efrom = efrom.toString("dd-M-yyyy HH:mm");
	  $('#eplanningFrom').val(efrom);
	  etill = new Date(etill.getTime());
	  eoldSlotTill = Math.round(etill / 1000);
	  etill = etill.toString("dd-M-yyyy HH:mm");
	  $('#eplanningTill').val(etill);
	  $('input#eplanningReoccuring')[0].checked = eval(user.reoc);
	  window.oldslot = {
	    from: eoldSlotFrom,
	    till: eoldSlotTill,
	    reoc: user.reoc,
	    type: eoldSlotValue,
	    uuid: user.uuid
	  };
	},
*/
	
	// Timeline slots
	getSlots: function(uuid)
	{
		if (uuid == undefined)
		{
	  	var resources = JSON.parse(webpaige.get('resources'));
	  	var xid = resources.uuid;
		}
		else
		{
	  	var xid = uuid;		
		}
	  webpaige.con(
	  {
	    path: '/askatars/' + xid + '/slots?' + window.range,
	    loading: 'De beschikbaarheden worden opgeladen..',
	    label: 'slots',
	    session: session.getSession()
	  },
	
	  function (data, label)
	  {
	    var slots = data;
	    timeline_data = new google.visualization.DataTable();
	    timeline_data.addColumn('datetime', 'start');
	    timeline_data.addColumn('datetime', 'end');
	    timeline_data.addColumn('string', 'content');
	    timeline_data.addColumn('string', 'group');
	    
	    
	    for (var i in slots)
	    {
	      var resources = JSON.parse(webpaige.get('resources'));
	      
	      var content = this.colorState(slots[i].text);
	      
	      timeline_data.addRow([
	      new Date(slots[i].start * 1000),
	      new Date(slots[i].end * 1000),
	      content,
	      slots[i].recursive ? '<span style="display:none;">b</span>Wekelijkse terugkerend<span style="display:none;">' + xid + ':true</span>' : '<span style="display:none;">a</span>Planning<span style="display:none;">' + xid + ':false</span>']);
	   
	/*
	      timeline_data.addRow([
	      new Date(slots[i].start * 1000),
	      new Date(slots[i].end * 1000),
	      content,
	      '<span style="display:none;">c</span>Combined<span style="display:none;">' + resources.uuid + ':false</span>']);
	*/
	      
	    }
	    
	    
	    var trange = webpaige.config('trange');
	    var options = {
	    	'axisOnTop': true,
	      'selectable': true,
	      'editable': true,
	      'height': 'auto',
	      'groupsWidth': '150px',
	      
	      //'min': new Date(trange.start), // lower limit of visible range
	      //'max': new Date(trange.end), // upper limit of visible range
	      
	      'min': new Date(trange.start), // lower limit of visible range
	      'max': new Date(trange.end), // upper limit of visible range
	      
	      'intervalMin': 1000 * 60 * 60 * 1, // one day in milliseconds
	      'intervalMax': 1000 * 60 * 60 * 24 * 7 * 2 // about three months in milliseconds,
	    };
	    timeline.draw(timeline_data, options);
	    timeline.addItem(
	    {
	      'start': new Date(0),
	      'end': new Date(0),
	      'content': 'available',
	      'group': '<span style="display:none;">b</span>Wekelijkse terugkerend<span style="display:none;">' + xid + ':true</span>'
	    });
	    timeline.addItem(
	    {
	      'start': new Date(0),
	      'end': new Date(0),
	      'content': 'available',
	      'group': '<span style="display:none;">a</span>Planning<span style="display:none;">' + xid + ':false</span>'
	    });
	    /*
	    timeline.addItem(
	    {
	      'start': new Date(0),
	      'end': new Date(0),
	      'content': 'available',
	      'group': '<span style="display:none;">c</span>Combined<span style="display:none;">' + resources.uuid + ':false</span>'
	    });
	    */
	
			if (webpaige.config('inited') == true) {
	    timeline.setVisibleChartRange(trange.start, trange.end);
	    } else {
	    timeline.setVisibleChartRange((new Date).add({days: -1}), (new Date).add({days: +13}));
	    }
	    
	  });
	},
	
	getGroupSlots: function(guuid, gname)
	{
	  var resources = JSON.parse(webpaige.get('resources'));
	  webpaige.con(
	  {
	    path: '/calc_planning/' + guuid + '?' + window.range,
	    loading: 'Groepsbeschikbaarheid wordt geladen..',
	    label: gname,
	    session: session.getSession()
	  },
	
	  function (data, label)
	  {
	    var ndata = [];
	    var maxh = 0;
	    for (var i in data)
	    {
	      if (data[i].wish > maxh) maxh = data[i].wish;
	    }
	    for (var i in data)
	    {
	      var maxNum = maxh;
	      var num = data[i].wish;
	      var xwish = num;
	      var height = Math.round(num / maxNum * 80 + 20); // a percentage, with a lower bound on 20%
	      var minHeight = height;
	      var style = 'height:' + height + 'px;';
	      'title="Minimum aantal benodigden: ' + num + ' personen"><span>' + num + '</span></div>';
	      var requirement = '<div class="requirement" style="' + style + '" ' + 'title="Minimum aantal benodigden: ' + num + ' personen"></div>';
	      num = data[i].wish + data[i].diff;
	      var xcurrent = num;
	      // a percentage, with a lower bound on 20%
	      height = Math.round(num / maxNum * 80 + 20);
	      if (xcurrent < xwish)
	      {
	        var color = '#a93232';
	        var span = '';
	      }
	      else if (xcurrent == xwish)
	      {
	        var color = '#e0c100';
	        var span = '';
	      }
	      else if (xcurrent > xwish)
	      {
	        switch (num)
	        {
	          case 1:
	            var color = '#4f824f';
	            break;
	          case 2:
	            var color = '#477547';
	            break;
	          case 3:
	            var color = '#436f43';
	            break;
	          case 4:
	            var color = '#3d673d';
	            break;
	          case 5:
	            var color = '#396039';
	            break;
	          case 6:
	            var color = '#335833';
	            break;
	          case 7:
	            var color = '#305330';
	            break;
	          default:
	            var color = '#294929';
	        }
	        var span = '<span class="badge badge-inverse">' + num + '</span>';
	      }
	      if (xcurrent > xwish)
	      {
	        height = minHeight;
	      }
	      style = 'height:' + height + 'px;' + 'background-color: ' + color + ';';
	      var actual = '<div class="bar" style="' + style + '" ' + ' title="Huidig aantal beschikbaar: ' + num + ' personen">' + span + '</div>';
	      var item = {
	        'group': label,
	        'groupsWidth': '150px',
	        'start': Math.round(data[i].start * 1000),
	        'end': Math.round(data[i].end * 1000),
	        'content': requirement + actual
	      };
	      ndata.push(item);
	    }
	    webpaige.config('both', ndata);
	    webpaige.con(
	    {
	      path: '/calc_planning/' + guuid + '?' + window.range + '&stateGroup=knrm.StateGroup.BeschikbaarNoord',
	      loading: 'Groepsbeschikbaarheid voor Noord wordt geladen..',
	      label: gname + ' Station Noord',
	      session: session.getSession()
	    },
	
	    function (data, label)
	    {
	      var ndata = [];
	      var maxh = 0;
	      for (var i in data)
	      {
	        if (data[i].wish > maxh) maxh = data[i].wish;
	      }
	      for (var i in data)
	      {
	        var maxNum = maxh;
	        var num = data[i].wish;
	        var xwish = num;
	        var height = Math.round(num / maxNum * 80 + 20); // a percentage, with a lower bound on 20%
	        var minHeight = height;
	        var style = 'height:' + height + 'px;';
	        'title="Minimum aantal benodigden: ' + num + ' personen"><span>' + num + '</span></div>';
	        var requirement = '<div class="requirement" style="' + style + '" ' + 'title="Minimum aantal benodigden: ' + num + ' personen"></div>';
	        num = data[i].wish + data[i].diff;
	        var xcurrent = num;
	        // a percentage, with a lower bound on 20%
	        height = Math.round(num / maxNum * 80 + 20);
	        if (xcurrent < xwish)
	        {
	          var color = '#a93232';
	          var span = '';
	        }
	        else if (xcurrent == xwish)
	        {
	          var color = '#e0c100';
	          var span = '';
	        }
	        else if (xcurrent > xwish)
	        {
	          switch (num)
	          {
	            case 1:
	              var color = '#4f824f';
	              break;
	            case 2:
	              var color = '#477547';
	              break;
	            case 3:
	              var color = '#436f43';
	              break;
	            case 4:
	              var color = '#3d673d';
	              break;
	            case 5:
	              var color = '#396039';
	              break;
	            case 6:
	              var color = '#335833';
	              break;
	            case 7:
	              var color = '#305330';
	              break;
	            default:
	              var color = '#294929';
	          }
	          var span = '<span class="badge badge-inverse">' + num + '</span>';
	        }
	        if (xcurrent > xwish)
	        {
	          height = minHeight;
	        }
	        style = 'height:' + height + 'px;' + 'background-color: ' + color + ';';
	        var actual = '<div class="bar" style="' + style + '" ' + ' title="Huidig aantal beschikbaar: ' + num + ' personen">' + span + '</div>';
	        var item = {
	          'group': label,
	          'groupsWidth': '150px',
	          'start': Math.round(data[i].start * 1000),
	          'end': Math.round(data[i].end * 1000),
	          'content': requirement + actual
	        };
	        ndata.push(item);
	      }
	      webpaige.config('north', ndata);
	    });
	    webpaige.con(
	    {
	      path: '/calc_planning/' + guuid + '?' + window.range + '&stateGroup=knrm.StateGroup.BeschikbaarZuid',
	      loading: 'Groepsbeschikbaarheid voor Noord wordt geladen..',
	      label: gname + ' Station Zuid',
	      session: session.getSession()
	    },
	
	    function (data, label)
	    {
	      var ndata = [];
	      var maxh = 0;
	      for (var i in data)
	      {
	        if (data[i].wish > maxh) maxh = data[i].wish;
	      }
	      for (var i in data)
	      {
	        var maxNum = maxh;
	        var num = data[i].wish;
	        var xwish = num;
	        var height = Math.round(num / maxNum * 80 + 20); // a percentage, with a lower bound on 20%
	        var minHeight = height;
	        var style = 'height:' + height + 'px;';
	        'title="Minimum aantal benodigden: ' + num + ' personen"><span>' + num + '</span></div>';
	        var requirement = '<div class="requirement" style="' + style + '" ' + 'title="Minimum aantal benodigden: ' + num + ' personen"></div>';
	        num = data[i].wish + data[i].diff;
	        var xcurrent = num;
	        // a percentage, with a lower bound on 20%
	        height = Math.round(num / maxNum * 80 + 20);
	        if (xcurrent < xwish)
	        {
	          var color = '#a93232';
	          var span = '';
	        }
	        else if (xcurrent == xwish)
	        {
	          var color = '#e0c100';
	          var span = '';
	        }
	        else if (xcurrent > xwish)
	        {
	          switch (num)
	          {
	            case 1:
	              var color = '#4f824f';
	              break;
	            case 2:
	              var color = '#477547';
	              break;
	            case 3:
	              var color = '#436f43';
	              break;
	            case 4:
	              var color = '#3d673d';
	              break;
	            case 5:
	              var color = '#396039';
	              break;
	            case 6:
	              var color = '#335833';
	              break;
	            case 7:
	              var color = '#305330';
	              break;
	            default:
	              var color = '#294929';
	          }
	          var span = '<span class="badge badge-inverse">' + num + '</span>';
	        }
	        if (xcurrent > xwish)
	        {
	          height = minHeight;
	        }
	        style = 'height:' + height + 'px;' + 'background-color: ' + color + ';';
	        var actual = '<div class="bar" style="' + style + '" ' + ' title="Huidig aantal beschikbaar: ' + num + ' personen">' + span + '</div>';
	        var item = {
	          'group': label,
	          'groupsWidth': '150px',
	          'start': Math.round(data[i].start * 1000),
	          'end': Math.round(data[i].end * 1000),
	          'content': requirement + actual
	        };
	        ndata.push(item);
	      }
	      webpaige.config('south', ndata);
	    });
	    var trange = webpaige.config('trange');
	    var options = {
	      "width": "100%",
	      "height": 'auto',
	      "style": "box",
	      'selectable': true,
	      'editable': false,
	      'groupsWidth': '150px',
	      'eventMarginAxis': 0,
	      'min': new Date(trange.start), // lower limit of visible range
	      'max': new Date(trange.end),
	      'intervalMin': 1000 * 60 * 60 * 1, // one day in milliseconds
	      'intervalMax': 1000 * 60 * 60 * 24 * 7 * 2 // about three months in milliseconds,
	    };
	    timeline2 = new links.Timeline(document.getElementById('groupTimeline'));
	    google.visualization.events.addListener(timeline2, 'rangechange', this.onRangeChanged2);
	    timeline2.draw(ndata, options);
	    
	    if (webpaige.config('inited') == true) {
	    timeline2.setVisibleChartRange(trange.start, trange.end);
	    } else {
	    timeline2.setVisibleChartRange((new Date).add({days: -1}), (new Date).add({days: +13}));
	    }
	    
	  });
	},
	
	getMemberSlots: function(uuid, mid)
	{
	  webpaige.con(
	  {
	    path: '/network/' + uuid + '/members',
	    loading: 'De groep leden beschikbaarheden worden opgeladen..',
	    label: uuid,
	    session: session.getSession()
	  },
	
	  function (data, label)
	  {
	  	if (data.length > 0)
	  	{
		  	$('#memberTimeline').show();
		    timeline_data3 = new google.visualization.DataTable();
		    timeline_data3.addColumn('datetime', 'start');
		    timeline_data3.addColumn('datetime', 'end');
		    timeline_data3.addColumn('string', 'content');
		    timeline_data3.addColumn('string', 'group');
		    var members = data;
		    for (var i in members)
		    {
		    
		    
		    
		    	this.renderMemberSlots(members[i], members[i].name, false);
		    	
		    	
		    	
		    	/*
		    	if (mid == members[i].uuid)
		    	{
			    	renderMemberSlots(members[i], members[i].name, true);
		    	}
		    	else
		    	{
			    	renderMemberSlots(members[i], members[i].name, false)
		    	}
		    	*/
		    }
		    var trange = webpaige.config('trange');
		    if (webpaige.getRole() == 1)
		    {
		      var options = {
		        'selectable': true,
		        'editable': true,
		        'snapEvents': false,
		        'groupChangeable': false,
		        'groupsWidth': '150px',
		        'min': new Date(trange.start), // lower limit of visible range
		        'max': new Date(trange.end),
		        'intervalMin': 1000 * 60 * 60 * 1, // one day in milliseconds
		        'intervalMax': 1000 * 60 * 60 * 24 * 7 * 2 // about three months in milliseconds,
		      };
		    }
		    else
		    {
		      var options = {
		        'selectable': false,
		        'editable': false,
		        'snapEvents': false,
		        'groupChangeable': false,
		        'groupsWidth': '150px',
		        'min': new Date(trange.start), // lower limit of visible range
		        'max': new Date(trange.end),
		        'intervalMin': 1000 * 60 * 60 * 1, // one day in milliseconds
		        'intervalMax': 1000 * 60 * 60 * 24 * 7 * 2 // about three months in milliseconds,
		      };
		    }
		    timeline3.draw(timeline_data3, options);
		    
		    if (webpaige.config('inited') == true) {
		    timeline3.setVisibleChartRange(trange.start, trange.end);
		    //console.log('working!');
		    } else {
		    timeline3.setVisibleChartRange((new Date).add({days: -1}), (new Date).add({days: +13}));
		    //webpaige.config('inited', true);
		    }
		    
	  	}
	  	else
	  	{
		  	// console.log('this group has no members');
		  	$('#memberTimeline').hide();
	  	}
	  });
	},
	
	renderMemberSlots: function(member, name, mid)
	{	
	if (mid != false)
	{
	  webpaige.con(
	  {
	    path: '/askatars/' + member.uuid + '/slots?' + window.range,
	    loading: 'De beschiebaarheiden worden opgeladen..',
	    label: member,
	    session: session.getSession()
	  },
	  function (data, label)
	  {
	    var slots = data;
	    timeline3.addItem(
	    {
	      'start': new Date(0),
	      'end': new Date(0),
	      'content': 'available',
	      'group': '<span style="display:none;">' + label.uuid + ':true:false</span>' + label.name + ' <div style="display:none;">b</div>(W)'
	    });
	    timeline3.addItem(
	    {
	      'start': new Date(0),
	      'end': new Date(0),
	      'content': 'available',
	      'group': '<span style="display:none;">' + label.uuid + ':false:false</span>' + label.name + ' <div style="display:none;">a</div>(P)'
	    });
	    for (var i in slots)
	    {
	      var content = colorState(slots[i].text);
	      timeline3.addItem(
	      {
	        'start': new Date(slots[i].start * 1000),
	        'end': new Date(slots[i].end * 1000),
	        'content': content,
	        'group': slots[i].recursive ? '<span style="display:none;">' + label.uuid + ':true:false</span>' + label.name + ' <div style="display:none;">b</div>(W)' : '<span style="display:none;">' + label.uuid + ':false:false</span>' + label.name + ' <div style="display:none;">a</div>(P)'
	      });
	    }
	  });
	}
	else
	{
	  webpaige.con(
	  {
	    path: '/askatars/' + member.uuid + '/slots?' + window.range + '&type=both',
	    loading: 'De beschiebaarheiden worden opgeladen..',
	    label: member,
	    session: session.getSession()
	  },
	  function (data, label)
	  {
	  	if (webpaige.getRole() == 1)
	  	{
		  	var header = '<a onclick="reRenderMembers(\'' + label.uuid + '\', \'' + label.name + '\');">' + label.name + '</a>';
	  	}
	  	else
	  	{
		  	var header = label.name;
	  	}
	    var slots = data;
	    timeline3.addItem(
	    {
	      'start': new Date(0),
	      'end': new Date(0),
	      'content': 'available',
	      'group': '<span style="display:none;">' + label.name + ':false:true</span>' + header + '<div style="display:none;">c</div>'
	    });
	    for (var i in slots)
	    {
	      var content = colorState(slots[i].text);
	      timeline3.addItem(
	      {
	        'start': new Date(slots[i].start * 1000),
	        'end': new Date(slots[i].end * 1000),
	        'content': content,
	        'group': '<span style="display:none;">' + label.name + ':false:true</span>' + header + '<div style="display:none;">c</div>'
	      });
	    }
	  });
	}
},
	
	// Slot makeups
	colorState: function(state)
	{
	  var content = '?';
	  if (state == 'com.ask-cs.State.Available') return '<div class="available">' + state + '</div>';
	  if (state == 'com.ask-cs.State.KNRM.BeschikbaarNoord') return '<div class="availableN">' + state + '</div>';
	  if (state == 'com.ask-cs.State.KNRM.BeschikbaarZuid') return '<div class="availableS">' + state + '</div>';
	  if (state == 'com.ask-cs.State.Unavailable') return '<div class="unavailable">' + state + '</div>';
	  if (state == 'com.ask-cs.State.KNRM.SchipperVanDienst') return '<div class="schipper">' + state + '</div>';
	  if (state == 'com.ask-cs.State.Unreached') return '<div class="unreachable">' + state + '</div>';
	},
	
	timeline_helper_state2html: function(state)
	{
	  var state_map = {
	    'ask.state.1': ['com.ask-cs.State.Available', 'green'],
	    'ask.state.2': ['com.ask-cs.State.KNRM.BeschikbaarNoord', 'green'],
	    'ask.state.3': ['com.ask-cs.State.KNRM.BeschikbaarZuid', 'green'],
	    'ask.state.4': ['com.ask-cs.State.Unavailable', 'red'],
	    'ask.state.5': ['com.ask-cs.State.KNRM.SchipperVanDienst', 'yellow'],
	    'ask.state.6': ['com.ask-cs.State.Unreached', 'purple']
	  };
	  var content = '?';
	  if (state_map[state]) return '<div style="background-color:' + state_map[state][1] + '">' + state_map[state][3] + '</div>';
	},
	
	timeline_helper_html2state: function(content)
	{
	  var state_map = {
	    'ask.state.1': ['com.ask-cs.State.Available', 'green'],
	    'ask.state.2': ['com.ask-cs.State.KNRM.BeschikbaarNoord', 'green'],
	    'ask.state.3': ['com.ask-cs.State.KNRM.BeschikbaarZuid', 'green'],
	    'ask.state.4': ['com.ask-cs.State.Unavailable', 'red'],
	    'ask.state.5': ['com.ask-cs.State.KNRM.SchipperVanDienst', 'yellow'],
	    'ask.state.6': ['com.ask-cs.State.Unreached', 'purple']
	  };
	  var state = content.split('>')[1].split('<')[0];
	  //reverse map search..
	  for (var i in state_map)
	  {
	    if (state == state_map[i][0]) return i;
	  }
	  return state;
	},
	
	html2state: function(content)
	{
	  return content.split('>')[1].split('<')[0];
	},
	
	trimSpan: function(content)
	{
	  return content.split('n>')[1];
	},
	
	timeline_helper_html2state2: function(content)
	{
	  var state_map = {
	    'ask.state.1': ['com.ask-cs.State.Available', 'green'],
	    'ask.state.2': ['com.ask-cs.State.KNRM.BeschikbaarNoord', 'green'],
	    'ask.state.3': ['com.ask-cs.State.KNRM.BeschikbaarZuid', 'green'],
	    'ask.state.4': ['com.ask-cs.State.Unavailable', 'red'],
	    'ask.state.5': ['com.ask-cs.State.KNRM.SchipperVanDienst', 'yellow'],
	    'ask.state.6': ['com.ask-cs.State.Unreached', 'purple']
	  };
	  var state = content.split('>')[1].split('<')[0];
	  //reverse map search..
	  for (var i in state_map)
	  {
	    if (state == state_map[i][0]) return state_map[i][0];
	  }
	  return state;
	},
	
	// Group list producers
	renderGroupsList: function()
	{
	  if (webpaige.getRole() < 3)
	  {
	    webpaige.con(
	    {
	      path: '/network',
	      loading: 'De groep informatie wordt opgeladen..',
	      label: 'groups',
	      session: session.getSession()
	    },
	    
	    function (data, label)
	    {
	      for (var i in data)
	      {
	        $('#groupsList').append('<option value="' + data[i].uuid + '">' + data[i].name + '</option>');
	      }
	    });
	  }
	  else
	  {
	    webpaige.con(
	    {
	      path: '/parent',
	      loading: 'Parent groep informatie wordt opgeladen..',
	      label: 'parent group: ',
	      session: session.getSession()
	    },
	    
	    function (data, label)
	    {
	      for (var i in data)
	      {
	        $('#groupsList').append('<option value="' + data[i].uuid + '">' + data[i].name + '</option>');
	      }
	    });
	  }
	},
	
/*
	goToday: function()
	{
		webpaige.config('inited', false);
		
		//console.log(
		
	  var trange = webpaige.config('treset');
	  window.range = 'start=' + trange.bstart + '&end=' + trange.bend;
	  webpaige.config('trange', trange);
	  var label = {
	    gname: webpaige.config('gname'),
	    guuid: webpaige.config('guuid')
	  };
	  this.getSlots();
	  this.getGroupSlots(label.guuid, label.gname);
	  this.getMemberSlots(label.guuid);
	},
*/
	
	// Timeline navigations
/*
	timelineZoomIn: function()
	{
	  links.Timeline.preventDefault(event);
	  links.Timeline.stopPropagation(event);
	  timeline.zoom(0.4);
	  timeline.trigger("rangechange");
	  timeline.trigger("rangechanged");
	},
*/
	
/*
	timelineZoomOut: function()
	{
	  links.Timeline.preventDefault(event);
	  links.Timeline.stopPropagation(event);
	  timeline.zoom(-0.4);
	  timeline.trigger("rangechange");
	  timeline.trigger("rangechanged");
	},
*/
	
/*
	timelineMoveLeft: function()
	{
	
	  var otrange = webpaige.config('trange');
	  var trange = {};
	  trange.bend = otrange.bstart;
	  trange.bstart = (trange.bend - 86400 * 7 * 2);
	  trange.end = otrange.start;
	  trange.start = new Date(otrange.start).addWeeks(-2);
	  window.range = 'start=' + trange.bstart + '&end=' + trange.bend;
	  webpaige.config('trange', trange);
	  var label = {
	    gname: webpaige.config('gname'),
	    guuid: webpaige.config('guuid')
	  };
	  
	  var now = Date.today().getTime() / 1000;
	  
	  console.log(trange, now);
	  
	  if (now > trange.bstart && now < trange.bend)
	  {
		  console.log('you are in the right week');
		  webpaige.config('inited', false);
	  }
	  else
	  {
		  webpaige.config('inited', true);
	  }
	  
	  this.getSlots();
	  this.getGroupSlots(label.guuid, label.gname);
	  this.getMemberSlots(label.guuid);
	},
*/
	
/*
	timelineMoveRight: function()
	{
		webpaige.config('inited', true);
	  var otrange = webpaige.config('trange');
	  var trange = {};
	  trange.bstart = otrange.bend;
	  trange.bend = (trange.bstart + 86400 * 7 * 2);
	  trange.start = otrange.end;
	  trange.end = new Date(otrange.end).addWeeks(2);
	  window.range = 'start=' + trange.bstart + '&end=' + trange.bend;
	  webpaige.config('trange', trange);
	  var label = {
	    gname: webpaige.config('gname'),
	    guuid: webpaige.config('guuid')
	  };
	  
	  var now = Date.today().getTime() / 1000;
	  
	  console.log(trange, now);
	  
	  if (now > trange.bstart && now < trange.bend)
	  {
		  console.log('you are in the right week');
		  webpaige.config('inited', false);
	  }
	  else
	  {
		  webpaige.config('inited', true);
	  }
	  
	  this.getSlots();
	  this.getGroupSlots(label.guuid, label.gname);
	  this.getMemberSlots(label.guuid);
	}
*/
	
	
}

dashboard.$inject = ['$scope'];