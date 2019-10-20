#pragma strict

// Escriu les noves especies en format .dot

import System.IO;
static var instance : FitxerFilogenetic;
var nomFitxer = "afilogenetic";
private var sufixFitxer = "";
private var extensioFitxer = ".dot";
//var framesPintarEstadistiques = 10; // cada quants frames fa log d'estadistiques
var generaFitxer = true;

private var sw: StreamWriter;
private var init : boolean;

private var lastTxt = "";
private var lastTxt2 = "";

private var controller : GameController;

function Awake () {
	init = false;
	instance = this;
}

function Start() {
	controller = GameController.instance;
}

// Format:
//   idPresa, nom, adn, nomEspecie, causa, [idPredador], [nom], [adn]
//	 - idPresa, idPredador: id del genere segons biocenosi
// 	 


function NovaEspecie(evFill: Creature, genomePare: String) {

	// Format
	// LR_0 -> LR_2 [ label = "SS(B)" ];
	
	var txt : String;
	txt  = '"'+genomePare+'"';
	txt += " -> "; 
	txt += '"'+evFill.dna.genome.ToString()+'"';
	txt += " [ label = " +'"'+ evFill.dna.nomPantalla + "- T:" + SimTime.simTime.ToString("F0") +'"' + " ];";
	txt += " // "+evFill.dna.toleranciaTemp.ToString("F2")+ " - " +evFill.dna.tempOptima.ToString("F2");

	// petit control de linies duplicades
	if (txt == lastTxt || txt == lastTxt2) {
		return;
	}
	lastTxt = txt;
	lastTxt2 = lastTxt;
	
	
	//Debug.Log("Nova ESPECIE: "+txt);

	#if UNITY_WEBPLAYER
		AvisaNotAvailable();
	#else
		EscriuFitxer (txt);
	#endif
}


#if UNITY_WEBPLAYER
#else
	private function Open(): boolean {

		nomFitxer = nomFitxer + "_"+System.DateTime.Now.ToString("yyyy-MM-dd HH-mm-ss")+extensioFitxer;
		Debug.Log("FitxerFilogenetic. Nom fitxer estadistiques : "+nomFitxer);
		var nf = Application.dataPath + "/" +nomFitxer;
		sw = new StreamWriter (nf);					// falta directori <---
		if (sw == null) {
			Debug.LogError("*** ERROR *** Error obrint fitxer " + nf);
			generaFitxer = false;
			return false;   
			}
		else {
			init = true;
			Debug.Log("Obert FitxerFilogenetic "+nf);
			return true;
		}
	}

	private function titols():String {
		//return "idGenerePresa, generePresa, adnPresa, nomEspecie, causaMort, idGenerePredador, generePredador, adnPredador";
		var txt = "strict digraph terraformersim_phylogenetic_tree {";
			txt +="\n//This is phylogenetic tree created by Terraformer";
			txt +="\n//terraformersim.wordpress.org";
			txt +="\n//  (online .dot graph viewer at http://graphviz-dev.appspot.com/)";
			txt +="\n";
			txt +="rankdir=LR;";
		return txt;
		
	} 
	
	private function footer(): String {
		return "\n}";
	}

	private function EscriuFitxer (appendString: String) {

		// si l'usuari no vol estadistiques o si hi ha hagut un error obrint el fitxer, tornem
		
		if (!generaFitxer)
			return;
			
		// si encara no esta obert, l'obre
		
		if (!init) {
			Open();
			if (!init)
				return;
			// escriu titols
			sw.WriteLine (titols());
		}
		
		
		sw.WriteLine (appendString);
		//Debug.Log("Escribint a fitxer: "+appendString);
		if (Time.frameCount%100==0)
			sw.Flush();

	}
	
	/*
	private function nomGenere(id:int): String {
		return Biocenosi.instance.species[id].dna.nomGenere;
	}
	*/

#endif


/*
// no passa mai per aqui?
function OnApplicationQuit() {
	Debug.Log("FitxerFilogenetic.OnApplicationQuit. Tanco fitxer: "+nomFitxer);
	TancaFitxer();
}

function OnLevelWasLoaded() {
	Debug.Log("FitxerFilogenetic.OnLevelWasLoaded. Tanco fitxer: "+nomFitxer);
	TancaFitxer();
}
*/

// el tanco des de controller

function TancaFitxer() {
	#if UNITY_WEBPLAYER
		
	#else
	if (init && sw!= null) {
		sw.WriteLine (footer());
		sw.Flush();
		sw.Close();
		Debug.Log("Tancant fitxer: "+nomFitxer);
	}
	
	init = false;
	#endif
}

private var jaHoHeDit = false;
private function AvisaNotAvailable() {
	if (!jaHoHeDit)
		Debug.LogWarning("FitxerFilogenetic: not available on UNITY_WEBPLAYER");
	jaHoHeDit = true;
}