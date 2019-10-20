#pragma strict

/* Species 
 *
 * This structure define the original species that are referenced in spawners or labs
 * Each species belongs to a genus. Genus have a prefab in the scene.
 * Each genus has a basic set of dna genes. These are set in "InitializeGenusDna".
 * Then, some genes are modified to get specific species traits
 * At the end of the initialize function, some adjustements are made
 * 			dna.nomPantallaCurt.PadRight (5);
 * 			dna.nomPantalla = "(" Textos.msg ("TrophicLevel" dna.nivellTrofic "short") ")";
 * 			dna.SetGenomeFromVars ();
 *
 * Species class also keeps statistics about prey and predators.
 *
 */


public class Specie // extends System.ValueType //extends MonoBehaviour
{
	static var maxSpecie = 15;			// Max genus prefabs active in a level 
  
	var nomGenere: String;				// el que faig servir internament
	var prefabName: String;				// prefab que te associat
	var prefab : GameObject;			// punter al prefab (el posa Biocenesi)
	var morfologia : String;	 		// morfologia que cal afegir al prefab
	//var genome : Genome;				// genome per defecte
	var dna : Dna;						// adn per defecte de la generacio 0 del genome actual
	var local : boolean;				// es genere local? (esta en un spawner)
	var lab : boolean;					// esta al lab?
	
	// estadistiques de qui menja a qui
	var presesGenere : int[];			// numero de cops que he menjat aquest genere
	var predadorsGenere : int[];		// numero de cops que m'ha menjat aquest genere
		 
	

    public function Specie(nomGenere: String) {
    
	    this.nomGenere = nomGenere;		
	    this.local = false;				// si ve de spanwer ho posarem a true
  		
  		presesGenere = new int[maxSpecie];
  		predadorsGenere = new int[maxSpecie];
  		for (var i = 0; i< maxSpecie;i++) {
  			presesGenere[i] = 0;
  			predadorsGenere[i] = 0;
  		}

		dna = new Dna();

		switch(nomGenere) {
		case "g_herba":
			InitializeGenusDna("g0herba");
			break;
		case "g_grass":
			InitializeGenusDna("g0herba");
			break;
		case "g_herba_verda":
			InitializeGenusDna("g0herba");dna.nomPantalla = "Green grass";dna.nomPantallaCurt = "GGras";
			dna.colorCos = Color.green;
			break;
		case "g_herba_groga":
			InitializeGenusDna("g0herba");dna.nomPantalla = "Yellow grass";dna.nomPantallaCurt = "YGras";
			dna.puntsDefensaChemical = 100;
			dna.colorCos = Color.yellow;
			break;
		case "g_herba_vermella":
			InitializeGenusDna("g0herba");dna.nomPantalla = "Red grass";dna.nomPantallaCurt = "RGras";
			dna.colorCos = Color.red;
			break;
		case "g_herba_poc_densa":
			InitializeGenusDna("g0herba");dna.nomPantalla = "Grass";dna.nomPantallaCurt = "Grass";
			dna.colorCos = Color.red;
			dna.reprodMaxNeighbours = 4;	
			dna.reprodDistanceMin = 5;
			dna.reprodDistanceMax = 10;
			break;
		case "g_herba_blava":
			InitializeGenusDna("g0herba");
			dna.nomPantalla = "Blue grass";
			dna.nomPantallaCurt = "BGras";
			dna.colorCos = Color.blue;
			dna.pesAdult *=2;
			dna.reprodProb /= 2;
			break;
		case "g_bola":    						// a sustituir per bush
			InitializeGenusDna("g0bush");
			break;
  		case "g_bush":    
			InitializeGenusDna("g0bush");
			dna.morfoLocalScale = Vector3(1,3,1);
			break;
  		case "g_bola muntanya":    
			InitializeGenusDna("g0bola muntanya");
			break;
		//case "g_cilindre":
		case "g_arbre":
			InitializeGenusDna("g0arbre");			
			break;
		case "g_arbre_vermell":
			InitializeGenusDna("g0arbre");			
			dna.nomPantalla = "Red tree";
			dna.nomPantallaCurt = "RTree";
			dna.colorCos = Color.red;
			dna.pesAdult *= 2;
			dna.morfoLocalScale /= 1.7;
			dna.puntsAtac = 200;
			dna.reprodInterval = 130;
			break;
		case "g_arbre_blau":
			InitializeGenusDna("g0arbre");			
			dna.nomPantalla = "Blue tree";
			dna.nomPantallaCurt = "BTree";
			dna.colorCos = Color.blue;
			dna.pesAdult *= 1.4;
			dna.morfoLocalScale /= 1.25;
			dna.puntsAtac = 200;
			dna.reprodInterval = 70;
			break;
		case "g_conill":
			InitializeGenusDna("g1conill");
			break;
		case "g_conill_verd":
			InitializeGenusDna("g1conill");
			dna.nomPantalla = "Green rabbit";
			dna.nomPantallaCurt = "GRabb";
			dna.colorCos = Color.green;
			break;
		case "g_conill_blau":
			InitializeGenusDna("g1conill");			
			dna.nomPantalla = "Blue rabbit";
			dna.nomPantallaCurt = "BRabb";
			dna.colorCos = Color.blue;
			break;
		case "g_conill_groc":
			InitializeGenusDna("g1conill");			
			dna.nomPantalla = "Yellow rabbit";
			dna.nomPantallaCurt = "YRabb";
			dna.puntsDefensaChemical = 150;
			dna.colorCos = Color.yellow;
			dna.probLider *= 3;
			break;
		case "g_conill_vermell":
			InitializeGenusDna("g1conill");			
			dna.nomPantalla = "Red rabbit";
			dna.nomPantallaCurt = "RRabb";
			dna.colorCos = Color.red;
			dna.speedIdle = 12;
			dna.speedChasingX = 18;
			dna.multLocalScale *= 1.5;

			break;
		
		// conill que es reproduix de forma mes separada. P2N1
		// es mes gordo
		case "g_conill_blau_escas":
			InitializeGenusDna("g1conill");			
			dna.nomPantalla = "Blue rabbit2";
			dna.nomPantallaCurt = "BRabb2";
			dna.pesAdult *= 4;
			dna.reprodMaxNeighbours = 3;	// si hi ha mes d'aquests veins en radi parir no pareix (si es 0 no es comprova)
			dna.reprodDistanceMin = 1;		// pareix entre aquests dos radis
			dna.reprodDistanceMax = 20;	
			dna.colorCos = Color.blue;
			break;
		case "g_vaca":		// vaca...				// migrar a g_cow
			InitializeGenusDna("g1vaca");
			break;
		case "g_cow":		// vaca...
			InitializeGenusDna("g1vaca");
			break;
		case "g_guineu":
			InitializeGenusDna("g2guineu");
			break;
		case "g_guineu_vermella":
			InitializeGenusDna("g2guineu");
			dna.nomPantalla = "Red fox";
			dna.nomPantallaCurt = "R Fox";
			dna.colorCos = Color.red;
			dna.reprodOffspringX = 3;
			dna.reprodOffspringMax = 3;
			break;
		case "g_coyote":
			InitializeGenusDna("g2coyote");
			break;
		case "g_llop":
			InitializeGenusDna("g2llop");
			/*
			// FOR DEBUG 21/8/15
			dna.metabRate = 0;				// doesn't consume energy!!     ********************!!!!!
			dna.pendentMaxim = 1;
			dna.speedIdle = 20;
			dna.edatMort = 100000;
			*/
			break;
		case "g_lleo":
			InitializeGenusDna("g3lleo");
			break;			
		case "g_velociraptor":
			InitializeGenusDna("g3velociraptor");
			break;
		case "g_elefant":
			InitializeGenusDna("g1elefant");
			break;
		case "g_dinosauri":
			InitializeGenusDna("g1dinosauri");
			break;
		case "g_ovella":							// a sustituir per g_sheep
		case "g_sheep":
			InitializeGenusDna("g1ovella");
			dna.UpdateGen(9,9);		// super socials
			break;
		case "g_ovella_vermella":
			InitializeGenusDna("g1ovella");
			dna.nomPantalla = "Red sheep";
			dna.nomPantallaCurt = "RShee";
			dna.colorCos = Color.red;
			dna.pesAdult *=2;
			dna.reprodProb /= 2;

			break;
		case "g_alien0":
			InitializeGenusDna("g0alien");
			break;							
		case "g_alien1":
			InitializeGenusDna("g1alien");
			break;
		case "g_alien2":
			InitializeGenusDna("g2alien");
			break;
		case "g_alien3":
			InitializeGenusDna("g3alien");
			break;
		case "PENDENT":
			dna.PrimeraGeneracio(1);
			dna.nomPantalla = "Per laboratori...";
			dna.nomPantallaCurt = "Labo";
			break;
		case "especie_ja_definida":
			break;
	
	//
	//   OJO, RECORDA ACTUALITZAR MAX ESPECIES DEFINIDES ADALT
	//
	default:
			dna.PrimeraGeneracio(1);
			dna.nomPantalla = "ERROR GENERE: "+nomGenere;
			dna.nomPantallaCurt = "ERR:"+nomGenere;
			this.nomGenere="*** ERROR *** "+nomGenere+ " (constructor Genus)";
			this.prefabName="*** ERROR *** "+nomGenere+ " (constructor Genus)";
		}
		
		// ajustos finals
		
		dna.nomPantallaCurt.PadRight(5);
		
		if (dna.reprodOffspringMax < dna.reprodOffspringX) {
	  		dna.reprodOffspringMax = dna.reprodOffspringX;
	  		}
	  	
		// afegeix nom nivell trofic darrera de nomPantalla
	//22/7-ho trec perque amb la nova analisiNivell sobra. si cal en algun lloc, fer-ho a ma
	//	dna.nomPantalla += " ("+Textos.msg("TrophicLevel"+dna.nivellTrofic+"short")+")";
			
		// genera vars dependents
		dna.SetGenomeFromVars();		
		


	}
	
	
		// omple l'adn amb les variables comuns a cada familia	 
	private function InitializeGenusDna(familia: String) {
	
		switch(familia) {
		case "g0herba":
			// this.id = 	 1;
			dna.PrimeraGeneracio(0);
			this.prefabName = "g0herba";			// especie 1
			morfologia="MorfHerba";
			dna.morfoLocalScale = Vector3(1,2,1);
			//this.nom  ="Herba";			// especie 1
			//dna.nomPantalla = "Herba";
			dna.nomPantalla = "Grass";
			dna.nomPantallaCurt = "Grass";
			dna.nomGenere = this.nomGenere;	
			//dna.tempOptima = 25;
			dna.edatAdult = 30;
			dna.edatMort = 300;
			dna.reprodProb = 0.003;	
			dna.reprodOffspringX = 2;	
			dna.reprodOffspringLab = 2;
			// l'herba hauria de ser bastant densa i es pot escampar
			dna.reprodMaxNeighbours = 7;	
			dna.reprodDistanceMin = 2;
			dna.reprodDistanceMax = 5;
			//dna.reprodExpandProb = 0.1;
			dna.pesAdult = 5;
			dna.puntsAtac = 0;
			dna.puntsDefensa = 10;

			break;
		case "g0bush":    
			// this.id = 	  2;
			dna.PrimeraGeneracio(0);
			this.prefabName = "g0bush";
			morfologia="MorfPlantaComu";
			dna.nomPantalla="Bush";
			dna.nomPantallaCurt = "Bush";
			dna.nomGenere = this.nomGenere;	
			//dna.alturaMaxima = 1500;
			//dna.tempOptima = 25;
			dna.reprodProb = 0.01;		
			dna.edatAdult = 30;
			// les boles s'escampen mes
			dna.reprodMaxNeighbours = 10;	
			//dna.radiVeinsReproduccio = 30;
			dna.reprodDistanceMin = 4;
			dna.reprodDistanceMax = 30;

			dna.pesAdult = 10;
			dna.puntsAtac = 0;
			dna.puntsDefensa = 40;
			break;
  		case "g0bola muntanya":    
  			// this.id = 	  3;
			dna.PrimeraGeneracio(0);
			this.prefabName = "g0bola muntanya";
			morfologia="MorfPlantaComu";
			//this.nom="bola muntanya";
			//dna.nomPantalla="Arbust muntanya";
			dna.nomPantalla="Mountain bush";
			dna.nomPantallaCurt = "MBush";
			dna.nomGenere = this.nomGenere;	
			//dna.alturaMaxima = 1800;
			//dna.alturaMaxima = dna.alturaMaxima; 
			dna.tempOptima = 12;
			dna.toleranciaTemp = 5;
			dna.reprodProb = 0.01;
			dna.reprodOffspringX = 2;		
			dna.reprodOffspringLab = 5;
			dna.reprodDistanceMin = 4;
			dna.reprodDistanceMax = 20;
			dna.pesAdult = 10;
			dna.puntsAtac = 0;
			break;
		//case "g_cilindre":
		case "g0arbre":
		    // this.id = 	  4;
			dna.PrimeraGeneracio(0);
			this.prefabName = "g0arbre";
			morfologia="MorfArbre";
			dna.nomPantalla="Tree";
			dna.nomPantallaCurt = "Tree";
			dna.nomGenere = this.nomGenere;	
			dna.morfoLocalScale = new Vector3(2,4,2);			
			dna.reprodProb = 0.03;
			// son grans i no poden neixer tant junts
			dna.reprodMaxNeighbours = 7;	
			dna.reprodDistanceMin = 40;
			dna.reprodDistanceMax = 80;
			dna.reprodInterval = 100;

			dna.pesAdult = 3000;		// cada m3 1000 kg, de 100kg a 20T
			dna.puntsDefensa = 80;
			
			dna.gen5var = 6;
			
			break;

		case "g1conill":

			dna.PrimeraGeneracio(1);
			this.prefabName = "g1conill";
			morfologia="MorfAnimalComu";
			dna.nomPantalla = "White Rabbit";
			dna.nomPantallaCurt = "WRabb";
			dna.nomGenere = this.nomGenere;	
			
			dna.speedIdle = Random.Range (4.0, 6.0);	
			
			dna.colorCos = Color.white;
			
			dna.reprodInterval = 30;
			dna.reprodProb = 0.1;
			dna.reprodOffspringX = 3;
			dna.reprodOffspringMax = 3;
			
			dna.pesAdult = 5;
			dna.puntsAtac = 60;
			dna.puntsDefensa = 30;
			dna.edatAdult = 10;
			dna.edatMort = 200;
			//dna.multPerduaPes = 0.03;

			break;
		

		case "g1vaca":		// vaca...
			dna.PrimeraGeneracio(1);
			this.prefabName = "g1vaca";
			morfologia="MorfAnimalComu";
			dna.nomPantalla = "Cow";
			dna.nomPantallaCurt = "Cow";
			dna.nomGenere = this.nomGenere;	
			dna.pendentMaxim /= 3; 
			dna.morfoLocalScale = new Vector3(3,3,3);
			dna.tempsSeguirLider *= 3; 			// molt gregaries
			dna.speedIdle = Random.Range (5.0, 6.0);	
			dna.pesAdult = 700;
			dna.puntsAtac = 87;
			dna.puntsDefensa = 70;
			dna.edatMort = 300;
			break;
		case "g2guineu":
		    // this.id = 	  8;
			dna.PrimeraGeneracio(2);
			this.prefabName = "g2guineu";
			morfologia="MorfAnimalComu";
			//this.nom="Guineu";
			dna.speedIdle = Random.Range (6.0, 8.0);	
			//dna.nomPantalla = "Guineu";
			dna.nomPantalla = "Fox";
			dna.nomPantallaCurt = "Fox";
			dna.nomGenere = this.nomGenere;	
			dna.pesAdult = 20;
			dna.puntsAtac = 70;
			dna.puntsDefensa = 120;
			dna.edatMort = 300;
			dna.multPesFart = 1.3;
			
			dna.reprodMaxNeighbours = 6;	// si hi ha mes d'aquests veins en radi parir no pareix (si es 0 no es comprova)
			dna.reprodDistanceMin = 4;		// pareix entre aquests dos radis
			dna.reprodDistanceMax = 7;	
			dna.reprodExpandProb = 0;  // si el radi esta ple pot parir mes lluny (entre 3 i 3 reprodDistanceMax) amb mutacio
			dna.reprodProb = 0.07;			// probabilitat de reproduir-se en dos segons
			dna.reprodOffspringX = 1;		// quantitat de fills que tenen al parir
			dna.reprodOffspringMax = 2;	
			dna.reprodOffspringLab = 1;	// quantitat de criatures spawnejades quan faig spawn des de labo (p.ex. herba es mes gran)
			dna.reprodInterval = 30;		// interval minim entre parts

			
			break;

		//case "g_pantera":
		case "g2coyote":
		    // this.id = 	  10;
			//dna.PrimeraGeneracio(3);
			//this.prefabName = "g3pantera";
			dna.PrimeraGeneracio(2);
			this.prefabName = "g2coyote";
			morfologia="MorfAnimalComu";
			//this.nom="pantera";
			//dna.nomPantalla = "Pantera";
			dna.nomPantalla = "Coyote";
			dna.nomPantallaCurt = "Coyot";
			dna.speedIdle = Random.Range (5.0, 7.0);	
			dna.nomGenere = this.nomGenere;	
			dna.pesAdult = 100;
			dna.puntsAtac = 170;
			dna.puntsDefensa = 140;
			dna.edatMort = 500;
			dna.multPesFart = 1.3;
			break;
		case "g2llop":
		    // this.id = 	  9;
			dna.PrimeraGeneracio(2);
			this.prefabName = "g2llop";
			morfologia="MorfAnimalComu";
			//this.nom="Llop";
			//dna.nomPantalla = "Llop";
			dna.nomPantalla = "Wolf";
			dna.nomPantallaCurt = "Wolf";
			dna.nomGenere = this.nomGenere;	
			dna.speedIdle = Random.Range (5.0, 7.0);	
			dna.pesAdult = 45;
			dna.puntsAtac = 210;
			dna.puntsDefensa = 170;
			dna.edatMort = 300;
			//dna.multPesFart = 1.1;
			break;
		case "g3lleo":
		    // this.id = 	  11;
			dna.PrimeraGeneracio(3);
			this.prefabName = "g3lleo";
			morfologia="MorfAnimalComu";
			//this.nom "Lleo";
			dna.morfoLocalScale = new Vector3(1,1.5,1);
			//dna.nomPantalla = "Lleo";
			dna.speedIdle = Random.Range (3.0, 5.0);	
			dna.speedChasingX = 16;
			dna.nomPantalla = "Lion";
			dna.nomPantallaCurt = "Lion";
			dna.nomGenere = this.nomGenere;	
			dna.pesAdult = 200;
			dna.puntsAtac = 200;
			dna.puntsDefensa = 200;
			dna.edatMort = 500;
			dna.multPesFart = 1.3;
			break;
			
		case "g3velociraptor":
		    // this.id = 	  5;
			dna.PrimeraGeneracio(3);
			this.prefabName = "g3velociraptor";
			morfologia="MorfAnimalComu";
			//this.nom="Velociraptor";
			dna.nomPantalla = "Velociraptor";
			dna.nomPantallaCurt = "Veloc";
			dna.nomGenere = this.nomGenere;	
			dna.morfoLocalScale = new Vector3(2,4,2);
			//dna.energiaInicial *= 2;
			dna.speedIdle = Random.Range (5.0, 7.0);	
			//dna.alturaMaxima = dna.alturaMaxima; 
			dna.pendentMaxim *= 3; 
			dna.tempsBuscarMenjar *= 6; 
			dna.reprodProb = 0.001; 
			dna.pesAdult = 300;
			dna.puntsAtac = 300;
			dna.puntsDefensa = 300;
			dna.edatMort = 500;
			dna.multPesFart = 1.3;
			break;
		case "g1elefant":
		    // this.id = 	  12;
			dna.PrimeraGeneracio(1);
			this.prefabName = "g1elefant";
			morfologia="MorfAnimalComu";
			dna.nomPantalla = "Elephant";
			dna.nomPantallaCurt = "Eleph";
			dna.nomGenere = this.nomGenere;
			dna.radiVisio = 25;	
			dna.speedIdle = Random.Range (2.0, 4.0);	
			dna.pendentMaxim /= 3; 
			dna.tempsBuscarMenjar *= 3; 
			
			dna.reprodProb = 0.015; 
		 
			dna.pesAdult = 7000;
			dna.puntsAtac = 100;
			dna.puntsDefensa = 190;
			dna.edatMort = 700;
			//dna.multPerduaPes = 0.005;
			
			//******30/5
			//dna.speedIdle = 0;
			
			break;
		case "g1dinosauri":
		    // this.id = 	  13;
			dna.PrimeraGeneracio(1);
			this.prefabName = "g1dinosauri";
			morfologia="MorfAnimalComu";
			//this.nom "Dinosauri";
			//dna.nomPantalla = "Dinosauri";
			dna.nomPantalla = "Dinosaur";
			dna.nomPantallaCurt = "Dino";
			dna.nomGenere = this.nomGenere;	
			//dna.energiaInicial *= 4;
			dna.speedIdle = Random.Range (2.0, 4.0);	
			dna.pendentMaxim /= 4; 
			dna.tempsBuscarMenjar *= 6; 
			dna.reprodProb = 0.003; 
			dna.pesAdult = 20000;
			//dna.mossegada = dna.pesAdult * 0.002;
			dna.puntsAtac = 89;
			dna.puntsDefensa = 200;
			dna.edatMort = 1000;
		break;
		case "g1ovella":
		    // this.id = 	  14;
			dna.PrimeraGeneracio(1);
			this.prefabName = "g1ovella";
			morfologia="MorfAnimalComu";
			dna.nomPantalla = "Sheep";
			dna.nomPantallaCurt = "Sheep";
			dna.nomGenere = this.nomGenere;	
			dna.speedIdle = Random.Range (4.0, 5.0);	
			dna.pesAdult = 80;
			dna.puntsAtac = 85;
			dna.puntsDefensa = 50;
			dna.edatMort = 250;
			break;
		case "g0alien":
		    // this.id = 	  
			dna.PrimeraGeneracio(0);
			this.prefabName = "g0alien";
			morfologia="MorfPlantaComu";
			//this.nom="bitxo1";
			dna.nomPantalla = "Alien Plant";
			dna.nomPantallaCurt = "A-Pla";
			dna.nomGenere = this.nomGenere;
			//dna.tempOptima = 25;
			dna.reprodProb = 0.01;		
			dna.edatAdult = 10;
			dna.edatMort = 1600;
			// l'herba hauria de ser bastant densa i es pot escampar
			dna.reprodMaxNeighbours = 7;	
			dna.reprodDistanceMin = 4;
			dna.reprodDistanceMax = 10;
			//dna.reprodExpandProb = 0.1;
			dna.pesAdult = 5;
			dna.puntsAtac = 0;
			dna.puntsDefensa = 10;
			break;	
						
		case "g1alien":
		    // this.id = 	 
			dna.PrimeraGeneracio(1);
			this.prefabName = "g1alien";
			morfologia="MorfAnimalComu";
			//this.nom="bitxo1";
			dna.nomPantalla = "Alien Herb";
			dna.nomPantallaCurt = "A-Her";
			dna.nomGenere = this.nomGenere;	
			// copio conill a 15 abril
			dna.speedIdle = Random.Range (2.0, 4.0);	
			dna.reprodProb = 0.01; 	
			dna.pesAdult = 5;
			dna.puntsAtac = 60;
			dna.puntsDefensa = 30;
			dna.edatAdult = 10;
			dna.edatMort = 200;
			dna.metEnergyAtBirth = 75;
			break;
		case "g2alien":
		    // this.id = 	 
			dna.PrimeraGeneracio(2);
			this.prefabName = "g2alien";
			morfologia="MorfAnimalComu";
			//this.nom="bitxo2";
			dna.nomPantalla = "Alien Pred";
			dna.nomPantallaCurt = "A-Pre";
			dna.nomGenere = this.nomGenere;	
			dna.speedIdle = Random.Range (3.0, 5.0);	
			dna.pesAdult = 45;
			dna.puntsAtac = 210;
			dna.puntsDefensa = 170;
			dna.edatAdult = 10;
			dna.edatMort = 300;
			dna.metEnergyAtBirth = 75;
			break;
		case "g3alien":
		    // this.id = 	  
			dna.PrimeraGeneracio(3);
			this.prefabName = "g3alien";
			morfologia="MorfAnimalComu";
			dna.nomPantalla = "Alien Apex";
			dna.nomPantallaCurt = "A-Apx";
			dna.nomGenere = this.nomGenere;	
			dna.pesAdult = 200;
			dna.puntsAtac = 200;
			dna.puntsDefensa = 200;
			dna.speedIdle = Random.Range (4.0, 7.0);	
			dna.edatAdult = 10;
			dna.edatMort = 300;
			dna.multPesFart = 1.3;
			dna.metEnergyAtBirth = 75;
			break;
		default:
			Debug.LogError("SpecieInitializeGenusDna - familia desconeguda: "+familia);
			break;
	
		}
		
		// and set genome
		dna.SetGenomeFromVars();
		
		// note UpdateGen can not be used until this function has been called at least once
		
	}
    
	// no puc afegir-ho en bioncenosi perque no sabia com passar la classe
	
	public function AfegeixMorfologia(clon: GameObject) {
		var morf : Morfologia;
		switch(this.morfologia) {
		case "MorfPlantaComu": 
				morf = clon.AddComponent(MorfPlantaComu); 
				break;
		case "MorfArbre": 
				morf = clon.AddComponent(MorfArbre); 
				break;
		case "MorfHerba": 
				morf = clon.AddComponent(MorfHerba); 
				break;
		case "MorfAnimalComu": 
				morf = clon.AddComponent(MorfAnimalComu); 
				break;
		case "Morfologia": 
				morf = clon.AddComponent(Morfologia); 
				break;
		default:
				Debug.LogWarning("SpecieFesSpawn. Nom de morfologia desconegut: "+morfologia+" nomPantalla="+dna.nomPantalla);
				morf = clon.AddComponent(Morfologia);
		}
		biblio.Assert(morf!=null, "Specie Error assignant morfologia: "+morf+ " a "+clon);
		
	}
}	