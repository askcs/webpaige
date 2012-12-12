$(document).ready(function ()
{
	
  pageInit('dashboard', 'true');
  
  webpaige.config('inited', false);
  
  var trange = webpaige.config('trange');
  window.range = 'start=' + trange.bstart + '&end=' + trange.bend;
  
  var guuid = webpaige.config('firstGroupUUID');
  var gname = webpaige.config('firstGroupName');
  webpaige.config('guuid', guuid);
  webpaige.config('gname', gname);
  
  
  renderGroupsList();
  
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
  
  
  preloader();
  
/*
  timelineInit();
  groupTimelineInit(guuid, gname);
  membersTimelineInit(guuid);
*/
  
  
  $('#groupAvBtn').addClass('active');
  $("#groupsList").change(function ()
  {
	webpaige.config('inited', false);
    $('#divisions option[value="both"]').attr('selected', 'selected');
    var guuid = $(this).find(":selected").val();
    var gname = $(this).find(":selected").text();
    webpaige.config('guuid', guuid);
    webpaige.config('gname', gname);
    
    preloader();
    
/*
    timelineInit();
    groupTimelineInit(guuid, gname);
    membersTimelineInit(guuid);
*/
    
  });
  $('#newEventBtn').click(function ()
  {
  
    //var resources = JSON.parse(webpaige.get('resources'));
    //$('#userWho').val(resources.uuid);
    
    
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
  
  var local = {
    title: 'dashboard_title',
    statics: ['dashboard_today', 'dashboard_new_availability', 'dashboard_status', 'dashboard_available', 'dashboard_available_noord', 'dashboard_available_zuid', 'dashboard_unavailable', 'dashboard_from', 'dashboard_till', 'dashboard_weekly', 'dashboard_cancel', 'dashboard_save_planning', 'dashboard_edit_availability', 'dashboard_delete_planning', 'dashboard_save_planning', 'dashboard_planboard']
  }
  webpaige.i18n(local);
  
  
  webpaige.config('division', 'default');
  
  $("#divisions").change(function ()
  {
    var division = $(this).find(":selected").val();
    webpaige.config('division', division);
    //timeline2.draw(webpaige.config(division));
  });
  
  
});
//var session = new ask.session();



function reRenderMembers(mid, mname)
{
  var guuid = $("#groupsList").find(":selected").val();
  var gname = $("#groupsList").find(":selected").text();
  
  $('#mytimeline .timeline-frame').append('<span id="tmlabel" class="label label-info" style="position:absolute; top:10px; left:10px; z-index:2000;">' + mname + '</span>');
  
  preloader(mid);
  
/*
  timelineInit(mid);
  groupTimelineInit(guuid, gname);
  membersTimelineInit(guuid, mid);	
*/
  
}
  
  
  
var timeline;
var timeline2;
var timeline3;
var timeline_selected = null;
// Submitters
function planSubmit()
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
  addSlot(planningFrom, planningTill, planningReoccuring, state, userWho);
  $('#newEventForm')[0].reset();
}

function editPlanSubmit()
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
  updateSlotModal();
  $('#editEventForm')[0].reset();
}

function deletePlanSubmit()
{
  $('#editEvent').modal('hide');
  deleteSlotModal(oldslot.from, oldslot.till, oldslot.reoc, oldslot.type);
  $('#editEventForm')[0].reset();
}
// Timeline initators
function timelineInit(uuid)
{
  timeline_data = [];
  timeline = new links.Timeline(document.getElementById('mytimeline'));
  // Add event listeners
  google.visualization.events.addListener(timeline, 'edit', timelineOnEdit);
  google.visualization.events.addListener(timeline, 'add', timelineOnAdd);
  google.visualization.events.addListener(timeline, 'delete', timelineOnDelete);
  google.visualization.events.addListener(timeline, 'change', timelineOnChange);
  google.visualization.events.addListener(timeline, 'select', timelineOnSelect);
  google.visualization.events.addListener(timeline, 'rangechange', onRangeChanged1);
  getSlots(uuid);
}

function groupTimelineInit(guuid, gname)
{
  getGroupSlots(guuid, gname);
}

function membersTimelineInit(uuid, mid)
{
  timeline_data3 = [];
  var options = {
    'groupsWidth': '150px'
  };
  timeline3 = new links.Timeline(document.getElementById('memberTimeline'));
  if (webpaige.getRole() == 1)
  {
    // Add event listeners
    google.visualization.events.addListener(timeline3, 'edit', timelineOnEdit2);
    google.visualization.events.addListener(timeline3, 'add', timelineOnAdd2);
    google.visualization.events.addListener(timeline3, 'delete', timelineOnDelete2);
    google.visualization.events.addListener(timeline3, 'change', timelineOnChange2);
    google.visualization.events.addListener(timeline3, 'select', timelineOnSelect2);
  }
  google.visualization.events.addListener(timeline3, 'rangechange', onRangeChanged3);
  timeline3.setVisibleChartRange(window.tstart, window.tend);
  timeline3.draw(timeline_data3, options);
  getMemberSlots(uuid, mid);
}

function onRangeChanged1()
{
  var range = timeline.getVisibleChartRange();
  timeline2.setVisibleChartRange(range.start, range.end);
  timeline3.setVisibleChartRange(range.start, range.end);
}

function onRangeChanged2()
{
  var range = timeline2.getVisibleChartRange();
  timeline.setVisibleChartRange(range.start, range.end);
  timeline3.setVisibleChartRange(range.start, range.end);
}

function onRangeChanged3()
{
  var range = timeline3.getVisibleChartRange();
  timeline.setVisibleChartRange(range.start, range.end);
  timeline2.setVisibleChartRange(range.start, range.end);
}
// Timeline events
function timelineOnAdd()
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
}

function timelineOnEdit()
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
  editSlotModal(curItem.start, curItem.end, trimSpan(curItem.group), html2state(content), real);
  $('#tmlabel').hide();
}

function timelineOnDelete()
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
  deleteSlot(oldItem.start / 1000, oldItem.end / 1000, oldItem.group, oldItem.content, real);
  timeline.cancelDelete();
  $('#tmlabel').hide();
}

function timelineOnSelect()
{
  var sel = timeline.getSelection();
  var row = sel[0].row;
  timeline_selected = timeline.getItem(row);
}

function timelineOnChange()
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
  updateSlot(timeline_selected, newItem, real);
  $('#tmlabel').hide();
}
// Timeline Members events
function timelineOnAdd2()
{
  timeline3.cancelAdd();
  var sel = timeline3.getSelection();
  var row = sel[0].row;
  var user = $.trim(timeline3.getItem(row).group.split('>')[1].split('<')[0]);
  user = user.split(':');
  $('#userWho').val(user[0]);
  $('#newEvent').modal('show');
}

function timelineOnEdit2()
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
  	editSlotModal(curItem.start, curItem.end, trimSpan(curItem.group), html2state(content), real);
  }
  else
  {
	  timeline3.cancelChange();
  }
}

function timelineOnDelete2()
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
}

function timelineOnSelect2()
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
}

function timelineOnChange2()
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
  
		updateSlot(timeline_selected, newItem, real); 
  }
  else
  {
  
  	//console.log('not allowed');
  
	  timeline3.cancelChange();
  }
}
// Timeline CRUD's
function addSlot(from, till, reoc, value, user)
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
    options = {
      type: 'post',
      path: '/askatars/' + user + '/slots',
      json: body,
      label: label,
      loading: 'Nieuwe beschikbaarheid aan het toevoegen..',
      session: session.getSession()
    },

    function (data, label)
    {
      getSlots();
      getGroupSlots(label.guuid, label.gname);
      getMemberSlots(label.guuid);
    });
  }
  
  
}
// check delete slot
function deleteSlot(from, till, reoc, value, user)
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
    options = {
      type: 'delete',
      path: path,
      label: label,
      loading: 'De beschikbaarheid wordt verwijderd..',
      session: session.getSession()
    },
    function (data, label)
    {
      getSlots();
      getGroupSlots(label.guuid, label.gname);
      getMemberSlots(label.guuid);
    });
  }
  else
  {
    timeline.cancelChange();
    alert('Het is niet toegestaan ​​om gebeurtenissen uit het verleden te veranderen.');
  }
}

function deleteSlotModal(from, till, reoc, value)
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
    options = {
      type: 'delete',
      path: path,
      label: label,
      loading: 'De beschikbaarheid wordt verwijderd..',
      session: session.getSession()
    },

    function (data, label)
    {
      getSlots();
      getGroupSlots(label.guuid, label.gname);
      getMemberSlots(label.guuid);
    });
  }
  else
  {
    timeline.cancelChange();
    alert('Het is niet toegestaan ​​om gebeurtenissen uit het verleden te veranderen.');
  }
}

function updateSlotModal()
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
    options = {
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
      getSlots();
      getGroupSlots(label.guuid, label.gname);
      getMemberSlots(label.guuid);
    });
  }
  else
  {
    timeline.cancelChange();
    alert('Het is niet toegestaan ​​om gebeurtenissen uit het verleden te veranderen.');
  }
}

function updateSlot(oldSlot, newSlot, user)
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
    options = {
      type: 'put',
      path: '/askatars/' + user.uuid + '/slots?' + query,
      json: body,
      label: label,
      loading: 'De beschikbaarheid wordt gewijzigd..',
      session: session.getSession()
    },

    function (data, label)
    {
      getSlots();
      getGroupSlots(label.guuid, label.gname);
      getMemberSlots(label.guuid);
    });
  }
  else
  {
    timeline.cancelChange();
    alert('Het is niet toegestaan ​​om gebeurtenissen uit het verleden te veranderen.');
  }
}

function editSlotModal(efrom, etill, ereoc, evalue, user)
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
}
// Timeline slots
function getSlots(uuid)
{

	$('#mytimeline').hide();
	$('#groupTimelineHolder').hide();
	$('#memberTimeline').hide();
	
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
  options = {
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
      
      var content = colorState(slots[i].text);
      
      if (slots[i].recursive) {
	      var xgroup = '<span style="display:none;">b</span>Wekelijkse terugkerend<span style="display:none;">' + xid + ':true</span>';
      }
      else
      {
	      var xgroup = '<span style="display:none;">a</span>Planning<span style="display:none;">' + xid + ':false</span>';
      }
      
      timeline_data.addRow([
      new Date(slots[i].start * 1000),
      new Date(slots[i].end * 1000),
      content,
      slots[i].recursive ? '<span style="display:none;">b</span>Wekelijkse terugkerend<span style="display:none;">' + xid + ':true</span>' : '<span style="display:none;">a</span>Planning<span style="display:none;">' + xid + ':false</span>']);
      
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

	
    $('#mytimeline').show();









		if (webpaige.config('inited') == true) {
    timeline.setVisibleChartRange(trange.start, trange.end);
    } else {
    timeline.setVisibleChartRange((new Date).add({days: -1}), (new Date).add({days: +13}));
    }
    
    
    
    
    
    
    
    
    
    
  });
}

function getGroupSlots(guuid, gname)
{
  var resources = JSON.parse(webpaige.get('resources'));
  webpaige.con(
  options = {
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
        //'groupsWidth': '150px',
        'start': Math.round(data[i].start * 1000),
        'end': Math.round(data[i].end * 1000),
        'content': requirement + actual
      };
      ndata.push(item);
    }
    webpaige.config('both', ndata);
    webpaige.con(
    options = {
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
          //'groupsWidth': '150px',
          'start': Math.round(data[i].start * 1000),
          'end': Math.round(data[i].end * 1000),
          'content': requirement + actual
        };
        ndata.push(item);
      }
      webpaige.config('north', ndata);
    });
    webpaige.con(
    options = {
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
          //'groupsWidth': '150px',
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
    google.visualization.events.addListener(timeline2, 'rangechange', onRangeChanged2);
    timeline2.draw(ndata, options);
    
	$('#groupTimelineHolder').show();
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    if (webpaige.config('inited') == true) {
    timeline2.setVisibleChartRange(trange.start, trange.end);
    } else {
    timeline2.setVisibleChartRange((new Date).add({days: -1}), (new Date).add({days: +13}));
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
  });
}

function getMemberSlots(uuid, mid)
{
  webpaige.con(
  options = {
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
	    	renderMemberSlots(members[i], members[i].name, false);
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
}

function renderMemberSlots(member, name, mid)
{	
	if (mid != false)
	{
	  webpaige.con(
	  options = {
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
	  options = {
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
}


// Slot makeups
function colorState(state)
{
  var content = '?';
  if (state == 'com.ask-cs.State.Available') return '<div class="available">' + state + '</div>';
  if (state == 'com.ask-cs.State.KNRM.BeschikbaarNoord') return '<div class="availableN">' + state + '</div>';
  if (state == 'com.ask-cs.State.KNRM.BeschikbaarZuid') return '<div class="availableS">' + state + '</div>';
  if (state == 'com.ask-cs.State.Unavailable') return '<div class="unavailable">' + state + '</div>';
  if (state == 'com.ask-cs.State.KNRM.SchipperVanDienst') return '<div class="schipper">' + state + '</div>';
  if (state == 'com.ask-cs.State.Unreached') return '<div class="unreachable">' + state + '</div>';
}

function timeline_helper_state2html(state)
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
}

function timeline_helper_html2state(content)
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
}

function html2state(content)
{
  return content.split('>')[1].split('<')[0];
}

function trimSpan(content)
{
  return content.split('n>')[1];
}

function timeline_helper_html2state2(content)
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
}
// Group list producers
function renderGroupsList()
{
  if (webpaige.getRole() < 3)
  {
    webpaige.con(
    options = {
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
    options = {
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
}

function goToday()
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
  getSlots();
  getGroupSlots(label.guuid, label.gname);
  getMemberSlots(label.guuid);
}
// Timeline navigations
function timelineZoomIn()
{
  links.Timeline.preventDefault(event);
  links.Timeline.stopPropagation(event);
  timeline.zoom(0.4);
  timeline.trigger("rangechange");
  timeline.trigger("rangechanged");
}

function timelineZoomOut()
{
  links.Timeline.preventDefault(event);
  links.Timeline.stopPropagation(event);
  timeline.zoom(-0.4);
  timeline.trigger("rangechange");
  timeline.trigger("rangechanged");
}

function timelineMoveLeft()
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
  
  
  
  getSlots();
  getGroupSlots(label.guuid, label.gname);
  getMemberSlots(label.guuid);
}

function timelineMoveRight()
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
  
  getSlots();
  getGroupSlots(label.guuid, label.gname);
  getMemberSlots(label.guuid);
}


















/* Preloader controller */

var preloader = function(uuid)
{	

	$('#loading span').show();
	$('#mytimeline').hide();
	
	console.log('loading began');
	
	$.ajaxSetup(
	{
	  contentType: 'application/json',
	  xhrFields: { 
	  	withCredentials: true
	  },
	  beforeSend: function(xhr)
	  {
	  	xhr.setRequestHeader('X-SESSION_ID', session.getSession());
	  }		
	})

	window.app = {
		userslots: [],
		slots: {},
		aggs: {},
		settings: {},
		timeline: []
	}

  //var now = parseInt((new Date()).getTime() / 1000);
  
  var trange = webpaige.config('trange');
  //window.range = 'start=' + trange.bstart + '&end=' + trange.bend;
  
  /*
  var period = {
	  bstart: (now - 86400 * 7 * 1),
	  bend: (now + 86400 * 7 * 1),
	  start: Date.today().add({ days: -5 }),
	  end: Date.today().add({ days: 5 })
  }
  */
  
  var period = {
	  bstart: trange.bstart,
	  bend: trange.bend,
	  start: trange.start,
	  end: trange.end
  }
  
  window.app.settings = { 
  	ranges: {
		  period: period,
		  reset: period
	  }
  }
	
	var divisions = [
		'knrm.StateGroup.BeschikbaarNoord',
		'knrm.StateGroup.BeschikbaarZuid',
	]

	if (uuid == undefined)
	{
  	var resources = JSON.parse(webpaige.get('resources'));
  	var xid = resources.uuid;
	}
	else
	{
  	var xid = uuid;		
	}
	
	var sequence1 = [
    
    function(callback)
    {
      setTimeout(function()
      {
      
      	$('#timeloading span').text('Loading user slots..');
      	
				//var resources = JSON.parse(webpaige.get('resources'));
				var userslots = [];
			  $.ajax(
				{
					url: host + '/askatars/' 
										+ xid 
										+ '/slots?start=' 
										+ window.app.settings.ranges.period.bstart 
										+ '&end=' 
										+ window.app.settings.ranges.period.bend
				})
				.success(
				function(data)
				{																
					window.app.userslots = data;
					var res = {'userslots': true}
	    		callback(null, res);
				})
      }, 100);	
    },
	
    function(res, callback)
    {
      setTimeout(function()
      {	
      
      	$('#timeloading').text('Loading group agg slots..');
      	
				var params = [];
				if (divisions.length > 0)
				{
					$.each(divisions, function(index, value)
					{
						var param = '&stateGroup=' + value;
						params.push(param);
					})
				}
				params.unshift(null);
				var groups = {},
				tmp = {},
				aggs = {},
				key,
				stateGroup,
				ikey;
				var group = webpaige.config('guuid');
				aggs[group] = {};
				$.each(params, function(index, param)
				{
					if (param)
					{
						var key = param.substr(12);
						var stateGroup = param;
					}
					else
					{
						var key = 'default';
						var stateGroup = '';
					}
					ikey = group + "_" + key;
					(function(ikey, stateGroup, key, index)
					{
						tmp[ikey] = function(callback, index)
						{
							setTimeout(function()
							{
							  $.ajax(
								{
									url: host + '/calc_planning/' 
														+ group 
														+ '?start=' 
														+ window.app.settings.ranges.period.bstart 
														+ '&end=' 
														+ window.app.settings.ranges.period.bend
														+ stateGroup
								})
								.success(
								function(data)
								{		
									aggs[group][key] = data;
					    		callback(null, 'done');
								})
							}, (index * 100) + 100) 
						}													
						$.extend(groups, tmp)
					}) (ikey, stateGroup, key, index)
				})
					
				async.series(groups,
				function(err, results)
				{
					window.app.aggs = aggs;	
					res = {'aggs': true};
					callback(null, res);
				});			
      }, 200);
    }];
    
    var sequence2 = [
    function(res, callback)
    {
      setTimeout(function()
      {
      
      	$('#timeloading span').text('Loading members..');
      	
				var group = webpaige.config('guuid');
			  $.ajax(
				{
					url: host + '/network/' + group + '/members?fields=[role]',
				})
				.success(
				function(data)
				{	
					window.app.members = data;
					res = {'members': true};
	    		callback(null, res);
	    	})
      }, 300);	
    },
    
    function(res, callback)
    {
      setTimeout(function()
      {	
      
      	$('#timeloading span').text('Loading group member slots..');
      	
				var members = {},
				tmp = {},
				slots = {},
				key,
				itype,
				ikey,
				//params = [];
				params = ['&type=both'];
				params.unshift(null);
				
				$.each(window.app.members, function (index, member)
				{
					slots[member.uuid] = {};
					$.each(params, function(index, param)
					{
						if (param)
						{
							key = param.substr(6);
							itype = param;
						}
						else {
							key = 'default';
							itype = '';
						}
						ikey = member.uuid + "_" + key;
						(function(ikey, itype, key, index)
						{
							tmp[ikey] = function(callback, index)
							{
								setTimeout(function()
								{
								
									//console.log(member.name);
									
								  $.ajax(
									{
										url: host + '/askatars/' 
															+ member.uuid 
															+ '/slots?start=' 
															+ window.app.settings.ranges.period.bstart 
															+ '&end=' 
															+ window.app.settings.ranges.period.bend
															+ itype
									})
									.success(
									function(data)
									{																
										slots[member.uuid][key] = data;
						    		callback(null, 'done');
									})
								}, (index * 100) + 100) 
							}					
							$.extend(members, tmp)
						}) (ikey, itype, key, index)
					})
				})
				
				async.series(members,
				function(err, results)
				{			
					window.app.slots = slots;
					localStorage.setItem('slots', JSON.stringify(slots));	
					res = {'memberslots': true};
					callback(null, res);
				})
			
      }, 400);				

    }    
    
	];
	
	
	var sequence = sequence1.concat(sequence2);
	//var sequence = sequence1;
	
	
	async.waterfall(sequence,
	function(err, results)
	{
		console.log('it is done!');
      
    $('#timeloading').hide();
    $('#mytimeline').show();
		
		renderTimeline(xid);
		
	})
	
}


function renderTimeline(xid)
{
		
		var timedata = [];
		
		
		//userslots
		var userslots = window.app.userslots;
    for (var i in userslots)
    {
      var resources = JSON.parse(webpaige.get('resources'));
      var content = colorState(userslots[i].text);
      
      if (userslots[i].recursive) {
	      var xgroup = '<span style="display:none;">b</span>Wekelijkse terugkerend<span style="display:none;">' + xid + ':true</span>';
      }
      else
      {
	      var xgroup = '<span style="display:none;">a</span>Planning<span style="display:none;">' + xid + ':false</span>';
      }
			timedata.push({
				start: new Date(userslots[i].start * 1000),
				end: new Date(userslots[i].end * 1000),
				group: xgroup,
				content: content,
				editable: true
			})	
    }
      
		timedata.push({
			start: new Date(0),
			end: new Date(0),
			group: '<span style="display:none;">b</span>Wekelijkse terugkerend<span style="display:none;">' + xid + ':true</span>',
			content: 'available',
			editable: true
		})	
    
		timedata.push({
			start: new Date(0),
			end: new Date(0),
			group: '<span style="display:none;">a</span>Planning<span style="display:none;">' + xid + ':false</span>',
			content: 'available',
			editable: true
		})	
		
		
		// agg slots
	  var guuid = webpaige.config('guuid');
	  var gname = webpaige.config('gname');
	  var division = webpaige.config('division');
	  
	  switch(division)
	  {
		  case 'default':
		  	var divi = 'default';
		  break;
		  case 'north':
		  	var divi = 'knrm.StateGroup.BeschikbaarNoord';
		  break;
		  case 'south':
		  	var divi = 'knrm.StateGroup.BeschikbaarZuid';
		  break;
	  }
	  
	  
	  var density = ['#294929', '#4f824f', '#477547', '#436f43', '#3d673d', '#396039', '#335833', '#305330'];
	  
	  
	  var agg = window.app.aggs;
		
		var group = agg[guuid][divi];
		
		var maxh = 0;
		
		$.each(group, function(index, slot)
		{
			if (slot.wish > maxh) maxh = slot.wish;
		})	
	
		$.each(group, function(index, slot)
		{
		  var maxNum = maxh;
		  var num = slot.wish;
		  var xwish = num;
		  
		  // a percentage, with a lower bound on 20%
		  var height = Math.round(num / maxNum * 80 + 20);
		  
		  var minHeight = height;
		  var style = 'height:' + height + 'px;';
		  //'title="Minimum aantal benodigden: ' + num + ' personen"><span>' + num + '</span></div>';
		  var requirement = '<div class="requirement" style="' + style + '" ' + 'title="Minimum aantal benodigden: ' + num + ' personen"></div>';
		  num = slot.wish + slot.diff;
		  var xcurrent = num;
		  
		  // a percentage, with a lower bound on 20%
		  height = Math.round(num / maxNum * 80 + 20);
		  
		  if (xcurrent < xwish)
		  {
		    var color = '#a93232';
		    //var span = '';
		  }
		  else if (xcurrent == xwish)
		  {
		    var color = '#e0c100';
		    //var span = '';
		  }
		  else if (xcurrent > xwish)
		  {
		  	var color = (num < 0 || num > 7) ? density[0] : density[num];
		    //var span = '<span class="badge badge-inverse">' + num + '</span>';
		  }
		  if (xcurrent > xwish)
		  {
		    height = minHeight;
		  }
		  style = 'height:' + height + 'px;' + 'background-color: ' + color + ';';
		  var actual = '<div class="bar" style="' + style + '" ' + ' title="Huidig aantal beschikbaar: ' + num + ' personen"></div>';
		  //var actual = '<div class="bar" style="' + style + '" ' + ' title="Huidig aantal beschikbaar: ' + num + ' personen">' + span + '</div>';
		  
		  timedata.push({
		    group: gname,
		    start: Math.round(slot.start * 1000),
		    end: Math.round(slot.end * 1000),
		    content: requirement + actual,
		    className: 'group-aggs',
				editable: false
		  });     
		})
		
		
		// render users
		var members = window.app.members;
		
		$.each(members, function(index, member)
		{
		
			var slots = window.app.slots[member.uuid]['default'];
			
			$.each(slots, function(index, slot)
			{
			     
				timedata.push({
					start: new Date(0),
					end: new Date(0),
					group: '<span style="display:none;">' + member.uuid + ':true:false</span>' + member.name + ' <div style="display:none;">b</div>(W)',
					content: 'available'
				})	
		    
				timedata.push({
					start: new Date(0),
					end: new Date(0),
					group: '<span style="display:none;">' + member.uuid + ':false:false</span>' + member.name + ' <div style="display:none;">a</div>(P)',
					content: 'available'
				})	
		    
		    for (var i in slots)
		    {
		      var content = colorState(slots[i].text);
		      
		      if (slots[i].recursive) {
			      var group = '<span style="display:none;">' + member.uuid + ':true:false</span>' + member.name + ' <div style="display:none;">b</div>(W)';
		      } else {
		      	var group = '<span style="display:none;">' + member.uuid + ':false:false</span>' + member.name + ' <div style="display:none;">a</div>(P)';
		      }
		    
					timedata.push({
						start: new Date(slots[i].start * 1000),
						end: new Date(slots[i].end * 1000),
						group: group,
						content: content
					})	
		      
		    }
			
			})
			
		})
		
		
		// render timeline
		var trange = webpaige.config('trange');
		
	  var options = {
	    'axisOnTop': true,
	    'width': '100%',
	    'height': 'auto',
	    'selectable': true,
	    'editable': true,
	    'style': 'box',
	    'groupsWidth': '150px',
	    'eventMarginAxis': 0,
      
      'min': new Date(trange.start), // lower limit of visible range
      'max': new Date(trange.end), // upper limit of visible range
      
	    'intervalMin': 1000 * 60 * 60 * 1,
	    'intervalMax': 1000 * 60 * 60 * 24 * 7 * 2
	  };
	  timeline = new links.Timeline(document.getElementById('mytimeline'));
	  timeline.draw(timedata, options);  
}