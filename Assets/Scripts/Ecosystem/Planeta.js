#pragma strict

// cada unitat Y son 10m reals

static var instance : Planeta;
@HideInInspector var nomPlaneta = "nom planeta";  // cal llegir-lo de Textos per a poder accedir-lo a la home
var idPlaneta : int;			// index en Textos
var comment = "info del terreny";
var desnivell = "desconegut";
// parametres modificables per l'usuari
//var tempMitja = 25;			// 0temperatura a 0 m  --> l'he posat al biotop
private var offset_H : int = 0;			// valor de y que te la tempMitja --- SEMPRE EL DEIXARE A ZERO A PARTIR D'ARA, "A NIVELL DEL MAR"
var y2m : int = 10;			// quans metres d'alçada representen cada punt de y en aquest terreny
var incTempPerMetre : float = -0.01;	// diferencia termica cadam d'alçada(fred a les muntanyes) 

//var radiacioMitja : int = 10;	// probabilitat de que muti un gen al fill (0-100)
//var precipitacions : int = 50;	// 1..100 influeix en l'alimentacio de les plantes <-- QUIN PARAMETRE

var hMinJetPack = 50; 	// fins on pot baixar la camara panoramica abans de saltar a terra
var hMaxJetPack = 200;	// fins on pot pujar la camara panoramica abans de pujara a la nau
var hMinCamaraZenital = 100;	// fins on pot baixar la camara zenital
var hMaxCamaraZenital = 750;	// fins on pot pujar la camara zenital

@HideInInspector var maskLimits : LayerMask = 1 << 12;		// 12 <-- limits cal posar-lo en setup d'escena
@HideInInspector var maskMateixGenere : LayerMask;			// 13 + idgenere
@HideInInspector var maskLimitsAndWater : LayerMask = 1 << 12 | 1<<4;  // water is layer 4


//@HideInInspector var tempActual = 26;			// 0temperatura a 0 m  <---- INTEGER?

function Awake() {
	instance = this;
	// repeteixo aixo perque no se en quin ordre s'executen els start de controller, aquest i textos...
	nomPlaneta = Textos.instance.msg("PlanetName"+idPlaneta);  
}


function Start () {
	nomPlaneta = Textos.instance.msg("PlanetName"+idPlaneta);
	biblio.Assert(Terrain.activeTerrain.gameObject.layer == 12, "Planeta: Terreny no te layer 12");
	biblio.Assert(Textos.instance!=null, "Planeta no textos");
	
	Debug.Log("*************************************************************");
	Debug.Log("ACTIVANT PLANETA "+nomPlaneta+ " - "+comment + " OffsetH: "+offset_H + "  y2h(0):"+y2h(0.0));
	Debug.Log("Terreny: "+Terrain.activeTerrain.name);
	var tPos = Terrain.activeTerrain.GetPosition();
	Debug.Log("Terreny position: "+tPos);
	var tSize = Terrain.activeTerrain.terrainData.size;
	Debug.Log("Terrain size: "+tSize);
	Debug.Log("Terrain xmin, xmax: "+(tPos.x-tSize.x/2)+ ", "+(tPos.x+tSize.x/2));
	Debug.Log("Terrain zmin, zmax: "+(tPos.z-tSize.z/2)+ ", "+(tPos.z+tSize.z/2));
}


// temperatura en la posicio donada a partir de la temperatura actual a 0 graus
// ojo, el vector p pot estar sobre el terreny o no

function TempEnPosicio (p: Vector3, tempActual: float): float {
	return tempActual + incTempPerMetre * (p.y-offset_H) * y2m ;	// cada unitat y son 10 metres
}


// torna l'alçada en metres a partir de vector 
function pos2h(p:Vector3):int {
	return (p.y - offset_H)*y2m;
}
// torna l'alcada en metres a partir de valor y
function y2h(y:float): int {
	return (y - offset_H)*y2m;
}

// torna la posicio on esta apuntant el mouse
// torna biblio.vectorNull; si no esta en el terreny

function MousePositionToSimPosition(): Vector3 {
	// calculem interseccio de la posicio del mouse en el terreny
	
	var hit1: RaycastHit;
	var ray1: Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	if (!Physics.Raycast(ray1, hit1)) {
		return biblio.vectorNull; 		
	}
	else {
		//Debug.Log("controller.fesspawn mouse: "+Input.mousePosition + "   hit: "+hit1.point);
		return Vector3(hit1.point.x, Terrain.activeTerrain.SampleHeight(hit1.point), hit1.point.z);
	}
}

