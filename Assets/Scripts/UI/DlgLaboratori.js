#pragma strict

/*

	Es un dialeg per veure informacio dels generes
	A l'esquerra tens tots els generes, primer els del laboratori
	Hi ha tres tabs	
	- Genome -> Permet modificar si es una especie si es del Laboratori
	- Estadistiques 
	- Help -> text amb ajuda. es el que es mostra el principi
	
	Si un animal esta seleccionat, entra amb el seu genere i el seu adn
	
	Si modifique l'adn d'una especie tambe es modifica  el de l'animal seleccionat (per veure els canvis)
	
	9/3/15 - nomes presenta els generes del laboratori

*/
static var instance : DlgLaboratori;

// selection

static var idEspecieEditada : int;
private var criaturaEditada : Creature;
private var labSpecie : Specie;		// el que editem. ara traspassem sempre a labo pero podriem fer un boto "guardar"

// pointers

private var txtNomEspecie : UI.Text;
//private var txtStatsCapcalera : UI.Text;
//private var txtStatsNivellTrofic : UI.Text;
private var txtGenome : UI.Text;
private var txtEstadistiques : UI.Text;
private var cvSeleccioEspecie : GameObject;
private var cvGenome : GameObject;
private var cvHelp : GameObject;
private var panelObjecteDetall : GameObject;
//var txtObjecteDetall : UI.Text;
//private var cvEstadistiques : GameObject;
private var listSliders : UnityEngine.UI.Slider[];
private var tgSeleccioEspecie : UI.Toggle;
private var tgGenome : UI.Toggle;
private var tgHelp : UI.Toggle;
//private var tgEstadistiques : UI.Toggle;
private var tgroupFinestraEdicio : UI.ToggleGroup;
private var	goGrupSliderGen : GameObject;
private var biocenosi : Biocenosi;
private var laboratori : Laboratori;
private var inicialitzat = false;
private var posMouseWhenOpen : Vector3;
private var tempAtMousePosition : float;	

function Awake() {
	instance = this;
}


function Start () {

	this.gameObject.SetActive(true);
	
	var but : UI.Button;
	
	if (inicialitzat)
		return;
	inicialitzat = true;
		
	Debug.Log("dlgLABORATORI - Start() - inici");
	
	// edited genus
	
	labSpecie = new Specie("PENDENT");
	
	// get basic pointers
	
	biocenosi = Biocenosi.instance;
		biblio.Assert(biocenosi!=null, "dlgLaboratori: No he trobat biocenosi");
	laboratori = GameController.instance.laboratori;
		biblio.Assert(laboratori!=null, "dlgLaboratori: No he trobat laboratori");
	


	// recupera punter a toogle selectors de canvas

	tgroupFinestraEdicio = GameObject.Find("/Display/dlgLaboratori/tgroupFinestraEdicio").GetComponent(UI.ToggleGroup);
		biblio.Assert(tgroupFinestraEdicio!=null, "dlglaboratori tgroupFinestraEdicio null");	

	tgSeleccioEspecie = tgroupFinestraEdicio.transform.Find("tgSeleccioEspecie").GetComponent(UI.Toggle);
	tgSeleccioEspecie.onValueChanged.RemoveAllListeners();
	tgSeleccioEspecie.onValueChanged.AddListener(function () {	ToogleTab("cvSeleccioEspecie"); } );

	tgGenome = tgroupFinestraEdicio.transform.Find("tgGenome").GetComponent(UI.Toggle);
	tgGenome.onValueChanged.RemoveAllListeners();
	tgGenome.onValueChanged.AddListener(function () {	ToogleTab("cvGenome"); } );

	tgHelp = tgroupFinestraEdicio.transform.Find("tgHelp").GetComponent(UI.Toggle);
	tgHelp.onValueChanged.RemoveAllListeners();
	tgHelp.onValueChanged.AddListener(function () {	ToogleTab("cvHelp"); } );	// es cridaran tots dos!
	
	//tgEstadistiques = tgroupFinestraEdicio.transform.Find("tgEstadistiques").GetComponent(UI.Toggle);
	//tgEstadistiques.onValueChanged.RemoveAllListeners();
	//tgEstadistiques.onValueChanged.AddListener(function () {	ToogleTab("cvEstadistiques"); } );	// es cridaran tots dos!
	
	
	// recupera punter a canvas seleccio especie
	
	cvSeleccioEspecie = GameObject.Find("/Display/dlgLaboratori/cvSeleccioEspecie");
		biblio.Assert(cvSeleccioEspecie!=null, "dlglaboratori cvSeleccioEspecie null");
	// posa noms botons
	InformaTabSeleccioEspecie();


	
	// recupera punter a canvas genome
	
	cvGenome = GameObject.Find("/Display/dlgLaboratori/cvGenome");
		biblio.Assert(cvGenome!=null, "dlglaboratori cvGenome null");
	txtGenome = cvGenome.transform.Find("txtGenome").GetComponent(UI.Text);
		biblio.Assert(cvGenome!=null, "dlglaboratori txtGenome null");
	// recupera punter a nom genere seleccionat
	txtNomEspecie = GameObject.Find("/Display/dlgLaboratori/cvGenome/txtNomEspecie").GetComponent(UI.Text);	
	goGrupSliderGen = cvGenome.Find("goGrupSliderGen");
		biblio.Assert(goGrupSliderGen!=null, "dlglaboratori goGrupSliderGen null");

	// WARNING TIPUS ve perque GetComponentsInChildre torna un Component[]
	// i jo vull UI.Sliders...
	var temp = goGrupSliderGen.GetComponentsInChildren(UnityEngine.UI.Slider);
	var j = 0;
	listSliders = new UnityEngine.UI.Slider[10];
	for (var x : UnityEngine.UI.Slider in temp) {
		listSliders [j++] = x;
	}
	// posem callbacks a sliders
	var i = 0;
	for (var sl : UnityEngine.UI.Slider in listSliders) {
		sl.onValueChanged.RemoveAllListeners();
		sl.onValueChanged.AddListener(function () {   SliderGenValueChange(sl); } );  // OJO PARAMETRE <---
	
		// gen0 and gen1 are read only
		if (sl.transform.parent.name == "sliderGen0" || sl.transform.parent.name == "sliderGen1") {
			sl.interactable = false;
		}
	}	
	
	
	// recupera punter a canvas help
	
	cvHelp = GameObject.Find("/Display/dlgLaboratori/cvHelp");
		biblio.Assert(cvHelp!=null, "dlglaboratori cvHelp null");

	panelObjecteDetall = cvHelp.Find("panelObjecteDetall"); 
		biblio.Assert(panelObjecteDetall!=null, "No he trobat panelObjecteDetall en dlgLaboratori.Start");
	//txtObjecteDetall = panelObjecteDetall.Find("scrollRect2/txtObjecteDetall").GetComponent(UI.Text);
	//	biblio.Assert(txtObjecteDetall!=null, "No he trobat txtObjecteDetall en ObjecteDetall.Start");		


	// recupera punter a canvas estadistiques
	/*
	cvEstadistiques = GameObject.Find("/Display/dlgLaboratori/cvEstadistiques");
		biblio.Assert(cvEstadistiques!=null, "dlglaboratori cvEstadistiques null");

	txtEstadistiques = cvEstadistiques.transform.Find("scrollRect3/TextEstadistiques").GetComponent(UI.Text);
		biblio.Assert(txtEstadistiques!=null, "dlglaboratori txtEstadistiques null");
	txtStatsCapcalera = GameObject.Find("/Display/dlgLaboratori/cvEstadistiques/txtStatsCapcalera").GetComponent(UI.Text);	
	txtStatsNivellTrofic = GameObject.Find("/Display/dlgLaboratori/cvEstadistiques/txtStatsNivellTrofic").GetComponent(UI.Text);	
	*/
	
	// recupera punter a boto sortir
	
	but = GameObject.Find("btn_sortir").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {	UIMgr.instance.HudTogglePanellExclusiu("Laboratori"); } );


	// panell per defecte seleccio especie
	
	tgSeleccioEspecie.isOn=true;	
	//ToogleTab("cvSeleccioEspecie");
	
	Debug.Log(">>> dlgLaboratori - Start() - fi");
}

//function Update() {

	// actualitza les estadistiques de morts
	/*
	if (Time.frameCount%20==0) {
		if (tgEstadistiques.isOn && idEspecieEditada!=-1 && idEspecieEditada !=null) { 
			InformaTabEstadistiques();
		}
	}
	*/
//}

// Open() can be called in two ways
//	- with a selected creature --> opens genome tab for its gender
//  - without one --> opens specie selection tab


function Open() {
	if (!inicialitzat)
		Start();
					
	this.gameObject.SetActive(true);
	
	// remember position of mouse at open to get temperature
	
	posMouseWhenOpen = GameController.instance.biotop.PosMouseTerrain();
		
	// check for selected creature
		
	if (ObjecteSeleccionat.instance.CreatureSeleccionat != null) {

		idEspecieEditada = ObjecteSeleccionat.instance.CreatureSeleccionat.dna.idGenus;
		
		// check if creature is present in lab
		//if (idEspecieEditada <= laboratori.ousNumEspecies) {
		if (idEspecieEditada <= Biocenosi.instance.speciesMax) {
		
			// store specie
			SelectEspecie(idEspecieEditada);
			if (posMouseWhenOpen == null) {
				posMouseWhenOpen = ObjecteSeleccionat.instance.CreatureSeleccionat.transform.position;
			}
			// set genome tab unless estadistiques was previously selected
			tgGenome.interactable=true;
			//tgEstadistiques.interactable=true;
			//if (!tgEstadistiques.isOn && !tgGenome.isOn) {
			if (!tgGenome.isOn) {
				tgGenome.isOn = true;
			}
		}
		else {
		
			// this creature is not in the lab
			if (!tgSeleccioEspecie.isOn)
				tgSeleccioEspecie.isOn = true;
			idEspecieEditada = -1;
			tgGenome.interactable=false;
			//tgEstadistiques.interactable=false;
		}
	}
	else {
	
		// no creature selected, open selection tab
		if (!tgSeleccioEspecie.isOn)
			tgSeleccioEspecie.isOn = true;
		idEspecieEditada = -1;
		tgGenome.interactable=false;
		//tgEstadistiques.interactable=false;
	}


	
	if (posMouseWhenOpen !=null) {
		tempAtMousePosition = GameController.instance.biotop.TempSobreTerreny(posMouseWhenOpen);
	}
	else {
		tempAtMousePosition = -1000;
	}
	Debug.Log("DlgLaboratori.Open: mouse at= "+posMouseWhenOpen+" temp= "+tempAtMousePosition);
	

}


// Es crida des dels botons del menu d'especies de l'esquerra
// Posa el nom de l'especie corresponent i refresca el tab actiu

function SelectEspecie(id: int) {

	// aquesta es estatica
	
	idEspecieEditada  = id;

	// activa el model Laboratori en la criatura editada, si existeix
	
	// desactiva l'anterior
	if (criaturaEditada!=null) {
		criaturaEditada.SetLaboratoriOff();
	}
	if (ObjecteSeleccionat.instance.CreatureSeleccionat!=null) {
		criaturaEditada = ObjecteSeleccionat.instance.CreatureSeleccionat;
		criaturaEditada.SetLaboratoriOn();
	}

	// posa nom a tabs genome i estadistiques
	
	txtNomEspecie.text = id+". "+biocenosi.species[id].dna.nomPantalla;// + "  ("+biocenosi.species[id].nomGenere+") "; // + foranea;
	//txtStatsNivellTrofic.text = "Stats";
	txtGenome.text = laboratori.ousGenome[id].ToString();	

	// activate genome tab
	tgGenome.interactable=true;
	//tgEstadistiques.interactable=true;
	if (!tgGenome.isOn)
		tgGenome.isOn = true;
	//ToogleTab("cvGenome");
			
}

// Sortir

function Toogle()  {
		
	if (this.gameObject.activeSelf)
		Close();
	else	
		Open();
}

function Close()  {

	if (criaturaEditada!=null) {
		criaturaEditada.SetLaboratoriOff();
	}
	this.gameObject.SetActive(false);
}



// Activate tab

private function ToogleTab(nomCanvas: String) {
		
	//if (idEspecieEditada == -1 && (nomCanvas=="cvGenome" || nomCanvas=="cvEstadistiques")) {
	if (idEspecieEditada == -1 && nomCanvas=="cvGenome") {
		return;
	}

	cvSeleccioEspecie.SetActive(false);	
	cvGenome.SetActive(false);
	//cvEstadistiques.SetActive(false);
	cvHelp.SetActive(false);
		
	switch(nomCanvas) {
	case "cvSeleccioEspecie":
		//if (tgSeleccioEspecie.isOn == false)
		//	tgSeleccioEspecie.isOn=true;				//  <-- ojo, estic fent un bucle!!
		cvSeleccioEspecie.SetActive(true);
		// reset specie
		break;
	case "cvGenome":
		//if (tgGenome.isOn == false)
		//	tgGenome.isOn = true;
		cvGenome.SetActive(true);
		InformaTabGenome();
		InformaTabVariables();
		break;
	case "cvHelp":
		//if (tgHelp.isOn == false)
		//	tgHelp.isOn = true;
		cvHelp.SetActive(true);
		//InformaTabVariables();
		break;
	/*
	case "cvEstadistiques":
		//if (tgEstadistiques.isOn == false)
		//	tgEstadistiques.isOn = true;
		//cvEstadistiques.SetActive(!cvEstadistiques.activeSelf);
		cvEstadistiques.SetActive(true);
		InformaTabEstadistiques();
		break;
	*/
	default:
		Debug.LogWarning("dlglaboratori.tooglefinestraedicio. error canvas "+nomCanvas);
	}

}

function InformaTabGenome() {
		
		labSpecie.dna = biocenosi.species[idEspecieEditada].dna;
		//17/6: labSpecie.dna.genome.CopyGenome(laboratori.ousGenome[idEspecieEditada]);
		// reconstrueix vars a partir de genome
		labSpecie.dna.UpdateGenome(laboratori.ousGenome[idEspecieEditada]);
		
		// recalculate genome with optimal temperature set to temperature at position of selected creature or camera   <--- should be mouse?3
		if (tempAtMousePosition > -1000) {
			labSpecie.dna.tempOptima = tempAtMousePosition;
			labSpecie.dna.SetGenomeFromVars();
			// copy back modified genome to laboratory
			laboratori.ousGenome[idEspecieEditada].CopyGenome(labSpecie.dna.genome);
			biocenosi.species[idEspecieEditada].dna = labSpecie.dna;
		}

		// posa cada sliders al valor del gen que li toca
		for (var sl : UnityEngine.UI.Slider in listSliders) {
			var j : int;
			j = sl.gameObject.transform.parent.name[9];     // OJO, presuposa nom sliders = "sliderGen#"
			j -= 48;	//48 es el unicode de "0"
			sl.gameObject.transform.parent.Find("genValue").GetComponent(UI.Text).text = labSpecie.dna.genome.gen[j].ToString();
			sl.gameObject.transform.parent.Find("description").GetComponent(UI.Text).text = Textos.instance.msg("GenName"+j.ToString());
			sl.gameObject.transform.parent.Find("textLow").GetComponent(UI.Text).text = Textos.instance.msg("GenLow"+j.ToString());
			sl.gameObject.transform.parent.Find("textHigh").GetComponent(UI.Text).text = Textos.instance.msg("GenHigh"+j.ToString());
			sl.value = labSpecie.dna.genome.gen[j];
			
			// si no es forania, desactiva el slder
			//sl.interactable= especieEditadaEsForanea;
			
		}

}

function InformaTabVariables() {

	// actualitzem el adn amb el genome actual
	//labSpecie.nomGenere = laboratori.ousNomEspecie[idEspecieEditada];
	labSpecie.nomGenere = biocenosi.species[idEspecieEditada].dna.nomPantalla;
	labSpecie.dna = biocenosi.species[idEspecieEditada].dna;

}

/*
function InformaTabEstadistiques() {
	
	// capcalera amb els noms de les especies
	txtStatsCapcalera.text = FormatGeneres.instance.StatsMortsCapcalera(idEspecieEditada);

	// contingut
	txtEstadistiques.text = FormatGeneres.instance.StatsMortsToString(idEspecieEditada);
	
	if (laboratori.ousInfinits) 
		txtEstadistiques.text += "\n\nUnlimited units to spawn from lab";
	else {
		if (biocenosi.species[idEspecieEditada].lab) 
			txtEstadistiques.text += "\n\n"+laboratori.ousQuantitat[idEspecieEditada]+ " units to spawn from lab";
		else
			txtEstadistiques.text += "\n\n0 units to spawn from lab";
	}

	txtEstadistiques.text += "\n\nT="+SimTime.simTime.ToString("F1");

}
*/

// si es mou un slider dels genomes actualitza el genome del laboratori, de la criatura seleccionada i actualitza les vars

function SliderGenValueChange(sl: UnityEngine.UI.Slider) {
	// llegim valor del slider
	var val = sl.value;
	// l'actualitzem al panell
	sl.transform.gameObject.transform.parent.Find("genValue").GetComponent(Text).text = val.ToString();
	//Debug.Log("SliderGenValueChange slider="+sl+ " nou valor:"+val);
	
	// recuperem el #del gen a partir del titol que te en pantalla, mes o menys: j=val(name)
	var j : int;
	j = sl.transform.parent.name[9];			// OJO, presuposa nom sliders = "sliderGen#"
	j -= 48;	//48 es el unicode de "0"
	
	labSpecie.dna.genome.SetGen(j, sl.value);			// el que fem servir internament

	// actualitza el genome de l'especie en laboratori 
	//biocenosi.species[idEspecieEditada].dna.Gen2Var(j,sl.value);
	biocenosi.species[idEspecieEditada].dna.UpdateGenome(labSpecie.dna.genome);
	laboratori.ousGenome[idEspecieEditada].gen[j] = sl.value;  // <-- no es fa servir, nomes per recuperar-ho aqui?
	//Debug.Log("dlglabo-canviat gen ou "+j+" = "+sl.value+" o "+laboratori.ousAdn[idEspecieEditada].gens[j]);
	txtGenome.text = laboratori.ousGenome[idEspecieEditada].ToString();	
	

	// si encara esta seleccionat li canviem l'adn i li actualitzem l'aparença
	if (criaturaEditada != null && criaturaEditada.dna.idGenus == idEspecieEditada) {
		//criaturaEditada.dna.Gen2Var(j,sl.value);
		criaturaEditada.dna.UpdateGenome(labSpecie.dna.genome);
		//Debug.Log("DlgLaboratori. Ajustant morfologia de criaturaEditada: "+criaturaEditada);
		criaturaEditada.AjustaMorfologia();
	}
	
	// refresquem variables
	InformaTabVariables();


}


private function InformaTabSeleccioEspecie(){

		// menu seleccio genere: posa nom si hi ha foreign species i amaga els altres
	
	var g = GameObject.Find("/Display/dlgLaboratori/cvSeleccioEspecie");
	biblio.Assert(g!=null, "DlgLaboratori: grupHSeleccioEspecie not found");
	for (var k=0;k<15;k++) {			// <--- There are 15 buttons in the dialog
		if (k<5) {
			var but = g.transform.Find("grup1/Button"+k).GetComponent(UI.Button);
		}
		else if (k<10) {
			but = g.transform.Find("grup2/Button"+k).GetComponent(UI.Button);
		}
		else if (k<15) {
			but = g.transform.Find("grup3/Button"+k).GetComponent(UI.Button);
		}
		
		//if (k< laboratori.ousNumEspecies) {
		if (k< Biocenosi.instance.speciesMax) {
		
			// put name of species in buttons
			but.transform.Find("TextGenere").GetComponent(UI.Text).text = k+"."+Biocenosi.instance.species[k].dna.nomPantalla;	
			
			// add listener			
			but.onClick.RemoveAllListeners();
			// sembla que si poso parametre k agafar l'ultim valor (17)
			if (k==0) but.onClick.AddListener(function () {	SelectEspecie(0); } );
			if (k==1) but.onClick.AddListener(function () {	SelectEspecie(1); } );
			if (k==2) but.onClick.AddListener(function () {	SelectEspecie(2); } );
			if (k==3) but.onClick.AddListener(function () {	SelectEspecie(3); } );
			if (k==4) but.onClick.AddListener(function () {	SelectEspecie(4); } );
			if (k==5) but.onClick.AddListener(function () {	SelectEspecie(5); } );
			if (k==6) but.onClick.AddListener(function () {	SelectEspecie(6); } );
			if (k==7) but.onClick.AddListener(function () {	SelectEspecie(7); } );
			if (k==8) but.onClick.AddListener(function () {	SelectEspecie(8); } );
			if (k==9) but.onClick.AddListener(function () {	SelectEspecie(9); } );
			if (k==10) but.onClick.AddListener(function () {	SelectEspecie(10); } );
			if (k==11) but.onClick.AddListener(function () {	SelectEspecie(11); } );
			if (k==12) but.onClick.AddListener(function () {	SelectEspecie(12); } );
			if (k==13) but.onClick.AddListener(function () {	SelectEspecie(13); } );
			if (k==14) but.onClick.AddListener(function () {	SelectEspecie(14); } );
			if (k==15) but.onClick.AddListener(function () {	SelectEspecie(15); } );
		
		}
		else {
			but.interactable= false;		
		}	
	}
	

}
