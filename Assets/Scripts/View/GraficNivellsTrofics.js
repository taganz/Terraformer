#pragma strict


static var instance : GraficNivellsTrofics;
var graficNT : Grafic;		// ha de ser accessible des de graficbiomassa
//private var framesPintarGraf = 50; // cada quants frames fa log 
//@HideInInspector var simTimeNow : float;
private var simTimeLastLog : float;
private var logInterval = 0.3;	// 1 sec.
private var inicialitzat = false;
private var biocenosi : Biocenosi;

function Awake() {
	instance = this;
}



function StartNivell() {

	biocenosi = Biocenosi.instance;
	var controller = GameController.instance;
	
	//graficNT = new Grafic(4, 100, 10, 800, 400);
	graficNT = new Grafic(4, 5, 10, 300, 100);
	//graficNT.ResetData();
	//graficNT.SetDataNames("Plantes", "Herbiv", "Carniv1", "Carniv2", "");
	//graficNT.SetDataNames("P", "H", "C", "C2", "");
	graficNT.SetDataNames("Plant", "Herb", "Pred", "Apex", "");
	graficNT.SetDataColors(Color.green, Color.yellow,Color.red, Color.blue, Color.gray);
	
	// if max values for TL max y velues are blank, set default values
	for (var tl=0;tl<4;tl++) {
		if (controller.biocenosiData.grafNTYMax[tl] == 0) {
			var n = controller.biocenosiData.capacityReference * controller.biocenosiData.capacityTL[tl] * 1.2;
			controller.biocenosiData.grafNTYMax[tl] = n-n%10;			// round to 10x
		}
	}
	//Debug.LogWarning("GraficNivellsTrofics: recorda comprovar que canvi en grafNTYMax default esta be i borra aquest missatge...");
	
	/*
	if (controller.biocenosiData.grafNTYMax[0] == 0) {
		var n = controller.biocenosiData.maxPlantes * 1.2;
		controller.biocenosiData.grafNTYMax[0] = n-n%10;
	}
	if (controller.biocenosiData.grafNTYMax[1] == 0) {
		n = controller.biocenosiData.maxAnimals * 0.4;
		controller.biocenosiData.grafNTYMax[1] = n - n%10;
	}
	if (controller.biocenosiData.grafNTYMax[2] == 0) {
		n = controller.biocenosiData.maxAnimals * 0.3;
		controller.biocenosiData.grafNTYMax[2] = n - n%10;
	}
	if (controller.biocenosiData.grafNTYMax[3] == 0) {
		n =  controller.biocenosiData.maxAnimals * 0.2;
		controller.biocenosiData.grafNTYMax[3] = n - n%10;
	}
	*/
	graficNT.SetDataYMax(
		controller.biocenosiData.grafNTYMax[0]
		, controller.biocenosiData.grafNTYMax[1]
		, controller.biocenosiData.grafNTYMax[2]
		, controller.biocenosiData.grafNTYMax[3]
		, 1); 
	
	inicialitzat = true;
	//simTimeNow = 0;
	simTimeLastLog = 0;
	graficNT.Open();
}


function Update() {

	//if (Time.frameCount%framesPintarGraf == 0 && inicialitzat){ // && !EsticEnPauseGUI) {

	if (SimTime.simTime - simTimeLastLog > logInterval) {
	
		graficNT.Log(
			biocenosi.viusNTrofic[0],
			biocenosi.viusNTrofic[1],
			biocenosi.viusNTrofic[2],
			biocenosi.viusNTrofic[3],0);
		
		simTimeLastLog = SimTime.simTime;
			
	}

}


function OnGUI() {

	if (inicialitzat && graficNT.isOpen) {
		graficNT.DoGUI();	
		
	}	
}

function Toogle() {
	graficNT.Toogle(); 
}

function Open() {
	graficNT.Open(); 
}

function Close() {
	graficNT.Close(); 
}
