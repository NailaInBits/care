var count = 0;

// Collect incoming tweets from stream
function collectTweets(tag, atts) {
	var arr = Array.prototype.slice.call(arguments).slice(2);
	var tweet = document.createElement(tag);

	Object.keys(atts).forEach(function(att) {
		if(att === 'class') {
			atts[att].split(' ').forEach(function(cls) {
				tweet.classList.add(cls);
			});
			return;
		}
		tweet.setAttribute(att, atts[att]);
	});

	arr.forEach(function(child) {
		if(typeof child === 'string') {
			tweet.appendChild(document.createTextNode(child));
		} else {
			tweet.appendChild(child);
		}
	});
	return tweet;
}

// Format tweets and refresh tweets after every 5th tweet
function updateFeed(msg) {
	count++;
	var twitterFeed = document.getElementById("twitterFeed");
	
	if(count > 5) {
		twitterFeed.removeChild(twitterFeed.childNodes[0]);
	}
	
	var feedDiv =
		collectTweets('feedDiv', {class:'tweet hbox'},
			collectTweets('feedDiv', {class:'image'},
				collectTweets('img', {
					src:msg.message.user.profile_image_url_https,
					width:'48', height:'48'
				})
			),
			collectTweets('feedDiv', {class:'vbox'},
				collectTweets('feedDiv', {class:'hbox'},
					collectTweets('b', {class:'name'}, msg.message.user.name + " "),
					collectTweets('span', {class:'username'},
						' @'+msg.message.user.screen_name + ' '
					),
					collectTweets('b', {class:'time'}, '')
				),
				collectTweets('feedDiv', {class:'text'}, msg.message.text)
			)
		);
	twitterFeed.appendChild(feedDiv);
}

var pubnub = new PubNub({
	subscribeKey:'sub-c-78806dd4-42a6-11e4-aed8-02ee2ddab7fe'
});

pubnub.addListener({  
	message: function(msg) {
		try {
			updateFeed(msg);
		} catch (e) {
			console.log(e);
		}
	} 
});

//Subscribe to the PubNub Twitter Stream
pubnub.subscribe({ 
	channels:['pubnub-twitter']
});