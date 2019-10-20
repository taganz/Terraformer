#pragma strict
static var instance : GameController;

/*
 *  Manages start of game
 *  Manages change within views (jetpack, landing, spaceship)
 *
 * 
 * StartNivell
 * 	 Fa StartNivell de les classes
 * No te update
 *	 
 *
 */ 


// parametres configuracions

// game status

enum EstatJoc { EstatNull, Ship, Player, PlayerControl, JetPack, JetPackControl}  // sim = nau?
@HideInInspector var estat : EstatJoc;					// game status
@HideInInspector var player : GameObject;				// the player

// level class pointers

@HideInInspector var ecosistema : GameObject;			// ecosystem selected for user in current level
@HideInInspector var biotop : Biotop;					// biotope for selected ecosystem
@HideInInspector var laboratori : Laboratori;			// labo for selected ecosystem 
@HideInInspector var biocenosiData : BiocenosiData;		// biocenosi data for selected ecosystem
@HideInInspector var ecosistemaMenu = new GameObject[5];	// ecosystem selection menu
@HideInInspector var titolNivell = new String[5];			// ecosystem selection menu
@HideInInspector var idEco : int;					// user selected ecosystem

private var ultimEstat : EstatJoc;
private var camaraActiva : idCamara;			// camares player i zenitals 
private var numEcosistemes : int;

enum idCamara { Null, Player, Zenital2, Seguiment, JetPack}   // Control, Zenital
private var camaraPlayer : GameObject;	
private var camaraZenital2 : GameObject;		// camara simulacio
private var camaraJetPack : GameObject;

// unique class pointers
private var biocenosi : Biocenosi;
private var genus : GameObject;
private var planeta : Planeta;
private var uIMgr: UIMgr;


function Awake() {

	instance = this;
	
	// get pointers

	uIMgr = FindObjectOfType(UIMgr);
	biblio.Assert(uIMgr != null, "No hi ha uIMgr (per les etiquetes?)");

	camaraPlayer = GameObject.Find("Main Camera");
	biblio.Assert(camaraPlayer != null, "Inicialitzant camara camaraPlayer");

	camaraZenital2 = GameObject.Find("/CamaraZenital2");
	biblio.Assert(camaraZenital2 != null, "Inicialitzant camara camaraZenital2");

	camaraJetPack = GameObject.Find("/CamaraJetPack");
	biblio.Assert(camaraJetPack != null, "Inicialitzant camara camaraJetPack");

	player = GameObject.FindGameObjectWithTag("Player");
	biblio.Assert(player != null, "Inicialitzant player");
	

}

function Start() {

	Debug.Log("CONTROLLER Start");
		
	// check terrain consistency

	biblio.Assert(Terrain.activeTerrain!=null, "GameController Awake: Terreny null???");
	biblio.Assert(Terrain.activeTerrain.gameObject.layer == 12, "El terreny no te layer 12 (limits), cal posar-ho");
	
	planeta = Terrain.activeTerrain.GetComponent(Planeta);
	biblio.Assert(planeta != null, "No hi ha component Planeta terreny");
	if (Terrain.activeTerrain.transform.position.y !=0) {
		Debug.LogWarning("El terreny no te y=0 i SampleHeight no funcionara be. (Terrain.activeTerrain.transform.position.y="+Terrain.activeTerrain.transform.position.y);
	}
	
	// get biocenosi pointer
	
	biocenosi = Biocenosi.instance;
	biblio.Assert(biocenosi != null, "No hi ha biocenosi");
	
	
	estat = EstatJoc.EstatNull;
	
	// camera used for ecosystem selection is camaraZenital - set camera in scene manually to a general view of planet 
	
	camaraPlayer.SetActive(false);
	camaraZenital2.SetActive(true);
	camaraJetPack.SetActive(false);
	
	/*
	// deixo de fondo per seleccionar el ecosistema el terreny vist de camara zenital en alçada maxima
	camaraZenital2.GetComponent(al2CamaraZenital).PosarAYMax();
	*/
	
	// provo aixo per evitar el problema de que de vegades algu empentava el player (suposo que neixia algu a dins?)
	
	var c = GameObject.Find("/First Person Controller").GetComponent(CharacterController);
	c.detectCollisions = false;
	
	// obre dialeg de seleccio d'ecosistema
	// recupera els ecosistemes que hi ha a l'escena per a generar menu
	
	ecosistemaMenu[0] = GameObject.Find("/Ecosistema1");
	ecosistemaMenu[1] = GameObject.Find("/Ecosistema2");
	ecosistemaMenu[2] = GameObject.Find("/Ecosistema3");
	ecosistemaMenu[3] = GameObject.Find("/Ecosistema4");
	ecosistemaMenu[4] = GameObject.Find("/Ecosistema5");
	
	// per a cada ecosistema recuperem el nom per posar-lo al menu
	
	numEcosistemes = 0;
	for (var eco=1;eco<=5;eco++) {
		if (ecosistemaMenu[eco-1] != null) {
			numEcosistemes++;
			// recuperem el nom de l'ecosistema
			titolNivell[eco-1] = ecosistemaMenu[eco-1].GetComponent(BiocenosiData).titolNivell;
			Debug.Log("Ecosistema "+eco + ": "+titolNivell[eco-1]);
		}
	}	
	Debug.Log(numEcosistemes+" ecosystem(s) found");
	

	// obrim dialeg de seleccio si n'hi ha mes d'un
	
	// <--- aixo no hauria de passar al UIMgr??
	
	if (numEcosistemes > 1) {
		DlgSeleccioEcosistema.instance.Open();
	}
	else {
		AcordioEcosistema.instance.Close();
		DlgSeleccioEcosistema.instance.Close();
		StartEcosystem(1);
	}
	
	Debug.Log("controller start fi");
	

}

// Once user has chosen an ecosystem in dlgSeleccioEcosistema, this function is called to start it

function StartEcosystem(idSelectedEco: int) {

	if (ecosistemaMenu[idSelectedEco-1] == null) {
		QuitEscena();
	}
	idEco = idSelectedEco;
	Debug.Log("******************************************");
	Debug.Log("controller Start nivell enter..." + idEco);
	
	// get biocenosiData, biotope and lab component pointers for selected ecosystem

	ecosistema = ecosistemaMenu[idEco-1];
	biblio.Assert(ecosistema != null, "Controller.StartEcosystem: No hi ha GameObject ecosistema "+ecosistemaMenu[idEco-1]+". Recorda que si nomes n'hi ha un ha de ser Ecosistema1");
	biocenosiData = ecosistema.GetComponent(BiocenosiData);
	biblio.Assert(biocenosiData != null, "Controller.StartEcosystem: No hi ha biocenosiData en ecosistema "+ecosistema);
	biotop = ecosistema.GetComponent(Biotop);
	biblio.Assert(biotop != null, "Controller.StartEcosystem: No hi ha biotop en ecosistema "+ecosistema);
	laboratori = ecosistema.GetComponent(Laboratori);
	biblio.Assert(laboratori != null, "Controller.StartEcosystem: No hi ha laboratori en ecosistema "+ecosistema);
	
	DoStartEcosystem(false);
}

// This is called by UIMgr when user request restarting ecosystem

private var ecosystemIteration = 1;
function ReStartEcosystem() {
	ecosystemIteration++;
	Debug.Log("******************************************");
	Debug.Log("controller RESTART nivell enter..." + idEco+ " iteration: "+ecosystemIteration);
	
	// clean all creatures in ecosystem
	Creature.esticEnPause = true;				// stop everybody before killing them to avoid errors
	var criaturesEnEscena : Creature[] = FindObjectsOfType(Creature);
	Debug.Log("controller restart destroying "+criaturesEnEscena.length+" criatures en escena");
	for (var go : Creature in criaturesEnEscena) {
		Destroy(go);
	}
	
	DoStartEcosystem(true);
}

function DoStartEcosystem(restarting: boolean) {

	//ecosistema = ecosistemaMenu[idEco-1];
	
	// start level simulation
	
	SimTime.instance.StartNivell();
	//Dna.StartNivell();
	Creature.StartNivell();
	biocenosi.StartNivell(ecosistema);		// aquesta ha d'arrancar abans que la resta de StartNivell
	
	/* 21/8/15: game starts in jetpack mode
	
	// set player at position defined by object "playerPosition"
	
	var playerPosition = ecosistema.gameObject.transform.Find("playerPosition");
	biblio.Assert(playerPosition!=null, "Controller: playerPosition not found. Remember to add object in ecosistema");
	if (playerPosition != null) {
		player.transform.position =  playerPosition.transform.position;
	}
	else {
		player.transform.position = ecosistema.transform.position;
	}
	player.transform.position.y = Terrain.activeTerrain.SampleHeight(player.transform.position)+5;
	*/

	// level starts in mode JetPack. camera will be set at "playerPosition" looking at "cameraLookAt" (ecosystem children objects)
	
	camaraActiva = idCamara.Null;
	CanviaEstat(EstatJoc.JetPack);
	//Camera.main.GetComponent(al2CamaraJetPack).PosarAYMin(biocenosiData.hInitCamaraJetPack);
	
	/* 21/8/15 - moved to CanviaEstat
	// initial position of camera in ecosystem can be fixed using object "cameraLookAt"
	// orientate camera to desired position
	
	var cameraLookAt = ecosistema.gameObject.transform.Find("cameraLookAt");
	biblio.Assert(cameraLookAt!=null, "Controller: cameraLookAt not found. Remember to add object in ecosistema");
	if (cameraLookAt != null) {
		Camera.main.transform.LookAt(cameraLookAt.transform.position);
	}
	else {
		Camera.main.transform.LookAt(biocenosiData.camaraLookAt);
	}
	*/
	
	// start nivell at remaining classes
	
	uIMgr.StartNivell();
	Puntuacio.instance.StartNivell();
	FitxerPoblacio.instance.StartNivell(Application.loadedLevel + "_" + idEco);

	Debug.Log("CONTROLLER.StartNivell -- fi. *** StartNivell *** Nom: "+ biocenosi.titolNivell+ " Pantalla: " + Application.loadedLevel + " Ecosistema triat: " + idEco);

}






//
//  Canvis d'estat demanats per UI
//		opcions: "BotoDretMouse", "c", "j", "space"
//
//function LlegirTeclat () {
function CanviaEstatUI(canvi: String) {		
	
	switch(estat){
	
		case EstatJoc.Player: 
			// boto dret activa apuntant
			if (canvi=="BotoDretMouse")	CanviaEstat(EstatJoc.PlayerControl);
			if (canvi=="c") 		CanviaEstat(EstatJoc.Ship);
			if (canvi=="j") 		CanviaEstat(EstatJoc.JetPack);
			break;

		case EstatJoc.Ship :
			if (canvi=="c") 				CanviaEstat(EstatJoc.Player);
			if (canvi=="space") 			CanviaEstat(EstatJoc.Player);
			if (canvi=="j") 				CanviaEstat(EstatJoc.JetPack);		
			break;

		case EstatJoc.PlayerControl:
			if (canvi=="BotoDretMouse")	CanviaEstat(EstatJoc.Player);
			if (canvi=="c") 				CanviaEstat(EstatJoc.Ship);
			if (canvi=="j") 				CanviaEstat(EstatJoc.JetPack);			
			break;

		case EstatJoc.JetPack:
			if (canvi=="BotoDretMouse")	CanviaEstat(EstatJoc.JetPackControl);
			if (canvi=="c") 				CanviaEstat(EstatJoc.Ship);
			if (canvi=="space")			CanviaEstat(EstatJoc.Player);
			break;			
			
		case EstatJoc.JetPackControl:
			if (canvi=="BotoDretMouse")	CanviaEstat(EstatJoc.JetPack);
			if (canvi=="c") 				CanviaEstat(EstatJoc.Ship);
			if (canvi=="space")			CanviaEstat(EstatJoc.Player);
			break;			
 	 default :
			Debug.Log("controller llegeix teclat estat desconegut "+estat);
	}
	
}




//private var ultimHCamaraSim : float;

function CanviaEstat(nouEstat: EstatJoc)
{
	if (estat == nouEstat) 
		return;
	
	var posLastCamaraActiva : Vector3;
	posLastCamaraActiva = Camera.main.transform.position;

	ultimEstat = estat;
	estat = nouEstat;
	Debug.Log("Controller CanviaEstat de "+ultimEstat+" a " + estat);
	
	camaraPlayer.SetActive(false);
	camaraZenital2.SetActive(false);
	//camaraSeguiment.SetActive(false);
	camaraJetPack.SetActive(false);
	
	
	switch(estat) {
	case EstatJoc.Ship:
		camaraZenital2.SetActive(true); 
		camaraActiva = idCamara.Zenital2;
		
		// s'activa a sobre de la posicio del jugador, a la darrera posicio on estava, sempre orientada a nord?
		camaraZenital2.transform.position.x = player.transform.position.x;
		camaraZenital2.transform.position.z = player.transform.position.z;
		camaraZenital2.transform.position.y = al2CamaraZenital.instance.lastY;
		
		player.SetActive(false);
		uIMgr.HudMostraCompatibles();
		
		uIMgr.AvisUsuari("Embarcant en la nau...");
		//Screen.lockCursor = true;
		break;

	case EstatJoc.Player:
		
		camaraPlayer.SetActive(true); 
		camaraActiva = idCamara.Player;

		switch(ultimEstat) {
			case EstatJoc.PlayerControl: 
				// nomes ha de tornar a activar el MouseLook
				camaraPlayer.GetComponent(MouseLook).enabled = true;
				player.GetComponent(MouseLook).enabled = true;	
				player.transform.position.y +=3	;	// per evitar que aparegui al terreny i l'atravessi
				break;
			case EstatJoc.Ship:
			case EstatJoc.JetPack:
			case EstatJoc.JetPackControl:
				// ve d'adalt. aterra segons on estes la camara
				player.SetActive(true);
				player.transform.position = posLastCamaraActiva;
				player.transform.position.y = Terrain.activeTerrain.SampleHeight(posLastCamaraActiva)+ 10;
				//player.transform.position.y = Terrain.activeTerrain.SampleHeight(posLastCamaraActiva)+ GameController.instance.biotop.hMinJetPack;
				//player.transform.position.y = posLastCamaraActiva.y;
				uIMgr.AvisUsuari("Aterrant...");
				break;
			default:
				Debug.LogError("Controller.CanviaEstat - player ultimestat desconegut "+ultimEstat);
		}			
		Screen.lockCursor = true;
		uIMgr.HudAmagaTots();
		break;
		
	case EstatJoc.PlayerControl:
	
		camaraPlayer.SetActive(true); 
		camaraActiva = idCamara.Player;
		
		// sempre ve d'estat Player, l'unic que ha de fer es desactivar el MouseLook
		biblio.Assert(ultimEstat == EstatJoc.Player, "Controller.CanviaEstat - player control error");
		camaraPlayer.GetComponent(MouseLook).enabled = false;
		player.GetComponent(MouseLook).enabled = false;
		Screen.lockCursor = false;
		uIMgr.HudMostraCompatibles();
		break;

	case EstatJoc.JetPackControl:
		camaraJetPack.SetActive(true);
		camaraActiva = idCamara.JetPack;
		
		// sempre ve d'estat JetPack
		biblio.Assert(ultimEstat == EstatJoc.JetPack, "Controller.CanviaEstat - panoramica control error");
		camaraJetPack.GetComponent(MouseLook).enabled = false;
		Screen.lockCursor = false;
		uIMgr.HudMostraCompatibles();
		break;

	case EstatJoc.JetPack:
		camaraJetPack.SetActive(true);
		camaraActiva = idCamara.JetPack;

		switch(ultimEstat) {
			case EstatJoc.Player:
			case EstatJoc.PlayerControl: 
				// despeguem d'on estava el player, una mica mes amunt...
				Camera.main.transform.position.x = player.transform.position.x;
				Camera.main.transform.position.z = player.transform.position.z;
				Camera.main.transform.position.y = planeta.hMinJetPack;
				uIMgr.AvisUsuari("Jet Pack activat");
				player.SetActive(false);
				break;
			case EstatJoc.Ship:
				// ve de la camara zenital. heredem la posicio, una mica mes avall...
				Camera.main.transform.position = posLastCamaraActiva;
				Camera.main.transform.position.y -= 20;
				uIMgr.AvisUsuari("Jet Pack activat");
				player.SetActive(false);
				break;
			case EstatJoc.JetPackControl:
				// ja ha activat el mouselook adalt, per si havia passat de panoramicacontrol a un altre abans de venir aqui
				player.SetActive(false);
				break;
			case EstatJoc.EstatNull:
				// level start: set camera to position defined by object "playerPosition" and looking at object "cameraLookAt"
				var playerPosition = ecosistema.gameObject.transform.Find("playerPosition");
				biblio.Assert(playerPosition!=null, "Controller: playerPosition not found. Remember to add object in ecosistema to fix initial jetpack camera view");
				if (playerPosition != null) {
					Camera.main.transform.position =  playerPosition.transform.position;
				}
				else {
					Camera.main.transform.position = ecosistema.transform.position;
				}		
				var cameraLookAt = ecosistema.gameObject.transform.Find("cameraLookAt");
				biblio.Assert(cameraLookAt!=null, "Controller: cameraLookAt not found. Remember to add object in ecosistema to fix initial jetpack camera view");
				if (cameraLookAt != null) {
					Camera.main.transform.LookAt(cameraLookAt.transform.position);
				}
				else {
					Camera.main.transform.LookAt(biocenosiData.camaraLookAt);
				}
				player.SetActive(false);
				break;
			default:
				Debug.LogError("Controller.CanviaEstat - panoramica ultimestat desconegut "+ultimEstat);
		}
		
			
		//player.SetActive(false);
		
		//4/1/15 - INCIDENCIA DIRECCIO NO SEGUEIX MOUSELOOK
		//Screen.lockCursor = true;			
		Screen.lockCursor = false;
		camaraJetPack.GetComponent(MouseLook).enabled = true;
		uIMgr.HudAmagaTots();
		//camaraJetPack.GetComponent(MouseLook).enabled = false;

		break;

	default:
		Debug.Log("controller.canviaestat estat desconegut: "+estat);
		estat = ultimEstat;
		
	}

	// si ens ha quedat la camara per sota el terreny la pujem
		if (Camera.main.transform.position.y < Terrain.activeTerrain.SampleHeight(Camera.main.transform.position)+ 10)
			Camera.main.transform.position.y = Terrain.activeTerrain.SampleHeight(Camera.main.transform.position)+ 10;
	

}





function GetIdCamaraActiva() : idCamara {
	return camaraActiva;
}


function estatToString(estat: EstatJoc): String {
	var txt: String;
	switch(estat) {
		case EstatJoc.Ship: txt= "Ship"; break;
		//case EstatJoc.SimControl: txt= "SimControl"; break;
		case EstatJoc.Player: txt= "Player"; break;
		case EstatJoc.JetPack: txt= "JetPack"; break;
		case EstatJoc.JetPackControl: txt= "JetPackControl"; break;
		case EstatJoc.PlayerControl: txt= "PlayerControl"; break;
		default: txt= estat + "(?)";
	}
	return txt;
}

// passa a un estat que tingui el mouse bloquejat (per quan surten dialegs per exemple)

function BloquejaMouse(){

	if (estat == EstatJoc.Player) {	
		CanviaEstat(EstatJoc.PlayerControl);
	}
	else
	if (estat == EstatJoc.JetPack) {
		CanviaEstat(EstatJoc.JetPackControl);
	}

}


function QuitEscena(){

	if (Application.CanStreamedLevelBeLoaded(0)) {		// <-- NO HAURIA DE PASSAR PERQUE LA ZERO ESTARA CARREGADA
		Debug.Log("GameController.Loading scene 0");
		Application.LoadLevel(0);
		
		// tanca fitxers si estan oberts
		FitxerEvents.instance.TancaFitxer();
		FitxerFilogenetic.instance.TancaFitxer();
		FitxerPoblacio.instance.TancaFitxer();
		
	}
	else
		Debug.LogWarning("Controller.QuitEscena CanStreamedLevelBeLoaded !=1 !");
}

function DoLoadLevel(name:String) {
	Application.LoadLevel(name);
}	


function OnApplicationQuit() {
	Screen.lockCursor = false;
	// tanca fitxers si estan oberts
	FitxerEvents.instance.TancaFitxer();
	FitxerFilogenetic.instance.TancaFitxer();
	FitxerPoblacio.instance.TancaFitxer();
	Debug.Log("Bye...");
}


