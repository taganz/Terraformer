#pragma strict

// panell que mostra informacio sobre l'estat de l'ecosistema
// si esta actiu s'actualitza cada 50 frames  <--- POSAR UN YIELD O UN INVOKE REPEATING??

// <-- HI HA MOLTA COSA QUE ES PODRIA LLEGIR UN SOL COP I NO A CADA UPDATE!!!!!


static var instance : AcordioEcosistema;
private var acordioEcosistema : GameObject; 
	private var txtBiocenosiAgregats : UI.Text;
	private var txtInfoBiotop : UI.Text;
//	private var txtInfoOus : UI.Text;
	private var txtBiocenosi : UI.Text;
//	private var txtStatus : UI.Text;
//private var ajudaTab : Toggle; 
private var infoBiocenosiTab : Toggle; 
private var infoBiocenosiAgregatsTab : Toggle;
//private var infoOusTab : Toggle; 
private var infoBiotopTab : Toggle; 
//private var infoStatusTab : Toggle;

private var biocenosi : Biocenosi;
private var laboratori : Laboratori;
private var biotop 	  : Biotop;
private var planeta	  : Planeta;

private var inicialitzat = false;

function Awake() {
	instance = this;
}

function Start(){

	planeta = Planeta.instance;
	
	// el script de AcordioEcosistema penja de controller, no del panel real (per que? <-----)
	acordioEcosistema = GameObject.Find("/Display/acordioEcosistema");
		biblio.Assert(acordioEcosistema!=null, "No he trobat /Display/acordioEcosistema en AcordioEcosistema.Start");

	txtBiocenosiAgregats = acordioEcosistema.Find("txtBiocenosiAgregats").GetComponent(UI.Text);
		biblio.Assert(txtBiocenosiAgregats!=null, "No he trobat txtBiocenosiAgregats en AcordioEcosistema.Start");
	txtBiocenosi = acordioEcosistema.Find("txtBiocenosi").GetComponent(UI.Text);
		biblio.Assert(txtBiocenosi!=null, "No he trobat txtBiocenosi en AcordioEcosistema.Start");
//	txtInfoOus = acordioEcosistema.Find("txtInfoOus").GetComponent(UI.Text);
//		biblio.Assert(txtInfoOus!=null, "No he trobat txtInfoOus en AcordioEcosistema.Start");
	txtInfoBiotop = acordioEcosistema.Find("txtInfoBiotop").GetComponent(UI.Text);
		biblio.Assert(txtInfoBiotop!=null, "No he trobat txtInfoBiotop en AcordioEcosistema.Start");
//	txtStatus = acordioEcosistema.Find("txtStatus").GetComponent(UI.Text);
//	biblio.Assert(txtStatus!=null, "No he trobat txtStatus en AcordioEcosistema.Start");


//	ajudaTab = GameObject.Find("/Display/acordioEcosistema/Ajuda").GetComponent(Toggle);
//		biblio.Assert(ajudaTab!=null, "No he trobat ajudaTab en AcordioEcosistema.Start");
	infoBiocenosiTab = GameObject.Find("/Display/acordioEcosistema/InfoBiocenosi").GetComponent(Toggle);
		biblio.Assert(infoBiocenosiTab!=null, "No he trobat infoBiocenosiTab en AcordioEcosistema.Start");
	infoBiocenosiAgregatsTab = GameObject.Find("/Display/acordioEcosistema/InfoBiocenosiAgregats").GetComponent(Toggle);
		biblio.Assert(infoBiocenosiAgregatsTab!=null, "No he trobat infoBiocenosiAgregatsTab en AcordioEcosistema.Start");
//	infoOusTab = GameObject.Find("/Display/acordioEcosistema/InfoOus").GetComponent(Toggle);
//		biblio.Assert(infoOusTab!=null, "No he trobat infoOusTab en AcordioEcosistema.Start");
	infoBiotopTab = GameObject.Find("/Display/acordioEcosistema/InfoBiotop").GetComponent(Toggle);
		biblio.Assert(infoBiotopTab!=null, "No he trobat infoBiotopTab en AcordioEcosistema.Start");
//	infoStatusTab = GameObject.Find("/Display/acordioEcosistema/InfoStatus").GetComponent(Toggle);
//		biblio.Assert(infoStatusTab!=null, "No he trobat infoStatusTab en AcordioEcosistema.Start");


	
	// panells amb info estatica
//	var txt = acordioEcosistema.Find("txtAjuda").GetComponent(UI.Text);
//	biblio.Assert(txt!=null, "No he trobat txtAjuda en AcordioEcosistema.Start");
//	txt.text = Textos.instance.msg("MSG_SHORCUTS");
	
//	ajudaTab.isOn = true; //??
//	infoBiocenosiTab.isOn = true;		--> s'ha de posar al inspector de l'objecte
	Close();
	
}
function Inicialitza() {

	// biocenosi s'activa quan es selecciona el nivell, no ho podem fer en start
	
	if (biocenosi == null)
		biocenosi = Biocenosi.instance;
	if (laboratori == null)
		laboratori = GameController.instance.laboratori;
	if (biotop == null)
		biotop  = GameController.instance.biotop;

	inicialitzat = (biocenosi!=null) && (laboratori!=null) && (biotop!=null);

	if (inicialitzat) {
		// cal carregar-los tots al principi i despres es poden actualitzar per separat
		//txtStatus.text = InfoStatus();
		txtInfoBiotop.text = InfoBiotop();
		txtBiocenosiAgregats.text = FormatBiocenosi.instance.InfoBiocenosiAgregats(); 
		txtBiocenosi.text = FormatBiocenosi.instance.InfoBiocenosi();
//		txtInfoOus.text = InfoOus();
	}
}


function Update () {
		
	if (!inicialitzat) {
		Inicialitza();
	}
	
	if (GameController.instance.estat == EstatJoc.EstatNull || !inicialitzat) {
		return;
	}

	
	// panells que s'actualitzen mes rapid	

	if (Time.frameCount%10 == 0) {
		
		// caixa 5 - status del joc
		//if (infoStatusTab.isOn) {
		//	txtStatus.text = InfoStatus();
		//}
		
		// caixa 3 - info biotop
		if (infoBiotopTab.isOn) {			
			txtInfoBiotop.text = InfoBiotop();
		}

	}
	
	// panells que s'actualitzen amb menys frequencia
	
	if (Time.frameCount%50 == 0) {
			
		// caixa info nivells trofics
		if (infoBiocenosiAgregatsTab.isOn) {
			txtBiocenosiAgregats.text = FormatBiocenosi.instance.InfoBiocenosiAgregats(); 
		}
		
		// caixa  info especies
		if (infoBiocenosiTab.isOn) {
			txtBiocenosi.text = FormatBiocenosi.instance.InfoBiocenosi();
		}
			
	}


}

			

private function InfoBiotop(): String {
	return "" 
//		 +"\nPlanet "+planeta.nomPlaneta
//		 +"\n"		 +biotop.comment
//		 +"\nTemperature"
//		 +"\n   average 0 m: "+biotop.tempMitja +" ºC"
//		 +"\n   actual 0 m:  "+biotop.tempActual +" ºC"
//		 +"\n   variation:      "+planeta.incTempPerMetre+" ºC/m"
//		 +"\nRadiation (1-100): "+biotop.radiacioMitja.ToString("n0")
//		 +"\nWater (1-100):     "+biotop.precipitacions.ToString("n0")
		 +InfoBiotopMouse()
		 +"\n\n";
//		 +"\n\nPress (O) for ecosystem options";
}

// private function InfoOus():String {
// 	var tt= "Tecla           	Queden";
//	for (var j=0; j<laboratori.ousNumEspecies;j++) {
//		tt += "\n"+String.Format("{0,2}: {1,-15}  {2,4}", j, biocenosi.species[j].dna.nomPantalla, laboratori.ousQuantitat[biocenosi.generesIdOu[j]]);
//	}
//	tt += laboratori.ousInfinits ? "\n\nOus infinits: SI" : "\n\nOus infinits: NO";
//	tt += "\nTecla (O) per canviar ous infinits";
//	
//	return tt;
//}

/*
private function InfoStatus():String {
	var 
	  txt =  "sim time:  " +SimTime.simTime.ToString("F1");
	txt += "\ntimeScale: "+Time.timeScale;
	txt += "\nEstat:  "+GameController.instance.estatToString(GameController.instance.estat);
	txt += "\nCamara: "+Camera.main.transform.position ;
	txt += "\nPlayer: "+GameController.instance.player.transform.position;
//	txt += "\nNivell: "+Application.loadedLevel;
	txt += "\nSim Speed: "+ (SimTime.instance.simSpeedFast ? "FAST" : "NORMAL");
	txt += "\nTitol:  "+biocenosi.titolNivell;
//	txt += "\nmaxPlantes: "+biocenosi.maxPlantes;
//	txt += "\ntotalPlantes: "+Planta.totalPlantes;
//	txt += "\nmaxAnimals: "+biocenosi.maxAnimals;
	txt += "\nTime.time: "+Time.time.ToString("F0");
	txt += "\nframeCount: "+Time.frameCount;
	//Debug.Log(txt);
	return txt;
}
*/
		
private function InfoBiotopMouse(): String {
	var txt : String;
	// posicio mouse	
	var hit1: RaycastHit;
	var ray1: Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	if (Physics.Raycast(ray1, hit1)) {
		var yterreny = Terrain.activeTerrain.SampleHeight(hit1.point);
		var posCentre = Camera.main.ScreenToWorldPoint(hit1.point);
		txt  = "Mouse position info: ";
		txt += "\n pos: ("+hit1.point.x.ToString("n0")+ ", "+yterreny.ToString("n0")+ ", "+hit1.point.z.ToString("n0")+ ")";
		txt += "\n h: " + planeta.y2h(yterreny)+" m.";
		//txt += " Temp: "+biotop.TempEnPosicio(posCentre).ToString("n0") +"ºC";
		txt += "\n temp: "+GameController.instance.biotop.TempEnPosicio(Vector3(posCentre.x, yterreny, posCentre.z)).ToString("n0") +"ºC";
	}
	else {
		txt = "Mouse: "+Input.mousePosition+ " (not over the terrain)";
	}
	return txt; 
	
}



public function Open() {

	this.gameObject.SetActive(true);
}

public function Close() {
	this.gameObject.SetActive(false);

}

// torna true si l'ha obert
public function Toogle(): boolean {
	if (this.gameObject.activeSelf)
		Close();
	else 
		Open();
	return this.gameObject.activeSelf;

}
