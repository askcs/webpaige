
    // direct host = 'http://demo.myask.me/resman_ext';
    // direct key  = 'bc29fe76-2b3b-102f-8c63-005056bc7e66';

   var ask_host = 'http://localhost:8888/ns_tymon/rev1';

////////////////////////////////////////////////////////////

function groupsPage_init()
{
    // get contactsGroup ID
    var ask_key = global_get('sessionID');
    var rootNode = global_get('user');
    var resman = ask_host+'/node/'+rootNode+'/node';

    var json = '{ filter":{"name":"contactGroups" } }';
    
    var noCookie = { "X-SESSION_ID": ask_key };
    document.cookie= 'X-SESSION_ID='+ask_key+'; path=/';    //does not work cross domain..
    $.ajax({
        url: resman, 
        type: 'GET',
        data: json, 
        contentType: 'application/json',
        xhrFields: {   withCredentials: true   },
        headers: noCookie,
        statusCode: {
            403: function() {alert("No session?");}
        },
        success: function(jsonData)
        {
            var data = JSON.parse(jsonData);
            if( data.directMembers.length == 1 )
            {
                global_update('contactGroups', data.directMembers[0].uid );
                jos_ding(1);//load treegrid
            }
        }
    });


}


function groups_createGroup(data)
{
    if( !data['groupName'] )
    {   
        console.log("# name not set..");
        return;
    }       
    
    if( !global_get('contactGroups') )
    {   
        console.log("# no root..");
        return;
    }       

/////////////////
    
    //test if name exists?

       
    //ajax
    var resman = ask_host+'/node' ;

    var json = '{ "name": "'+ data['groupName']+'", "description": '+data['description']+' }';
    
    var ask_key = global_get('sessionID');
    var noCookie = { "X-SESSION_ID": ask_key };
    document.cookie= 'X-SESSION_ID='+ask_key+'; path=/';    //does not work cross domain..
    $.ajax({
        url: resman, type: 'POST',
        data: json, contentType: 'application/json',
        xhrFields: {   withCredentials: true   },
        headers: noCookie,
        success: function(jsonData)
        {
            console.log("success!", jsonData );
            var data = JSON.parse(jsonData);
            var new_uid = data.uid;
            
            //attach it to my->'contactGroups'
            node_list[ new_uid ] = { "name" : data['groupName'], "type":"New" };
            ask_link( global_get('contactGroups'), new_uid );
        }
    });

}




//////////////////////////////////////////


var treegrid;
var treegrid2;

function jos_ding(doInit)
{
    //webpaige specifics        
    rootNode = global_get('user');

    // specify options
    var options = {
        'width': '450px',
        'height': '450px',

   };

    // Instantiate our treegrid object.
    var container = document.getElementById('mytreegrid');
    treegrid = new links.TreeGrid(container, options);
    links.events.addListener( treegrid, 'expand', jos_expand );
    links.events.addListener( treegrid, 'select', jos_select );
    links.events.addListener( treegrid, 'unlink', node_unlink );
    links.events.addListener( treegrid, 'edit', node_edit );

    var data = [];
    data = new links.DataTable(data, {'dataTransfer':{'allowedEffect':'move','dropEffect':'move'}} );

    // Draw our treegrid with the created data and options
    treegrid.draw(data);

    treegrid.frame.onDragEnd = function (event) {
        if( event.dataTransfer.dropArea && event.dataTransfer.dropArea.item )
            jos_drop( event.dataTransfer.dropArea.item.data );
        else
            console.log("no drop area?");
        return true;
    }
    links.TreeGrid.Item.prototype.onDrop = function (event) { /*short circuit*/ return true;    }


    //and one more time
    var container2 = document.getElementById('mytreegrid2');
    treegrid2 = new links.TreeGrid(container2, options);
    links.events.addListener( treegrid2, 'expand', jos_expand );
    links.events.addListener( treegrid2, 'select', jos_select );
    links.events.addListener( treegrid2, 'unlink', node_unlink );

    var data2 = [];
    data2 = new links.DataTable(data2, {'dataTransfer':{'allowedEffect':'move','dropEffect':'move'}} );

   // Draw our treegrid with the created data and options
    treegrid2.draw(data2);

    treegrid2.frame.onDragEnd = function (event) {
        if( event.dataTransfer.dropArea && event.dataTransfer.dropArea.item )
            jos_drop( event.dataTransfer.dropArea.item.data );
        else
            console.log("no drop area?");
        return true;
    }

      //populate top level
    if(doInit)
        ask_get(rootNode, defaultFilter );
}


function jos_expand(props)
{
    for(var i in props.items )
    {
if(VERBOSE) console.log("expand",props.items[i][PROP_UID] );
        ask_get( props.items[i][PROP_UID],'' );
    }
}


function jos_select(props)
{
    //remove previous selection
    for( var i in node_list )
    {
        if( node_list[i].selected )node_list[i].selected = 0;
    }

    //set new selection
    for( var i in props.items )
    {
        // console.log('select', props.items[i] );
        node_list[ props.items[i][PROP_UID] ].selected = 1;
    }
    check_integrity( rootNode, treegrid.frame.grid.dataConnector.data ,'left');
    check_integrity( rootNode, treegrid2.frame.grid.dataConnector.data ,'right');
}

function node_unlink(props)
{
    for(var i in props.items )
    {
        ask_unlink( props.items[i][PROP_GID], props.items[i][PROP_UID] );
    }
}

function node_edit(props)
{
    if( props.items.length == 1 )
    {
        modal_editGroup( props.items[0][PROP_UID] );
    }
}


//////////////////////////////////////////////////////////////////////

var rootNode = 0;
var defaultFilter = '';
var PROP_GID = "_gid";
var PROP_UID = "_askid";

var edge_list = new Array();
var node_list = new Array();

var VERBOSE = false;


// array.indexOf?
function edge_list_has(p,c)
{
//  console.log("edge_list_has(",p,c );

    for(var i=edge_list[p].length-1;i>=0;i--)
        if( edge_list[p][i] == c )
            return 1;
    return 0;
}

function edge_list_add(p,c,info)
{
    if( p ==c )return; //too small cycle

    if(VERBOSE)
        console.log("list_add ", p,c );

    if( info )
    {
        if( node_list[c] )
            console.log("overwrite "+c,info);
        node_list[c] = info;
    }

    if( !edge_list_has(p,c) )
    {
//      console.log("edge_list_add(",p,c);
        edge_list[p].push( c );
    }

}

function edge_list_remove(p,c)
{
    if( p == 0 )return;

    for(var i=edge_list[p].length-1;i>=0;i--)
    {
        if( edge_list[p][i] == c )
        {
            edge_list[p].splice( i,1 );
            break;
        }
    }

}

function edge_list_removeAll(p)
{
    edge_list[p] = [];
}

function edge_list_getAll(p)
{
    return edge_list[p]; //need to clone?
}



////////////////////////////////////////////////
//
// compare treegrid with current edge_list
function check_integrity( node, tree ,token )
{
    var parentID = rootNode;
    if( node[PROP_UID] )
        parentID = node[PROP_UID];

    if(VERBOSE)
        if(parentID==rootNode)     console.log("check_integrity",parentID, tree );

    // test if treegrid is missing children
    var missingList = new Array();
    var children = edge_list_getAll( parentID );
    for(var i in children )
    {
        var found = 0;
        for( var j in tree )
        {
            if( tree[j][PROP_UID] == children[i] ){found++;break;}
        }
        if(!found)
            missingList.push( children[i] );
    }

 
    for(var i=missingList.length-1;i>=0;i--)
    {
if(VERBOSE)     console.log(token,'add link ',parentID,'->', missingList,i );
        var item = new Object();
        item[PROP_GID] = ''+parentID;
        item[PROP_UID] = ''+missingList[i];
        item.type = node_list[ missingList[i] ]['type'];
        item.name = node_list[ missingList[i] ]['name'];
        item._childs = new links.DataTable([],{'dataTransfer':{'allowedEffect':'move','dropEffect':'move'}} );

        if( parentID != rootNode )
        {
            if( token == 'left' )
                item._actions = [ {'event': 'edit' } ];
        }
        tree.push( item );
    }

    // test if treegrid has too many children
    for(var i = tree.length-1;i>=0;i--) // for(var i in tree)
    {
        // test if childs are in edeList
        if( !edge_list_has( parentID, tree[i][PROP_UID] ) )
        {
if(VERBOSE)         console.log(token,'remove link:', parentID,'->', tree[i][PROP_UID] );
            tree.splice(i,1 );
        }
    }

    /* test info consistency..
    for(var i = tree.length-1;i>=0;i--) // for(var i in tree)
   {
        if(tree[i].name != node_list[ tree[i][PROP_UID] ].name )
        {
            tree[i].name = node_list[ tree[i][PROP_UID] ].name;
            console.log("changed..", tree[i][PROP_UID] );
        }
    }
*/

    //make it slower
    tree.sort( function(a,b){ if(a.type>b.type)return 1; if(a.type<b.type)return -1; if(a.name > b.name)return 1;if(a.name < b.name)return -1; return 0;}  ); // use a better sort?


    //recurse some
    for( var i in tree )
    {
        if( tree[i][PROP_UID] != parentID && tree[i][PROP_UID] != rootNode ) // avoid cycles?
            check_integrity( tree[i], tree[i]._childs.data, token );
    }


    //update visual part
    if(parentID == rootNode )
    {
        treegrid.frame.grid.update();
        treegrid.frame.grid.repaint();
        treegrid2.frame.grid.update();
        treegrid2.frame.grid.repaint();
    }
}


////////////////////////////////////////////////////////////////

function ask_get(nodeID,nameFilter)
{
    //webpaige specifics
    ask_key = global_get('sessionID');
    console.log("ask_get: ",ask_host,' ',ask_key );

    //ajax
    var resman = ask_host+'/node'

    if( nodeID != 0 )
        resman += '/'+nodeID+'/node';

    var json = '{ "resource":["name","askatar","askatarNetwork","askatarNetworkGroup"] ';
    if( nameFilter!='' )json += ',"filter":{"name":"'+ nameFilter+'" }';
    json += '}';


    var noCookie = { "X-SESSION_ID": ask_key };
    document.cookie= 'X-SESSION_ID='+ask_key+'; path=/';    //does not work cross domain..
    $.ajax({
        url: resman, 
        type: 'GET',
        data: json, 
        contentType: 'application/json',
        xhrFields: {   withCredentials: true   },
        headers: noCookie,
        statusCode: {
            403: function() {alert("No session?");}
        },
        success: function(jsonData)
        {
            // remove all related edges first
            edge_list_removeAll( nodeID );
            
            var members = JSON.parse(jsonData).directMembers;
            for(var i in members )
            {
                var anID = "" +( members[i].id || members[i].uid )+"";
                var name = "" + ( members[i].name || "NIL" ) +"";
                var askatar = "";
//filters..
                if( members[i].askatar !== undefined )askatar += '<img src="img/tymon_pion.png" alt="askatar"/>';
                if( members[i].askatarNetwork !== undefined )askatar += '<img src="img/tymon_bug.png" alt="network"/>';
                if( members[i].askatarNetworkGroup !== undefined )askatar += '<img src="img/tymon_map.png" alt="group"/>';
                if( anID == 'com.ask-cs.node.PaigeUsers' )askatar += '<img src="img/tymon_all.png" alt="root"/>';

                if( askatar == '' )askatar= '?';
//                if( askatar == '' )askatar = '?';
//              if( askatar == '?')continue;

                edge_list_add( nodeID, anID, {'name':members[i].name, 'type': askatar } );
            }
            check_integrity( rootNode, treegrid.frame.grid.dataConnector.data ,'left');
            check_integrity( rootNode, treegrid2.frame.grid.dataConnector.data ,'right');
        }
    });
}


function ask_unlink(nodeID, childID )
{
    console.log("TODO unlink", nodeID, childID );

    //ajax
    var resman = ask_host+'/node/'+nodeID +'/member/' + childID;

    var json = '{ "uid": "'+childID+'" }';

    var noCookie = { "X-SESSION_ID": ask_key };
    document.cookie= 'X-SESSION_ID='+ask_key+'; path=/';    //does not work cross domain..
    $.ajax({
        url: resman, type: 'DELETE',
        data: json, contentType: 'application/json',
      xhrFields: {   withCredentials: true   },
        headers: noCookie,
      success: function(jsonData)
      {
            console.log(jsonData );

            edge_list_remove( nodeID, childID );
            check_integrity( rootNode, treegrid.frame.grid.dataConnector.data ,'left');
            check_integrity( rootNode, treegrid2.frame.grid.dataConnector.data ,'right');
        }
    });

}

function ask_link(nodeID,childID)
{
    if( nodeID == childID )
    {
        console.log("refuse self-linking on", nodeID);
        return;
    }
    if( nodeID == 0 )
    {
        console.log("no virtual node linking",childID );
        return;
    }

    //ajax
    var resman = ask_host+'/node/'+nodeID + '/member' ;

    var json = '{ "uid": "'+childID+'" }';
    
    var noCookie = { "X-SESSION_ID": ask_key };
    document.cookie= 'X-SESSION_ID='+ask_key+'; path=/';    //does not work cross domain..
    $.ajax({
        url: resman, type: 'POST',
        data: json, contentType: 'application/json',
      xhrFields: {   withCredentials: true   },
        headers: noCookie,
      success: function(jsonData)
      {
            console.log(jsonData );

            edge_list_add( nodeID, childID );
            check_integrity( rootNode, treegrid.frame.grid.dataConnector.data ,'left');
            check_integrity( rootNode, treegrid2.frame.grid.dataConnector.data ,'right');
        }
    });

}


