#pragma strict

// info objecte seleccionat
//
// la informacio l'omple ObjecteSeleccionat
//
// dlgLaboratori tambe toca txtObjecteDetall

static var instance : AcordioSeleccionat;
var txtNomPantalla : UI.Text;
var txtObjecteSeleccionat : UI.Text;
var txtObjecteDetall : UI.Text;
var txtStatsMorts : UI.Text;
var txtDebug : UI.Text;

private var acordioSeleccionat : GameObject; 

private var InfoObjecteSeleccionat : Toggle;
private var InfoObjecteDetall : Toggle; 
private var InfoStatsMorts : Toggle; 
private var InfoDebug : Toggle; 
private var inicialitzat = false;



function Awake() {
	instance = this;
//}

//function Start(){

	acordioSeleccionat = GameObject.Find("/Display/acordioSeleccionat");
		biblio.Assert(acordioSeleccionat!=null, "No he trobat /Display/acordioSeleccionat en AcordioEcosistema.Start");

	txtNomPantalla = acordioSeleccionat.Find("txtNomPantalla").GetComponent(UI.Text);
		biblio.Assert(txtNomPantalla!=null, "No he trobat txtNomPantalla en AcordioEcosistema.Start");
	txtObjecteSeleccionat = acordioSeleccionat.Find("txtObjecteSeleccionat").GetComponent(UI.Text);
		biblio.Assert(txtObjecteSeleccionat!=null, "No he trobat txtObjecteSeleccionat en AcordioEcosistema.Start");
	txtObjecteDetall = acordioSeleccionat.Find("txtObjecteDetall").GetComponent(UI.Text);
		biblio.Assert(txtObjecteDetall!=null, "No he trobat txtObjecteDetall en AcordioEcosistema.Start");
	txtStatsMorts = acordioSeleccionat.Find("txtStatsMorts").GetComponent(UI.Text);
		biblio.Assert(txtStatsMorts!=null, "No he trobat txtStatsMorts en AcordioEcosistema.Start");
	txtDebug = acordioSeleccionat.Find("txtDebug").GetComponent(UI.Text);
		biblio.Assert(txtDebug!=null, "No he trobat txtDebug en AcordioEcosistema.Start");

	// els InfoXXXTab han d'estar en majuscula
	InfoObjecteSeleccionat = GameObject.Find("/Display/acordioSeleccionat/InfoObjecteSeleccionat").GetComponent(Toggle);
		biblio.Assert(InfoObjecteSeleccionat!=null, "No he trobat InfoObjecteSeleccionat en AcordioEcosistema.Start");
	InfoObjecteDetall = GameObject.Find("/Display/acordioSeleccionat/InfoObjecteDetall").GetComponent(Toggle);
		biblio.Assert(InfoObjecteDetall!=null, "No he trobat InfoObjecteDetall en AcordioEcosistema.Start");
	InfoStatsMorts = GameObject.Find("/Display/acordioSeleccionat/InfoStatsMorts").GetComponent(Toggle);
		biblio.Assert(InfoStatsMorts!=null, "No he trobat InfoStatsMorts en AcordioEcosistema.Start");
	InfoDebug = GameObject.Find("/Display/acordioSeleccionat/InfoDebug").GetComponent(Toggle);
		biblio.Assert(InfoDebug!=null, "No he trobat InfoDebug en AcordioEcosistema.Start");
	
	Close();
	
}




public function Open() {
	GameController.instance.BloquejaMouse();
	this.gameObject.SetActive(true);
}

public function Close() {
	if (this.gameObject != null)
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
