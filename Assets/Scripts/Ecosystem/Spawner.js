#pragma strict

// Fa spawn d'especies en un radi i amb una frequencia donades
// Les especies son les que se li posen com a components
// Si fas clic a sobre dona info i et deixa forçar un spawn
// Es pot modificar l'adn de l'especie posant-li un modificador d'adn (EspecieXXX)


class Spawner extends MonoBehaviour {

	private var nomGenere : String;			// surt en pantalla quan fas clic sobre el spawner
	@HideInInspector var idGenus : int;	// id de biocenosi per aquest genere
	var numSpawnStart : int = 5;
	var timeRepeat : int = 0;			// spawn again every n seconds
	var numSpawnRepeat : int = 0;
	var r1 = 0;								
	var r2 = 30;
	// 
	var adjustTemperature = true;			// adjust optimal temperature in adn to position (even if adn modifier exist!)

	// adn modifiers (apply only if modificadorAdn not set)
	var still = false;						// posar speed IDLE a zero (per debugs)
	
	@HideInInspector var esticInicialitzat = false;
	
	//@HideInInspector static var controller : GameController;	
	static var biocenosi : Biocenosi;
	
	private var adnGenere : Dna;	// original del genere de biocenosi
	private var adnEspecie : Dna;	// el modificat
	private var modificadorAdn : EspecieBase;

	private var inicialitzat = false;
	
	// el genere que instanciarem es el propi nom del game object
	
	function Awake() {
	   nomGenere = gameObject.transform.name;	    
	 
	}
	
	// Start
	function Start() {
		if (!inicialitzat)
			DoStart();
	}
	

	function DoStart () {

		if (biocenosi==null)
			biocenosi = Biocenosi.instance;
		biblio.Assert(biocenosi!=null, "Spawner. Biocenosi = null!");
			
		// els faig petit per a que no es vegin tant en runtime
		// i els poso damunt del terrenyu

		transform.localScale = Vector3(1,1,1);
	    transform.position.y = Terrain.activeTerrain.SampleHeight(transform.position + Vector3.up*5);
	
		inicialitzat = true;
	}

	// StartSpawner es cridat per Biocenosi

	function StartSpawner() {

		//Debug.Log("Spawner. StartSpawner init");
		if (!inicialitzat) {
			DoStart();
		}
	

		// recupera el id de genere de biocenosi a partir del nom
		
		idGenus = biocenosi.Nom2idGenere(nomGenere);
		if (idGenus<0) { 
			Debug.LogWarning("Spawner Spawner. genere no trobat en species: "+nomGenere + ". Destrueixo Spawner");
			Destroy(gameObject);
		}
		
		// recuperem adn del genere

		adnGenere = biocenosi.species[idGenus].dna;

		// generem adn de l'especie. mirem si cal modificar el del genere
			
		modificadorAdn = gameObject.GetComponent(EspecieBase);
		if (modificadorAdn != null) {
			adnEspecie = modificadorAdn.ModificaAdn(adnGenere);
		 	Debug.Log("Modificador adn: "+modificadorAdn);
		}
		else {
			adnEspecie = adnGenere;
			if (still) {
				Debug.Log("still true. setting speed to 0");
				adnEspecie.speedIdle = 0;
				adnEspecie.speedChasingX = 0;
			}
		}
		
		// adjust optimal temperature to position temperature
		
		if (adjustTemperature) {
			var tempAtSpawnPosition = GameController.instance.biotop.TempSobreTerreny(transform.position);
			adnEspecie.tempOptima = tempAtSpawnPosition;
			adnEspecie.SetGenomeFromVars();
		}

		esticInicialitzat = true;
		Debug.Log ("SPAWNER INICIALITZAT: "+nomGenere+" idGenus: "+idGenus);
		
		
		// do initial spawn if game is not paused
		
		if (!SimTime.instance.simIsPaused) {
			DoSpawn(numSpawnStart, 1, r1, r2);
		}
		else {
			Debug.LogWarning("Spawner: game paused. Start spawn skipped!");
		}
	
	
		// start periodic spawn
		
		if (timeRepeat > 0 && numSpawnRepeat > 0) {
		 	CancelInvoke();   // cancel in case this is a restart
		  	InvokeRepeating("DoRepeat", timeRepeat, timeRepeat);	
		 }

	
	}

	// spawn periodic cada framesUpdate
	// <--- ojo si coincideix un dorepeat en un proces de restart!!

	function DoRepeat() {
			
		if (!SimTime.instance.simIsPaused) {
			DoSpawn(numSpawnRepeat, 1, r1, r2);
		}
		else {
			Debug.LogWarning("Spawner: game paused. Repeat spawn skipped!");
		}

	}
	
	// spawn de idGenus
							
	function DoSpawn(numIndividuals:int, probSpawn: float, rMin: float, rMax:float) {
		
		if (biocenosi.inicialitzat == false) {
			Debug.LogWarning("Spawner.DoSpawn - especie: "+idGenus+ " .... Biocenosi encara no esta inicialitzat");
			return;
		}
		
		// comprova que no hi hagi massa individuus de l'especie
		var max : int;
		var nt = biocenosi.species[idGenus].dna.nivellTrofic;
		max = biocenosi.capacityReference * biocenosi.capacityTL[nt];
		/*
		if (nt == 0)
			max = biocenosi.capacityTL[0] * biocenosi.maxPlantes;
		else
			max = biocenosi.capacityTL[nt] * biocenosi.maxAnimals;
		if (max > biocenosi.viusNTrofic[nt]) {
		*/
		//Debug.Log("max="+max+ " biocenosi.viusNTrofic[nt]="+biocenosi.viusNTrofic[nt]);	
		if (max > biocenosi.viusEspecie[idGenus]) {
			// first if to avoid division by zero on %				<--- ???????????
			if (Random.value < probSpawn) {
				for (var i=0;i<numIndividuals;i++) {
					biocenosi.FesSpawn(idGenus, transform.position+biblio.VectorAleatori(rMin, rMax), adnEspecie);
					//biocenosi.FesSpawn(especie, transform.position+biblio.VectorAleatori(rMin, rMax));
					Debug.DrawLine(transform.position, transform.position+Vector3(rMax, 0, 0));
					Debug.DrawLine(transform.position, transform.position+Vector3(-rMax, 0, 0));
					Debug.DrawLine(transform.position, transform.position+Vector3(0, 0, rMax));
					Debug.DrawLine(transform.position, transform.position+Vector3(0, 0, -rMax));
					//Debug.Log("Spawner.DoSwpan - Spawn: "+especie + " nt: "+ nt);
					//Debug.Log("max="+max+ " biocenosi.viusNTrofic[nt]="+biocenosi.viusNTrofic[nt]);	
					if (max < biocenosi.viusNTrofic[nt]) {
						Debug.LogWarning("Spawner.DoSpawn ("+adnEspecie.nomPantalla+") - No spawn, massa gent. idGenus: "+idGenus + "nt: " + nt + "max: "+max + " i n'hi ha "+biocenosi.viusNTrofic[biocenosi.species[idGenus].dna.nivellTrofic]);
						break;
					}
				}
			}
		}
		
		else  {
			Debug.LogWarning("Spawner.DoSpawn ("+adnEspecie.nomPantalla+") - No spawn, massa gent. idGenus: "+idGenus + "nt: " + nt + "max: "+max + " i n'hi ha "+biocenosi.viusNTrofic[biocenosi.species[idGenus].dna.nivellTrofic]);
		}
	}


	private var ClicPerSpawnActiu = false;
	private var quants = 0;
	
	
	public function OnMouseDown() {

		// boto dret fa spawn
		if (ClicPerSpawnActiu == true) {
			Debug.Log("Spawner activat manualment.");		
			DoSpawn(quants, 1, r1, r2);
		}
		else
		// boto esquerra posa etiqueta i activa periode de clic
		if (ClicPerSpawnActiu == false) {
			//if (controller == null) {
			//	controller = FindObjectOfType(GameGameController.instance.);
			//}
			var txt = "Spawner "+nomGenere;
			if (numSpawnStart > 0) {
				txt += "\nnumSpawnStart: "+numSpawnStart;
				quants = numSpawnStart;
			}
			if (numSpawnRepeat > 0) {
				txt += "\ntimeRepeat: "+timeRepeat;
				txt += "\nnumSpawnRepeat: "+numSpawnRepeat;
				quants = numSpawnRepeat;
			}
			txt += "\nradi: "+r1+", "+r2;
			//Debug.Log("Clic en Spawner. "+txt);
			ObjecteSeleccionat.instance.ClicEnObjecte(this.gameObject, txt+"\nClic abans de 3 segons fa spawn de "+quants);
			ClicPerSpawnActiu = true;
			//Debug.Log("Activo timer 1");
			StartCoroutine("Timer");
			//Debug.Log("Activo timer 2");
		}


	}


}