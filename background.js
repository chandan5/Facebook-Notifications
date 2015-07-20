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
					console.log("need not fetch rss url");
					break;
				}
				else
				{
					console.log("fetching rss url");
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
			console.log("You are not logged in facebook.")
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
		                seen: 0
	        		};
	        		notifs[count++] = item;
	    		});
    			if(localStorage['seenNotifsGuids'] == "" || localStorage['seenNotifsGuids'] == undefined)
    				seenNotifsGuids = [];
    			else
    				seenNotifsGuids = JSON.parse(localStorage['seenNotifsGuids']);
				console.log("debug");
				console.log(seenNotifsGuids);
				console.log("/debug");
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
	    				//console.log(notifs[k].guid, seenNotifsGuids[j]);
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
	    		};
	    		
				chrome.storage.local.set({"notifs": notifs});
				localStorage['seenNotifsGuids'] = JSON.stringify(seenNotifsGuids);
			});

  		}
	});
}, 5000);
