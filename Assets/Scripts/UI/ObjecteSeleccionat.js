#pragma strict
import UnityEngine.UI;

/*
 * Gestiona l'animal o l'objecte que es selecciona amb boto esquerra
 *
 * function Update()					// actualitza etiquetes
 * function ClicEnCreature(ev: Creature)
 * function ClicEnObjecte(ob: GameObject, txt:String) 
 * function TreuSeleccio()
 * function AnimalSeleccionatHaMort(ob:Animal)
 *
 * Escriu en
 *			sobre l'animal (guitext?)
 * 			en AcordioSeleccionat
 */

static var instance : ObjecteSeleccionat;
static var CreatureSeleccionat : Creature;

var tempsVidaEtiqueta = 3.0;				
private var elGUIText: GUIText;
private var etiquetaAnimal : GUIText;
private var animalSeguit : Creature;
private var nivellInfo : int;
private var esticSeguintAnimal = false;

private var controller : GameController;
private var biocenosi : Biocenosi;

private var etiquetesPosades: Array = new Array();
static var drawVisionSquare = true;

function Awake() {
	instance = this;

}

function Start () {

	controller = GameController.instance;
	biocenosi = Biocenosi.instance;

	//elGUIText = FindObjectOfType(GUIText);
	elGUIText = GameObject.Find("/Display/HUDMessages/GUIText").GetComponent(GUIText);
	biblio.Assert(elGUIText!=null, "No he trobat elGUIText en ObjecteSeleccionat.Start");
	elGUIText.enabled = false;

	var but : UI.Button;
	

}


// pinta tet amb informacio a sobre l'animal
// el crida l'animal quan li han fet clic a sobre

function Update() {

	// pinta etiqueta movil
	
	if (esticSeguintAnimal) {
	
			// mou l'etiqueta dinamica 
			 
			if (animalSeguit != null && etiquetaAnimal != null) {
					
					// recupera etiqueta amb info basica
					//txtObjecteSeleccionat.text = animalSeguit.GetEtiqueta();
					AcordioSeleccionat.instance.txtObjecteSeleccionat.text = animalSeguit.GetEtiqueta();
					
					// alçada de l'etiqueta sobre l'animal depen de la camara (cal recupera cada cop)	<--  TAMBE DEPENDRIA DE LA Y ON ESTIGUI EL 
					switch(controller.GetIdCamaraActiva()) {
						case idCamara.Player:   var h = 0.2; break;
						case idCamara.Zenital2:   h = 0.1; break;
						case idCamara.Seguiment:   h = 0.4; break;
						default:	  h = 0; 
					}
					
					// posa l'etiqueta sobre l'animal
					etiquetaAnimal.transform.position = Camera.main.WorldToViewportPoint (animalSeguit.transform.position)+Vector2(0,h);						

					// si l'animal esta darrera no el pinta					
					if (etiquetaAnimal.transform.position.z >0) {
						etiquetaAnimal.text = animalSeguit.EtiquetaSobreAnimal();		// etiqueta que esta per sobre del sim
					}
					else {
						etiquetaAnimal.text = "?";
					}
					
					
					// AQUI HAURIA DE MIRAR
					//		1. SI L'ANIMAL HA SORTIT PER POC DE LA PANTALLA, POSEM L'ETIQUETA A DINS
					//		2. SI L'ANIMAL HA SORTIT PER MOLT, DESACTIVEM EL SEGUIMENT		
										
					if (etiquetaAnimal.transform.position.y > 1) { etiquetaAnimal.transform.position.y = 0.9; etiquetaAnimal.text = "?";}
					if (etiquetaAnimal.transform.position.y < 0) { etiquetaAnimal.transform.position.y = 0.1; etiquetaAnimal.text = "?";}
					if (etiquetaAnimal.transform.position.x > 1) { etiquetaAnimal.transform.position.x = 0.9; etiquetaAnimal.text = "?";}
					if (etiquetaAnimal.transform.position.x < 0) { etiquetaAnimal.transform.position.x = 0.1; etiquetaAnimal.text = "?";}
					
					
					// actualitza etiqueta de adn i de preses i predadors
					if (Time.frameCount%50==0) {
						PosaInfoEnEtiquetaDetall();
						if (drawVisionSquare) {
							// show vision area
							biblio.DebugDrawSquare(animalSeguit.transform.position, animalSeguit.dna.radiVisioCurt*2, Color.yellow, 0.3f);
							biblio.DebugDrawSquare(animalSeguit.transform.position, animalSeguit.dna.radiVisio*2, Color.yellow, 0.3f);
							// Show position for last prey we have seen
							if (animalSeguit.lastPresaPos1 != biblio.vectorNull)
								Debug.DrawLine(animalSeguit.transform.position+Vector3(0,5,0), animalSeguit.lastPresaPos1+Vector3(0,5,0), Color.yellow, 0.3f);
							if (animalSeguit.lastPresaPos2 != biblio.vectorNull)
								Debug.DrawLine(animalSeguit.transform.position+Vector3(0,5,0), animalSeguit.lastPresaPos2+Vector3(0,5,0), Color.yellow, 0.3f);
							if (animalSeguit.lastPresaPos3 != biblio.vectorNull)
								Debug.DrawLine(animalSeguit.transform.position+Vector3(0,5,0), animalSeguit.lastPresaPos3+Vector3(0,5,0), Color.yellow, 0.3f);


						}
						
					}
					
				}
				else {
					if (etiquetaAnimal != null) {
						Destroy(etiquetaAnimal);
						esticSeguintAnimal = false;
					}
				}
	
		}




}


function ClicEnCreature(ev: Creature) {
	Debug.Log("ObjecteSeleccionat: Clic en : "+ev.meuId );
	// deselecciona l'anterior
	if (CreatureSeleccionat!=null) {
		CreatureSeleccionat.SetSeleccionat(false);
		//CreatureSeleccionat.SetRajo(false);
		//CreatureSeleccionat.esticRajant = false;
	}
	
	// nou seleccionat
	CreatureSeleccionat = ev;
	//CreatureSeleccionat.SetRajo(true);
	//CreatureSeleccionat.esticRajant = true;
	CreatureSeleccionat.SetSeleccionat(true);
	// activa etiqueta movil
	PosaEtiquetaEnAnimal(ev, 1);
	
	PosaInfoEnEtiquetaDetall();
	
	// 20/4 - s'obre automaticament nomes si l'usuari l'ha activat 
	if (UIMgr.instance.hudAcordioSeleccionat)
		AcordioSeleccionat.instance.Open();
	
	//panelObjecteSeleccionat.SetActive(true);
	//Debug.Log(txtObjecteSeleccionat);

}

// posa una etiqueta estatica

function ClicEnObjecte(ob: GameObject, txt:String) {
	PosaEtiqueta(ob.transform.position, txt); 

}



function TreuSeleccio() {

	if (CreatureSeleccionat!=null) {
		//CreatureSeleccionat.SetRajo(false);
		//CreatureSeleccionat.esticRajant = false;
		CreatureSeleccionat.SetSeleccionat(false);
	}
	esticSeguintAnimal = false;
	TreuEtiquetes();

}


// OJO: nomes pot haver-hi un seleccionat actualment. no comprovo  <---

function AnimalSeleccionatHaMort(ob:Animal) {
	Debug.Log("Animal seleccionat mort: "+ob.meuId);
	if (AcordioSeleccionat.instance!=null)
		AcordioSeleccionat.instance.Close();
	//if (panelObjecteSeleccionat!=null) 
	//	panelObjecteSeleccionat.SetActive(false);
	CreatureSeleccionat = null;

	esticSeguintAnimal = false;

}



// les etiquetes estatiques no es mouen ni es borren de moment

private function PosaEtiqueta(pos: Vector3, txt: String) {
	//componentEtiqueta = ob;
	var etiqueta = Instantiate (elGUIText, pos, Quaternion.identity);
	biblio.Assert(etiqueta != null, "Error creant etiqueta en Al2Etiqueta");
	etiqueta.enabled = true;
	//etiqueta.transform.position = controller.getCamaraActual().WorldToViewportPoint(pos)+Vector2(0,0.4);	
	etiqueta.transform.position = Camera.main.WorldToViewportPoint(pos)+Vector2(0,0.4);	
	if (etiqueta.transform.position.y > 1) etiqueta.transform.position.y = 0.9;
	if (etiqueta.transform.position.y < 0) etiqueta.transform.position.y = 0.1;
	// <-- no comprova la x !!
	if (etiqueta.transform.position.z < 0)
		Debug.Log("*** AVIS *** etiqueta PosaEtiqueta z<0 "+ pos + " " + txt);
	etiqueta.text = txt;
	//tincEtiquetes = true;
	etiquetesPosades.Push(etiqueta);
	
	// i quan ja l'hem vist ens la carreguem
	Destroy(etiqueta, tempsVidaEtiqueta);
	etiquetesPosades.Pop();			// podriem treure l'array (a no ser que hagi de posar mes d'una etiqueta en 3 segons??)
}

// penja una etiqueta d'un animal per a que es mogui amb ell i l'anira actualitzant
// 0 - no actualitzis
// 1...2 nivell d'info GetEtiqueta

private function PosaEtiquetaEnAnimal(animal: Creature, ninfo: int) {
	// creo un GUIText
	if (etiquetaAnimal == null)		// si ja en tinc una no cal crear-la
		etiquetaAnimal = Instantiate (elGUIText, Vector3.zero, Quaternion.identity); // podria mirar si ja en tenia?
	biblio.Assert(etiquetaAnimal != null, "Error creant etiqueta en Al2Etiqueta");
	etiquetaAnimal.enabled = true;
	animalSeguit = animal;
	nivellInfo = ninfo;
	esticSeguintAnimal = true;
}




private function TreuEtiquetes() {
	//Debug.Log("etiqueta: destruint "+ etiquetesPosades.length+ " etiquetes");    	// <-- passa per aqui??

	for (var etiqueta in etiquetesPosades)
		Destroy(etiqueta as GameObject);
	if (etiquetaAnimal != null)
		Destroy(etiquetaAnimal.gameObject);
	etiquetesPosades.Clear();
	//tincEtiquetes = false;
	elGUIText.enabled = false;		
	//panelObjecteSeleccionat.SetActive(false);
	AcordioSeleccionat.instance.Close();
}

// etiqueta llarga amb info de adn i de preses/predadors

private function PosaInfoEnEtiquetaDetall() {
	var txt : String;
	biblio.Assert(AcordioSeleccionat.instance.txtNomPantalla!=null, "Objecteseleccionat AcordioSeleccionat.instance.txtNomPantalla==null");
	biblio.Assert(CreatureSeleccionat!=null, "Objecteseleccionat CreatureSeleccionat==null");
	AcordioSeleccionat.instance.txtNomPantalla.text = CreatureSeleccionat.dna.nomPantalla;

	// adn
	//txt += "\n"+CreatureSeleccionat.GetEtiquetaAdn();	
	txt += "\n"+CreatureSeleccionat.dna.Etiqueta();	
	AcordioSeleccionat.instance.txtObjecteDetall.text = txt;

	txt = "\n"+CreatureSeleccionat.GetEtiquetaDebug();	
	if (CreatureSeleccionat.dna.nivellTrofic > 0) {
		txt += "\nlastPresaPos: \n   "+CreatureSeleccionat.lastPresaPos1;
	}
	AcordioSeleccionat.instance.txtDebug.text = txt;
		
		
	txt = "\n";
	txt += FormatGeneres.instance.StatsMortsCapcalera(CreatureSeleccionat.dna.idGenus);
	txt += "\n"+FormatGeneres.instance.StatsMortsToString(CreatureSeleccionat.dna.idGenus);

	//AcordioSeleccionat.instance.txtStatsMorts.text = txt;
	AcordioSeleccionat.instance.txtStatsMorts.text = "";
}


