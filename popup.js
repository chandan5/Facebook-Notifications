function postTemplate(item)
{
 /* item = {
                  title: $this.find("title").text(),
                  description: $this.find("description").text(),
                  pubDate: $this.find("pubDate").text(),
                  author: $this.find("author").text()
            }*/
  s = '<div class="post';
  if(item.seen == 1)
  	s += ' seen ';
  s += '" id='+ item.guid +'><a class="item_link" target="_blank" href=' + item.link + '>';
  s += '<p class="title" >' + item.title + '</p>';
  s += '</a></div>';
  return s;
}

var test;

$(document).ready(function(){
	console.log("hi");
	console.log(localStorage['fbRssUrl']);
	console.log("bye");
	var notifs = JSON.parse(localStorage['notifs']);
	if(localStorage['notifs'] != undefined)
	{
		console.log(notifs.length);
		for (i=0; i < notifs.length ; i++)
		{
			document.getElementById('notifications-div').innerHTML += postTemplate(notifs[i]);
		}
	}
  	//$('.post').click();
});