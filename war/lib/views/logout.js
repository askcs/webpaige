$("document").ready(function()
{
	var xhr = $.ajax(
	{
		url: host+'/logout',
		statusCode: {
			400: function(){
			}
		},
		xhrFields: { withCredentials: true },
		success: function(jsonData, status, xhr){
			localStorage.removeItem("loginCredentials");
				document.location = "login.html";
		},
		error: function(xhr, status) {
			console.log('error');
		},
		complete: function(xhr, status) {
		}				
	});
});