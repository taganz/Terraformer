#pragma strict

// clic dret: envia ClicEnCamaraBotoDret a al2GUI amb posicio
// clic esquerra: 
//	 si ha pillat animal ja s'envia sol
//	 si el clic estava aprop d'un animal li envia OnMouseDown
//	 si no hi havia res envia ClicEnCamaraBotoEsquerra a controller amb posicio



private var radiSeleccio = 10;	// radi per seleccionar animal quan fas clic amb el boto dret
//private var controller : GameController;
private var eventSystem : UnityEngine.EventSystems.EventSystem;

//function Awake() {
function Start() {
	//controller = GameObject.FindObjectOfType(GameController);
	eventSystem = GameObject.FindObjectOfType(UnityEngine.EventSystems.EventSystem);
}

function Update () {
/*
	// llegir boto dret
	if (Input.GetMouseButtonDown(1) && GUIUtility.hotControl == 0) {
		var hit1: RaycastHit;
		var ray1: Ray = camera.ScreenPointToRay(Input.mousePosition);
		Physics.Raycast(ray1, hit1);
		Debug.Log("boto dret en "+hit1.point);
		//controller.ClicEnCamaraBotoDret(hit1.point);  
		MenuBotoDret.instance.ClicEnCamaraBotoDret(Input.mousePosition, hit1.point);  
	}
*/
	// llegeix clic mouse esquerra sobre un objecte
	
	if (Input.GetMouseButtonDown(0) && GUIUtility.hotControl == 0 && !eventSystem.current.IsPointerOverGameObject() ) {
		 var hit: RaycastHit;
		 var ray: Ray = GetComponent.<Camera>().ScreenPointToRay(Input.mousePosition);


		// si enganxes just en un animal
		if (Physics.Raycast(ray, hit)) {
			// si enganxo un animal no faig res perque ja ho detectara ell
			 var objectHit: Transform = hit.transform;
			 if (objectHit.GetComponent.<Rigidbody>() != null) {			// aixo detecta l'animal be?? <---
			 	//Debug.Log("Camara.Clicat animal..."+objectHit.gameObject);
			 }
			 else {
			 	// si no, mirem si hi ha algun animal a prop del punt del terreny on hem fet hit
			 	// OJO, sera un un punt del terreny? <--- 
				var hitColliders = Physics.OverlapSphere(hit.point, radiSeleccio);
	
				if (hitColliders.Length > 1)  {   // sempre detecta el terreny almenys
					//Debug.Log("Camara.detectat "+hitColliders.Length+" animals aprop en "+hit.point);
					var fet = false;
					// si hem enganxat un animal li enviem un clic
					for (var i=0; i<hitColliders.Length && !fet; i++) {
						if (hitColliders[i].gameObject.layer >=8 &&  hitColliders[i].gameObject.layer <= 11) {
							//hitColliders[i].gameObject.SendMessage("OnMouseDown");
							hitColliders[i].transform.parent.gameObject.SendMessage("OnMouseDown");
							fet = true;
							//Debug.Log("Camara.Clic a prop animal, el selecciono");
						}
					}
				}
  				 // si no hi ha res de res, que el controller faci el que vulgui amb el clic
				 //else {
				 //	 controller.ClicEnCamaraBotoEsquerra(hit.point);  
			 		 //Debug.Log("Camara.hit: "+objectHit + " en "+hit.transform.position + " impacte en "+hit.point); 
				//}
			}
		}
		
			  
		
	}
	

			
}


