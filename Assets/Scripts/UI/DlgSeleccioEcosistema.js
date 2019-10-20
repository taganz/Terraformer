#pragma strict

// dlgSeleccioEcosistema 
// - usuari escull ecosistema on vol entrar
// - el crida controller abans d'arrancar el nivell

static var instance : DlgSeleccioEcosistema;
private var controller : GameController;
private var txtPlaneta : UI.Text;
private var txtInfoPlaneta : UI.Text;


function Awake() {
	instance = this;
	//Debug.LogError("DlgSeleccioEcosistema awake ok");
}

/*
static function Instance(): DlgSeleccioEcosistema {
	if (instance==null) {
		instance = FindObjectOfType(typeof (DlgSeleccioEcosistema));
		biblio.Assert(instance!=null, "DlgSeleccioEcosistema.Instance Falta objecte");
	}
	return instance; 
}
*/
//function Start() {
//	controller = GameController.instance;
//	biblio.Assert(controller!=null, "DlgSeleccioEcosistema.Start");
//}

function Open () {
	
	if (controller==null) {
		controller = GameController.instance;
		biblio.Assert(controller!=null, "DlgSeleccioEcosistema.Start");
	}
	
	this.gameObject.SetActive(true);
	
	if (instance==null)
		instance = this;
	
	var but = this.transform.Find("goBotons/btn_eco1").GetComponent(UI.Button);
	biblio.Assert(but!=null, "DlgSeleccioEcosistema.Obrir: but=goBotons/btn_eco1 null");
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {	Close(); controller.StartEcosystem(1); } );
	
	but.transform.Find("txt_eco").GetComponent(Text).text = controller.titolNivell[0];
	but = this.transform.Find("goBotons/btn_eco2").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {	Close(); controller.StartEcosystem(2); } );
	//but.onClick.AddListener(function () {	Close(); controller.StartEcosystem(2); } );
	
	but.transform.Find("txt_eco").GetComponent(Text).text = controller.titolNivell[1];
	but = this.transform.Find("goBotons/btn_eco3").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {	Close(); controller.StartEcosystem(3); } );
	
	but.transform.Find("txt_eco").GetComponent(Text).text = controller.titolNivell[2];
	but = this.transform.Find("goBotons/btn_eco4").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {	Close(); controller.StartEcosystem(4); } );
	
	but.transform.Find("txt_eco").GetComponent(Text).text = controller.titolNivell[3];
	but = this.transform.Find("goBotons/btn_eco5").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {	Close(); controller.StartEcosystem(5); } );
	
	but.transform.Find("txt_eco").GetComponent(Text).text = controller.titolNivell[4];

	//Debug.Log("DlgSeleccioEcosistemes. Capturant nom planeta...");
	
	// info del planeta que es mostra a l'esquerra del dialeg
	
	txtPlaneta = gameObject.transform.Find("txtPlaneta").GetComponent(UI.Text);
	txtPlaneta.text = "Planet: "+Planeta.instance.nomPlaneta;
	txtInfoPlaneta = gameObject.transform.Find("txtInfoPlaneta").GetComponent(UI.Text);
	
	// text descripcio sota de la foto
	txtInfoPlaneta.text = TextPlaneta();

	
	//biblio.Assert(Planeta.instance!=null, "Planeta.instance null");

	// obre el panell amb info dels ecosistemes
		
	//InfoEcosistemes.instance.Open();
	
}


function Close() {
	//InfoEcosistemes.instance.Close();
	this.gameObject.SetActive(false);

}


private function TextPlaneta() {
	return 
		//Planeta.instance.nomPlaneta
		Planeta.instance.comment
		+ "\nHeigh difference: "+Planeta.instance.desnivell
		//+ "\nTemp. a 0 m: "+ GameController.instance.biotop.tempMitja
		//+ "\nRadiation (0-100): "+GameController.instance.biotop.radiacioMitja
		;

}
		