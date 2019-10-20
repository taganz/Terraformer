#pragma strict

//var dlgAjuda : Animator;
@HideInInspector var dlgAjudaNivell : GameObject;
static var instance : DlgAjudaNivell;
private var inicialitzat = false;

function Awake() {
	instance = this;
}


static function Instance(): DlgAjudaNivell {
	if (instance==null) {
		instance = FindObjectOfType(typeof (DlgAjudaNivell));
		biblio.Assert(instance!=null, "DlgAjudaNivell.Instance Falta objecte");
	}
	return instance; 
}




function Start() {
		
	this.gameObject.SetActive(true);
		
	// boto sortir
	
	var but = this.gameObject.Find("btnTancar").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {	this.gameObject.SetActive(false); } );

	// posa instruccions 
	var txtAjudaNivell = this.gameObject.Find("txtAjudaNivell").GetComponent(UI.Text);
	//txtAjudaNivell.text = Textos.instance.msg(9010);
	txtAjudaNivell.text = Textos.instance.msg("HelpKeys");

	inicialitzat = true;
	
}



function Open() {
	if (!inicialitzat)
		Start();					
	this.gameObject.SetActive(true);

}	
	

function Close()  {

	this.gameObject.SetActive(false);
}


function Toogle()  {
		
	if (this.gameObject.activeSelf)
		Close();
	else	
		Open();
}
 