#pragma strict
import UnityEngine.UI;

// marca la puntuacio en funcio de la biomassa que anem adquirint
// compta el temps que estem en cada nivell



static var instance : Puntuacio;

private var txtObjectiuNivell: String;


// variables de puntuacio
private var biomassa : float = 0.0;
private var biomassaTempsOk : int = 0;				// <--- ojo, falta posar simtime, float
private var bioObjN1 : int;
private var bioObjN2 : int;
private var bioObjN3 : int;
private var bioObjN4 : int;
private var bioObjNivellActual : int;
private var bioObjNivellAnterior : int;
private var bioObjN1Temps : int;
private var bioObjN2Temps : int;
private var bioObjN3Temps : int;
private var bioObjN4Temps : int;
//private var produccio = 0;				// <-- treure??
//private	var productivitat : float;			// <-- treure??
static var biomassaUltim = 0.0;			// <-- treure??


//private var framesPintarGraf = 10; // cada quants frames fa log d'estadistiques

private	var txtBiomassa : UI.Text;		// puntuacio



private var inicialitzat : boolean;

function Awake() {
	instance = this;
	inicialitzat = false;

}

//function Start () {
//}

function StartNivell(){
	
	
	var hud = GameObject.Find("/Display");
	biblio.Assert(hud!=null, "No he trobat display en Puntuacio.Start");

	var p = GameObject.Find("/Display/HUDMessages/txtBiomassa");
	biblio.Assert(p!=null, "No he trobat p en Puntuacio.Start");
	txtBiomassa = GameObject.Find("/Display/HUDMessages/txtBiomassa").GetComponent(UI.Text);
	biblio.Assert(txtBiomassa!=null, "No he trobat txtBiomassa en Puntuacio.Start");
	txtBiomassa.gameObject.SetActive(false);
	
	
	
	// puntuacio
	bioObjN1 = Biocenosi.instance.biomassaObjectiu;
	bioObjN2 = bioObjN1 * 10;	
	bioObjN3 = bioObjN2 * 10;	
	bioObjN4 = bioObjN3 * 10;	
	bioObjN1Temps = 0;
	bioObjN2Temps = 0;
	bioObjN3Temps = 0;
	bioObjN4Temps = 0;
	bioObjNivellActual = 0;

	inicialitzat = true;
	txtBiomassa.gameObject.SetActive(true);
	Debug.Log("Puntuacio.StartNivell");
}





function Update () {

	if (SimTime.instance.simIsPaused || !inicialitzat || Time.frameCount%50 != 0)
		return;
		
	//Debug.Log("..... AQUI ESTOY");

	// estat puntuacio
	
	//biomassa = 1.0*biocenosi.biomassaNT[1];
	biomassa = Biocenosi.instance.biomassaNT[1];
	
	// test nivell 1
	
	if (biomassa > bioObjN1) {		
		bioObjNivellActual = 1;
		bioObjN1Temps++;
		biomassaTempsOk = bioObjN1Temps;
	}
	else {
		bioObjN1Temps = 0;
		biomassaTempsOk = 0;
		bioObjNivellActual = 0;
	}

	// test nivell 2
	
	if (biomassa > bioObjN2) {		
		bioObjNivellActual = 2;
		bioObjN2Temps++;
		biomassaTempsOk = bioObjN2Temps;
	}
	else {
		bioObjN2Temps = 0;
	}
	
	// test nivell 3
	
	if (biomassa > bioObjN3) {		
		bioObjNivellActual = 3;
		bioObjN3Temps++;
		biomassaTempsOk = bioObjN3Temps;
	}
	else {
		bioObjN3Temps = 0;
	}
	
	// test nivell 4
	
	if (biomassa > bioObjN4) {		
		bioObjNivellActual = 2;
		bioObjN4Temps++;
		biomassaTempsOk = bioObjN4Temps;
	}
	else {
		bioObjN4Temps = 0;
	}
	
	
		// panell puntuacio
		
	//produccio = biomassa-biomassaUltim;
	//productivitat = 100.0*produccio/biomassa;
	biomassaUltim = biomassa;
	
	if (bioObjNivellActual > 0) 
		var txtbio = "  (N"+(bioObjNivellActual).ToString("n0") + " t:"+ biomassaTempsOk +")";
	else
		txtbio = "(N0)";
			
	txtBiomassa.text = (biomassa/1000).ToString("n0")+" T" + "   "+txtbio;

	
	//	tt+= "Objectiu biomassa: "+Biocenosi.instance.biomassaObjectiu.ToString("n0")+" T";
	//	txtRolloEstadistiques.text = tt;

	// si ha canviat actualitzem el grafic
	if (bioObjNivellAnterior != bioObjNivellActual) {
		switch(bioObjNivellActual) {
		case 4: GraficBiomassa.instance.CanviNivell(bioObjN4*10); break;
		case 3: GraficBiomassa.instance.CanviNivell(bioObjN4); break;
		case 2: GraficBiomassa.instance.CanviNivell(bioObjN3); break;
		case 1: GraficBiomassa.instance.CanviNivell(bioObjN2); break;
		default: GraficBiomassa.instance.CanviNivell(bioObjN1);
	}
	}
	

	bioObjNivellAnterior = bioObjNivellActual;
	
}