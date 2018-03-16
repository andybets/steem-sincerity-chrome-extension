// this is the code which will be added to the steemit.com page

// generic function used for getting JSON data from Sincerity API
function loadJSON(url, callback) {   
	var xobj = new XMLHttpRequest();
	    xobj.overrideMimeType("application/json");
	xobj.open('GET', url, true);
	xobj.onreadystatechange = function () {
	      if (xobj.readyState == 4 && xobj.status == "200") {
	        callback(xobj.responseText);
	      }
	};
	xobj.send(null);  
}

(function() {
	console.log('Running Steem Sincerity...');
	comment_elements = document.getElementsByClassName("Comment");
	var comment_authors = [];
	for (var ci = 0; ci < comment_elements.length; ci++) {
		comment_id = comment_elements[ci].id
		author = comment_id.substring(2, comment_id.indexOf('/'))
		comment_authors.push(author);
	}

	for (var r = 0; r < comment_authors.length; r+=100) {
		comment_authors_string = comment_authors.slice(r, r+100).join()
		loadJSON('https://multi.tube/s/api/get-info/' + comment_authors_string, function(response) { 
	
			// change rendering of matching spam comments
			var classification_score_data = JSON.parse(response);
			for (var ci = 0; ci < comment_elements.length; ci++) {
				if (comment_authors[ci] in classification_score_data) {
					human_score = classification_score_data[comment_authors[ci]].classification_human_score;
					spammer_score = classification_score_data[comment_authors[ci]].classification_spammer_score;
					if (spammer_score > human_score) {
						comment_elements[ci].style.opacity=0.3; // make comment and children semi-transparent
//						comment_elements[ci].style.display="none"; // fully remove comment, and children
					}
				}
			}

			// add simple hover tooltip to provide extra info about comment author accounts
			author_links = document.getElementsByClassName('ptc')
			for (var ali = 0; ali < author_links.length; ali++) {
				author = author_links[ali].href.substring(author_links[ali].href.indexOf('@')+1);
				if (author in classification_score_data) {
					spammer_score = classification_score_data[author].classification_spammer_score;
					comment_count = classification_score_data[author].comment_count;
					comment_average_image_count = classification_score_data[author].comment_average_image_count;
					comment_average_word_count = classification_score_data[author].comment_average_word_count;
					comment_random_sample = classification_score_data[author].comment_random_sample;
					post_count = classification_score_data[author].post_count;
					post_average_word_count = classification_score_data[author].post_average_word_count;

					info_text = 'Spam Score: ' + (spammer_score*100).toFixed(0) + '%\n\n'
					if (post_count > 0) {
						info_text += 'Post Count: ' + post_count + '\n'
						info_text += 'Post Avg. Word Count: ' + post_average_word_count.toFixed(0) + '\n\n'
					}
					if (comment_count > 0) {
						info_text += 'Comment Count: ' + comment_count + '\n'
						info_text += 'Comment Avg. Word Count: ' + comment_average_word_count.toFixed(1) + '\n'
						info_text += 'Comment Avg. Image Count: ' + comment_average_image_count.toFixed(2) + '\n\n'
						info_text += 'Comment Sample...\n' + comment_random_sample + '\n'
					}
					author_links[ali].setAttribute('title', info_text);
				}
			}
		})
	}

})();
