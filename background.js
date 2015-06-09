setInterval(function(){
	isLoggined = 0;
	chrome.cookies.getAll({"domain":".facebook.com"}, function(cookies){
		for (var i in cookies) {
			if(cookies[i].name == 'c_user')
			{	
				isLoggined = 1;
				//console.log(typeof(localStorage['c_user']));
				//console.log(typeof(cookies[i].value));
				var a = localStorage['c_user'];//.toString();
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
							$html = $(data);
							$div_element = $html[34];
							$link_element = $div_element.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[2].childNodes[0];
							localStorage['fbRssUrl'] = 'http://www.facebook.com/feeds/' + $link_element.href.split('/')[4];
							localStorage['c_user'] = cookies[i].value;
							var y = data.indexOf('rss');
							localStorage['fbRssUrl'] = 'http://www.facebook.com' + data.substring(y-107, y+5).replace(/&amp;/g, '&');
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
		if(localStorage['seenNotifs'] == undefined)
			localStorage['seenNotifs'] = [];
		if(localStorage['notifs'] == undefined)
			localStorage['notifs'] = [];
		if(localStorage['fbRssUrl'] != undefined)
		{
	  		$.get(localStorage['fbRssUrl'], function(data) {
	  			localStorage['tempNotifs'] = [];
	  			var tempNotifs = [];
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
	        		tempNotifs[count++] = item;
	        	//	if(localStorage['seenNotifs'].indexOf(item.guid) != -1)
	        	//		item.seen = 1;
	        	//	localStorage['tempNotifs'] += item;
			        //document.getElementById('notifications-div').innerHTML += postTemplate(item);
			        //Do something with item here...
	    		});
	    		localStorage['tempNotifs'] = JSON.stringify(tempNotifs);
	    		//for (var i = localStorage['tempNotifs'].length - 1; i >= 0; i--) {
	    		//	console.log(localStorage['tempNotifs'][i]);
	    		//};
	    		console.log(localStorage['notifs'].length);
	    		localStorage['notifs'] = localStorage['tempNotifs'];
	    		console.log(localStorage['tempNotifs'].length);
			//    console.log(localStorage['notifs']);
			});

  		}
	});
}, 5000);
