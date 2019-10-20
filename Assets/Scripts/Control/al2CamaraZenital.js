#pragma strict
static var instance : al2CamaraZenital;

// respon a cursor per moure i a pgup/pgdn per pujar i baixar

var zoom = 10;		// zoom per PageUp i PageDown
var velocitat = 2;		// multiplicador de la velocitat
//var hInicial = 150;		// TBD a calcular segons el camp

private var hMin : float;
private var hMax : float;
@HideInInspector var lastY : float;

function Awake() {
	instance = this;
	this.gameObject.SetActive(false);
}

function Start () {

	//hMin = Planeta.instance.hMaxJetPack+1;
	hMin = Planeta.instance.hMinCamaraZenital;
	hMax = Planeta.instance.hMaxCamaraZenital;
	Debug.Log("CAMARA ZENITAL. Start. Interval valid en el terreny: hMin="+hMin + "  hMax="+hMax);
	lastY = transform.position.y;
	//ShowH();

}

function Update () {

	// corregeix alçada si esta per sota terreny
	if (transform.position.y < Terrain.activeTerrain.SampleHeight(transform.position)+hMin) {
		ShowH("Elevant automaticament... ");
		transform.position.y = Terrain.activeTerrain.SampleHeight(transform.position)+hMin;
	}



	// llegeix pgup i pgdn per pujar i baixar camara
	
	if (Input.GetKey(KeyCode.PageUp) || (Input.GetAxis("Mouse ScrollWheel") > 0) )
		Elevar(); 
	
		
	if (Input.GetKey(KeyCode.PageDown) || (Input.GetAxis("Mouse ScrollWheel") < 0))
		Baixar();
	
		
			
					
	// llegeix el cursor per desplaçar
	
	var directionVector = new Vector3(Input.GetAxis("Horizontal"), 0, Input.GetAxis("Vertical"));
	if (directionVector != Vector3.zero) {
		// moviment tret del fpsinputcontroller. esta optimitzat per joysticks i no se que mes
		var directionLength = directionVector.magnitude;
		directionVector = directionVector / directionLength;
		directionLength = Mathf.Min(1, directionLength);
		directionLength = directionLength * directionLength;
		directionVector = directionVector * directionLength;
		ShowH();
	}
	transform.position += directionVector *2;
		
}

function Elevar() {
	if  (transform.position.y < Terrain.activeTerrain.SampleHeight(transform.position)+hMax) {
		transform.position += Vector3.up*zoom;
		lastY = transform.position.y;
		ShowH();
	}
	else {
		ShowH("Alçada maxima!");
	}
}

function Baixar() {
	if (transform.position.y > Terrain.activeTerrain.SampleHeight(transform.position)+ hMin) {
		transform.position += Vector3.down*zoom;
		lastY = transform.position.y;
		ShowH();
	}
	else {
		ShowH("Alçada minima! (J) per JetPack, (C) per aterrar");
	}
	// abans si baixaves molt passaves a jetpack. ara no
	//	GameController.instance.CanviaEstat(EstatJoc.JetPack);


}


function ShowH() {
	UIMgr.instance.AvisUsuari(Planeta.instance.pos2h(transform.position)+" m");
}

function ShowH(txtAfegit: String) {
	var s : String;
	s = Planeta.instance.pos2h(transform.position)+" m - "+txtAfegit;
	UIMgr.instance.AvisUsuari(s);
}

function PosarAYMin() {

		transform.position.y = Terrain.activeTerrain.SampleHeight(transform.position)+hMin;

}


function PosarAYMax() {

		transform.position.y = Terrain.activeTerrain.SampleHeight(transform.position)+hMax;

}
