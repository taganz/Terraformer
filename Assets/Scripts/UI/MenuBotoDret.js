#pragma strict
import UnityEngine.UI;

/*
// Si fas boto dret apareix el menu contextual


static var instance : MenuBotoDret;

private var posWorldBotoDret : Vector3;

private var panelBotoDret : GameObject;
	private var txtBotoDretInfo : UI.Text;
	private var btnBotoDretSpawn : UI.Button;
	private var btnBotoDretExplorar : UI.Button;
	private var btnBotoDretJetPack : UI.Button;
	private var btnBotoDretEmbarcar : UI.Button;

private var controller : GameController;

function Awake() {
	instance = this;

}

function Start () {

	controller = GameController.instance;
	
	// panelBotoDret
	var but : UI.Button;
	
	panelBotoDret = GameObject.Find("/Display/panelBotoDret"); 
	biblio.Assert(panelBotoDret!=null, "No he trobat panelBotoDret en UIMgr.Start");
		txtBotoDretInfo = GameObject.Find("/Display/panelBotoDret/txtBotoDretInfo").GetComponent(UI.Text);
		biblio.Assert(txtBotoDretInfo!=null, "No he trobat txtBotoDretInfo en UIMgr.Start");
		btnBotoDretSpawn = GameObject.Find("/Display/panelBotoDret/btnBotoDretSpawn").GetComponent(UI.Button);
		btnBotoDretSpawn.onClick.RemoveAllListeners();
		btnBotoDretSpawn.onClick.AddListener(function () {	UIMgr.instance.AvisUsuari("SPAWN NO IMPLEMENTAT"); } );
		btnBotoDretExplorar = GameObject.Find("/Display/panelBotoDret/btnBotoDretExplorar").GetComponent(UI.Button);
		btnBotoDretExplorar.onClick.RemoveAllListeners();
		btnBotoDretExplorar.onClick.AddListener(function () {	panelBotoDret.SetActive(false);controller.player.transform.position = posWorldBotoDret;controller.CanviaEstat(EstatJoc.Player); } );
		btnBotoDretJetPack = GameObject.Find("/Display/panelBotoDret/btnBotoDretJetPack").GetComponent(UI.Button);
		btnBotoDretJetPack.onClick.RemoveAllListeners();
		btnBotoDretJetPack.onClick.AddListener(function () {	panelBotoDret.SetActive(false);controller.player.transform.position = posWorldBotoDret;controller.CanviaEstat(EstatJoc.JetPack); } );
		btnBotoDretEmbarcar = GameObject.Find("/Display/panelBotoDret/btnBotoDretEmbarcar").GetComponent(UI.Button);
		btnBotoDretEmbarcar.onClick.RemoveAllListeners();
		btnBotoDretEmbarcar.onClick.AddListener(function () {	panelBotoDret.SetActive(false);controller.player.transform.position = posWorldBotoDret;controller.CanviaEstat(EstatJoc.Sim); } );
		but = GameObject.Find("/Display/panelBotoDret/btnBotoDretCancel").GetComponent(UI.Button);
		but.onClick.RemoveAllListeners();
		but.onClick.AddListener(function () {	panelBotoDret.SetActive(false); } );
	panelBotoDret.SetActive(false);

}

function Update() {

	// llegir boto dret
	if (Input.GetMouseButtonDown(1) && GUIUtility.hotControl == 0) {
		var hit1: RaycastHit;
		var ray1: Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		var impacte = Physics.Raycast(ray1, hit1);
		Debug.Log("boto dret en "+hit1.point);
		if (impacte) {
			ClicEnCamaraBotoDret(Input.mousePosition, hit1.point);  
		}
		else {
			ClicEnCamaraBotoDret(Input.mousePosition, biblio.vectorNull);  
		}
	}

}


// clic en zenital --> aterra
function ClicEnCamaraBotoDret(posMouse: Vector2, posWorld:Vector3) {
	var sobreTerreny : boolean;
	sobreTerreny = (posWorld != biblio.vectorNull);
	
	panelBotoDret.transform.position = posMouse;
	
	var yterreny = Terrain.activeTerrain.SampleHeight(posWorld);
	var posSobreTerreny = Vector3(posWorld.x, yterreny, posWorld.z);
	var txt : String;
	if (sobreTerreny) {
		txt  = "("+posWorld.x.ToString("n0")+ ", "+yterreny.ToString("n0")+ ", "+posWorld.z.ToString("n0")+ ")";
		txt += " h: " + GameController.instance.biotop.y2h(yterreny)+" m.   "+GameController.instance.biotop.TempEnPosicio(posSobreTerreny).ToString("n0") +"ºC";	
		posWorldBotoDret = posWorld;		// la fan servir els botons del panell
	
	}
	else {
		txt = "";
		posWorldBotoDret = Camera.main.transform.position;
	}
	txtBotoDretInfo.text = txt;
		
	switch(controller.estat) {
	
		case EstatJoc.JetPackControl:
		case EstatJoc.JetPack:
			//btnBotoDretSpawn.gameObject.SetActive(sobreTerreny);
			//btnBotoDretEmbarcar.gameObject.SetActive(true);
			//btnBotoDretExplorar.gameObject.SetActive(sobreTerreny);
			//btnBotoDretJetPack.gameObject.SetActive(false);
			//panelBotoDret.SetActive(true);
			break;
		case EstatJoc.Sim:
			btnBotoDretSpawn.gameObject.SetActive(sobreTerreny);
			btnBotoDretEmbarcar.gameObject.SetActive(false);
			btnBotoDretExplorar.gameObject.SetActive(sobreTerreny);
			btnBotoDretJetPack.gameObject.SetActive(true);
			panelBotoDret.SetActive(true);
			break;
		case EstatJoc.Player:
			// passa directe a player control, sense menu
			break;
		case EstatJoc.PlayerControl:
			//btnBotoDretSpawn.gameObject.SetActive(sobreTerreny);
			//btnBotoDretEmbarcar.gameObject.SetActive(true);
			//btnBotoDretExplorar.gameObject.SetActive(sobreTerreny);
			//btnBotoDretJetPack.gameObject.SetActive(true);
			//panelBotoDret.SetActive(true);
			break;
		default :
			Debug.Log("alGUI.ClicEnCamaraBotoDret. estat desconegut: "+ controller.estat);
	}
	
	
	
}

*/
