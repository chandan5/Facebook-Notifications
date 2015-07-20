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
  
  
  chrome.storage.local.get("notifs",  function (result) {
    notifs = result.notifs;
		console.log(notifs.length);
		for (i=0; i < notifs.length ; i++)
		{
			document.getElementById('notifications-div').innerHTML += postTemplate(notifs[i]);
		}
    $('.post').click(function() {
      console.log("deb123");
      var guidOfClickedNotif = $(this).attr('id');
      //alert(guidOfClickedNotif);
      seenNotifsGuids = JSON.parse(localStorage['seenNotifsGuids']);
    //test = seenNotifsGuids;
      seenNotifsGuids.push(guidOfClickedNotif);
      localStorage['seenNotifsGuids'] = JSON.stringify(seenNotifsGuids);
      console.log(localStorage['seenNotifsGuids']);
    //
    });
  });

  //$('.post').click(function() {
  //  console.log("deb123");
  //  var guidOfClickedNotif = $(this).attr('id');
  //  alert(guidOfClickedNotif);
    /*
    chrome.storage.local.get("seenNotifsGuids",  function (result) {
      seenNotifsGuids = result.seenNotifsGuids;
      seenNotifsGuids.push(guidOfClickedNotif);
      alert(seenNotifsGuids);
      chrome.storage.local.set({"seenNotifsGuids": seenNotifsGuids});
    });
*/
    //alert(guidOfClickedNotif);
    //seenNotifsGuids = JSON.parse(localStorage['seenNotifsGuids']);
    //test = seenNotifsGuids;
    //seenNotifsGuids.push(guidOfClickedNotif);
    //localStorage['seenNotifsGuids'] = JSON.stringify(seenNotifsGuids);
    //alert(toString(seenNotifsGuids));
    //alert(localStorage['seenNotifsGuids']);
  //});
});