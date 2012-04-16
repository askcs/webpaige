
function homePage_init()
{
    jos_timeline();
}

function jos_timeline() {

    var data = [];
    var timeline;

    data.push({
        'start': new Date(2012, 4, 1),
        //'end': new Date(2012, 2, 1),  // end is optional
        'content': 'fool'
        // Optional: a fourth parameter 'group'
    });
/*
    data = [
          {
              'start': new Date(2010, 7, 23),
              'content': 'Conversation<br><img src="img/comments-icon.png" style="width:32px; height:32px;">'
          },
          {
              'start': new Date(2010, 7, 23, 23, 0, 0),
              'content': 'Mail from boss<br><img src="img/mail-icon.png" style="width:32px; height:32px;">'
          },
          {
              'start': new Date(2010, 7, 24, 16, 0, 0),
              'content': 'Report'
          },
          {
              'start': new Date(2010, 7, 26),
              'end': new Date(2010, 8, 2),
              'content': 'Traject A'
          },
          {
              'start': new Date(2010, 7, 28),
              'content': 'Memo<br><img src="img/notes-edit-icon.png" style="width:48px; height:48px;">'
          },
          {
              'start': new Date(2010, 7, 29),
              'content': 'Phone call<br><img src="img/Hardware-Mobile-Phone-icon.png" style="width:32px; height:32px;">'
          },
          {
              'start': new Date(2010, 7, 31),
              'end': new Date(2010, 8, 3),
              'content': 'Traject B'
          },
          {
              'start': new Date(2010, 8, 4, 12, 0, 0),
              'content': 'Report<br><img src="img/attachment-icon.png" style="width:32px; height:32px;">'
          }
        ];
 */
    // specify options
    var options = {
        'width': '100%',
        'height': '300px',
        'editable': false,   // enable dragging and editing events 
        'style': 'box'
    };

    timeline = new links.Timeline(document.getElementById('mytimeline'));
    //var newStartDate = new Date(document.getElementById('startDate').value);
    //var newEndDate = new Date(document.getElementById('endDate').value);
    //timeline.setVisibleChartRange(newStartDate, newEndDate);     

    // attach an event listener using the links events handler
    function onRangeChanged(properties) {
        console.log(properties);
    }
    links.events.addListener(timeline, 'rangechanged', onRangeChanged);

    timeline.draw(data, options);
}


//////////////////

function ask_login(user, pass) {

    //debugging.. (remove this line)
    if( pass!='1234') pass = MD5(pass);
    
    var host = 'http://localhost:8888/ns_tymon';

    var xhr = $.ajax({ url: host + '/login?uuid=' + user + '&pass=' + pass,
        /*
        //dataType: 'jsonp',
        statusCode: {
            400: function () { alert("Username or password incorrect"); 
            window.location = "login.html"; }
        },
        */
        xhrFields: {
            withCredentials: true
        },
        success: function (jsonData, status, xhr) {
            var data = JSON.parse(jsonData);
            global_update('sessionID', data['X-SESSION_ID'] );
            global_update('user', user );
            /*
            if (r != null) {
                localStorage.setItem("loginCredentials", user + ";" + pass);
            } else {
                localStorage.removeItem("loginCredentials");
            }
            document.location = "/";
            */
        },
        error: function (xhr, status) {
            //console.log(xhr);
            global_update('sessionID', '');
            alert('Invalid login or password');
        },
        /*
        complete: function (xhr, status) {
            var json = JSON.parse(xhr.responseText);
            var sessionId = json["X-SESSION_ID"];
            var session = new ask.session();
            session.setSession(sessionId);
            document.cookie = "sessionId=" + session;
        }
        */
    });
	 

}
