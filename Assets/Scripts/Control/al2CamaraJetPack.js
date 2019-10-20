#pragma strict
static var instance : al2CamaraJetPack;

// camara panoramica 
// respon a cursor per moure i a pgup/pgdn per pujar i baixar

var zoom = 10;		// zoom per PageUp i PageDown
var speed = 2;		// multiplicador de la speed
//var hInicial = 150;		// TBD a calcular segons el camp

private var hMin : float;
private var hMax : float;
private var controller : GameController;
private var player : GameObject;
@HideInInspector var lastY : float;

function Awake() {
	instance = this;
}

function Start () {

	controller = GameController.instance;
	//player = transform.parent.gameObject;
	
	hMin = Planeta.instance.hMinJetPack;
	hMax = Planeta.instance.hMaxJetPack;
	Debug.Log("CAMARA PANORAMICA. Start. Interval valid en el terreny: hMin="+hMin + "  hMax="+hMax);
	lastY = transform.position.y;
	
	
}

function Update () {

	// corregeix alçada si esta per sota terreny
	if (transform.position.y < Terrain.activeTerrain.SampleHeight(transform.position)+hMin)
		transform.position.y = Terrain.activeTerrain.SampleHeight(transform.position)+hMin;



	// llegeix pgup i pgdn per pujar i baixar camara
	
	if (Input.GetKey(KeyCode.PageUp) || (Input.GetAxis("Mouse ScrollWheel") > 0) )
		Elevar(); 
	
		
	if (Input.GetKey(KeyCode.PageDown) || (Input.GetAxis("Mouse ScrollWheel") < 0))
		Baixar();
		
	// llegeix el cursor per desplaçar
	var h = transform.position.y;		// amb el cursor no mourem la y
	var directionVector = new Vector3(Input.GetAxis("Horizontal"), 0, Input.GetAxis("Vertical"));
	if (directionVector != Vector3.zero) {
		// moviment tret del fpsinputcontroller. esta optimitzat per joysticks i no se que mes
		var directionLength = directionVector.magnitude;
		directionVector = directionVector / directionLength;
		directionLength = Mathf.Min(1, directionLength);
		directionLength = directionLength * directionLength;
		directionVector = directionVector * directionLength;
	}
	
		// aixo servia quan la camara sempre estava en direccio front. si mouselook la gira cal canviar la direccio 		
		//transform.position += directionVector *2;
		
		transform.position += transform.TransformDirection(directionVector *2);		
		transform.position.y = h;
		if (transform.position.y > Terrain.activeTerrain.SampleHeight(transform.position) + hMax) {
			UIMgr.instance.AvisUsuari("Jet Pack alcada maxima. 'c' per entrar en la nau...");
			//GameController.instance.CanviaEstat(EstatJoc.Sim);
			transform.position.y = Terrain.activeTerrain.SampleHeight(transform.position) + hMax;
		}
		else 
		if (transform.position.y < Terrain.activeTerrain.SampleHeight(transform.position) + hMin) {
			UIMgr.instance.AvisUsuari("Jet Pack alçada minima. SPACE per aterrar...");
			transform.position.y = Terrain.activeTerrain.SampleHeight(transform.position) + hMin;
		}

}

function Elevar() {

	switch(controller.estat) {
	case EstatJoc.JetPackControl:
	case EstatJoc.JetPack:
		if  (transform.position.y < Terrain.activeTerrain.SampleHeight(transform.position) + hMax) {
			transform.position += Vector3.up*zoom;
			//player.transform.position += Vector3.up*zoom;
		}
		else {
			UIMgr.instance.AvisUsuari("Jet Pack alcada maxima. 'c' per entrar en la nau...");
		}
		break;
	//case EstatJoc.Player:
	//case EstatJoc.PlayerControl:
	//	controller.CanviaEstat(EstatJoc.JetPack);
	//	break;	
	default:
		Debug.LogError("alCamaraJetPack.Elevar estat desconegut "+controller.estat);
	}
	lastY = transform.position.y;
}

function Baixar() {

	switch(controller.estat) {
	case EstatJoc.JetPackControl:
	case EstatJoc.JetPack:
		if (transform.position.y > Terrain.activeTerrain.SampleHeight(transform.position) + hMin) {
			transform.position += Vector3.down*zoom;
			//player.transform.position += Vector3.down*zoom;
		}
		else {	
			//GameController.instance.CanviaEstat(EstatJoc.Player);
			UIMgr.instance.AvisUsuari("Jet Pack alçada minima. SPACE per aterrar...");
		}
		break;
	//case EstatJoc.Player:
	//case EstatJoc.PlayerControl:
	case EstatJoc.EstatNull:
		break;
	default:
		Debug.LogError("alCamaraJetPack.Elevar estat desconegut "+controller.estat);
	}
	lastY = transform.position.y;
}


// posa la camara a l'alcada buscada i si es zero a hMin
function PosarAYMin(hBuscada: float) {
	if (hBuscada == 0 || hBuscada < hMin)
		transform.position.y = Terrain.activeTerrain.SampleHeight(transform.position)+hMin;
	else
		transform.position.y = Terrain.activeTerrain.SampleHeight(transform.position)+hBuscada;
	

}


function PosarAYMax() {

		transform.position.y = Terrain.activeTerrain.SampleHeight(transform.position)+hMax;

}
