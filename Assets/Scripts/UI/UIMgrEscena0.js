#pragma strict


static var instance : UIMgrEscena0;

//var dlgAjuda : Animator;
var dlgAjuda : GameObject;
var dlgCredits : GameObject;
var dlgConfSortir : GameObject;
var dlgConfiguracio : GameObject;
var textos : Textos;
var tglRajaFitxerStats : UI.Toggle;
var txtModeJoc : UI.Text;
private var dlgConfirmQuit : GameObject;

private var txtSelectPlanet : UI.Text;

// assign level name to buttons
private var levelPlanet1 = "n5_sandbox";
private var levelPlanet2 = "n1";
private var levelPlanet3 = "n2";
private var levelPlanet4 = "n3";
//private var levelSandbox = "n5_sandbox";

//private var controller : GameController;

function Awake(){
	if (instance == null) {
		instance = this;
		DontDestroyOnLoad(this); 
	}
	//else
	//	Debug.Log("UIManagerScript - instance != null");
		
	biblio.Assert(instance!=null, "UIMgrEscena0 instance==null");
}

function Start() {

	var but : UI.Button;
	
	// configura UI escena (alguns encara estan als propis botons)
	
	dlgAjuda = GameObject.Find("/Canvas/dlg_ajuda");
	biblio.Assert(dlgAjuda!=null, "No he trobat dlgAjuda en UIManager.Start");
	textos = FindObjectOfType(Textos);
	GameObject.Find("/Canvas/dlg_ajuda/lbl_ajuda").GetComponent(UI.Text).text = textos.Ajuda();
	dlgAjuda.SetActive(false);

	// dlg confirmquit
	
	dlgConfirmQuit = GameObject.Find("/Canvas/dlgConfirmQuit");
			biblio.Assert(dlgConfirmQuit!=null, "No he trobat dlgConfirmQuit en UIMgrEscena0.Start");
	but = dlgConfirmQuit.transform.Find("botons/btnCancel").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {  DlgConfirmQuit(false); } );
	but = dlgConfirmQuit.transform.Find("botons/btnAccept").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {  DlgConfirmQuit(true); } );
	dlgConfirmQuit.SetActive(false);							

	// button sortir

	but = GameObject.Find("/Canvas/btn_sortir").GetComponent(UI.Button);
	but.onClick.RemoveAllListeners();
	but.onClick.AddListener(function () {  ConfirmaQuit(); } );
	dlgConfirmQuit.SetActive(false);							


	// button sandbox --> escena 5
	
	//but = GameObject.Find("/Canvas/btn_sandbox").GetComponent(UI.Button);
	//but.onClick.RemoveAllListeners();
	//but.onClick.AddListener(function () {	DoLoadLevel (levelSandbox); } );
		
	
	txtSelectPlanet = GameObject.Find("/Canvas/txtSelectPlanet").GetComponent(UI.Text);
	biblio.Assert(txtSelectPlanet!=null, "No he trobat txtSelectPlanet en UMgrEscena0");
	txtSelectPlanet.text = "Select a planet to visit its ecosystems"; 
	
	dlgCredits.SetActive(false);
	//dlgConfiguracio.SetActive(false);
	dlgConfSortir.SetActive(false);
	
	#if UNITY_WEBPLAYER
		// desactivo aquests de moment a la web
		//GameObject.Find("/Canvas/btn_sandbox").SetActive(false);
		GameObject.Find("/Canvas/btn_sortir").SetActive(false);
		//GameObject.Find("/Canvas/grupBotonsPlaneta/btn_e3").SetActive(false);
		//GameObject.Find("/Canvas/grupBotonsPlaneta/btn_e4").SetActive(false);
	#endif	
	
}



function ObrirAjuda() {
	//dlgAjuda.SetActive(true);
	//#if UNITY_WEBPLAYER
	// this is to try to open the page in another tab --> but pop up blocker stops it!
	//Application.ExternalEval("window.open('https://terraformersim.wordpress.com/play/','Terraformer')");
	//#else
	Application.OpenURL("https://terraformersim.wordpress.com/play/");
	//#endif
}	

function TancarAjuda() {
	dlgAjuda.SetActive(false);
}

function ObrirCredits() {
	dlgCredits.SetActive(true);
	dlgCredits.Find("lbl_credits1").GetComponent(UI.Text).text = textos.Credits1();
	dlgCredits.Find("lbl_credits2").GetComponent(UI.Text).text = textos.Credits2();
}

function TancarCredits() {
	dlgCredits.SetActive(false);
}

function btn_e1() {
        DoLoadLevel (levelPlanet1);
}


function btn_e2() {
        DoLoadLevel (levelPlanet2);
}

function btn_e3() {
        DoLoadLevel (levelPlanet3);
}

function btn_e4() {
       #if UNITY_EDITOR
        //DoLoadLevel (levelPlanet4);
	    Debug.LogWarning("UIMgrEscena0: LEVEL 4 not available");
	  #else
	    Debug.LogError("UIMgrEscena0: LEVEL 4 not available");
	  #endif
}





function ConfirmaQuit() {
	dlgConfirmQuit.transform.Find("txt").GetComponent(Text).text = "Exit Terraformer?";
	dlgConfirmQuit.SetActive(true);

}
function DlgConfirmQuit(res: boolean) {
	dlgConfirmQuit.SetActive(false);
	if (res) {
	  #if UNITY_EDITOR
	    EditorApplication.isPlaying = false;
     #else
	    Application.Quit();
	 #endif
	}
}

function DoLoadLevel(i: String) {
	Debug.Log("UIMgrEscena0.Loading level "+name);
	#if UNITY_EDITOR
		Application.LoadLevel(i);
	#else
	if (Application.CanStreamedLevelBeLoaded(i)) {		// <-- NO HAURIA DE PASSAR PERQUE LA ZERO ESTARA CARREGADA
		Application.LoadLevel(i);
	}
	else {
		Debug.LogWarning("UIMgrEscena0.DoLoadLevel CanStreamedLevelBeLoaded !=1 i="+i);
		txtSelectPlanet.text = "Level is loading. Please try again...";
		// aixo s'hauria de posar amb algo per a que deaparegues
	}
	#endif
}


