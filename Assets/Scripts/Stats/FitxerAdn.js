#pragma strict


// genera un fitxer amb l'adn de totes les especies de la biocenosi en un moment donat
// format csv


import System.IO;
static var instance : FitxerAdn;
var nomFitxer = "DNA";
private var sufixFitxer = ".csv";


private var sw: StreamWriter;
private var init : boolean;

private var txt = "";

function Awake () {
	init = false;
	instance = this;
}

//function Start () {

//}

function Genera() {

	#if UNITY_WEBPLAYER
		Debug.LogWarning("FitxerAdn: not available on UNITY_WEBPLAYER");
	#else
		nomFitxer = nomFitxer + "_"+System.DateTime.Now.ToString("yyyy-MM-dd HH-mm-ss");
		Debug.Log("FitxerAdn. Nom fitxer estadistiques : "+nomFitxer);
		EscriuFitxer(Dna.CSVCapcalera());

		var bio = Biocenosi.instance;
		// per cada especies de bicenosi cridem Dna.LiniaAdnCsv
		for (var j=0; j< bio.speciesMax;j++) {
			EscriuFitxer(bio.species[j].dna.CSVLinia());
		}
		
		// per si un cas encara esta obert
		TancaFitxer();
	#endif
	

}


#if UNITY_WEBPLAYER
#else
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

function OnApplicationQuit() {
	TancaFitxer();
}

function OnLevelWasLoaded() {
	TancaFitxer();
}

private function TancaFitxer() {
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