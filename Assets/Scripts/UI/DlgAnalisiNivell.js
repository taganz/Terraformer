#pragma strict


// sempre es mostrara en pause --> no cal fer updates



static var instance : DlgAnalisiNivell;


// tabMission

private var tabMission : GameObject; 
private var txtInfoEcosistema : UI.Text;
//private var txtInfoBiotop : UI.Text;
private var txtLlistaOus : UI.Text;
private var txtLlistaEspeciesSpawners :UI.Text;

// tabBiotope

private var tabBiotope : GameObject; 
private var sliderTemperatura : UnityEngine.UI.Slider;
private var sliderRadiacio : UnityEngine.UI.Slider;
private var sliderHumitat : UnityEngine.UI.Slider;

private var tabPopulation : GameObject;
private var tabDeaths : GameObject;
private var tabPrey : GameObject;

// tabOptions
private var tabOptions : GameObject;
private var tgHerbivorsSempreFarts : UI.Toggle;
private var tgOusInfinits : UI.Toggle;

// tabDeaths


private var ntGenereSeleccionat : int = 0;
private var btnTabSeleccionat : String = "btnMission";
private var biocenosi : Biocenosi;

function Awake() {
	instance = this;
	// el baixem si l'hem mogut en editor
	this.transform.position.y = 0;
	Close();
}


// posa per sobre
function OnEnable() {
	transform.SetAsLastSibling();
}

function Open () {
	
	biocenosi = Biocenosi.instance;
		
	Debug.Log("DlgAnalisiNivell - StartNivell() - inici");
	
	GameController.instance.BloquejaMouse();		// <-- ja ho fa UIMgr quan el crida, no?
	this.gameObject.SetActive(true);
		
	//////////////
	//  Buttons
	//////////////
	
	// set callbacks to buttons
	
	var but : UI.Button;
	var tab : GameObject;
	
	RegistraButton("btnMission");
	RegistraButton("btnBiotope");
	RegistraButton("btnPopulation");
	RegistraButton("btnDeaths");
	RegistraButton("btnPrey");
	RegistraButton("btnOptions");

	but = this.transform.Find("panel/btnSortir").GetComponent(UI.Button);
	biblio.Assert(but!=null, "btnSortir btnSortir == null");
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {   UIMgr.instance.HudTogglePanellExclusiu("AnalisiNivell"); } );  


	/////////////////
	// tabMission  
	/////////////////
	
	tabMission = this.transform.Find("panel/tabMission").gameObject;
	tab = tabMission;
	tab.SetActive(true);
	
	txtInfoEcosistema = tab.transform.Find("GBiocenosi/txtInfoEcosistema").GetComponent(UI.Text);
	txtInfoEcosistema.text = TextInfoEcosistema();
	
	//txtInfoBiotop = tab.transform.Find("GBiotop/txtInfoBiotop").GetComponent(UI.Text);
	//txtInfoBiotop.text = TextInfoBiotop();

	txtLlistaOus = tab.transform.Find("GLab/txtLlistaOus").GetComponent(UI.Text);
	txtLlistaOus.text = biocenosi.laboratori.TextLlistaOus();
	
	txtLlistaEspeciesSpawners  = tab.transform.Find("GBiocenosi/txtLlistaEspeciesSpawners").GetComponent(UI.Text);
	txtLlistaEspeciesSpawners.text = FormatGeneres.TextLlistaEspeciesSpawners();
	
	
	/////////////////
	// tabBiotope
	/////////////////
	
	tabBiotope = this.transform.Find("panel/tabBiotope").gameObject;
	biblio.Assert(tabBiotope!=null, "tabBiotope==null");
	tab = tabBiotope;
	tab.SetActive(true);
	
	//var x = tab;
	//var y = tab.Find("GBiotop/sliderTemperatura");
	/////////////////
	// tabPopulation  
	/////////////////
	
	tabPopulation = this.transform.Find("panel/tabPopulation").gameObject;
	tab = tabPopulation;
	tab.SetActive(true);
	
	RegistraButton(tab, "gBtnNT/btnNT0", function () {   TabPopulationBtnNT(0); });
	RegistraButton(tab, "gBtnNT/btnNT1", function () {   TabPopulationBtnNT(1); });
	RegistraButton(tab, "gBtnNT/btnNT2", function () {   TabPopulationBtnNT(2); });
	RegistraButton(tab, "gBtnNT/btnNT3", function () {   TabPopulationBtnNT(3); });

	
	//tabPopulation.transform.Find("gCol2/titCol").GetComponent(UI.Text).text = Textos.msg("TrophicLevel"+0+"plural");
	//tabPopulation.transform.Find("gCol3/titCol").GetComponent(UI.Text).text = Textos.msg("TrophicLevel"+1+"plural");
	//tabPopulation.transform.Find("gCol4/titCol").GetComponent(UI.Text).text = Textos.msg("TrophicLevel"+2+"plural");
	//tabPopulation.transform.Find("gCol5/titCol").GetComponent(UI.Text).text = Textos.msg("TrophicLevel"+3+"plural");
	
	/////////////////
	// tabDeaths  
	/////////////////
	
	tabDeaths = this.transform.Find("panel/tabDeaths").gameObject;
	tab = tabDeaths;
	tab.SetActive(true);
	
	RegistraButton(tab, "gBtnNT/btnNT0", function () {   TabPredatorsBtnNT(0); });
	RegistraButton(tab, "gBtnNT/btnNT1", function () {   TabPredatorsBtnNT(1); });
	RegistraButton(tab, "gBtnNT/btnNT2", function () {   TabPredatorsBtnNT(2); });
	RegistraButton(tab, "gBtnNT/btnNT3", function () {   TabPredatorsBtnNT(3); });
	
	/////////////////
	// tabPrey  
	/////////////////
	
	tabPrey = this.transform.Find("panel/tabPrey").gameObject;
	tab = tabPrey;
	tab.SetActive(true);
	
	RegistraButton(tab, "gBtnNT/btnNT0", function () {   TabPreyBtnNT(0); });
	RegistraButton(tab, "gBtnNT/btnNT1", function () {   TabPreyBtnNT(1); });
	RegistraButton(tab, "gBtnNT/btnNT2", function () {   TabPreyBtnNT(2); });
	RegistraButton(tab, "gBtnNT/btnNT3", function () {   TabPreyBtnNT(3); });
	
	/////////////////
	// tabOptions
	/////////////////
	
	tabOptions = this.transform.Find("panel/tabOptions").gameObject;
	tab = tabOptions;
	tab.SetActive(true);
	
	// toogle tgHerbivorsSempreFarts
	tgHerbivorsSempreFarts = tab.Find("tgHerbivorsSempreFarts").GetComponent(UI.Toggle);
	biblio.Assert(tgHerbivorsSempreFarts!=null, "DlgAnalisiNivell tgHerbivorsSempreFarts null");
	tgHerbivorsSempreFarts.onValueChanged.RemoveAllListeners();
	tgHerbivorsSempreFarts.onValueChanged.AddListener(function () {   Biocenosi.instance.herbivorsSempreFarts = tgHerbivorsSempreFarts.isOn; } );  

	tgHerbivorsSempreFarts.isOn = Biocenosi.instance.herbivorsSempreFarts;

	// toogle tgOusInfinits
	tgOusInfinits = tab.Find("tgOusInfinits").GetComponent(UI.Toggle);
	biblio.Assert(tgOusInfinits!=null, "DlgAnalisiNivell tgOusInfinits null");
	tgOusInfinits.onValueChanged.RemoveAllListeners();
	tgOusInfinits.onValueChanged.AddListener(function () {   GameController.instance.laboratori.ousInfinits = tgOusInfinits.isOn; } );  

	tgOusInfinits.isOn = GameController.instance.laboratori.ousInfinits;


	sliderTemperatura = tab.Find("sliderTemperatura").GetComponent(UI.Slider);
	biblio.Assert(sliderTemperatura!=null, "DlgAnalisiNivell sliderTemperatura null");
	sliderTemperatura.onValueChanged.RemoveAllListeners();
	sliderTemperatura.onValueChanged.AddListener(function () {   SliderGenValueChange(sliderTemperatura); } );  
		
	sliderRadiacio = tab.Find("sliderRadiacio").GetComponent(UI.Slider);
	biblio.Assert(sliderRadiacio!=null, "DlgAnalisiNivell sliderRadiacio null");
	sliderRadiacio.onValueChanged.RemoveAllListeners();
	sliderRadiacio.onValueChanged.AddListener(function () {   SliderGenValueChange(sliderRadiacio); } );  

	sliderHumitat = tab.Find("sliderHumitat").GetComponent(UI.Slider);
	biblio.Assert(sliderHumitat!=null, "DlgAnalisiNivell sliderHumitat null");
	sliderHumitat.onValueChanged.RemoveAllListeners();
	sliderHumitat.onValueChanged.AddListener(function () {   SliderGenValueChange(sliderHumitat); } );  

	//sliderTemperatura.text = "Temperatura (-30º - 50º)";
	sliderTemperatura.minValue = -10;
	sliderTemperatura.maxValue = 50;
	sliderTemperatura.value = GameController.instance.biotop.tempActual;
	sliderTemperatura.transform.Find("Text").GetComponent(Text).text = sliderTemperatura.value.ToString();
	
	//sliderRadiacio.text = "Radiacio (0-100)";
	sliderRadiacio.minValue = 0;
	sliderRadiacio.maxValue = 100;
	sliderRadiacio.value = GameController.instance.biotop.radiacioMitja;
	sliderRadiacio.transform.Find("Text").GetComponent(Text).text = sliderRadiacio.value.ToString();

	//sliderHumitat.text = "Humitat (0-100)";
	sliderHumitat.minValue = 0;
	sliderHumitat.maxValue = 100;
	sliderHumitat.value = GameController.instance.biotop.precipitacions;
	sliderHumitat.transform.Find("Text").GetComponent(Text).text = sliderHumitat.value.ToString();
	
	

	// set initial tab
	
	//ChangeTab("btnMission");
	ChangeTab(btnTabSeleccionat);

}

function RegistraButton(butName: String) {
	RegistraButton(this.transform, butName);
}
function RegistraButton(parentTransform: Transform, butName: String) {
	var but = parentTransform.Find("panel/gButtons/"+butName).GetComponent(UI.Button);
	biblio.Assert(but!=null, butName+"== null");
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {  ChangeTab(butName);}	 );  

}
function RegistraButton(parent: GameObject, butName: String, callName: Events.UnityAction) {
	var but = parent.transform.Find(butName).GetComponent(UI.Button);
	biblio.Assert(but!=null, "RegistraButton error finding butName="+butName+ " in parent.name="+parent.name);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(callName );  

}

function Update() {
	if (Time.frameCount%20==0) 
		txtLlistaOus.text = biocenosi.laboratori.TextLlistaOus();
		
}
// change tab for button clicked

private function ChangeTab(btnName: String) {
	var txt : String;
	tabMission.SetActive(false);
	tabBiotope.SetActive(false);
	tabPopulation.SetActive(false);
	tabDeaths.SetActive(false);
	tabPrey.SetActive(false);
	tabOptions.SetActive(false);
	switch(btnName) {
		case "btnMission":
			tabMission.SetActive(true);
			break;
		case "btnBiotope":
			tabBiotope.SetActive(true);
			this.transform.Find("panel/tabBiotope/GBiotop/txtBiotope").GetComponent(UI.Text).text
			 = FormatBiotop.instance.StringBiotop();
			break;
		case "btnPopulation":
			tabPopulation.SetActive(true);
			TabPopulationBtnNT(ntGenereSeleccionat);
			//tabPopulation.transform.Find("gCol1/txtCol").GetComponent(UI.Text).text = FormatBiocenosi.instance.InfoBiocenosiAgregats(); 
			//tabPopulation.transform.Find("gCol2/txtCol").GetComponent(UI.Text).text = FormatBiocenosi.instance.InfoPopulationNT(0);
			//tabPopulation.transform.Find("gCol3/txtCol").GetComponent(UI.Text).text = FormatBiocenosi.instance.InfoPopulationNT(1);
			//tabPopulation.transform.Find("gCol4/txtCol").GetComponent(UI.Text).text = FormatBiocenosi.instance.InfoPopulationNT(2);
			//tabPopulation.transform.Find("gCol5/txtCol").GetComponent(UI.Text).text = FormatBiocenosi.instance.InfoPopulationNT(3);
			break;
		case "btnDeaths":
			tabDeaths.SetActive(true);
			TabPredatorsBtnNT(ntGenereSeleccionat);
			break;
		case "btnPrey":
			tabPrey.SetActive(true);
			TabPreyBtnNT(ntGenereSeleccionat);
			break;
		case "btnOptions":
			tabOptions.SetActive(true);
			txt = "\nloadedLevel: "+Application.loadedLevel;
			txt += "\n";
			//txt += "\nmaxPlantes: "+biocenosi.maxPlantes;
			txt += "\ncapacityReference: "+biocenosi.capacityReference;
			txt += "\ntotalPlantes: "+Planta.totalPlantes;
			txt += "\ntotalAnimals: "+Planta.totalAnimals;
			//txt += "\nmaxAnimals: "+biocenosi.maxAnimals;
			this.transform.Find("panel/tabOptions/txtOptions").GetComponent(UI.Text).text = txt;
			break;
		default:
			Debug.LogError("DlgAnalisiNivell.ChangeTab error="+btnName);
	}
	
	// conserva tab per a obrir-lo si tanquem i tornem a obrir
	btnTabSeleccionat = btnName;
}



	
private function TextInfoEcosistema() {
 return	biocenosi.biocenosiData.comments;
}					
					
private function TextInfoBiotop() {
 return biocenosi.biotop.comment;

}

function SliderGenValueChange(sl: UnityEngine.UI.Slider) {

	if (sl ==sliderTemperatura) {
		GameController.instance.biotop.tempActual = sl.value;
	}
	else
	if (sl ==sliderRadiacio) {
		GameController.instance.biotop.radiacioMitja = sl.value;
	}
	else
	if (sl ==sliderHumitat) {
		GameController.instance.biotop.precipitacions = sl.value;
	}
	else
		Debug.LogError("dlgAnalisiNivell slider desconegut: "+sl);

	// actualitza string valor
	sl.transform.Find("Text").GetComponent(Text).text = sl.value.ToString();


}


public function Close() {
	this.gameObject.SetActive(false);

}

public function Toogle() {
	if (this.gameObject.activeSelf)
		Close();
	else
		Open();

}	

// callback dels botons que canvien NT en tabPredator

private function TabPredatorsBtnNT(nt: int) {
	tabDeaths.transform.Find("titol").GetComponent(UI.Text).text 
			= "Death causes for "+Textos.msg("TrophicLevel"+nt+"plural");		
	tabDeaths.transform.Find("capcalera").GetComponent(UI.Text).text
		    = FormatGeneres.instance.StatsMortsCapcalera(nt);
	tabDeaths.transform.Find("caixaScroll/scrollRect/txt").GetComponent(UI.Text).text	
			= FormatGeneres.instance.StatsMortsToString(nt); 
	ntGenereSeleccionat = nt;
}
private function TabPreyBtnNT(nt: int) {
	tabPrey.transform.Find("titol").GetComponent(UI.Text).text 
			= "Prey stats for "+Textos.msg("TrophicLevel"+nt+"plural");		
	tabPrey.transform.Find("capcalera").GetComponent(UI.Text).text
		    = FormatGeneres.instance.StatsMortsCapcalera(nt);	
	tabPrey.transform.Find("caixaScroll/scrollRect/txt").GetComponent(UI.Text).text	
			= "\n" + FormatGeneres.instance.StatsPrey(nt); 
	ntGenereSeleccionat = nt;
}
private function TabPopulationBtnNT(nt: int) {
	tabPopulation.transform.Find("titol").GetComponent(UI.Text).text 
			= "Population stats for "+Textos.msg("TrophicLevel"+nt+"plural");			
	tabPopulation.transform.Find("capcalera").GetComponent(UI.Text).text	
		    = FormatGeneres.instance.StatsMortsCapcalera(nt);
	tabPopulation.transform.Find("caixaScroll/scrollRect/txt").GetComponent(UI.Text).text	
			= FormatGeneres.instance.StatsVius(nt);	
	//		= FormatBiocenosi.instance.InfoPopulationNT(nt); 
	ntGenereSeleccionat = nt;
}