#pragma strict

static var instance : MenuDebug;
private var menuDebug : GameObject;

function Awake() {

	instance = this;
	
	// panel menu debug
	
	menuDebug = GameObject.Find("/Display/menuDebug");
	biblio.Assert(menuDebug!=null, "MenuDebug.Awake No he trobat menuDebug");
	
	var but = GameObject.Find("/Display/menuDebug/btnGeneraFitxerAdn").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener( function() { BtnGeneraFitxerAdn(); } );
	
	but = GameObject.Find("/Display/menuDebug/btnStatus").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener( function() { BtnStatus(); } );
	
	but = GameObject.Find("/Display/menuDebug/btnSelectParir").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener( function() { BtnSelectParir(); } );
	
	but = GameObject.Find("/Display/menuDebug/btnSelectRadiVisio").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener( function() { BtnSelectRadiVisio(); } );
	
	menuDebug.SetActive(false); 

}

function Start () {

}

function Update () {

}


function BtnStatus(){
	UIMgr.instance.PanelStatusToogle();
}

function BtnGeneraFitxerAdn() {
	UIMgr.instance.AvisUsuari("Generant fitxer dna...");
	FitxerAdn.instance.Genera(); 
}

// fes parir a la criatura seleccionada

function BtnSelectParir() {
	if (ObjecteSeleccionat.instance.CreatureSeleccionat != null) {
		ObjecteSeleccionat.instance.CreatureSeleccionat.Parir();
	}
	else {
		UIMgr.instance.AvisUsuari("Select a creature first");
	}
}


// pinta un quadro amb el radi de visio del sim seleccionat

function BtnSelectRadiVisio() {
	ObjecteSeleccionat.instance.drawVisionSquare = !ObjecteSeleccionat.instance.drawVisionSquare;
	//var ev = ObjecteSeleccionat.instance.CreatureSeleccionat;
	if (ObjecteSeleccionat.instance.CreatureSeleccionat != null) {
		//biblio.DebugDrawSquare(ev.transform.position, ev.dna.radiVisioCurt*2, Color.yellow, 0.3f);
		//biblio.DebugDrawSquare(ev.transform.position, ev.dna.radiVisio*2, Color.yellow, 0.3f);
	}
	else {
		UIMgr.instance.AvisUsuari("No creature selected");
	}
}



public function Open() {
	GameController.instance.BloquejaMouse();
	this.gameObject.SetActive(true);
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