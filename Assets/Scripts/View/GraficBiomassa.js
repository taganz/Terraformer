#pragma strict

static var instance : GraficBiomassa;
private	var graficBiomassa : Grafic;
//private var framesPintarGraf = 10; // cada quants frames fa log 
private var inicialitzat = false;
//@HideInInspector var simTimeNow : float;
private var simTimeLastLog : float;
private var logInterval = 0.3;	// 1 sec.

function Awake() {
	instance = this;
}

function StartNivell() {

	graficBiomassa = new Grafic(1, 1, 10, 300,100);
	graficBiomassa.SetDataNames("Biomassa (T)", "", "", "", "");
	graficBiomassa.SetDataColors(Color.white, Color.gray,Color.gray, Color.gray, Color.gray);
	graficBiomassa.SetDataYMax(Biocenosi.instance.biomassaObjectiu,0,0,0,0);
	//simTimeNow = 0;
	simTimeLastLog = 0;
	inicialitzat = true;
	//graficBiomassa.Open();

}


function Update() {

	//if (Time.frameCount%framesPintarGraf == 0 && inicialitzat){ // && !EsticEnPauseGUI) {
	if (SimTime.simTime - simTimeLastLog > logInterval) {
		graficBiomassa.Log(Biocenosi.instance.biomassaNT[1]/1000.0, 0, 0, 0, 0);
		simTimeLastLog = SimTime.simTime;
	}

}


function OnGUI() {

	// ojo, no poden estar dos grafics oberts al mateix temps perque el DoGUI es fa un lio
	// IGUAL TAMBE FUNCIONA SI ES POSEN TOTS AL MATEIX ONGUI, PER ORDRE EN COMPTES DE QUE VAGIN EN PARAL.LEL??
	if (inicialitzat && graficBiomassa.isOpen && !GraficNivellsTrofics.instance.graficNT.isOpen) {
		graficBiomassa.DoGUI();	
		
	}

		
}


function Toogle() {
	graficBiomassa.Toogle(); 
}

function Open() {
	graficBiomassa.Open(); 
}

function Close() {
	if (graficBiomassa!=null)
		graficBiomassa.Close(); 
}

// si canvia el nivell de puntuacio actualitzem el grafic amb biomassa (kg)
function CanviNivell(seguentNivellBiomassa: int) {
	graficBiomassa.SetDataYMax(seguentNivellBiomassa/1000,0,0,0,0);
}
