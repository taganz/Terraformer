#pragma strict

/*
 * Creature
 *
 *  This is the main classe for simulation agents. Both Animal and Planta inherit from Creatures
 *
 */


// Estats dels Essers Vius
// 	cadaver i pendingterminate es controlen des de la classe Creature, la resta des d'Animal o Planta
// hi ha una funcio getEstatString() que torna literal	

enum CreatureStatus { NOINIT, LABORATORI, 
				BABY, IDLE, PENDING_BIRTH, CHASING, EATING, ESCAPING, ATTACKED, TURNING, BANDA, 
				WRECK}; // , PENDINGTERMINATE};

static var esticEnPause = false;		// used to pause creatures
static var id = 0;						// remember last id
static var totalPlantes = 0;			
static var totalAnimals = 0;


// constants
static var tempsPutrefaccioCadaver = 5.0;		// temps que tarda en podrir-se el cadaver
static var tempsGestacio = 2.0;				// es per fer un efecte abans de parir

var debugMode = true;			// si li fan clic rajara en debug

//@HideInInspector var esticRajant = false;
@HideInInspector var esticSeleccionat = false;  // l'usuari t'esta seguint
@HideInInspector var meuId = "______";
@HideInInspector var dna : Dna;
@HideInInspector var metab : Metabolisme;			// s'accedeix des de FitxerEvents	
protected var morfologia : Morfologia;
@HideInInspector var estat: CreatureStatus;


private var lastPes : float;
private var pesUltimaSumaBiomassa : float;

protected var tempsEnEstat : float;
protected var simTimeCanviEstat : float;

protected var tempsDesDeParir: float;
private var simTimeUltimPart: float;
protected var lastParirCheck : float;
protected var intervalParirCheck = 2.0;		// cada quan es testeja la probabilitat de reproduccio
private var lastBiomassaSumCheck : float;
private var intervalBiomassaSumCheck = 1.0;

protected var esticInicialitzat = false;

// stats (haurien d'estar en animal pero llavors hauria de moure la fitxa de lloc...?)
@HideInInspector var heMenjatPes : float;			// nomes animals
@HideInInspector var heMenjatPesDesDePart : float;			// nomes animals
@HideInInspector var heParitCops : int;			// nomes animals

// (animals) remember last places where food was seen
@HideInInspector var lastPresaPos1 : Vector3;	// location of last seen prey
@HideInInspector var lastPresaPos2 : Vector3;	// previous place (can be close to 1)
@HideInInspector var lastPresaPos3 : Vector3;	// previous place (at a minimum distance radiVisio*2), this is managed in radar

private var NT 		: int;	// cache

private var predador : Creature;					// <-- podria treure idGenerePredador i adnStringPredador ara
private var idGenerePredador = -1;
private var adnStringPredador : String;
private var noArribaANeixer = false;

protected var elCol : Collider;						// el collider que penja de mi

// mascares que es fan servir en radar(), etc
// repetits en Radar
private var maskMateixGenere : LayerMask;			// 13 + idgenere
/*
private var maskLimits : LayerMask = 1 << 12;		// 12 <-- limits cal posar-lo en setup d'escena
private var maskLimitsAndWater : LayerMask = 1 << 12 | 1<<4;  // water is layer 4
*/
protected var CreatureStatusObjecte : Creature;				// qui l'ataca, escapa, menja, etc...

// vars for debug purposes

private var parirTryOk = 0;
private var parirTryNoOk = 0;

// pointers to classes

static var biocenosi : Biocenosi;
static var controller : GameController;   // ho fa servir animal per ClicEnAnimal
static var biotop : Biotop;
static var planeta : Planeta;

static function StartNivell() {
	id = 0;
	totalAnimals = 0;
	totalPlantes = 0;
	esticEnPause = false;

	biocenosi = Biocenosi.instance;
	biblio.Assert(biocenosi!=null, "Creature StartNivell biocenosi = null");
	controller = GameController.instance;
	biblio.Assert(controller!=null, "Creature StartNivell controller = null");
	biotop = GameController.instance.biotop;
	biblio.Assert(biotop!=null, "Creature StartNivell biotop = null");
	planeta = Planeta.instance;
	biblio.Assert(planeta!=null, "Creature StartNivell planeta = null");

}

function Inicialitzat(adnPare: Dna) {
 	  
 	/*
	// son estatiques, no cal fer el find cada cop
	if (biocenosi == null) {
		biocenosi = Biocenosi.instance;
		biblio.Assert(biocenosi!=null, "Creature start biocenosi = null");
	}
	if (controller == null) {
		controller = GameController.instance;
		biblio.Assert(controller!=null, "Creature start controller = null");
	}
	if (biotop == null) {
		biotop = GameController.instance.biotop;
		biblio.Assert(biotop!=null, "Creature start biotop = null");
	}
	if (planeta == null) {
		planeta = Planeta.instance;
		biblio.Assert(planeta!=null, "Creature start planeta = null");
	}
	*/
	  // heredem el adn del pare pero pot haver-hi mutacions (excepte a la primera generacio)
		
	  dna = new Dna();
	  dna.Hereda(adnPare);
	  if (dna.generacio > 1)  {
		  dna.MutacioAleatoria(biotop.radiacioMitja);
	  }
	   
	  // inicialitzem metabolisme
	  
	  metab = new Metabolisme(this);
	  biblio.Assert(metab!=null, "Creature.Inicialitzat met==null");
	  
	  
	  // recupera l'objecte que te el collider per assignar-li les mascares
	  
 	  elCol = this.transform.FindObjectOfType(Collider);		// ojo! si hi ha mes d'un collider pot fer coses rares!! <---
	  biblio.Assert(elCol!=null, "Creature no tinc collider ("+dna.nomPantalla+")");
 	  if (elCol!=null && elCol.transform.parent != this.transform) {
 	  	Debug.LogWarning(dna.nomPantalla + " probablement hi ha un collider per sota l'objecte 3D pare. o fill 3d te tag animal. elCol.name="+elCol.name+" this.gameObject.name="+this.gameObject.name);
 	  }
 	  //Debug.Log("this.gameObject.name="+this.gameObject.name+" te fill amb collider elCol.name="+elCol.name);	  
 	  // marcar layers per a raytracings etc.
 	  
	  elCol.gameObject.layer = 13 + dna.idGenus;

 	  maskMateixGenere = 1 << (13 + dna.idGenus);
 
	// init de parametres basics
	
	meuId = dna.idGenus + "-" + ++id; 
	dna.id = meuId;
	//simTimeBorn = SimTime.simTime;
	//edat = 0;		//	edat = SimTime.simTime - simTimeBorn;

	//salut = 100;
	heMenjatPes = 0.0;			// nomes animals
	heMenjatPesDesDePart = 0.0;
	heParitCops = 0;			// nomes animals
	
	// initialize "home" position at birth place
	lastPresaPos1 = transform.position;
	lastPresaPos2 = biblio.vectorNull;
	lastPresaPos3 = biblio.vectorNull;


	// variables cachejades
	NT = dna.nivellTrofic;

	pesUltimaSumaBiomassa = 0;
	
	simTimeUltimPart = dna.edatAdult;		// de manera que comenci a parir a adult+reprodInterval
	tempsDesDeParir = -1000;			// de manera que al principi tempsDesDeParir << simtime - simTimeUltimPart
	
	lastParirCheck = 0;
	lastBiomassaSumCheck = 0;
	
	
	//esticInicialitzat = true;
	
	estat = CreatureStatus.NOINIT;
	CreatureStatusObjecte = null;
	tempsEnEstat = 0;				// tempsEnEstat = SimTime.simTime - simTimeCanviEstat;	
	//esticEnPause = false;
	esticSeleccionat = false;
	

	// dona forma segons morfologia i genome

	// recupera el component de la morfologia
	morfologia = gameObject.GetComponent(Morfologia);

	if (morfologia!=null) {
		morfologia.Inicialitza();
		
		// fa els canvis especifics segons la classe morfologia que s'ha assignat en Genus i el genome
		morfologia.AjustaMorfologia();
		morfologia.MorfologiaPes(metab.pes/dna.pesAdult);
		
	}
	else {
		Debug.LogWarning("Creature. Morfologia == null en "+adnPare.nomPantalla);
	}
			
	// orientacio inicial aleatoria
	
	var gir : float = Random.Range(0,360);
	transform.Rotate(Vector3.up * gir);    		

	// si esta en terreny elevat li ajusta l'alçada	(presuposa terreny y = 0)
	
    transform.position.y = Terrain.activeTerrain.SampleHeight(transform.position);

	// check de si estem a punt de neixer en condicions bones. si no, no arribem a neixer

	// no neixem si hem nascut per sobre la nostra alçada maxima o de l'alçada maxima d'aquest biotop
	if (planeta.y2h(transform.position.y) > dna.alturaMaxima || planeta.y2h(transform.position.y)> biotop.maxHeightSpawn ) {
		//salut = 0;
		biblio.RajaMolt("Creature spawn per sobre de altura maxima. No neix. Genus: "+dna.idGenus+ " en h="+planeta.y2h(transform.position.y));
		noArribaANeixer = true;
	}

	
 	// no neixem si detecta que estem fora del terreny (maskLimits) o sobre aigua (layer 4)
 	
 	// fem raycast des de molt amunt cap avall buscant terreny primer
	if (!Physics.Raycast(transform.position+Vector3(0,1000,0), Vector3.down, 1500, Planeta.instance.maskLimits)) {
		
		// no estem sobre terreny
		//salut = 0;   // no faig destroy perque no es fa efectiu fins al final del update actual
		biblio.RajaMolt("Creature spawn fora del terreny. No neix");
		noArribaANeixer = true;
	}
	else {
		// si hi ha aigua i terreny poden estar en diferents superposicions

		// fem raycast des de molt amunt cap avall buscant aigua (layer 4) o terreny
		var hits: RaycastHit[];
		hits = Physics.RaycastAll(transform.position+Vector3(0,1000,0), Vector3.down, 1500, Planeta.instance.maskLimitsAndWater); 
		// com que ja hem fet hit sobre terreny, si ara nomes trobem un collider, sera aigua fora del terreny i no ens interessa
		if (hits.Length > 1) {
		
			// l'aigua i el terreny poden estar en diferent ordre
			// busquem el collider amb l'alçada maxima
			var hMax : float = -10000;
			var iMax : int = -1;
			for (var i=0;i<hits.Length; i++) {
				//Debug.Log("hit "+i+" layer= "+hits[i].collider.gameObject.layer+" y="+hits[i].point.y);
				if (hits[i].point.y > hMax) {
					hMax = hits[i].point.y;
					iMax = i;
				}
			}
			// si l'aigua esta per sobre, no neixem
			if (iMax >=0 && hits[iMax].collider.gameObject.layer == 4) {
					//salut = 0;   // no faig destroy perque no es fa efectiu fins al final del update actual
					biblio.RajaMolt("Creature spawn sobre l'aigua. No neix");
					noArribaANeixer = true;
			}
		}			
	}
	
	// no neixem si detecta si temperatura es molt diferente de la nostra 
	if (TempDiferenciaOptima(transform.position) > 3) {	
		//salut = 0;
		biblio.RajaMolt("Creature amb temperatura molt diferent a on neix. No neix");
		noArribaANeixer = true;
	}
	
	// si finalmente hem conseguit neixer, registrem estadistiques
	
	if (!noArribaANeixer) {
		
		esticInicialitzat = true;
		if (dna.nivellTrofic==0)
			totalPlantes++;
		else
			totalAnimals++;
	
		biocenosi.RegisterCreatureIsBorn(dna.idGenus,NT, dna.generacio);
		FitxerEvents.instance.EventNeixement(this);
		// <--- tot el tema de registrar les noves especies esta desactivat perque funciona malament
		// si soc el primer d'una altra especie registrem l'event nova especie
		if (dna.generacio == 1) {
			FitxerFilogenetic.instance.NovaEspecie(this, adnPare.nomPantalla);
			// <--- nova especie esta funcionant malament. hauria de mantenir una llista de especies
			// ja declarades
			//FitxerEvents.instance.EventNovaEspecie(this, adnPare.nomPantalla);
		}
		else {
			if (dna.genome.ToString() != adnPare.genome.ToString()) {
				FitxerEvents.instance.EventNovaEspecie(this, adnPare.genome.ToString());
				// <--- nova especie esta funcionant malament. hauria de mantenir una llista de especies
				// ja declarades
				//FitxerFilogenetic.instance.NovaEspecie(this, adnPare.genome.ToString());
			}
		}
	}
	
	// i si no arribem a neixer ens carreguem l'objecte immediatament
	
	else {
	
		esticInicialitzat = false;
		FitxerEvents.instance.EventNoArribaANeixer(this);
		Destroy(gameObject);
	}				
}


// Es crida des d'Update en animals o des de FesUpdate de les plantes 

function FesUpdateCreature() {

	if (esticEnPause || !esticInicialitzat)
		return;	
		
	// si el te seleccionat el laboratori l'unic que fa es girar sense variar res
	if (estat == CreatureStatus.LABORATORI) {
		transform.Rotate(Vector3.up * 0.6);  		
		return;
	 }

	// comptadors de temps que tenen en compte les pauses
	
	tempsEnEstat = SimTime.simTime - simTimeCanviEstat;	
	tempsDesDeParir  = SimTime.simTime - simTimeUltimPart;	
	//edat = SimTime.simTime - simTimeBorn;
	
	// actualitza la biomassa del seu nivell trofic amb la diferencia de pes
	
	// <--- PASSAR A METABOLISME AMB UNS STATICS
	
	if (SimTime.simTime - lastBiomassaSumCheck > intervalBiomassaSumCheck) {
		lastBiomassaSumCheck = SimTime.simTime;
	 	biocenosi.biomassaNT[NT] += metab.pes - pesUltimaSumaBiomassa;
 		pesUltimaSumaBiomassa = metab.pes;
 	}
	
	// si soc un cadaver miro si ja m'he podrit i faig un destroy
	
	if (estat == CreatureStatus.WRECK) {
		// si ja s'han menjat el que quedava o si ha passat molt temps i s'ha podrit acabem
		if (metab.pes <= 0 || SimTime.simTime - simTimeCanviEstat > tempsPutrefaccioCadaver) {
				Destroy (gameObject);
		}
	}
	
	// si encara estic viu...
	
	else {
			
		// puja edat i consumeixo energia			
		// <--- OPTIMITZAR EL TEMA TEMPERATURA, NO CALCULAR CADA COP!!!! En alguns nivells quasi tot es pla!!

		var temperaturaEnPos = biotop.TempEnPosicio(transform.position);
		metab.FesUpdate(temperaturaEnPos);
				
				
		//28/6: if (edat++ > dna.edatMort) {
		/*
		if (edat > dna.edatMort) {
		
			// em moro de vell
						
			estat = CreatureStatus.WRECK;
						
			biocenosi.mortsVell++;
			biocenosi.mortsVellPerGenere[dna.idGenus]++;
			FitxerEvents.instance.EventMort(this, "OLD");

		}
		else {
		*/
		
		// si em moro registro la causa i em poso a cadaver
		// conservo rao de la mort a efectes estadistics
	
			if (metab.mort == true) {
			
					// m'he mort per algun problema relacionat amb el metabolisme
					
					estat = CreatureStatus.WRECK;
					
					// registro causa
					
					switch(metab.raoMort) {
					case "OLD":
						biocenosi.mortsVell++;
						biocenosi.mortsVellPerGenere[dna.idGenus]++;
						FitxerEvents.instance.EventMort(this, "OLD");
						break;						
					case "HOT":
						biocenosi.mortsCalor++;
						biocenosi.mortsCalorPerGenere[dna.idGenus]++;
						FitxerEvents.instance.EventMort(this, "HOT");
						break;
					case "COLD":
						biocenosi.mortsFred++;
						biocenosi.mortsFredPerGenere[dna.idGenus]++;
						FitxerEvents.instance.EventMort(this, "COLD");
						break;
					case "STARVE":
						biocenosi.mortsGana++;
						biocenosi.mortsGanaPerGenere[dna.idGenus]++;
						FitxerEvents.instance.EventMort(this, "STARVE");
						break;
					case "PREY":
						biocenosi.mortsPresa++;		
						biocenosi.mortsPresaPerGenere[dna.idGenus]++;		// <--- suposem que es per aixo
						biocenosi.species[dna.idGenus].predadorsGenere[idGenerePredador]++;
						biocenosi.species[idGenerePredador].presesGenere[dna.idGenus]++;
						FitxerEvents.instance.EventMort(this, "PREY", predador);
						// com que no se detectar quan algu s'ha menjat algu altre, la presa 
						// fa tambe el registre del predador <---
						FitxerEvents.instance.EventMenjar(predador, this);
						break;		
					default:
						Debug.LogWarning("Causa de mort desconeguda. meuId: "+meuId+" Pes:"+metab.pes+ " Salut:"+metab.	salut+" Edat:"+metab.edat);
						FitxerEvents.instance.EventMort(this, "UNKNOWN");
					}
			}
				
		

				
		if (estat == CreatureStatus.WRECK) {
			simTimeCanviEstat = SimTime.simTime;
			biocenosi.RegisterCreatureHasDied(dna.idGenus, dna.nivellTrofic);
			Rajo("MORO...  causa="+metab.raoMort+"  pes: "+metab.pes+ " salut: "+metab.salut+ " edat: "+metab.edat+ " (edat mort: "+dna.edatMort+") ");
			if (morfologia!=null) {
				morfologia.MorfologiaCadaver();
			}
		}
	}	

	// tant si estic viu com cadaver he d'actualitzar la morfologia segons el pes
	// en simulacio rapida no es veu com creixen! <---
	
	if (!SimTime.simSpeedFast && morfologia != null && (metab.pes > lastPes*1.03 || metab.pes < lastPes*0.97)) {
       	morfologia.MorfologiaPes(metab.pes/dna.pesAdult);
	 	//13/6: morfologia.MorfologiaPes();
		lastPes = metab.pes;
	}
	


}	


// Try to give birth for all offspring
// If one try fails, we give up. Count failures, description will be logged in console

function Parir(){
	var pucParir=true;
	var oks = 0;
	for (var i=0;i<dna.reprodOffspringX && pucParir;i++) {
		pucParir=ParirUn();
		if (pucParir) {
			parirTryOk++;
			oks++;
			heMenjatPesDesDePart = 0;
		}
		else {
			parirTryNoOk++;
		}
		//Debug.Log("Parir "+dna.nomPantalla+" i="+i+". pucParir="+pucParir+". dna.reprodOffspring="+dna.reprodOffspring);
	}
	FitxerEvents.instance.EventGiveBirth(this, oks);
}

// Give birth to one creature and return ok/ko
// Reasons for failure
//	- to many neighbours (but there is a chance to expand far away)
//	- to many creatures (there is a setup maxAnimals and maxPlantes to observe) 

private function ParirUn(): boolean {
	var pucParir = false;
	simTimeUltimPart = SimTime.simTime;		// si te gana resseteja el timer de parir

	var intents = -1;
	
	// for debug purposes: show area to give birth 
	
	if (esticSeleccionat) {
		biblio.DebugDrawSquare(transform.position, dna.reprodDistanceMin*2, Color.gray, 0.3f);
		biblio.DebugDrawSquare(transform.position, dna.reprodDistanceMax*2, Color.gray, 0.3f);
	}
	
	// creature setup limit control
	
	/*	
	if ( (dna.nivellTrofic > 0 && viusEspecie[dna.idGenus] > biocenosi.maxAnimals*biocenosi.capacityTL[dna.nivellTrofic]) 
		|| (dna.nivellTrofic == 0 && viusEspecie[dna.idGenus] > biocenosi.maxPlantes*biocenosi.capacityTL[0])) {		
	*/
	if (biocenosi.viusEspecie[dna.idGenus] > biocenosi.capacityReference * biocenosi.capacityTL[dna.nivellTrofic]) {
		//Debug.LogWarning(dna.nomPantalla+" T:"+SimTime.simTime+" No puc parir perque viusEspecie > capacityReference * capacityTL ");
		Rajo("No puc parir perque viusEspecie > capacityReference * capacityTL ");
	}	
	else {
	
		// count neighbours in birth area. we can not give birth if it's crowdd
		
		var neighbours = Physics.OverlapSphere(transform.position, dna.reprodDistanceMax, maskMateixGenere);
		//Rajo("parir. veins neighbours="+neighbours.Length);
		if (neighbours.Length <= dna.reprodMaxNeighbours) {
		
			// intenta parir en p o, si hi ha algu exactament a la mateix posicio, ho intenta al costat
			intents = 3;
			var posBirth = transform.position + biblio.VectorAleatori(dna.reprodDistanceMin, dna.reprodDistanceMax);
			while(intents > 0) {
			
				// que no hi hagi ningu exactament al mateix lloc
				var hihalgu = Physics.OverlapSphere(posBirth, 1, maskMateixGenere);
				if (hihalgu.Length ==0) {
				
					// pareix
					Debug.DrawLine(transform.position, posBirth, Color.white, 0.5f);
					var clon = Instantiate (this.gameObject, posBirth, Quaternion.identity);
					if (clon == null) Debug.Log (meuId + "*** ERROR *** Instanciant fill en " + posBirth);
					else {
						clon.SetActive(true);
						clon.gameObject.SendMessage("Inicialitzat", dna);
						Rajo("he parit "+CreatureToString(clon));
						heParitCops++;
						pucParir = true;
						}
					intents = 0;  
				}
				else {
					Rajo("Parir. Algu ("+hihalgu.Length+") al meu lloc. Intents "+intents+" Pos: "+posBirth+ ": "+CreatureToString(hihalgu[0]));
					posBirth = transform.position + biblio.VectorAleatori(2,3);
					intents--;
				}
			}
		}
		else  {	
			Rajo(" Parir. To many neighbours to give birth: " +neighbours.Length + " > " + dna.reprodMaxNeighbours + " en " + transform.position + " , radi "+dna.reprodDistanceMax);
		}
		
		// si el radi estava ple, pot escampar-se. si torna a caure en un lloc ple de gent, ho deixa estar
		if (intents <0) {
			if (Random.value < dna.reprodExpandProb) {	
				posBirth = transform.position + biblio.VectorAleatori(dna.reprodDistanceMax*3, dna.reprodDistanceMax*3);
				neighbours = Physics.OverlapSphere(posBirth, dna.reprodDistanceMax, maskMateixGenere);
				if (neighbours.Length <= dna.reprodMaxNeighbours) {
					Debug.DrawLine(transform.position, posBirth, Color.white, 0.3f);
					//var clon2 = Instantiate (biocenosi.species[dna.idGenus].prefab, posBirth, Quaternion.identity); 
					var clon2 = Instantiate (this.gameObject, posBirth, Quaternion.identity); 
					if (clon2 != null) {
						// inicialitza'l
						clon2.SetActive(true);
						clon2.gameObject.SendMessage("Inicialitzat", dna);
						// quan s'escampen muten sempre
						//clon2.GetComponent(Creature).dna.MutacioAleatoria(100);
						//clon2.GetComponent(Creature).dna.MutacioAleatoria(biotop.radiacioMitja);
						//Rajo(" Parir. M'escampo de "+transform.position +" a "+posBirth+", amb mutacio");
						Rajo(" Parir. M'escampo de "+transform.position);
						heParitCops++;
						pucParir = false; 	// expandir-se es una excepcio
					}
				}
				else {
					Rajo("M'anava a escampar pero tampoc puc");
				}
			}
		}
	}
	return pucParir;
}


// quan et mossenguen perds salut i pes
//  punts d'atac
//  mossegada: pes que s'endura l'atacant -> la presa per 5 x mossegada
//  si la mossegada el deixa per sota de pesMinim, es mor
// es public perque es crida des de Animal:Update()
//public function EtMossego(puntsAtac:int, mossegadaPes: float, atacant: Creature): float {
public function EtMossego(atacant: Creature): float {

	if (esticInicialitzat == false) {
		Debug.LogError("*** AVIS *** Creature.EtMossego no esticInicialitzat");
		return 0;
	}


	var estavaMort : boolean = metab.mort;
	
	// efecte de l'atac sobre pes i salut
	
	var mossegadaReal = metab.RebreMossegada(atacant);

	// Si moro ara registro qui es presa i qui es predador		
	//Rajo("Em mosseguen. puntsAtac: "+puntsAtac+" puntsDefensa: "+dna.puntsDefensa+" mossegada: "+mossegada+" Resultat: salut: "+salut+ " pes: "+pes);
	if (!estavaMort && metab.mort && idGenerePredador == -1) {
		idGenerePredador = atacant.dna.idGenus;
		predador = atacant;
		biblio.Assert(idGenerePredador!=null, "Creature.EtMossego idGenerePredador==null, meuId="+meuId);
		adnStringPredador = atacant.dna.genome.ToString();
		//Debug.Log("un "+idGenerePredador+" s'ha menjat un " + dna.idGenus + " ("+meuId+")");
		Rajo(" se m'ha menjat un "+idGenerePredador);
	}
	
	return mossegadaReal;
		
}	




function getEstatString(estat: CreatureStatus): String {
		var txt: String;
		switch(estat) {
			case CreatureStatus.BABY: 			txt= "BABY"; break;
			case CreatureStatus.IDLE: 		txt= "OK"; break;
			case CreatureStatus.BANDA: 		txt= "BAND"; break;
			case CreatureStatus.PENDING_BIRTH: 	txt= "TOGIVEBIRTH"; break;
			case CreatureStatus.CHASING: 	txt= "CHASING"; break;
			case CreatureStatus.EATING: 		txt= "EATING "+ CreatureToString(CreatureStatusObjecte); break;
			case CreatureStatus.ESCAPING: 		txt= "ESCAPING"+ (CreatureStatusObjecte!=null ? " "+CreatureToString(CreatureStatusObjecte) : ""); break;
			case CreatureStatus.ATTACKED: 		txt= "ATTACKED "+ CreatureToString(CreatureStatusObjecte); break;
			case CreatureStatus.TURNING: 		txt= "ROTATING"; break;
			case CreatureStatus.WRECK: 		txt= "DEAD"; break;
			//case CreatureStatus.PENDINGTERMINATE: txt= "PENDINGTERMINATE"; break;
			default: txt= estat + "(?)";
		}
	return txt;
}



function Rajo(txt: String) {
	//if (esticRajant && debugMode) {
	if (esticSeleccionat && debugMode) {
		Debug.Log("["+dna.nomPantallaCurt+", "+meuId+"- T "+SimTime.simTime.ToString("F1") +"]     " + txt + "           [Edat: "+metab.edat.ToString("F2") + ". Energia="+metab.energia.ToString("F2")+" Pes="+metab.pes.ToString("F1") + ". Salut="+metab.salut + ". Pos="+transform.position+" frameCount="+Time.frameCount+"]");	
	}
}



function CreatureToString(animal: GameObject) {
	if (animal!=null) 		return animal.GetComponent(Creature).dna.nomPantallaCurt+" "+animal.GetComponent(Creature).meuId;
//	if (animal!=null) 		return animal.GetComponent(Creature).meuId;
	else 					return "(animal null)";
}
function CreatureToString(animal: Collider) {
	//if (animal!=null) 		return animal.gameObject.GetComponent(Creature).meuId;
	if (animal!=null) 		return animal.transform.parent.gameObject.GetComponent(Creature).dna.nomPantallaCurt+" "+animal.transform.parent.gameObject.GetComponent(Creature).meuId;
//	if (animal!=null) 		return animal.transform.parent.gameObject.GetComponent(Creature).meuId;
	else 					return "(animal null)";
}
function CreatureToString(animal: Creature) {
	if (animal!=null) 		return animal.dna.nomPantallaCurt+" "+animal.meuId;
//	if (animal!=null) 		return animal.meuId;
	else 					return "(animal null)";
}
function SetSeleccionat(onoff: boolean) {
	esticSeleccionat = onoff;
}


// versio reduida de l'etiqueta (la que es pinta sobre l'animal)

function EtiquetaSobreAnimal(): String {
	
	var txt="";
	txt +=dna.nomPantalla;			//+" ("+dna.nomGenere+")";
	txt += "\n"  + getEstatString(estat);
	if (metab.mort)
		txt += " ("+metab.raoMort+")";
	else {
		if (!metab.tempOk) {
			txt+= "\n" + (metab.tempNoOkFred ? "TO COLD!" : "TO WARM!");
		}
		//if (dna.nivellTrofic > 0) {			// <-- ojo repe abaix
		//	var food = (Mathf.Clamp(1.0*(dna.intervalGana - tempsDesDeMenjar)/dna.intervalGana, 0, 1)*100);
		//	txt += "\nFood: "+food.ToString("F0")+"%";
		//}
			txt += "\nEnergy: "+metab.energia.ToString("n0");
		if (metab.salut >=0) {
			txt += "\nHealth:  "+metab.salut.ToString("n0");
		}
		if (metab.pes >= 0 && metab.salut >0) {
			//var fart : int = metab.pes/pesFart*100;
			txt += "\n" + metab.pes.ToString("F0") + " kg";// ("+fart+"%)";
			if (metab.esticFart())
				txt += " FULL!";
			else
				if (metab.tincGana())
					txt += " HUNGRY!!";		
		}
	}
	return txt;
}

// Etiqueta mes complerta que es posa adalt

function GetEtiqueta(): String {
	
	var txt=dna.nomPantalla;
	txt += "\n"  + getEstatString(estat);
	if (metab.mort)
		txt += " ("+metab.raoMort+")";
	
	txt +="\nEnergy: "+metab.energia.ToString("n0");
	if (metab.esticFart())
		txt += " FULL!";
	else
		if (metab.tincGana())
			txt += " HUNGRY!";
	
	txt +="\nSalut:   "+metab.salut.ToString("n0");
	if (!metab.tempOk)
		txt+= metab.tempNoOkFred ? " COLD!" : " WARM!";
	//var fart : int = metab.pes/pesFart*100;
	//if (dna.nivellTrofic > 0) {			// <-- ojo repe adalt
	//	var food = (Mathf.Clamp(1.0*(dna.intervalGana - tempsDesDeMenjar)/dna.intervalGana, 0, 1)*100);
	//	txt += "\nFood: "+food.ToString("F0")+"%";
	//}
	// Animals: tenen gana?
	var ratioPes : float = metab.pes/dna.pesAdult*100;
	txt += "\nWeight: " + metab.pes.ToString("F1") + " kg ("+ratioPes.ToString("F0")+"%)";
	// Plantes: tenen aigua?
	if (dna.nivellTrofic == 0 && biotop.precipitacions < dna.precipitacionsNecessaries)
		txt += " NEED WATER!";
	
	txt += "\nId:     " + meuId + " ("+dna.nomGenere+", "+dna.generacio+")";
	txt += "\nEdat:   "+metab.edat.ToString("F0")+ " ("+dna.edatMort+")";
	txt += "\nheMenjatPes: "+heMenjatPes.ToString("F1");
	txt += "\n des de part:"+heMenjatPesDesDePart.ToString("F1");
	txt += "\nheParitCops: "+heParitCops;
	txt += "\nGenome:      " + dna.genome.ToString();	
		
	return txt;
}

public function GetEtiquetaDebug():String {
	var txt : String;
	txt = "";
	txt += "\nedat:         "+metab.edat.ToString("F1");
	txt += "\nsimTime";
	txt += "\n  Now:        "+SimTime.simTime.ToString("F1");
	txt += "\n  CanviEstat: "+simTimeCanviEstat.ToString("F1");
//	txt += "\n  Born:       "+metab.simTimeBorn.ToString("F1");
	txt += "\n  UltimPart:  "+simTimeUltimPart.ToString("F1");
	txt += "\nCollider: "+elCol.gameObject.name;
	txt += "\nLayer: "+elCol.gameObject.layer;
	txt += "\ntempsEnEstat: "+tempsEnEstat.ToString("F1")+" ("+getEstatString(estat)+")";
	txt += "\nconsumDiariEnergia: "+metab.consumDiariEnergia.ToString("F2");
	//txt += "\nmeuAdn.intervalGana:  "+dna.intervalGana;
	//txt += "\ntempsDesDeMenjar:     "+tempsDesDeMenjar.ToString("F1");
	txt += "\nmeuAdn.reprodInterval: "+dna.reprodInterval.ToString("F1");
	txt += "\ntempsDesDeParir:      "+tempsDesDeParir.ToString("F1");
	txt += "\nparirTryOk:           "+parirTryOk;
	txt += "\nparirTryNoOk:         "+parirTryNoOk;
	return txt;
}

/*
public function GetEtiquetaAdn():String {
	var txt2 = " Id: "+meuId;	
	txt2+= dna.Etiqueta();
	//Rajo("ADN... "+txt2);
	return txt2;
}
*/
public function OnMouseDown() {
if (!esticInicialitzat) 
		return;
	Rajo(" M'han fet clic");
	ObjecteSeleccionat.instance.ClicEnCreature(this);
}


// la crida laboratori (??)
public function AjustaMorfologia() {
	//if (!SimTime.simSpeedFast) {
		morfologia.AjustaMorfologia();
		morfologia.MorfologiaPes(metab.pes/dna.pesAdult);
	 	
	//}
}


function PosaColorCosSeleccionat(partNom: String, color: Color) {
	if (!SimTime.simSpeedFast || esticSeleccionat) {
		morfologia.PosaColorCos(partNom, color);
	}
}

// l'agafa el laboratori per canviar-li el genome
private var estatAbansLaboratori : CreatureStatus;
public function SetLaboratoriOn(){
	if (estat== CreatureStatus.LABORATORI)
		return;
	Rajo("Passo a estat Laboratori");
	estatAbansLaboratori = estat;
	//transform.position.y += 10;
	estat = CreatureStatus.LABORATORI;
}
public function SetLaboratoriOff(){
	if (estat!= CreatureStatus.LABORATORI)
		return;
	Rajo("Surto d'estat Laboratori");
	estat = estatAbansLaboratori;
	//transform.position.y -= 10;
}



protected function TemperaturaOkPerMi(p: Vector3): boolean {	
	return (Mathf.Abs(biotop.TempSobreTerreny(p) - dna.tempOptima) < dna.toleranciaTemp);
}		
// diferencia en valor absolut temperatura terreny i temperatura optima meva + tolerancia temp
protected function TempDiferenciaOptima(p: Vector3): float {	
	var dt = Mathf.Abs(biotop.TempSobreTerreny(p) - dna.tempOptima);
	if (dt < dna.toleranciaTemp)
		return 0;
	else
		return (dt - dna.toleranciaTemp);
}		

function OnDestroy() {
	if (esticInicialitzat) {
	 	biocenosi.biomassaNT[NT] -= pesUltimaSumaBiomassa;
		if (dna.nivellTrofic==0)
			totalPlantes--;
		else
			totalAnimals--;
	}
	// R.I.P

}
