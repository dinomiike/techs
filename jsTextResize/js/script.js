document.getElementById("chatbox").focus();

var txtHeight = document.getElementById("chatbox").scrollHeight;
var offsetHeight = document.getElementById("chatbox").offsetHeight;
document.getElementById("sizelabel").value = txtHeight;
document.getElementById("offsetlabel").value = offsetHeight;

function checkHeight(box) {
	var cBox = box.scrollHeight;
	var oBox = box.offsetHeight;
	document.getElementById("sizelabel").value = cBox;
	document.getElementById("offsetlabel").value = oBox;
	if ((cBox > oBox) || (cBox > oBox) && (window.event.keyCode == 13)) {
		box.style.height = (cBox + 5)+"px";
	}
}
