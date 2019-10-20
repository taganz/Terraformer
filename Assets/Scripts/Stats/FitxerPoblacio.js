#pragma strict


/*
 * Fitxer poblacio
 *
 *	Escriu linia cada Update()
 *
 */

import System.IO;
static var instance : FitxerPoblacio;
var nomFitxer = "Populat";
private var sufixFitxer = ".csv";
//var framesPintarEstadistiques = 5; // cada quants frames fa log d'estadistiques
var writeInterval = 1; 	// writes a line every x SimTime units
var generaFitxer = true;

private var writeLastSimTime : float = 0;
private var sw: StreamWriter;
private var init : boolean;

private var txt = "";

private var controller : GameController;

function Awake () {
	init = false;
	if (instance==null) {
		instance = this;
	}
}

function Start () {

	controller = GameController.instance;
}

function StartNivell(txt:String) {

	if (!generaFitxer)
		return;
		
	#if UNITY_WEBPLAYER
		Debug.LogWarning("FitxerPoblacio: not available on UNITY_WEBPLAYER");

	#else
	
		
		// per si un cas encara esta obert
		TancaFitxer();
		
		// crea nom del nou
		nomFitxer = nomFitxer + "_"+txt+"_"+System.DateTime.Now.ToString("yyyy-MM-dd HH-mm-ss");
		Debug.Log("FitxerPoblacio. Nom fitxer estadistiques : "+nomFitxer);
		fitxerPosaCapcalera();

		init = true;
	#endif
}

#if UNITY_WEBPLAYER
#else

	function Update () {
	
		//if (init && Time.frameCount%framesPintarEstadistiques == 0 && !SimTime.instance.simIsPaused){ 
		if (init && !SimTime.instance.simIsPaused && Mathf.Floor(SimTime.simTime)> writeLastSimTime) { 
				FormatejaEstadistiques();
				EscriuFitxer(txt);
				writeLastSimTime = Mathf.Floor(SimTime.simTime);
				//Debug.Log("fitxerPoblacio write line "+writeLastSimTime + " " + SimTime.simTime);
		}
	}

	private function FormatejaEstadistiques() {
				
			// A - TEMPS
			txt = ""+SimTime.simTime.ToString("F1");

			var	biomassaTotal : int;
			biomassaTotal = Biocenosi.instance.biomassaNT[0]+Biocenosi.instance.biomassaNT[1]+Biocenosi.instance.biomassaNT[2]+Biocenosi.instance.biomassaNT[3];

			// B- BIOMASSA TOTAL
			//txt += ", " +biomassaTotal.ToString("F1");
			txt += ", " +biomassaTotal;
			
			// C, D, E, F - BIOMASSA PER NT
			for (var i=0; i<4; i++) {
				//txt += ", " +Biocenosi.instance.biomassaNT[i].ToString("F1") ; 
				var bioInt : int = Biocenosi.instance.biomassaNT[i]; 
				txt += ", " +bioInt; 
			}
	
			// G, H, I, J - POBLACIONS PER NT
			for (i=0; i<4; i++) {
				txt += ", "+Biocenosi.instance.viusNTrofic[i]; 
			}
			
			// K.. - POBLACIONS PER GENERE DE LABORATORI
			for (var j=0; j<Biocenosi.instance.speciesMax;j++) {
				txt += ", "+ Biocenosi.instance.viusEspecie[j];
			}
	}
	 
	 
	private function fitxerPosaCapcalera() {
		// capçalera fitxers
		
			var heading : String;
			
			heading  = "Time,Biomass Total, Bio Plants, Bio Herb, Bio Pred1, Bio Pred2, ";

			heading += "Pop Plants, Pop Herb, Pop Pred1, Pop Pred2,";
			
			for (var j=0; j<Biocenosi.instance.speciesMax;j++) {
				heading += Biocenosi.instance.species[j].dna.nomPantalla+ ", ";
			}		

			EscriuFitxer(heading);
	}

	private function EscriuFitxer (appendString: String) {

		// si encara no esta obert, l'obra
		if (!init) {
			nomFitxer = nomFitxer + ".csv";			// hi afegeixen sufixes des de gui
			var nf = Application.dataPath + "/" +nomFitxer;
			sw = new StreamWriter (nf);					// falta directori <---
			if (sw == null)
				Debug.LogError("*** ERROR *** Error obrint fitxer " + nf);
			else {
				init = true;
				Debug.Log("Obert fitxer "+nf);
			}
		}
		
		sw.WriteLine (appendString);
		//Debug.Log("Escribint a fitxer: "+appendString);
		if (Time.frameCount%100==0)
			sw.Flush();

	}

#endif

/*
// no passa mai per aqui?
function OnApplicationQuit() {
	Debug.Log("FitxerPoblacio.OnApplicationQuit. Tanco fitxer: "+nomFitxer);
	TancaFitxer();
}

function OnLevelWasLoaded() {
	Debug.Log("FitxerPoblacio.OnLevelWasLoaded. Tanco fitxer: "+nomFitxer);
	TancaFitxer();
}
*/

// el tanco des de controller

function TancaFitxer() {
	#if UNITY_WEBPLAYER
		
	#else
		if (init && sw!= null) {
			sw.Flush();
			sw.Close();
			Debug.Log("Tancant fitxer: "+nomFitxer);
		}
		
		init = false;
	#endif
}