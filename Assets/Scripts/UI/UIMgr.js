#pragma strict
import UnityEngine.UI;

/*
 *  UIMgr
 *	- gestiona l'input de teclat
 *  - obre i tanca panells i gestiona compatibilitat entre ells (panells compatibles i exclusius)
 *  - avisos per l'usuari
 *
 *  TO DO: Fer que els Dlg* derivin d'una classe que gestioni obrir i tancar panells i registre punters, call backs, etc.
 */

static var instance : UIMgr;

private var txtObjectiuNivell: String;

var BiblioRajaOn = false;		// per debug
var BiblioRajaMoltOn = false;		// per debug
var FotosPrefix = "sim";
var FotosSufixRandom = true; // si volem afegir un random al prefix. queda prefix_###_frame.png
//var menuPrincipalDebugOn = false; 	// mostra botons especifics de debug. pensat per escena sandbox

private var esticFentReportatge = false;
var framesReportatge = 500;			// cada quan fara una foto en modo reportatge
private var fotosFetesReportatge = 0;

// per a evitar que els clics als botons vagin cap abaix. ho han de xequejar els objectes de l'escena
//var mouseOnGUI : boolean;			// <-- revisar !!

//var framesPintarGraf = 10; // cada quants frames fa log d'estadistiques

//private var framesUltimPause = 0;		

//private var escalaGrafBiomassa = 1000;		// escala en el grafic. es llegeix de Biocenosi

//private var ultimDeltaTime = -1;

//var mostraFitxaAnimal = false;
//var txtFitxaAnimal : String;

// handle objectes
private var controller : GameController;
private var biocenosi : Biocenosi;
private var laboratori : Laboratori;
private var biotop : Biotop;
private var planeta : Planeta;

private	var display : GameObject; 
private var menuFixe : GameObject;
	private var txtMenuFixe : UI.Text;
private var menuPrincipal : GameObject;
//private var dlgAjudaNivell : GameObject;
//private var dlgLaboratori : DlgLaboratori;
//private var dlgOpcionsNivell : GameObject;
private var panelStatus : GameObject;
	private var txtStatus : UI.Text;
	private var txtStatus2 : UI.Text;
private var menuEstatNau : GameObject;
private var menuEstatPlayer : GameObject;
private var menuEstatJetPack : GameObject;
private var menuEstatControl : GameObject;
//private var menuPrincipalDebug : GameObject;
private var dlgConfirmQuit : GameObject;

private var txtBtnPause : UI.Text;
private var txtBtnSpeed : UI.Text;
private var txtAvis : UI.Text;


// Quan activem un dialeg, al sortir deixem els dialegs que hi havia abans
//enum EstatHud { Ecosistema, Laboratori, Explorar, AnalisiNivell};
enum EstatHud { Ecosistema, Laboratori, AnalisiNivell};
private var estatHudPrevi : EstatHud;
private var hudAcordioEcosistema = false;
private var hudGraficNT = false;
private var hudGraficBiomassa = false;
//private var hudDlgLaboratori = false;
//private var hudDlgAnalisiNivell = false;
private var hudmenuPrincipal = false;
@HideInInspector var hudAcordioSeleccionat = false;				//<-- ho fa servir ObjecteSeleccionat

private var pausatUsuari : boolean = false;
private var inicialitzat : boolean;
private var estatAnterior : EstatJoc;

function Awake() {
	instance = this;
	inicialitzat = false;
	//acordioEcosistema = hud.Find("/Display/acordioEcosistema");
	//	biblio.Assert(acordioEcosistema!=null, "No he trobat acordioEcosistema en al2GUI.Start");

}

// desactivem tots els panells

function Start () {
	Debug.Log("UIMgr start");
	var but : UI.Button;


	// recupera punters

	planeta = Planeta.instance;
	controller = FindObjectOfType(GameController);
	biblio.Assert(controller!=null, "No he trobat controller en al2GUI.Start");
	display = GameObject.Find("/Display");
	biblio.Assert(display!=null, "No he trobat Display en al2GUI.Start");

	// recuperem punters a panells i els desactivem tots
	
	// panel Ajuda
	
	//DlgAjudaNivell.Instance();
	DlgAjudaNivell.instance.gameObject.SetActive(false);
	
	// panel Status
	
	panelStatus = GameObject.Find("/Display/panelStatus");
	biblio.Assert(panelStatus!=null, "No he trobat panelStatus en al2GUI.Start");
	txtStatus = GameObject.Find("/Display/panelStatus/txtStatus").GetComponent(UI.Text);
	biblio.Assert(txtStatus!=null, "No he trobat txtStatus en al2GUI.Start");
	txtStatus.text = ""; 
	txtStatus2 = GameObject.Find("/Display/panelStatus/txtStatus2").GetComponent(UI.Text);
	biblio.Assert(txtStatus2!=null, "No he trobat txtStatus2 en al2GUI.Start");
	txtStatus2.text = ""; 
	panelStatus.SetActive(false);

	// panel dlgConfirmQuit
											
	dlgConfirmQuit = GameObject.Find("/Display/dlgConfirmQuit");
			biblio.Assert(dlgConfirmQuit!=null, "No he trobat dlgConfirmQuit en al2GUI.Start");
	but = dlgConfirmQuit.transform.Find("botons/btnCancel").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {  DlgConfirmQuit(false); } );
	but = dlgConfirmQuit.transform.Find("botons/btnAccept").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {  DlgConfirmQuit(true); } );
	dlgConfirmQuit.SetActive(false);							
			
	// menu Fixe
	
	menuFixe = GameObject.Find("/Display/menuFixe");
	biblio.Assert(menuFixe!=null, "No he trobat menuFixe en al2GUI.Start");
	txtMenuFixe = GameObject.Find("/Display/menuFixe/txtMenuFixe").GetComponent(UI.Text);
	but = GameObject.Find("/Display/menuFixe/btnSpeed").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {	ToogleSimSpeed(); } );
	txtBtnSpeed = GameObject.Find("/Display/menuFixe/btnSpeed/Text").GetComponent(UI.Text);
	txtBtnSpeed.text = "Fast (M)";

	but = GameObject.Find("/Display/menuFixe/btnPause").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {	PauseToogle(); } );
	txtBtnPause = GameObject.Find("/Display/menuFixe/btnPause/Text").GetComponent(UI.Text);
	txtBtnPause.text = "Pause (P)";
	
	but = GameObject.Find("/Display/menuFixe/btnRestart").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {	RestartLevel(); } );
	but = GameObject.Find("/Display/menuFixe/btnMenu").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {	menuPrincipal.SetActive(!menuPrincipal.activeSelf); } );
	menuFixe.SetActive(false);																				
	// panel Menu

	menuPrincipal = GameObject.Find("/Display/menuPrincipal");
	biblio.Assert(menuPrincipal!=null, "No he trobat menuPrincipal en al2GUI.Start");
	but = GameObject.Find("/Display/menuPrincipal/btnInfoSeleccio").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {  InfoSeleccio(); } );
	but = GameObject.Find("/Display/menuPrincipal/btnTreuSeleccio").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {  ObjecteSeleccionat.instance.TreuSeleccio(); } );
	but = GameObject.Find("/Display/menuPrincipal/btnBiomassa").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {  HudTooglePanellCompatible("Biomassa"); } );
	but = GameObject.Find("/Display/menuPrincipal/btnEcosistema").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {  HudTooglePanellCompatible("Ecosistema"); } );
	but = GameObject.Find("/Display/menuPrincipal/btnLaboratori").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {	HudTogglePanellExclusiu("Laboratori"); } );
	but = GameObject.Find("/Display/menuPrincipal/btnGrafic").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {	HudTooglePanellCompatible("Grafic"); } );
	but = GameObject.Find("/Display/menuPrincipal/btnFoto").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {	FesFoto(); } );
	but = GameObject.Find("/Display/menuPrincipal/btnOpcionsNivell").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {	HudTogglePanellExclusiu("AnalisiNivell"); } );
	but = GameObject.Find("/Display/menuPrincipal/btnAjuda").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {	HudTogglePanellExclusiu("AjudaNivell"); } );
	but = GameObject.Find("/Display/menuPrincipal/btnQuit").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {	ConfirmaQuit(); } );
	menuPrincipal.SetActive(false);		
		
	// menus que depenen de l'estat del jugador
	
	menuEstatNau = GameObject.Find("/Display/menuEstatNau"); 
	biblio.Assert(menuEstatNau!=null, "No he trobat menuEstatNau en al2GUI.Start");
		but = GameObject.Find("/Display/menuEstatNau/btnAterrar").GetComponent(UI.Button);
		but.onClick.RemoveAllListeners();
		//but.onClick.AddListener(function () {	controller.AterraNau(); } );
		//but.onClick.AddListener(function () {	controller.CanviaEstat(EstatJoc.Player); } );
		but.onClick.AddListener(function () {	ChangeViewLand(); } );

		but = GameObject.Find("/Display/menuEstatNau/btnElevar").GetComponent(UI.Button);
		but.onClick.RemoveAllListeners();
		//but.onClick.AddListener(function () {	controller.getCamaraActual().GetComponent(al2CamaraZenital).Elevar(); } );
		but.onClick.AddListener(function () {	Camera.main.GetComponent(al2CamaraZenital).Elevar(); } );
		but = GameObject.Find("/Display/menuEstatNau/btnBaixar").GetComponent(UI.Button);
		but.onClick.RemoveAllListeners();
		//but.onClick.AddListener(function () {	controller.getCamaraActual().GetComponent(al2CamaraZenital).Baixar(); } );
		but.onClick.AddListener(function () {	Camera.main.GetComponent(al2CamaraZenital).Baixar(); } );
	menuEstatNau.SetActive(false);

	menuEstatPlayer = GameObject.Find("/Display/menuEstatPlayer"); 
	biblio.Assert(menuEstatPlayer!=null, "No he trobat menuEstatPlayer en al2GUI.Start");
		but = GameObject.Find("/Display/menuEstatPlayer/btnEmbarcar").GetComponent(UI.Button);
		but.onClick.RemoveAllListeners();
		but.onClick.AddListener(function () {	controller.CanviaEstat(EstatJoc.Ship); } );
		but = GameObject.Find("/Display/menuEstatPlayer/btnJetPack").GetComponent(UI.Button);
		but.onClick.RemoveAllListeners();
		but.onClick.AddListener(function () {	controller.CanviaEstat(EstatJoc.JetPack); } );
		but = GameObject.Find("/Display/menuEstatPlayer/btnVisor").GetComponent(UI.Button);
		but.onClick.RemoveAllListeners();
		but.onClick.AddListener(function () {	controller.CanviaEstat(EstatJoc.PlayerControl); } );
	menuEstatPlayer.SetActive(false);
	
	
	menuEstatJetPack = GameObject.Find("/Display/menuEstatJetPack"); 
	biblio.Assert(menuEstatJetPack!=null, "No he trobat menuEstatJetPack en al2GUI.Start");
		but = GameObject.Find("/Display/menuEstatJetPack/btnExplorar").GetComponent(UI.Button);
		but.onClick.RemoveAllListeners();
		but.onClick.AddListener(function () {	controller.CanviaEstat(EstatJoc.Player); } );
		but = GameObject.Find("/Display/menuEstatJetPack/btnVisor").GetComponent(UI.Button);
		but.onClick.RemoveAllListeners();
		but.onClick.AddListener(function () {	controller.CanviaEstat(EstatJoc.JetPackControl); } );
	menuEstatJetPack.SetActive(false);
	
	
	menuEstatControl = GameObject.Find("/Display/menuEstatControl"); 
	biblio.Assert(menuEstatControl!=null, "No he trobat menuEstatControl en al2GUI.Start");
		but = GameObject.Find("/Display/menuEstatControl/btnEmbarcar").GetComponent(UI.Button);
		but.onClick.RemoveAllListeners();
		but.onClick.AddListener(function () {	controller.CanviaEstat(EstatJoc.Ship); } );
		but = GameObject.Find("/Display/menuEstatControl/btnJetPack").GetComponent(UI.Button);
		but.onClick.RemoveAllListeners();
		but.onClick.AddListener(function () {	controller.CanviaEstat(EstatJoc.JetPack); } );
		but = GameObject.Find("/Display/menuEstatControl/btnExplorar").GetComponent(UI.Button);
		but.onClick.RemoveAllListeners();
		but.onClick.AddListener(function () {	controller.CanviaEstat(EstatJoc.Player); } );
	menuEstatControl.SetActive(false);
			
	// laboratori
	DlgLaboratori.instance.gameObject.SetActive(false);

	// analisiNivell
	DlgAnalisiNivell.instance.gameObject.SetActive(false);

	// avis
	txtAvis = GameObject.Find("/Display/HUDMessages/txtAvis").GetComponent(UI.Text); 
	biblio.Assert(txtAvis!=null, "No he trobat txtAvis en al2GUI.Start");
	txtAvis.gameObject.SetActive(false);


	
	if (FotosSufixRandom)
		FotosPrefix += Random.Range(100,999);		// <-- POSAR NOM FITXER DEPENENENT DEL TIME

	//Debug.Log("DateTime.Now: "+System.DateTime.Now.ToString());

	// debug

	biblio.SetRaja(BiblioRajaOn);
	biblio.SetRajaMolt(BiblioRajaMoltOn);

	Debug.Log("UIMgr start fi");

}

//function ClicBoto() {
//	Debug.Log("ClicBoto!");
//}

function StartNivell(){
	
	Debug.Log("UIMgrs StartNivell...");
	
	if (!inicialitzat) {
		Debug.Log("UIMgr First initialize");
		// recuperem punters 
	
		biocenosi = Biocenosi.instance;
		biblio.Assert(biocenosi!=null, "No he trobat biocenosi en al2GUI.Start");
		// punters que gestiona el controller
		laboratori = controller.laboratori;
		biotop = controller.biotop;
	
		inicialitzat = true;
	
	}
	else {
		Debug.Log("UIMgr Repeating initialize");
	}
		
	GraficBiomassa.instance.StartNivell();
	GraficNivellsTrofics.instance.StartNivell();

	// tanquem tots els panells (de fet, ja estan tancats <--)
	HudAmagaTots();

	// activem l'ecosistema i el grafic

	menuFixe.SetActive(true);																				
	AcordioEcosistema.instance.Open();	
	GraficNivellsTrofics.instance.Open();
	
	estatAnterior = EstatJoc.EstatNull;

	// pararem despres que hagin arrancat els spawners per a presentar el dialeg d'opcions nivell
	//Invoke("PauseInicial", 0.01);
	Invoke("PauseInicial", 0.1);
	
}


private function PauseInicial() {
	//SimTime.instance.Pause(true);
	HudTogglePanellExclusiu("AnalisiNivell");
}

function Update () {

	if (!inicialitzat)
		return;
		
	// accions que no es fan si estas en pause
	
	if (!SimTime.instance.simIsPaused) {
		if (panelStatus.activeSelf)  {
			OmplePanelStatus();
		}
			
		// reportatge
		if (esticFentReportatge && Time.frameCount%framesReportatge==0) { // && !EsticEnPauseGUI) {
			FesFoto();
			fotosFetesReportatge++;
		}

	}
	
	// actualitzem el rellotge
	
	if (SimTime.instance.simIsPaused) {
		var timeStatus = " PAUSED";
	}
	else 
	if (SimTime.simSpeedFast) {
		timeStatus = " (x10)";
	}
	txtMenuFixe.text = "T: "+SimTime.simTime.ToString("F0")+ timeStatus;
	
		
	// el teclat es llegeix encara que estiguis en pause
	
	LlegirTeclat();	

}

private var lastESC = 0;
private function LlegirTeclat() {

	
	// escape
	if (Input.GetKey("escape")) {
		if (DlgAnalisiNivell.instance.gameObject.activeSelf) {
			HudClosePanellExclusiu("AnalisiNivell");
			lastESC = Time.frameCount;
		}
		else {
			if (DlgLaboratori.instance.gameObject.activeSelf) {
				HudClosePanellExclusiu("Laboratori");
				lastESC = Time.frameCount;
			}
			else {
				if (DlgAjudaNivell.instance.gameObject.activeSelf) {
					HudClosePanellExclusiu("AjudaNivell");
					lastESC = Time.frameCount;
				}
				else {
					if (Time.frameCount - lastESC > 50) {
						//Debug.Log("UIMgr. Entro en confirmaquit");
						ConfirmaQuit();
					}
				}
			}
		}
	}
	
	// spawn
	
	/* - recuperat de controller, potser es pot posar aqui - 
	// tecles 1 a 9: spawn especies
			for (var c=0; c<=9;c++) 	{
				var cs :String = "0123456789"[c]+"";
					if (Input.GetKeyDown (cs)) FesSpawn(cs);
			}
	*/
	
	if (Input.GetKeyDown("1")) laboratori.FesSpawn(Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift) ? 11 : 1);
	if (Input.GetKeyDown("2")) laboratori.FesSpawn(Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift) ? 12 : 2);
	if (Input.GetKeyDown("3")) laboratori.FesSpawn(Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift) ? 13 : 3);
	if (Input.GetKeyDown("4")) laboratori.FesSpawn(Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift) ? 14 : 4);
	if (Input.GetKeyDown("5")) laboratori.FesSpawn(Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift) ? 15 : 5);
	if (Input.GetKeyDown("6")) laboratori.FesSpawn(Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift) ? 16 : 6);
	if (Input.GetKeyDown("7")) laboratori.FesSpawn(Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift) ? 17 : 7);
	if (Input.GetKeyDown("8")) laboratori.FesSpawn(Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift) ? 18 : 8);
	if (Input.GetKeyDown("9")) laboratori.FesSpawn(Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift) ? 19 : 9);
	if (Input.GetKeyDown("0")) laboratori.FesSpawn(Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift) ? 10 : 0);
	
	// fix/unfix camera
	if (Input.GetMouseButtonDown(1)) 
		controller.CanviaEstatUI("BotoDretMouse");
	
	// zenital view
	if (Input.GetKeyDown("c")) {
		controller.CanviaEstatUI("c");
		ActivaMenuView();
	}
	
	// jet pack view
	if (Input.GetKeyDown("j")) {
		controller.CanviaEstatUI("j");
		ActivaMenuView();
	}
	
	// land view
	if (Input.GetKeyDown(KeyCode.Space)) {
		ChangeViewLand();
	}

	// Q - Quit
	if (Input.GetKeyDown ("q")) {
		ConfirmaQuit();
	}
	
	// pause
	if (Input.GetKeyDown("p"))	{
		PauseToogle();	
	}
	
	// grafica 
	if (Input.GetKeyDown ("g")) 
		HudTooglePanellCompatible("Grafic");

	// biomassa 
	if (Input.GetKeyDown ("b")) 
		HudTooglePanellCompatible("Biomassa");

	// laboratori 
	if (Input.GetKeyDown ("l")) 
		HudTogglePanellExclusiu("Laboratori");
	
	// panell ecosistema
	if (Input.GetKeyDown ("e")) 
		HudTooglePanellCompatible("Ecosistema");
	
	// panell analisi nivell
	if (Input.GetKeyDown ("o")) 
		HudTogglePanellExclusiu("AnalisiNivell");
		
	// ajuda
	if (Input.GetKeyDown ("h")) 
		HudTogglePanellExclusiu("AjudaNivell");

	// "f" treu foto 
	if (Input.GetKeyDown ("f"))	FesFoto();
	
	// "r" fes reportatge on/of 
	if (Input.GetKeyDown ("r"))	FesReportatge();
	
	// "z" restart level 
	if (Input.GetKeyDown ("z"))	RestartLevel();
	
	
	// panel menu 
	if (Input.GetKeyDown(KeyCode.F2)){
		menuPrincipal.SetActive (!menuPrincipal.activeSelf);
		if (DlgAnalisiNivell.instance.gameObject.activeSelf)
			DlgAnalisiNivell.instance.Close();
		if (menuPrincipal.activeSelf)
			GameController.instance.BloquejaMouse();
	}

	// panel menu debug
	if (Input.GetKeyDown(KeyCode.F8)) {		
		MenuDebug.instance.Toogle();
		if (MenuDebug.instance.gameObject.activeSelf)
			GameController.instance.BloquejaMouse();
	}

	// panel informacio objecte seleccionat
	if (Input.GetKeyDown ("t"))	{
		InfoSeleccio();
	}
			
	// unselect sim
	if (Input.GetKeyDown("u")) {
		ObjecteSeleccionat.instance.TreuSeleccio();
	}

	// "M" - simulation speed
	if (Input.GetKeyDown("m")) {
		ToogleSimSpeed();
	}
	
	

}

/* -- 3/4/15
function OnGUI() {

	if (inicialitzat) {
		// mirilla
		if (controller.estat == EstatJoc.Ship) {
			GUI.Box (Rect (Screen.width/2,Screen.height/2, 30, 30), "+");		// <----- ARREGLAR, posar una mirilla?
		}
	}

}
*/

// user press Space to land
private function ChangeViewLand() {
	// must be over terrain to land
	if (Physics.Raycast(Camera.main.transform.position+Vector3(0,1000,0), Vector3.down, 1500, Planeta.instance.maskLimits)) {
		controller.CanviaEstatUI("space");
		ActivaMenuView();
	}
	else {
		AvisUsuari("Player isn't over terrain. Can't land");
	}

}
private function PauseToogle(){
	SimTime.instance.PauseToogle();
	if (SimTime.instance.simIsPaused)
		txtBtnPause.text = "Resume (P)";
	else
		txtBtnPause.text = "Pause (P)";
		
	// recordem si ho ha pausat l'usuari
	pausatUsuari = SimTime.instance.simIsPaused;		// <-- si despres es generes un altra pausa que passaria? es possible? 

}

function InfoSeleccio() {
	hudAcordioSeleccionat = !hudAcordioSeleccionat;
	if (AcordioSeleccionat.instance.Toogle()) {
		GameController.instance.BloquejaMouse();	
	}
}


function OmplePanelStatus() {


	// text barra status 	

	var txt = "T: " +SimTime.simTime.ToString("F1")+ "   ";
	txt += "Estat: "+controller.estatToString(controller.estat)+" ";
	txt += " Camara: "+Camera.main.transform.position ;
	txt += " Player: "+controller.player.transform.position;
	txt += " Nivell: "+Application.loadedLevel+"-"+biocenosi.titolNivell;
	txt += " Build: "+Version.instance.buildVersion;
	txtStatus.text = txt;

	
	// posicio mouse	
	var hit1: RaycastHit;
	var ray1: Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	if (Physics.Raycast(ray1, hit1)) {
		var yterreny = Terrain.activeTerrain.SampleHeight(hit1.point);
		var posCentre = Camera.main.ScreenToWorldPoint(hit1.point);
		txt = "Mouse: "+Input.mousePosition;
		txt += " En terreny ("+hit1.point.x.ToString("n0")+ ", "+yterreny.ToString("n0")+ ", "+hit1.point.z.ToString("n0")+ ")";
		txt += " h: " + planeta.y2h(yterreny)+" m.";
		//txt += " Temp: "+biotop.TempEnPosicio(posCentre).ToString("n0") +"ºC";
		txt += " Temp: "+biotop.TempEnPosicio(Vector3(posCentre.x, yterreny, posCentre.z)).ToString("n0") +"ºC";
		txt += "  Radiacio: "+biotop.radiacioMitja;
	}
	else {
		txt = "Mouse: "+Input.mousePosition+ " (no esta sobre el terreny)";
	}
	txtStatus2.text = txt; 
	
}


// toogles simulation speed between Normal and Fast

function ToogleSimSpeed() {
	if (SimTime.instance.simSpeedFast) {
		SimTime.instance.SimSpeedNormal();
		AvisUsuari("Simulation speed: NORMAL");
		txtBtnSpeed.text = "Fast (M)";
	}
	else {
		SimTime.instance.SimSpeedFast();
		AvisUsuari("Simulation speed: FAST", 8.0);
		txtBtnSpeed.text = "Slow (M)";
	}
}



function FesFoto() {
	//var n = FotosPrefix+"_"+Time.frameCount+".png";
	var n = FotosPrefix+"_T"+SimTime.simTime.ToString("F0")+".png";
	Application.CaptureScreenshot(n);
	AvisUsuari("Screenshot taken "+n);
	Debug.Log("Screenshot "+n);
}


function FesReportatge() {
	esticFentReportatge = !esticFentReportatge;
	Debug.Log("Fent reportatge: "+esticFentReportatge);
}



// treu un avis durant uns segons

function AvisUsuari(txt: String) {
	AvisUsuari(txt, 2.0);
}

function AvisUsuari(txt: String, seconds: float) {

	txtAvis.gameObject.SetActive(true);
	txtAvis.text = txt;
	yield WaitForSeconds(seconds);
	txtAvis.gameObject.SetActive(false);
	
}

function AvisPause(onoff:boolean) {
	if (onoff) {
		txtAvis.gameObject.SetActive(true);
		if (SimTime.instance.hePausatPerZero)
			txtAvis.text = "No animals detected, simulation paused. \nPress (P) to resume"; 
		else
			txtAvis.text = "Paused. Press (P) to resume";
	}
	else {
		AvisUsuari("Resuming...");
	}
}

private var saveEstatConfirmaQuit : EstatJoc = EstatJoc.EstatNull;
private function ConfirmaQuit() {
	Debug.Log("ConfirmQuit");
	// ojo, entra diverses vegades aqui quan fem escape!!. cal evitar matxacar la variable 
	if (saveEstatConfirmaQuit == EstatJoc.EstatNull) {
		saveEstatConfirmaQuit = controller.estat;
		Debug.Log("guardo estat ..:"+saveEstatConfirmaQuit);
		controller.BloquejaMouse();
		dlgConfirmQuit.transform.Find("txt").GetComponent(Text).text = "Exit to main menu?";
		dlgConfirmQuit.SetActive(true);
	}
}
function DlgConfirmQuit(res: boolean) {
	dlgConfirmQuit.SetActive(false);
	if (res) {
		controller.QuitEscena();
	}
	else {
		// restaurem estat previ a bloquejar el mouse
		Debug.Log("Hauria de tornar a estat moure mouse..:"+saveEstatConfirmaQuit);
		controller.CanviaEstat(saveEstatConfirmaQuit);
		saveEstatConfirmaQuit = EstatJoc.EstatNull;
	}
}


function PanelStatusToogle(){
	panelStatus.SetActive(!panelStatus.activeSelf);
}


/*
 *  Gestio de panells (podria ser una classe <---)
 *
 *	 hi ha dos tipus de dialegs: els exclusius i els compatibles entre si
 *	 per obrir un exclusiu
 *		- bloquejo mouse
 *		- tanco la resta (recordo l'estat)
 *	 per tancar un exclusiu
 *		- he d'obrir els compatibles que estaven oberts abans
 *
 */ 

 
// Toogle dialegs compatibles

private function HudTooglePanellCompatible(nomPanell: String) {


	switch(nomPanell) {
	case "Grafic":
		// si esta actiu biomassa, desactivem biomassa primer
		if (GraficBiomassa.instance.gameObject.activeSelf) {
			GraficBiomassa.instance.Close();										
			hudGraficBiomassa = false;			
		}
		GraficNivellsTrofics.instance.Toogle();										
		hudGraficNT = GraficNivellsTrofics.instance.gameObject.activeSelf;			
		break;
	case "Biomassa":
		// si esta actiu grafic, primer el treiem
		if (GraficNivellsTrofics.instance.gameObject.activeSelf) {
			GraficNivellsTrofics.instance.Close();										
			hudGraficNT = false;			
		}
		GraficBiomassa.instance.Toogle();
		hudGraficBiomassa = GraficBiomassa.instance.gameObject.activeSelf;
		break;
	case "Ecosistema":
		AcordioEcosistema.instance.Toogle();
		hudAcordioEcosistema = AcordioEcosistema.instance.gameObject.activeSelf;
		break;
	default:
		Debug.LogError("UIMgr.HudActivaPanellCompatible desconegut="+nomPanell);
	}

}

// no es private perque el criden alguns dialegs per tancar-se
function HudTogglePanellExclusiu(nomPanell: String) {

	// obro el que toqui
	switch(nomPanell) {
	case "Laboratori":
		if (!DlgLaboratori.instance.gameObject.activeSelf) 
			HudOpenPanellExclusiu("Laboratori");
		else
			HudClosePanellExclusiu("Laboratori");
		break;
	case "AnalisiNivell":
		if (!DlgAnalisiNivell.instance.gameObject.activeSelf) 
			HudOpenPanellExclusiu("AnalisiNivell");
		else
			HudClosePanellExclusiu("AnalisiNivell");
		break;
	case "AjudaNivell":
		if (!DlgAjudaNivell.instance.gameObject.activeSelf) 
			HudOpenPanellExclusiu("AjudaNivell");
		else
			HudClosePanellExclusiu("AjudaNivell");
		break;
	default:
		Debug.LogError("UIMgr.HudTogglePanellExclusiu desconegut="+nomPanell);
	}

}	
private function HudOpenPanellExclusiu(nomPanell: String) {		
	
	HudAmagaTots();									// amaga compatibles
	GameController.instance.BloquejaMouse();		// bloqueja mouse
	SimTime.instance.Pause(true);					// posa pause
	
	switch(nomPanell) {
	case "Laboratori":
		DlgLaboratori.instance.Open();
		break;
	case "AjudaNivell":
		DlgAjudaNivell.instance.Open();
		break;
	case "AnalisiNivell":
		DlgAnalisiNivell.instance.Open();
		break;
	default:
		Debug.LogError("UIMgr.HudOpenPanellExclusiu desconegut="+nomPanell);
	}

}	
	
private function HudClosePanellExclusiu(nomPanell: String) {		
	
	
	switch(nomPanell) {
	case "Laboratori":
		DlgLaboratori.instance.Close();
		break;
	case "AjudaNivell":
		DlgAjudaNivell.instance.Close();
		break;
	case "AnalisiNivell":
		DlgAnalisiNivell.instance.Close();
		break;
	default:
		Debug.LogError("UIMgr.HudClosePanellExclusiu desconegut="+nomPanell);
	}

	// si l'hem pausat nostres rearranquem
	if (!pausatUsuari) {
		SimTime.instance.Pause(false);
	}

	// torno a obrir els compatibles
	HudMostraCompatibles();
	
}	


// amaga tots i recorda l'estat dels compatibles abans d'amagar

function HudAmagaTots(){

	// compatibles
	
	hudAcordioEcosistema = AcordioEcosistema.instance.gameObject.activeSelf;	// recorda estat
	if (hudAcordioEcosistema)													// si estava obert, el tanca
		AcordioEcosistema.instance.Close();
		
	hudGraficNT = GraficNivellsTrofics.instance.gameObject.activeSelf;
	if (hudGraficNT)
		GraficNivellsTrofics.instance.Close();
		
	hudGraficBiomassa = GraficBiomassa.instance.gameObject.activeSelf;
	if (hudGraficBiomassa)
		GraficBiomassa.instance.Close();

	hudmenuPrincipal = menuPrincipal.activeSelf;
	if (hudmenuPrincipal)
		menuPrincipal.SetActive (false);
		
	hudAcordioSeleccionat = AcordioSeleccionat.instance.gameObject.activeSelf;
	if (hudAcordioSeleccionat)
		AcordioSeleccionat.instance.Close();

	// exclusius
	
	if (DlgLaboratori.instance.gameObject.activeSelf)
		DlgLaboratori.instance.Close();
		
	if (DlgAnalisiNivell.instance.gameObject.activeSelf)
		DlgAnalisiNivell.instance.Close();
		
	if (DlgAjudaNivell.instance.gameObject.activeSelf)
		DlgAjudaNivell.instance.Close();
		
		
}

// mostra els panells compatibles que estaven actius 


function HudMostraCompatibles(){

			
	if (hudAcordioEcosistema)
		AcordioEcosistema.instance.Open();
		
	if (hudGraficNT)
		GraficNivellsTrofics.instance.Open();
		
	if (hudGraficBiomassa)
		GraficBiomassa.instance.Open();
		
	if (hudmenuPrincipal)
		menuPrincipal.SetActive (true);
		
	if (hudAcordioSeleccionat && ObjecteSeleccionat.instance.CreatureSeleccionat != null)
		AcordioSeleccionat.instance.Open();
}


/*
function AcordioEcosistemaClose() {
	if (AcordioEcosistema.instance!=null)
		AcordioEcosistema.instance.Close();
}
*/

function ActivaMenuView() {
// activa el panell que indica land/jetpack/zenital que toqui
		
	if (controller.estat != estatAnterior) {
		switch(controller.estat){
			case EstatJoc.PlayerControl:
					menuEstatNau.SetActive(false);
					menuEstatPlayer.SetActive(false);
					menuEstatJetPack.SetActive(false);
					menuEstatControl.SetActive(true);
				break;
			case EstatJoc.JetPack:
			case EstatJoc.JetPackControl:
					menuEstatNau.SetActive(false);
					menuEstatPlayer.SetActive(false);
					menuEstatJetPack.SetActive(true);
					menuEstatControl.SetActive(false);
				break;
			case EstatJoc.Ship:
					menuEstatNau.SetActive(true);
					menuEstatPlayer.SetActive(false);
					menuEstatJetPack.SetActive(false);
					menuEstatControl.SetActive(false);
				break;
			case EstatJoc.Player:
					menuEstatNau.SetActive(false);
					menuEstatPlayer.SetActive(true);
					menuEstatJetPack.SetActive(false);
					menuEstatControl.SetActive(false);	
					break;		
			case EstatJoc.EstatNull:
					menuEstatNau.SetActive(false);
					menuEstatPlayer.SetActive(false);
					menuEstatControl.SetActive(false);
				break;
			default :
				Debug.Log("alGUI.OnGUI. estat desconegut: "+ controller.estat);
		}
	}
	
	estatAnterior = controller.estat;
}

private function RestartLevel() {

	Debug.LogWarning("UIMgr.RestartLevel Polsat 'z'. Restart.....  OJO, FALTA CONFIRMACIO");
	AvisUsuari("Restarting level...", 3.0);
	controller.ReStartEcosystem();
}