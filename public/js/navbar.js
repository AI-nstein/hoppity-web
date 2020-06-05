function myFunction() {
	var x = document.getElementById("myTopnav");
	if (x.className === "navbar navbar-light bg-light sticky-to"){
		x.className += " responsive";
	}else{
		x.className = "navbar navbar-light bg-light sticky-to";
	}
} 
