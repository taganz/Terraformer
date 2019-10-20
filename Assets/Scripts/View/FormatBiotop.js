#pragma strict

static var instance : FormatBiotop;

function Awake() {
	instance = this;
}


function StringBiotop (): String {
	var txt =
	  "\nPlanet name:   "+Planeta.instance.nomPlaneta
	 +"\nPlanet type:   "+GameController.instance.biotop.comment
	 +"\n\nTemperature"
	 +"\n   average at 0 m   : "+GameController.instance.biotop.tempMitja +" ºC"+ "     "+biblio.Fahrenheit(GameController.instance.biotop.tempMitja)+" ºF"
	 +"\n   actual at 0 m    : "+GameController.instance.biotop.tempActual +" ºC"+ "     "+biblio.Fahrenheit(GameController.instance.biotop.tempActual)+" ºF"
	 +"\n   variation with h : "+Planeta.instance.incTempPerMetre+" º/m"
	 +"\n"
	 +"\nRadiation           : "+GameController.instance.biotop.radiacioMitja.ToString("n0")+ "    (index 0-100)";
	return txt;
}