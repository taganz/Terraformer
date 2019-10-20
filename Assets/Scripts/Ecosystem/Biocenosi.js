#pragma strict

// Biocenosi keeps stats for genus and creatures in the ecosystem

static var instance : Biocenosi;			

// aquestes variables les llegeix de BiocenosiData en cada Ecosistema

@HideInInspector var titolNivell = "";		
//@HideInInspector var maxPlantes : int;		
//@HideInInspector var maxAnimals : int;	
@HideInInspector var capacityReference : int;
@HideInInspector var capacityTL = [0.1, 0.2, 0.3, 0.4];	// spawners: si els individuus del seu nivell trofic superen aquest % sobre total plantes no fan spawn
@HideInInspector var hInitCamaraZenital = 100;		// alçada inicial camara zenital. ajustar segons posicio spawners
@HideInInspector var biomassaObjectiu = 1000;	// T per sobre de les quals hem d'estar
@HideInInspector var herbivorsSempreFarts = false;		// tests: els herbivors sempre tenen pes > pesFart
@HideInInspector var maskNT : LayerMask[];		// layermask de cada nivell trofic

// selected ecosystem pointers

@HideInInspector var biotop : Biotop;	// biotop actiu
@HideInInspector var biocenosiData : BiocenosiData;
@HideInInspector var laboratori: Laboratori;

// animals en nivell

@HideInInspector var species : Specie[];	// initial species present in labo + ecosystem
@HideInInspector var speciesMax : int;		// max number of register species
@HideInInspector var generesIdOu : int[];		// si esta en ous es l'index de ousNomEspecie, sino es -1	

@HideInInspector var spawnersNumEspecies : int;			// especies detectades en els spawners
@HideInInspector var spawnersNomEspecie : String[];

// estadistiques. index is dna.idGenus

@HideInInspector var viusNTrofic : int[];			// vius per escala alimentaria
@HideInInspector var viusEspecie : int[];	// vius per especie. 
@HideInInspector var mortsEspecie : int[];	// parts - vius per especie, per comoditat. 
@HideInInspector var parts : int; 
@HideInInspector var partsEspecie : int[];	// parts per especie. 
@HideInInspector var generacionsEspecie : int[];	// generacions per especie. 
@HideInInspector var biomassaNT : float[];	// biomassa per nivell trofic, l'actualitzen els essers vius?
//@HideInInspector var biomassaTotal : int;	// biomassa total, s'actualitza a cada update
@HideInInspector var animalsViusTotal : int;		// inclou plantes
@HideInInspector var animalsViusSensePlantes : int;		// sense plantes
@HideInInspector var TotsMorts : boolean;	// no inclou plantes. si despres d'un reset han nascut animals i s'han mort tots

@HideInInspector static var mortsFred : int;
@HideInInspector static var mortsFredPerGenere : int[];
@HideInInspector static var mortsCalor : int;
@HideInInspector static var mortsCalorPerGenere : int[];
@HideInInspector static var mortsGana : int;
@HideInInspector static var mortsGanaPerGenere : int[];
@HideInInspector static var mortsVell : int;
@HideInInspector static var mortsVellPerGenere : int[];
@HideInInspector static var mortsPresa : int;
@HideInInspector static var mortsPresaPerGenere : int[];	

//private var esticEnPauseBionenosi : boolean;
@HideInInspector var inicialitzat = false;				// accesed by spawners
private var controller: GameController;
private var genus : GameObject;
private var spawners : Component[];

function Awake() {
	instance = this;
}


// Starts selected ecosystem

function StartNivell(ecosistema: GameObject) {

	// if first ecosystem run, init vars
	
	if (!inicialitzat) {
	
		Debug.Log("BIOCENOSI. StartNivell init...");
		
		// recuperem les variables de l'ecosistema seleccionat
		
		controller = GameController.instance;
		biocenosiData = controller.biocenosiData;
		biotop = controller.biotop;
		
		//maxPlantes = biocenosiData.maxPlantes;		
		//maxAnimals = biocenosiData.maxAnimals;	
		capacityReference = biocenosiData.capacityReference;
		capacityTL = biocenosiData.capacityTL;	
		hInitCamaraZenital = biocenosiData.hInitCamaraZenital;
		biomassaObjectiu = biocenosiData.biomassaObjectiu;	
		herbivorsSempreFarts = biocenosiData.herbivorsSempreFarts;	
	
		
		laboratori = ecosistema.GetComponent(Laboratori);
		biblio.Assert(laboratori != null, "Biocenosi.StartNivell: No hi ha laboratori en ecosistema "+ecosistema);

		viusNTrofic = new int[4];
		maskNT = new LayerMask[4];
		viusEspecie = new int[Specie.maxSpecie];
		mortsEspecie = new int[Specie.maxSpecie];
		partsEspecie = new int[Specie.maxSpecie];
		generacionsEspecie = new int[Specie.maxSpecie];
		mortsFredPerGenere = new int[Specie.maxSpecie];
		mortsCalorPerGenere = new int[Specie.maxSpecie];
		mortsGanaPerGenere = new int[Specie.maxSpecie];
		mortsPresaPerGenere = new int[Specie.maxSpecie];
		mortsVellPerGenere = new int[Specie.maxSpecie];
		
		biomassaNT = new float[4];

		// array especies que tindra el nivell. es carrega a partir del que troba 1) al laboratori i 2) als spawners
		
		species = new Specie[Specie.maxSpecie];
		generesIdOu = new int[Specie.maxSpecie];
		
		speciesMax = 0;
	}
	else {
	
		Debug.Log("BIOCENOSI. StartNivell LEVEL RESTART init...");
		
		// set prefab parent active again
		genus.SetActive(true);
		
	}
	
	// reset values
	
	for (var i=0;i<Specie.maxSpecie;i++) {
		viusEspecie[i]=0;
		mortsEspecie[i]=0;
		partsEspecie[i]=0;
		generacionsEspecie[i] = 0;
		mortsFredPerGenere[i] = 0;
		mortsCalorPerGenere[i] = 0;
		mortsGanaPerGenere[i] = 0;
		mortsPresaPerGenere[i] = 0;
		mortsVellPerGenere[i] = 0;
	}
	mortsFred =  0;
	mortsCalor =  0;
	mortsGana =  0;
	mortsVell =  0;
	mortsPresa =  0;
	parts = 0;

	
	// biomassa es recalcula a Creature
	// es presenta a puntuacio, grafic biomassa i fitxer poblacio
	for (i=0;i<4;i++) {
		viusNTrofic[i]=0;
		biomassaNT[i]=0;
	}
	
	TotsMorts=false;
	animalsViusTotal = 0;
	animalsViusSensePlantes = 0;
	Debug.Log("biocenosi.start: Specie.maxSpecie="+Specie.maxSpecie);
	
	/*
	// variables estatiques de Creature
	Creature.id = 0;
	Animal.totalAnimals = 0;
	Planta.totalPlantes = 0;
	*/
	
	// register genus in this ecosystem
	
	if (!inicialitzat) {
	
		// afegim els ous a array especies nivell (sempre comencem pels ous i despres pels spawners!!)
		
		for (var j=0; j<laboratori.ousNomEspecie.length;j++) {
			registerSpecie(laboratori.ousNomEspecie[j], j, false);
		}
		

		// llegim els spawners actius i registrem els seus generes
			
		spawners = ecosistema.gameObject.GetComponentsInChildren(Spawner);
		Debug.Log("Biocenosi. Trobats "+spawners.length+ " spawners. Arrancant...");	
		for (var sp: Component in spawners)  {
			registerSpecie(sp.gameObject.name, -1, true);
		}
		
		// mirem quantes especies diferents hem registrat als spawners
		
		spawnersNomEspecie = new String[spawners.length];
		spawnersNumEspecies = 0;		// comptarem les especies amb nom diferent <-- OJO, POT SER QUE TINGUI GENOMA DIFERENT I MATEIX NOM!!!!
		for (var idGen=0;idGen<speciesMax;idGen++) {
			var trobat = false;
			// nomes afegim les locals
			if (species[idGen].local) {
				for (var idEsp = 0; idEsp<=spawnersNumEspecies && !trobat;idEsp++) {	
					if (species[idGen].dna.nomPantalla==spawnersNomEspecie[idEsp]) {
						trobat = true;
					}
				}
				if (!trobat) {
					spawnersNomEspecie[spawnersNumEspecies] = species[idGen].dna.nomPantalla;
					Debug.Log("nova especie en spawer: "+spawnersNomEspecie[spawnersNumEspecies]);
					spawnersNumEspecies++;
				}
			}
		}
		
		Debug.Log("BIOCENOSI. Registrats "+speciesMax+ " generes. Spawners tenen "+spawnersNumEspecies+" especies diferents. ");
	
		// arranca laboratori per a que es quedi copia dels adn i poder modificar
		// <--- LABORATORI HAURIA DE TENIR EL SEU GENOMA PELS OUS???
	
		laboratori.Inicialitza();
	
	}
		
	// desactivem les especies sobrants (sino quan arranquem els spawners els detecten com animals?)
	
	var go = GameObject.FindGameObjectWithTag("animal");
	while(go!=null) {
		//Debug.Log("Desactivo prefabs de generes no utilitzats: "+go);
		go.SetActive(false);
		go = GameObject.FindGameObjectWithTag("animal");
	}
	
	
		
	// setup ok, we are ready to start spawners
	
	inicialitzat = true;		

	// arranca els spawners correctes. no ho podiem fer abans de desactivar les especies sobrants 
	
	Debug.Log("Biocenosi. Arrancant "+spawners.length+ " spawners...");
	//for (var sp: Component in spawners) {
	for (var sp: Spawner in spawners) {
		if (Nom2idGenere(sp.gameObject.name) > -1) {
			//20/8 -- ?? -- sp.gameObject.GetComponent(Spawner).StartSpawner();
			sp.StartSpawner();
		}
		else {
			Debug.LogWarning("error arrancant spawner "+sp+" name:"+sp.gameObject.name);
		}
	}
	
	// set creature prefabs to inactive because we don't want to see them in scene
	
	genus = GameObject.Find("Genus");
	biblio.Assert(genus!=null, "Biocenosi.StarNivell genus==null. Revisa els noms");
	genus.SetActive(false);
	
		
	Debug.Log("BIOCENOSI. StartNivell fi...");

}

// afegim una altra especie a l'array d'especies nivell de la biocenosi

private function registerSpecie(nom: String, idOu: int, origenSpawner: boolean) {
	
	// si ja tenim el genere tornem. abans li posem local true si cal si ve de spanwer
	if (Nom2idGenere(nom) > -1) {
		if (origenSpawner) {
			species[Nom2idGenere(nom)].local = true;
		}
		return;
	}
	
	// si no la tenim i ja no hi caben mes generes esta ko
	if (speciesMax >= Specie.maxSpecie)  {
		Debug.LogWarning("Biocenosi.registerSpecies. Massa generes al nivell! Ignoro: "+nom);
		return false;
	}
	
	// afegim el nou genere a l'array
	var i =  speciesMax;
	Debug.Log("Biocenosi. Registrant genere "+i+" "+nom);
		
	species[i] = new Specie(nom);
	if (species[i] == null) {
			Debug.Log("Biocenosi.registerSpecies No he pogut crear el genere: "+i+" "+nom);
			return;
		}
		
	// actualitzem la mascara amb el layer d'aquest genere
	var nt = species[i].dna.nivellTrofic;
	var layer : int = 13 + i;
	var novamask : LayerMask = 1 << layer;	
	maskNT[nt] = maskNT[nt].value | novamask.value;
	//Debug.Log("genere "+i + "-" + species[i].dna.nomPantalla+" nt="+nt+" maskIguals="+maskNT[nt].value);
	//Debug.Log("genere "+i + "-" + species[i].dna.nomPantalla+" nt="+nt+" maskIguals="+System.Convert.ToString (maskNT[nt].value, 2));
	
	// ho conservem per a que Creature informi de RegisterCreatureIsBorn i RegisterCreatureHasDied  <-- hauria d'estar en un static en Creature, no en ad
	//species[i].Inicialitza();
	species[i].dna.idGenus = i;
	//24/8-el genoma ja no depen del idGenus: species[i].dna.SetGenomeFromVars();		// recalcula el genome amb el idGenus

	// guardem l'id que tenia a l'array de l'ou
	generesIdOu[i] = idOu;
	
	// si ve de spanwer ho posem a true (pot ser que tambe sigui lab)
	// tambe afegim que es alien
	if (origenSpawner) {
		species[i].local = true;
	}
	else {
		species[i].lab = true;
	}

	// check for genus prefab
		
	species[i].prefab = GameObject.Find(species[i].prefabName); // NOTA:han d'estar actius perque sino Find no els troba
	if (species[i].prefab==null) {
		Debug.LogError("Biocenosi. No he trobat el prefab "+species[i].prefabName+" (comprova que estigui en hierarchy i actiu, i que existeixi en Genus)");
		return false;
	}
		
	// check if the genus prefab for this specie has been already initialized (species can share genus prefab)
	
	var genusInit = false;
	for (var g=0;g<i;g++) {
		if (species[g].prefabName != null) {
			if (species[g].prefabName == species[i].prefabName)
				genusInit = true;
		}
	}
	
	// initialize genus prefab object if requiered
	
	if (!genusInit) {
		 
		
		// add plant or animal creature component as required
		
		if (species[i].dna.nivellTrofic == 0) {
			var c1=species[i].prefab.AddComponent.<Planta>();
			biblio.Assert(c1!=null, "Biocenosi. Error adding creature component to "+species[i].prefabName);
		}
		else {
			var c2=species[i].prefab.AddComponent.<Animal>();
			biblio.Assert(c2!=null, "Biocenosi. Error adding creature component to "+species[i].prefabName);
			species[i].prefab.AddComponent.<Banda>();
		}
		
		// add tag "animal" to prefab (both plants and animals)
		
		species[i].prefab.tag = "animal";
		
		// add rigidbody
		
		//var compo = species[i].prefab.AddComponent(Rigidbody);
		//var rigidbody : Rigidbody = compo;
		var rigidbody : Rigidbody = species[i].prefab.AddComponent(Rigidbody);
		biblio.Assert(rigidbody!=null, "Biocenosi. Error adding rigidbody component to "+species[i].prefabName);
		if (rigidbody!=null) {
			rigidbody.isKinematic = true;				// don't want physics
			rigidbody.useGravity = true;				// want gravity
		}
		
		// check there is only one collider among children 
		
		var cols : Component[];
		cols = species[i].prefab.GetComponentsInChildren(Collider);
		biblio.Assert(cols.Length<2, "Biocenosi. Prefab "+species[i].prefabName+" has more than one Collider (cols.Length="+cols.Length+"). Only one collider is allowed ");
		// EsserViu posa el layer del layerMask fent un Find del collider. SI n'hi ha mes d'un no se que passara!
		biblio.Assert(cols.Length>0, "Biocenosi. Prefab "+species[i].prefabName+" has no Collider (cols.Length="+cols.Length+"). Please, add a collider is children ");
		
		// check collider.isTrigger is true for plants and false for animals
		// <--- revisar per que es aixo
		var coli : Collider;
		coli = cols[0];
		if (species[i].dna.nivellTrofic==0) {
			//biblio.Assert(coli.isTrigger==true, "Biocenosi. Prefab "+species[i].prefabName+" isTrigger==false for a plant. Changing it to true... ");
			coli.isTrigger = true;
		}
		else {
			//biblio.Assert(coli.isTrigger==false, "Biocenosi. Prefab "+species[i].prefabName+" isTrigger==true for an animal. Changing it to false... ");
			coli.isTrigger = false;	
		}
	
	}
	
	// 26/6-no els puc desactivar aqui perque reutilitzo per especies
	// desactivem els prefabs per a que no es quedin en escena
	//species[i].prefab.SetActive(false);
	
	// ok...
	speciesMax++;
	return;
}



//function Update() {
	//biomassaTotal = biomassaNT[0]+biomassaNT[1]+biomassaNT[2]+biomassaNT[3];
//}


// Spawns a 1st generation creature (from spawners or labo)

function FesSpawn(idGenus: int, vSpawn:Vector3, adnEspecie0 : Dna) {	

	if (!inicialitzat) {
		Debug.LogWarning("*** AVIS *** Biocenosi. FesSpawn cridat abans d'inicialitzar");
		return;
	}

	if (idGenus > speciesMax) {
		Debug.LogWarning("biocenosi.FesSpawn idGenus("+idGenus+") > speciesMax ("+speciesMax+")");
		return;
	}

	// instancia un prefab de la familia corresponent a l'especie
	var clon: GameObject;
	clon = Instantiate (species[idGenus].prefab, vSpawn, Quaternion.identity);
	species[idGenus].AfegeixMorfologia(clon);
	clon.SetActive(true);
	
	// l'inicialitza amb l'adn de generacio 0 de l'especie
	adnEspecie0.idGenus = idGenus;	
	clon.gameObject.GetComponent(Creature).Inicialitzat(adnEspecie0);
		
}



// Update stats

function RegisterCreatureIsBorn(idGenus: int, nivellTrofic: int, generacio: int)
{
	biblio.Assert(inicialitzat, "*** ERROR **** sumavius sense biocenosi inicialitzada");
	//Debug.Log("RegisterCreatureIsBorn "+idGenus+"-"+nivellTrofic);
	viusNTrofic[nivellTrofic] += 1;
	viusEspecie[idGenus] +=1;
	parts++;
	partsEspecie[idGenus] +=1;
	if (generacio > generacionsEspecie[idGenus]) { 
		generacionsEspecie[idGenus]++;
	}
	animalsViusTotal++;
	if (nivellTrofic>0) 
		animalsViusSensePlantes++;
	TotsMorts = false;

}

// Update stats
// Pause simulation if no animals detected

function RegisterCreatureHasDied(idGenus: int, nivellTrofic: int)
{
	biblio.Assert(inicialitzat, "*** ERROR **** restavius sense biocenosi inicialitzada");
	viusNTrofic[nivellTrofic] -=1;
	viusEspecie[idGenus] -=1;
	mortsEspecie[idGenus] +=1;
	animalsViusTotal--;
	if (nivellTrofic>0) {
		animalsViusSensePlantes--;
		// pause simulation if no animals
		if (animalsViusSensePlantes <= 0) {
			SimTime.instance.PauseZeroAnimals();
		}
	}
	TotsMorts = animalsViusSensePlantes < 1;
	
}


// donat un nom torna el id d'especie en aquest nivell (el punter dins de l'array especies[])

function Nom2idGenere(nom: String) {
	//return laboratori.Nom2idGenere(nom);
	//Debug.LogWarning("*** entrant   nom="+nom);
	for (var j=0;j<speciesMax;j++)  {
		//Debug.LogWarning("***"+j+" "+species[j].nomGenere.ToUpper());
		if (species[j].nomGenere.ToUpper() == nom.ToUpper())
			return j;
	}
	return -1;	
}

