#pragma strict


var comment = "info del biotop";
var tempMitja = 25.0;			// 0temperatura l'alcada base
//var alcadaTempMitja = 0;	// on s'ha mesurat la temperatura mitja (m)
@HideInInspector var tempActual : float;			
var radiacioMitja : int = 10;	// probabilitat de que muti un gen al fill (0-100)
var precipitacions : int = 50;	// 1..100 influeix en l'alimentacio de les plantes <-- QUIN PARAMETRE
var maxHeightSpawn : int = 9999;			// max height to spawn creatures (in m)

// temperatura en la posicio donada 

function Awake() {
	tempActual = tempMitja;
}

function Start() {
	Debug.Log("BIOTOP. "+comment
			+" tempMitja="+tempMitja
			+" radiacioMitja="+radiacioMitja
			+" precipitacions="+precipitacions
			+" maxHeightSpawn="+maxHeightSpawn
			);
}
// temperatura en el punt p (estigui a l'aire o al terreny)
function TempEnPosicio (p: Vector3): float {
	return Planeta.instance.TempEnPosicio(p, tempActual);
}

// temperatura a sobre el terreny en la vertical del vector p
function TempSobreTerreny (p: Vector3): float {
	p.y = Terrain.activeTerrain.SampleHeight(p);
	return Planeta.instance.TempEnPosicio(p, tempActual);
}

// torna la posicio sobre el terreny que indica el mouse o null
function PosMouseTerrain(): Vector3 {
	var ray1: Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	var hit1: RaycastHit;
	var pos : Vector3;
	if (Physics.Raycast(ray1, hit1)) {
		pos = Camera.main.ScreenToWorldPoint(hit1.point);
		pos.y = Terrain.activeTerrain.SampleHeight(pos);
	}
	Debug.Log("biotop.MouseSobreTerreny "+pos);
	return pos; 

}
