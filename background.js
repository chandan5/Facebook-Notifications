var test;
setInterval(function(){
	isLoggined = 0;
	chrome.cookies.getAll({"domain":".facebook.com"}, function(cookies){
		for (var i in cookies) {
			if(cookies[i].name == 'c_user')
			{	
				isLoggined = 1;
				//console.log(typeof(localStorage['c_user']));
				//console.log(typeof(cookies[i].value));
				var a = localStorage['c_user'];
				var b = cookies[i].value.toString();
				console.log(localStorage['fbRssUrl']);
				if((a == b) && (localStorage['fbRssUrl'] != "undefined"))
				{
				//	console.log("need not fetch rss url");
					break;
				}
				else
				{
				//	console.log("fetching rss url");
					$.ajax({
						url : 'http://www.facebook.com/notifications',
						success : function(data, textStatus, xmLHttpRequest){ //data contains notifications page
							localStorage['c_user'] = cookies[i].value;
							var y = data.indexOf('rss20');
							var z = data.lastIndexOf('href="/feeds/notifications.php',y);
							if(y != -1 && z != -1)
							console.log(data.substring(z+6,y+5));
							localStorage['fbRssUrl'] = 'http://www.facebook.com' + data.substring(z+6,y+5).replace(/&amp;/g, '&');
						},
						error : function(xhr, ajaxOptions, thrownError) {
							console.log(thrownError);
						}
					});
				}
				break;
			}
		}
		if(isLoggined == 0)
		{
			localStorage['fbRssUrl'] = "undefined";
		//	console.log("You are not logged in facebook.")
		//	console.log(localStorage['fbRssUrl']);
		}
		//fetching new notifs
		if(localStorage['fbRssUrl'] != undefined)
		{
	  		$.get(localStorage['fbRssUrl'], function(data) {
	  			var notifs = [];
	    		var $xml = $(data);
	    		var count = 0;
	    		$xml.find("item").each(function() {
	        		var $this = $(this);
	             	var item = {
		            	guid: $this.find("guid").text().split('/')[2],
		                title: $this.find("title").text(),
		                link: $this.find("link").text(),
		                description: $this.find("description").text(),
		                pubDate: $this.find("pubDate").text(),
		                author: $this.find("author").text(),
		                seen: 0,
		                notified : 0
	        		};
	        		notifs[count++] = item;
	    		});
    			if(localStorage['seenNotifsGuids'] == "" || localStorage['seenNotifsGuids'] == undefined)
    				seenNotifsGuids = [];
    			else
    				seenNotifsGuids = JSON.parse(localStorage['seenNotifsGuids']);
				if(localStorage['notifiedNotifsGuids'] == "" || localStorage['notifiedNotifsGuids'] == undefined)
    				notifiedNotifsGuids = [];
    			else
    				notifiedNotifsGuids = JSON.parse(localStorage['notifiedNotifsGuids']);
				console.log("debug");
				console.log(seenNotifsGuids);
				console.log(notifiedNotifsGuids);
				console.log("/debug");
				
	   			for (var k = notifs.length - 1; k >= 0; k--) {
	    			isNotified = 0;
					for (var j = notifiedNotifsGuids.length - 1; j >= 0; j--) {
	    				if(notifs[k].guid == notifiedNotifsGuids[j])
	    				{	
	    					notifs[k].notified = 1
	    					isNotified = 1;
	    					break;
	    				}
	    			};
	    			if(isNotified == 0)
	    			{
						chrome.notifications.create(notifs[k].guid + "^" + notifs[k].link,
						{
							type: 'basic', 
		    				iconUrl: 'images/fbicon.png', 
						    title: "Facebook Notification", 
						    message: notifs[k].title,
						    buttons: [{ title: 'Mark as read' }],
		      				isClickable: true,
						});
						notifiedNotifsGuids.push(notifs[k].guid);	    			
	    			}
	    		}
				
				var isInNotifs = 0;
	    		toBeDeletedSeenNotifsGuids = []; // cause no point in storing notifs->seen of notifs which are not being fetched now 
	    		for (var j = seenNotifsGuids.length - 1; j >= 0; j--) {
	    			isInNotifs = 0;
	    			for (var k = notifs.length - 1; k >= 0; k--) {
	    				if(notifs[k].guid == seenNotifsGuids[j])
	    				{	
	    					notifs[k].seen = 1
	    					isInNotifs = 1;
	    					break;
	    				}
	    			};
	    			if(isInNotifs == 0)
	    			{
						toBeDeletedSeenNotifsGuids.push(seenNotifsGuids[j]);	    			
	    			}
	    		};

	    		console.log("toBeDeletedSeenNotifsGuids:");
	    		console.log(toBeDeletedSeenNotifsGuids);
				console.log("deb1");
	    		
	    		for (var j = toBeDeletedSeenNotifsGuids.length - 1; j >= 0; j--) {
	    			index = seenNotifsGuids.indexOf(toBeDeletedSeenNotifsGuids[j]);
	    			if(index > -1)
	    				seenNotifsGuids.splice(index,1);
	    			index = notifiedNotifsGuids.indexOf(toBeDeletedSeenNotifsGuids[j]);
	    			if(index > -1)
	    				notifiedNotifsGuids.splice(index,1);
	    		};
	    		
				chrome.storage.local.set({"notifs": notifs});
				localStorage['seenNotifsGuids'] = JSON.stringify(seenNotifsGuids);
				localStorage['notifiedNotifsGuids'] = JSON.stringify(notifiedNotifsGuids);
			});
  		}
	});
}, 5000);

function markSeen(guidAndLink)
{
	guid = guidAndLink.split('^')[0];
	link = guidAndLink.slice(guid.length+1, guidAndLink.length);
	if(localStorage['seenNotifsGuids'] == "" || localStorage['seenNotifsGuids'] == undefined)
    	seenNotifsGuids = [];
    else
    	seenNotifsGuids = JSON.parse(localStorage['seenNotifsGuids']);
    seenNotifsGuids.push(guid);
    localStorage['seenNotifsGuids'] = JSON.stringify(seenNotifsGuids);
    return link;
}

chrome.notifications.onClicked.addListener(function openLinkAndMarkSeen(guidAndLink){
	link = markSeen(guidAndLink);
    window.open(link);
    console.log(link);
});

chrome.notifications.onButtonClicked.addListener(function markAsRead(guidAndLink){
	markSeen(guidAndLink);
});