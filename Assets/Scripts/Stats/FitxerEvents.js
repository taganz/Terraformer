#pragma strict

// Registra els events

import System.IO;
static var instance : FitxerEvents;
var nomFitxer = "events";
private var sufixFitxer = ".csv";
//var framesPintarEstadistiques = 10; // cada quants frames fa log d'estadistiques
var generaFitxer = true;

private var sw: StreamWriter;
private var init : boolean;

private var txt = "";

//private var controller : GameController;

function Awake () {
	init = false;
	instance = this;
}

// Format:
//   idPresa, nom, adn, nomEspecie, causa, [idPredador], [nom], [adn]
//	 - idPresa, idPredador: id del genere segons biocenosi
// 	 

/*
function Start() {
	controller = GameController.instance;
}
*/
function EventNeixement(evS: Creature) {
	if (evS!=null) {
		EventStandard(evS, "BORN", null, evS.dna.idPare, evS.dna.generacio.ToString("F0"));
	}
	else {
		EventError("Error. Neixement EVS == NULL");
	}
}

function EventGiveBirth(evS: Creature, totalOk: int) {
	if (evS!=null) {
		EventStandard(evS, "TRY BIRTH", null, "tryOk="+totalOk, "offSpring="+evS.dna.reprodOffspringX.ToString("F1")+" "+" births="+evS.heParitCops);
	}
	else {
		EventError("Error. EventGiveBirth EVS == NULL");
	}
}

function EventMenjar(evS: Creature, evO: Creature) {
	if (evS!=null && evO!=null) 
		EventStandard(evS, "EAT", evO, "heMenjatPes="+evS.heMenjatPes.ToString("F1")+" pes="+evS.metab.pes.ToString("F1"), null);
	else
		EventError("Error. Menjar evS=null or evO=null");
}

function EventMort(evS: Creature, causa: String) {
	if (evS!=null) 
		EventStandard(evS, "DIED", null, causa, null);
	else	
		EventError("Error. Mort evS == null");
}	

function EventMort(evS: Creature, causa: String, predador: Creature) {
	if (evS!=null) 
		EventStandard(evS, "DIED", predador, causa, null);
	else	
		EventError("Error. Mort evS == null");
		
}	

function EventNoArribaANeixer(evS: Creature) {
	if (evS!=null)
		EventStandard(evS, "SPAWN_NOT_BORN");
	else	
		EventError("Error. No arriba a neixer evS == null");
}

function EventNovaEspecie(evS: Creature, genomePare: String) {
	//if (evS!=null)
	// EventStandard(evS, "NEW_SPECIE", null, genomePare);
	//else	
	//	EventError("Error. Nova especie evS == null");
}

//
//  Sintaxis EventStandard
//
//    evS, verb, [evO], [text]
//

private function EventStandard(evS: Creature, verb: String) {	
	if (evS != null)
		EventStandard(evS, verb, null, null, null);
	else	
		EventError ("Error evS==null en verb="+verb);
}


private function EventStandard(evS: Creature, verb: String, evO: Creature) {	
	if (evS!=null && evO != null) 
		EventStandard(evS, verb, evO, null, null);
	else 
		EventError("Error evS==null or evO == null en verb="+verb);
}

private function EventStandard(evS: Creature, verb: String, evO: Creature, txt1: String, txt2: String) {	
	#if UNITY_WEBPLAYER
		AvisaNotAvailable();
	#else
		var txt : String;
		//txt  = ""+SimTime.instance.tempsJocNivell;
		txt  = ""+SimTime.simTime.ToString("F0");
		txt += ", " + evS.transform.position.x.ToString("F0");
		txt += ", " + Planeta.instance.y2h(evS.	transform.position.y);
		txt += ", " + evS.transform.position.z.ToString("F0");
		txt += ", " + GameController.instance.biotop.TempSobreTerreny(evS.transform.position).ToString("F1");
		txt += ", " + evS.meuId;
		txt += ", " + evS.dna.nomGenere;
		txt += ", " + evS.dna.nomPantalla;
		txt += ", " + evS.dna.genome.ToString();
		txt += ", " + verb;
		if (evO!=null) {
			txt += ", " + evO.meuId;
			txt += ", " + evO.dna.nomGenere;
			txt += ", " + evO.dna.nomPantalla;
			txt += ", " + evO.dna.genome.ToString();
		}
		else {
			txt += ", , , , ";
		}
		if (txt1 != null) {
			txt += ", " +txt1;
		}
		if (txt2 != null) {
			txt += ", " +txt2;
		}
		EscriuFitxer (txt);
	#endif
}


private function EventError(txt) {
	#if UNITY_WEBPLAYER
		AvisaNotAvailable();
	#else
		EscriuFitxer (txt);
	#endif
}


#if UNITY_WEBPLAYER
#else
	private function Open(): boolean {

		nomFitxer = nomFitxer + "_"+System.DateTime.Now.ToString("yyyy-MM-dd HH-mm-ss")+".csv";
		Debug.Log("FitxerEvents. Nom fitxer estadistiques : "+nomFitxer);
		var nf = Application.dataPath + "/" +nomFitxer;
		sw = new StreamWriter (nf);					// falta directori <---
		if (sw == null) {
			Debug.LogError("*** ERROR *** Error obrint fitxer " + nf);
			generaFitxer = false;
			return false;   
			}
		else {
			init = true;
			Debug.Log("Obert FitxerEvents "+nf);
			return true;
		}
	}

	private function titols():String {
		//return "idGenerePresa, generePresa, adnPresa, nomEspecie, causaMort, idGenerePredador, generePredador, adnPredador";
		return "Time, x, y, z, temperature, idS, genusS, nameS, genomeS, action, idO, genusO, nameO, genomeO";
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
	

#endif

/*
// no passa mai per aqui?
// In the editor this is called when the user stops playmode. In the web player it is called when the web view is closed.
function OnApplicationQuit() {
	Debug.Log("FitxerEvents.OnApplicationQuit. Tanco fitxer: "+nomFitxer);
	TancaFitxer();
}

function OnLevelWasLoaded() {
	Debug.Log("FitxerEvents.OnLevelWasLoaded. Tanco fitxer: "+nomFitxer);
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

private var jaHoHeDit = false;
private function AvisaNotAvailable() {
	if (!jaHoHeDit)
		Debug.LogWarning("FitxerEvents: not available on UNITY_WEBPLAYER");
	jaHoHeDit = true;
}