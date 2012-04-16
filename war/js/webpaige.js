///////////////////
var global_data = new Array();
var global_callback = new Array();

function global_init() {
    global_data['user'] = '';
    global_data['sessionID'] = '';
    global_data['selectedPage'] = 0;

    var cookies = document.cookie.split(';');
    //console.log("init",cookies);
    for (var i in cookies) {
        var pair = cookies[i].split("=");
        if (pair.length != 2) continue;
        pair[0] = pair[0].replace(/^\s+|\s+$/g, '');    //trim
        pair[1] = pair[1].replace(/^\s+|\s+$/g, '');    //trim
        switch (pair[0]) {
            case 'webpaige_X-SESSION_ID': global_update('sessionID', pair[1]); break;
            case 'webpaige_user': global_update('user', pair[1]); break;
        }
    }

    if (global_data['sessionID'] != '')
        console.log("test if session is valid?");
}

function global_register(key, callback) {
    if (!global_callback[key]) global_callback[key] = Array();
    global_callback[key].push(callback);
}
function global_update(key, value) {
    global_data[key] = value;
    console.log("update: ", key, ' = ', value);

    //persist some
    switch(key)
    {
        case 'sessionID':
            document.cookie = 'webpaige_X-SESSION_ID' + "=" + value;
        break;
        case 'user':
            document.cookie = 'webpaige_user' + "=" + value;
        break;
    }

    //run key callbacks
    if (global_callback[key])
        for (var i in global_callback[key])
            global_callback[key][i](value);
}

function global_get(key)
{
    return global_data[key];    //may return 'undefined'
}


//////////////////////////////////////////////////////


function modal_in(htmlString) {
    if( !htmlString )return;

    //darken screen
    var div1 = document.createElement('div');
    div1.setAttribute('id', 'modal_darken_div');
    div1.style.position = 'absolute';
    div1.style.left = '0px';
    div1.style.top = window.pageYOffset + 'px';
    div1.style.width = '100%';
    div1.style.height = '100%';
    div1.style.opacity = '0.5';
    div1.style.backgroundColor = '#373736';
    div1.innerHTML = '';
    document.body.appendChild(div1);

    //add dialog
    var div2 = document.createElement('div');
    div2.setAttribute('id', 'modal_content_div');
    div2.style.position = 'absolute';
    div2.style.left = '0px';
    div2.style.top = window.pageYOffset+'px';
    div2.style.width = '100%';
    div2.style.height = '100%';
    div2.innerHTML =
        '<table border=1 style="width:100%; height:100%" ><tr valign="middle"><td align="center" >' +
        htmlString +
        '</td><tr></table>';
    document.body.appendChild(div2);

    //disable scrolling
    document.body.style.overflow = 'hidden';

    return div2;
}
function modal_out() {
    document.body.removeChild(document.getElementById('modal_content_div'));
    document.body.removeChild( document.getElementById('modal_darken_div') );
    document.body.style.overflow = '';
}
