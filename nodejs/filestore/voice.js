voice = function(server) {
	var socket = io(server);
	playStream = function(stream) {
		var audio = $('<audio autoplay />').appendTo('body');
        audio[0].src = (URL || webkitURL || mozURL).createObjectURL(stream);
	}
	gotStream = function(stream) {
	
	}
	peers = {};
	connectPeer = function(stream, peer, isCaller) {
		pc = new RTCPeerConnection(peer);
		pc.onaddstream = function (evt) {
	        playStream(evt.stream);
	    };
	    if (isCaller) {
	    	pc.createOffer(description);
	    } else {
	    	pc.createAnswer(pc.remoteDescription, description);
	    }
	    function description(desc) {
            pc.setLocalDescription(desc);
            socket.emit("sdp", desc);
        }
	}
	socket.on("sdp", function(data) {
		var remoteDescription = new RTCSessionDescription(data.sdp);
		peers[data.id].setRemoteDescription(remoteDescription);
	});
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	navigator.getUserMedia({audio:true}, gotStream, function(error) {
		console.log("Error: " + error);
	});
}
