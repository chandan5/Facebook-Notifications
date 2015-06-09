chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//	console.log("hi");
//	alert("hi");
 if (request.action == "fetch_rss_url")
   sendResponse({dom: "The dom that you want to get"});
 else
   sendResponse({}); // Send nothing..
});
