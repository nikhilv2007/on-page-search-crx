//console.log("DOM loaded");

var selectedText = '';

//event listeners
document.addEventListener('mouseup',checkSelectionChanged);

function checkSelectionChanged() {
  var nowSelected;
  if(window.getSelection){ 
        nowSelected = htmlencode(window.getSelection().toString());
    	//console.log("now ->"+nowSelected);
    } 
    if(nowSelected != '' && nowSelected != selectedText) {
    	//console.log(nowSelected);
      	//console.log(this);       
      	selectedText = nowSelected;
      	//if popup already exists, close it
      	if(document.getElementById('bubbleSearch-floatDiv')){
      		removePopup();
      	}
      	
      	var createDiv = document.createElement('div');
		createDiv.setAttribute('id','bubbleSearch-floatDiv');
		createDiv.setAttribute('style',"z-index:199999999999; border:2px outset black; border-radius:5px; padding:10px; display: block; right:0; position:fixed; background-color:white; width:25%; height:75%; box-shadow: 0 2px 5px 0; overflow:auto;");
						
		document.body.insertBefore(createDiv, document.body.childNodes[0]);
		//document.body.parentNode.appendChild(createDiv);

        var statusMessage = document.createElement('div');
        statusMessage.setAttribute('id','bubbleSearch-statusMessage');
        statusMessage.innerText = "Loading for " +nowSelected +" ..";
        document.getElementById('bubbleSearch-floatDiv').appendChild(statusMessage);
        
		var closeButton = document.createElement('button');
		closeButton.setAttribute('id','closeElem');
		closeButton.innerHTML = 'x';
		closeButton.setAttribute('style',"position:absolute; right:5px; cursor: pointer; top:5px; border:0px; padding:0px 2px; border-radius:100%; color:white; background-color:black");
		document.getElementById('bubbleSearch-floatDiv').appendChild(closeButton);
		document.getElementById('closeElem').addEventListener('click', removePopup);
		
		//callVideoApi(nowSelected);          // Deprecated API
		
		callDuckDuckGoApi(nowSelected);
    }
}

function htmlencode(str) {
    return str.replace(/[&<>"']/g, function($0) {
        return "&" + {"&":"amp", "<":"lt", ">":"gt", '"':"quot", "'":"#39"}[$0] + ";";
    });
}

function removePopup(){
	//console.log("inside remove popup");
	var elem = document.getElementById('bubbleSearch-floatDiv');
    elem.parentNode.removeChild(elem);
}

function callTranslateApi(text){
	//ajax call to fetch english text
		jQuery.ajax({
			
			url: 'http://mymemory.translated.net/api/get?',
		    dataType: 'json',
		    type: "GET",
		    accepts: "application/json", 
			data : "q=" + text + "&langpair=" + sourceLanguage + "|en",
		    beforeSend: function(x){
		    	x.setRequestHeader("Content-Type","application/json");
		    	//console.log("Selected text is - " + text.selectionText + "\n Language code - "+sourceLanguage);
		    },
		    success: function(data, textStatus, jqXHR) {
	            // Calls Success. If data found on the service then it would be inside "DATA" variable
		    	//console.log("translated text :"+ data["responseData"]["translatedText"]);
		    	alert(data["responseData"]["translatedText"]);
		    },
		    error: function(xhr,error,code) {
	            // SOMETHING WRONG WITH YOUR CALL.
				alert("translation service failed"); 
			},
		    complete: function() {
		    	//alert("Process Completed.");
		    }
		});
}

function callVideoApi(text){
	//ajax call to fetch english text
		jQuery.ajax({
			
			url: 'https://gdata.youtube.com/feeds/api/videos?',
		    dataType: 'json',
		    type: "GET",
		    accepts: "application/json", 
			data : "q=" + encodeURI(text) + "&max-results=4&v=2&alt=jsonc",
		    success: function(data, textStatus, jqXHR) {
	            // Calls Success. If data found on the service then it would be inside "DATA" variable
		    	console.log(data);
		    	//console.log("videos retrieved = " +data.data.totalItems);
		    	
		    	if(data.data.hasOwnProperty('items')){
		    		var videoElement = document.createElement('embed');
			    	videoElement.setAttribute('src', "https://www.youtube.com/v/" +data.data.items[0].id);
			    	document.getElementById('bubbleSearch-floatDiv').appendChild(videoElement);
		    	}		    	
		    },
		    error: function(xhr,error,code) {
	            // SOMETHING WRONG WITH YOUR CALL.
				console.log("video api service failed"); 
			}
		});
}

function callDuckDuckGoApi(text){
	//ajax call to fetch english text
		jQuery.ajax({
			
			url: 'https://api.duckduckgo.com/?',
		    dataType: 'json',
		    type: "GET",
		    accepts: "application/json", 
			data : "q=" + encodeURI(text) + "&format=json&pretty=1&no_html=1&no_redirect=1&skip_disambig=1",
		    success: function(data, textStatus, jqXHR) {
	            // Calls Success. If data found on the service then it would be inside "DATA" variable
		    	console.log(data);
		    	
                document.getElementById('bubbleSearch-statusMessage').innerText = "";
                
		    	var duck2go = document.createElement('div');
				duck2go.setAttribute('id','duckDuckGo');
				duck2go.innerHTML = "Powered by DuckDuckGo";
				document.getElementById('bubbleSearch-floatDiv').appendChild(duck2go);
						    			    	
		    	if(data.hasOwnProperty('AbstractText') && data.AbstractText != ''){
		    		var abstractText = document.createElement('div');
		    		if (data.AbstractText) {
		    			abstractText.innerHTML = data.AbstractText;
		    		};
		    		if (data.AbstractURL) {
		    			abstractText.innerHTML += "<a href=" +data.AbstractURL+ ">" +data.AbstractSource+ " >></a>";
		    		};
			    	document.getElementById('duckDuckGo').appendChild(abstractText);
		    	}
                else{
                    var elem = document.getElementById('duckDuckGo');
                    elem.parentNode.removeChild(elem);
                    document.getElementById('bubbleSearch-statusMessage').innerText = "No results"
                }
		    			    		    	
		    },
		    error: function(xhr,error,code) {
	            // SOMETHING WRONG WITH YOUR CALL.
				console.log("duckduckgo api service failed"); 
			}
		});
}
