#pragma strict

// DNA is formed with
// - vars:		used by other classes 
// - genome: 	set of 9 gens calculed from vars. this is what user sees and modify in lab 
//
// Each gen is related to a subset of vars
//
// Mutation affect vars and then genome is recalculated
//
//
// Us:
//
//   1.Genus crea els adn de primera generacio que es guarden en biocenosi.species[]
//		- new Dna()
//		- dna.PrimeraGeneracio(prefab, nivell trofic)
// 		- ... modifico vars...
//		- dna.SetGenomeFromVars()    // per actualitzar el genome amb les noves vars
//
//   2.Els spawners, el jugador o els parts acaben cridant a Creature.Inicialitza(adnPare)
//		- new Dna()
//		- dna.Hereda(adnPare): fills hereden adnpare amb lleugeres modificacions (deriva genetica)
//
//   3.A laboratori l'usuari pot tocar el genome (no les vars!)
//		- UpdateGenome()
//
//	4. En qualsevol cas que modifiqui una var de ADN cal recalcular el genome
// 		- ... modifico vars...
//		- dna.SetGenomeFromVars()    // per actualitzar el genome amb les noves vars
//
//	5. En Creature, quan he parit faig una mutacio en funcio de la radiacio
//		- dna.MutacioAleatoria() 
//
//
//  OJO Vars: no poden calcular-se a partir d'altres (p.ex. pesadult*2) perque Genus() modifica vars i 
// 	llavors les dependents es queden desactualitzades!!


public class Dna 
{

	/*
	 *   Cada variable cal posar-la en 
	 *		- declaracio
	 *		- PrimeraGeneracio() - inicialitzar  (documentar aqui)
	 *		- Hereda() - copiar el del pare
	 *		- Etiqueta() - print 
	 *	    - CSVCapcalera() - per exportar a CSV
	 *		- CSVLinia()
	 */


	// DOCUMENTAR LES VARIABLES A LA PRIMERA FUNCIO
	
	// els que estan afectats per mutacio aleatoria han de ser floats per a no tendir a zero...
	
	// Vars with "X" are derived from other vars and should not be assigned directly in Species class

	@HideInInspector var nivellTrofic: int;
	
	@HideInInspector var idGenus : int;		
	@HideInInspector var id : String;			
	@HideInInspector var idPare : String;			
	@HideInInspector var nomGenere : String;	
	@HideInInspector var nomPantalla : String;	
	@HideInInspector var nomPantallaCurt : String;		// 5 chars

	@HideInInspector var genome : Genome;	// hauria de ser protected. cal canviar amb SetGen()!!!

	@HideInInspector var generacio : int;

	
	// aspecte
	@HideInInspector var morfoLocalScale : Vector3;		
	@HideInInspector var multLocalScale : float;
	@HideInInspector var colorCos : Color;
	
	@HideInInspector var multMossegada : float;
	@HideInInspector var multPesFart : float; 		
	@HideInInspector var multPesMinim : float;    
	@HideInInspector var histeresiFart : float;	
	@HideInInspector var tempsSeguirLider : float;		
	@HideInInspector var tempsBuscarMenjar : float;   	
	
	@HideInInspector public var precipitacionsNecessaries : int;	
	@HideInInspector public var tempOptima : float;		
	@HideInInspector public var toleranciaTemp : float;
	@HideInInspector public var alturaMaxima : float;	
	@HideInInspector public var pendentMaxim : float;		
	@HideInInspector public var speedIdle : float;			
	@HideInInspector public var speedChasingX : float;		
	@HideInInspector public var tempsGirarPerEsquivar : float;

	@HideInInspector public var pesAdult : float;
	
	@HideInInspector public var puntsAtac : float;
	@HideInInspector public var puntsDefensa : float;
	@HideInInspector public var puntsAtacChemicalX : float;
	@HideInInspector public var puntsDefensaChemical : float;
	
	
	// variables de radar
	@HideInInspector var radiVisio : float;		
	@HideInInspector var radiVisioCurt : float; 	

	// reproduction vars
	
	@HideInInspector var reprodMaxNeighbours : int;	
	@HideInInspector var reprodDistanceMin : float;
	@HideInInspector var reprodDistanceMax : float;
	@HideInInspector var reprodExpandProb : float;   	
	@HideInInspector var reprodProb : float;
	@HideInInspector var reprodOffspringX : float;
	@HideInInspector var reprodOffspringMin : float;
	@HideInInspector var reprodOffspringMax : float;
	@HideInInspector var reprodOffspringLab : float; 
	@HideInInspector var reprodInterval : float;
	
	@HideInInspector var metabRate : float;		

	// METABOLISME
	
	@HideInInspector var metEnergyAtBirth : float;		
	// com que es calcula a partir del pes no la puc tenir aqui perque quan genere el modifica no s'actualitza
	@HideInInspector var metEficDigestio : float;
	// predador.energiaConseguida = presa.pesMossegat * presa.dna.metEficNutritiva * predador.dna.metEficDigestio
	//@HideInInspector var metEficNutritiva : float;	// la part del que ens mosseguen que es transforma en energia pel predador
	@HideInInspector var metTempsMortGana : int;    

	
	@HideInInspector var edatAdult : int;		
	@HideInInspector var edatMort : int;		

	@HideInInspector var gen0var : float;	
	@HideInInspector var gen5var : float;	

	// variables banda
	@HideInInspector public var probLider : float;
	@HideInInspector public var vSeguirLider : Vector3;	
	@HideInInspector public var maxSeguidorsDirectes : int;		
		
	
   public function Dna() {
	   	genome = new Genome();
	   	//gen1NTultimId = [0,0,0,0];
   }
   
   
   // 1. Es crida des de Genus
      
    public function PrimeraGeneracio(nivellTrofic: int)       

    {
 

    	this.nivellTrofic = nivellTrofic;

        this.generacio = 0;
 
   		this.nomGenere = "NOMGENERE NO INIT";	// nom del prefab (objecte parent)
   		this.nomPantalla = "NOMPANTALLA NO INIT";	
   		this.nomPantallaCurt = "NOINI";			// 5 chars
       	this.idGenus = -1;		// id de Genus en Biocenosi per l'ecosistema actual
       							// l'assignara Biocenosi al spawn de la primera generacio segons species[]
		this.id = "";			// no s'hereda. s'assigna en Creature.Inicialitzar
		this.idPare = "1stGen"; // la primera generacio no te pare
 
		// ajustos per familia
		this.multPesFart = 1.1; 		// si te mes ja no busca preses
		this.multPesMinim = 0.4; 		// si li mengen mes d'aquest pes es mor
		this.histeresiFart = 0.9;	// quan torna a menjar despres d'haver estat fart
		this.tempsSeguirLider = 100;		// temps que seguiran al lider encara que no trobin res
		this.tempsBuscarMenjar = 4;   	// si porta aquest temps sense menjar, canvia direccio 
		this.metabRate = 0.05;		// related to metabolic rate. units to be reviewed
		
		//this.morfoLocalScaleInicial = new Vector3(0,0,0); // morfologia posa aquest tamany a l'inicialitzar. si alguna dimensio es zero mante la que te el prefab / 3
		this.morfoLocalScale = new Vector3(0,0,0); // morfologia ho posa a valor prefab si segueix a zero en la primera generacio
														// adult
		this.multLocalScale = 1;	// segons genome pot variar el tamany
		this.colorCos = Color.clear;		// si es Color.clear, morfologia agafa el real del prefab
		
		this.gen0var = 0.0;		// this var sets directly gen0
		this.gen5var = 5.0;		// this var sets directly gen5. at present it is used to adjust morphology for species
		//
		// vars afectades pels gens (tenen versio Def per no acumular mutacions)
		// les vars Def es generen en DuplicaDef()		
		//
 		this.precipitacionsNecessaries = 50;	// en les plantes afecta el creixement. es un percentatge
		this.tempOptima = 25;	// gasta 1 unitat d'energia + unitats adicionals per cada grau de diferencia
		this.toleranciaTemp = 4;	// quants graus de temperatura de diferencia pot suportar sense perdre salut 
		this.alturaMaxima = 9999.0;		// (en m) maximum height to spawn
		this.pendentMaxim = 5.0;		// (en m) maxima alçada que puc pujar en un moviment 
		this.speedIdle = Random.Range (2.0, 4.0);				// aprox. modul de la speed
		//this.speedChasingX = 
		this.tempsGirarPerEsquivar =  2/this.speedIdle;	// cada quan intentara fintar al perseguidor. els rapids canviaran mes cops de direccio

		// reproduction vars
		
		this.reprodMaxNeighbours = 6;	// si hi ha mes d'aquests veins en radi parir no pareix (si es 0 no es comprova)
		this.reprodDistanceMin = 4;		// pareix entre aquests dos radis
		this.reprodDistanceMax = 7;	
		this.reprodExpandProb = 0.002;  // si el radi esta ple pot parir mes lluny (entre 3 i 3 reprodDistanceMax) amb mutacio
		this.reprodProb = 0.05;			// probabilitat de reproduir-se en dos segons
		//this.reprodOffspringX = 1;		// quantitat de fills que tenen al parir
		this.reprodOffspringMin = 1;	
		this.reprodOffspringMax = 1;	
		this.reprodOffspringLab = 1;	// quantitat de criatures spawnejades quan faig spawn des de labo (p.ex. herba es mes gran)		

				
		// cicle de vida
		
		this.edatAdult = 10;		// l'edat a la que es reprodueixen, persegueixen
		this.edatMort = 300;		// esperança de vida

		this.maxSeguidorsDirectes = 3;		// quants seguidors directes pot tenir cada lider

		this.metEnergyAtBirth = 100;	// energy at birth (aliens can be born hungry to start atacking ASAP)

       	// valors basics, cal actualitzar segons morfologia familia
		switch (this.nivellTrofic) {
		case 0:		this.pesAdult = 5;			// el pes BABY es pesAdult * multPesMinim * 1.1
					this.puntsAtac = 0;
					this.puntsDefensa = 5;
					this.puntsDefensaChemical = 0;		// 0-200
					this.puntsAtacChemicalX = 0;			// es calcula automatic
					this.multMossegada = 0;			// en plantes no aplica
					this.probLider = 1; 		// en plantes no aplica
					this.metabRate= 0;
					this.radiVisio = 0;
					this.radiVisioCurt = 0;
					this.edatAdult = 200;		// no existeix l'estat pero es fa servir per inicialitzar simTimeUltimPart
					this.edatMort = 1200;
					this.reprodInterval = 100;	// interval minim entre parts
					this.metEficDigestio = 0;	// en plantes no aplica
					this.metTempsMortGana = 80; // dies en que mort si no te res de menjar
					break;
		case 1:		this.pesAdult = 100;	
					this.puntsAtac = 10;
					this.puntsDefensa = 5;
					this.puntsDefensaChemical = 0;		// 0-200
					this.puntsAtacChemicalX = 0;			// es calcula automatic
					this.multMossegada = 0.05;	// quina fraccio del seu pes pot mossegar d'una presa
												// ojo mossegada * eficDigestio ha de cubrir 2 * consumEnergia (mosseguen cada dos segons)
					this.probLider = 0.1; 			// probabilitat de que neixi sent lider
					this.radiVisio = 15;		// si es zero no busca preses
					this.radiVisioCurt = 7; 	// primer mira aqui per menjar-se les del costat
					this.metEficDigestio = 0.5;	// com transforma en energia cada kg menjat
					this.metTempsMortGana = 30; // dies en que mort si no te res de menjar
					this.reprodInterval = 40;	
					break;
		case 2:		this.pesAdult = 50;	
					this.puntsAtac = 70;
					this.puntsDefensa = 20;
					this.puntsDefensaChemical = 0;		// 0-200
					this.puntsAtacChemicalX = 0;			// es calcula automatic
					this.multMossegada = 0.01;	// quina fraccio del seu pes pot mossegar d'una presa
					this.probLider = 0.4; 
					this.radiVisio = 20;	
					this.radiVisioCurt = 7; 	// primer mira aqui per menjar-se les del costat
					this.metEficDigestio = 1;	// com transforma en energia cada kg menjat
					this.metTempsMortGana = 40; // dies en que mort si no te res de menjar
					this.reprodInterval = 80;	
					break;
		case 3:		this.pesAdult = 50;	
					this.puntsAtac = 100;
					this.puntsDefensa = 100;
					this.puntsDefensaChemical = 0;		// 0-200
					this.puntsAtacChemicalX = 0;			// es calcula automatic
					this.multMossegada = 0.01;	// quina fraccio del seu pes pot mossegar d'una presa
					this.radiVisio = 36;		// si es zero no busca preses
					this.radiVisioCurt = 7; 	// primer mira aqui per menjar-se les del costat
					this.probLider = 0.8; 
					this.metEficDigestio = 1;	// com transforma en energia cada kg menjat
					this.metTempsMortGana = 50; // dies en que mort si no te res de menjar
					this.reprodInterval = 100;	
					break;
		}
		
      			
      	// en quina orientacio es posa seguint el lider
      	this.vSeguirLider = new Vector3(0, 0, -3);			// a quina distancia segueixen el lider
		
		
		// calculate genome
		
		SetGenomeFromVars();
		
	
	}
   	
   	
   	
   	 // 2. Inicialitzacio per a generacions seguents, que tenen pare 
   	 // Es crida des de Creature.Inicialitzat(adnPare)
   	 //
   	 // Nota: no puc fer  adnFill = adnPare perque son punters
    
    
    public function Hereda (adnPare: Dna) 
                                             // --> cada fill te propietats diferents (?)
    {
    	biblio.Assert(adnPare.idGenus != null, "Dna. adnPare.idGenus ==null :"+adnPare.idGenus);
    	this.nomPantalla = adnPare.nomPantalla;
    	this.nomPantallaCurt = adnPare.nomPantallaCurt;
		this.nomPantallaCurt.PadRight(5);

   		this.nomGenere = adnPare.nomGenere;
       	this.idGenus = adnPare.idGenus;			// el codi especie en aquest nivell
		this.id = "";								// no s'hereda. s'assigna en Creature.Inicialitzar
		this.idPare = adnPare.id;	
		
    	this.nivellTrofic = adnPare.nivellTrofic;
        this.gen0var = adnPare.gen0var;	
        this.gen5var = adnPare.gen5var;	
        this.morfoLocalScale.x = adnPare.morfoLocalScale.x * Random.Range(0.98, 1.03);
	    this.morfoLocalScale.y = adnPare.morfoLocalScale.y * Random.Range(0.98, 1.03);
    	this.morfoLocalScale.z = adnPare.morfoLocalScale.z * Random.Range(0.98, 1.03);
    	this.multLocalScale = adnPare.multLocalScale;
		this.colorCos = adnPare.colorCos;
		this.multMossegada = adnPare.multMossegada;
		this.multPesFart = adnPare.multPesFart; 		
		this.multPesMinim = adnPare.multPesMinim; 		
		this.metTempsMortGana = adnPare.metTempsMortGana; 		
		this.histeresiFart = adnPare.histeresiFart;	
		this.metabRate= adnPare.metabRate;		
		this.reprodInterval= adnPare.reprodInterval * Random.Range(0.95, 1.05);	
		this.metEnergyAtBirth = adnPare.metEnergyAtBirth;
		this.metEficDigestio = adnPare.metEficDigestio;	
		this.tempsSeguirLider = adnPare.tempsSeguirLider;	
		this.tempsBuscarMenjar = adnPare.tempsBuscarMenjar;   	
		
		this.precipitacionsNecessaries = adnPare.precipitacionsNecessaries * Random.Range (0.95,1.05);	
		if (precipitacionsNecessaries > 100) precipitacionsNecessaries = 100;
		if (precipitacionsNecessaries < 0) precipitacionsNecessaries = 0;
		this.tempOptima = adnPare.tempOptima;	
	    this.toleranciaTemp = adnPare.toleranciaTemp;
		this.alturaMaxima = adnPare.alturaMaxima;		// this is for scene setup only		
		this.pendentMaxim = adnPare.pendentMaxim * Random.Range (0.95,1.05);		
		this.speedIdle = adnPare.speedIdle * Random.Range (0.95,1.05);
		this.speedChasingX = adnPare.speedChasingX;
		this.tempsGirarPerEsquivar = adnPare.tempsGirarPerEsquivar * Random.Range (0.95, 1.05);
		this.pesAdult = adnPare.pesAdult * Random.Range (0.95,1.05);
	  	
	  	this.probLider = adnPare.probLider;
	  	this.vSeguirLider = adnPare.vSeguirLider;
	  	this.maxSeguidorsDirectes = adnPare.maxSeguidorsDirectes;
	  	this.reprodMaxNeighbours = adnPare.reprodMaxNeighbours;
		this.reprodDistanceMin = adnPare.reprodDistanceMin;
		this.reprodDistanceMax = adnPare.reprodDistanceMax;
	
	  	this.reprodExpandProb = adnPare.reprodExpandProb * Random.Range(0.95, 1.05);;
	  	this.reprodProb = adnPare.reprodProb;
	  	this.reprodOffspringX = adnPare.reprodOffspringX;
	  	this.reprodOffspringMin = adnPare.reprodOffspringMin;
	  	this.reprodOffspringMax = adnPare.reprodOffspringMax;
	  	if (this.reprodOffspringMin > this.reprodOffspringMax) {
	  		this.reprodOffspringMin = this.reprodOffspringMax;
	  		Debug.LogWarning("DNA "+this.nomPantallaCurt+" - this.reprodOffspringMin ("+reprodOffspringMin+") > this.reprodOffspringMax ("+this.reprodOffspringMax+"). Changing reprodOffspringMin to "+this.reprodOffspringMin);
	  		}
	  	this.reprodOffspringLab = adnPare.reprodOffspringLab;
	  	this.edatAdult = adnPare.edatAdult * Random.Range(0.9, 1.2);		// per a que no pareixin al mateix temps
	  	this.edatMort = adnPare.edatMort* Random.Range(0.9, 1.1); // que les bessonades no morin totes juntes
	  	this.radiVisio = adnPare.radiVisio;
	  	this.radiVisioCurt = adnPare.radiVisioCurt;

		this.puntsAtac = adnPare.puntsAtac;
		this.puntsDefensa = adnPare.puntsDefensa;
		this.puntsAtacChemicalX = adnPare.puntsAtacChemicalX;
		this.puntsDefensaChemical = adnPare.puntsDefensaChemical;
	  		  		  	
	  	this.generacio = adnPare.generacio +1;
/*	  	
  		// copiem genome per defecte (sobre tot per copiar el gen0 i el gen1 que son fixes en genere)
		for (var i = 0; i< adnPare.genome.numGens;i++)		// si copio a pel l'array es copien els punters!
        	this.genome.SetGen(i, adnPare.genome.GetGen(i));
*/     
   	
   		// calculate genome
	
		SetGenomeFromVars();

	

    }
    
         
    // el adn pateix mutacions aleatories amb una probabilitat que depen de la radiacio ambient
    // radiacio: 0..100
    public function MutacioAleatoria(radiacio: float)
    {
    	// si radiacio mitja = 10, prob 10%, en cada 
    	
	   	if (Random.value < radiacio/100) {
	            
			// Veure funcio de probabilitat de mutacio en funcio del valor en manual
			// Si s'acosta als limits de la variable per dalt o per baix la probabilitat de mutacio ha de se mes baixa
			// OJO, si el valor ha de poder ser negatiu cal fer-ho com a la temperatura per a no multiplicar per zero a mig interval
			
			//var deb=tempOptima;
			//tempOptima += (tempOptima+20) * DistribAssimetrica(tempOptima, -20, 20, 30) * (Random.value < 0.5 ? -0.05 : 0.05);
	        tempOptima += 20 * DistribAssimetrica(tempOptima, -20, 20, 30) * (Random.value < 0.5 ? -0.05 : 0.05);
	        //Debug.Log("Mutacio aleatoria. abans="+deb+" ara="+tempOptima);
	        
	        //toleranciaTemp += (toleranciaTemp+5) * DistribAssimetrica(toleranciaTemp, -5, 0, 5) * (Random.value < 0.5 ? -0.05 : 0.05);
	        toleranciaTemp *= Random.Range(0.95, 1.05);

	        pendentMaxim *= Random.Range(0.95, 1.05);

       		pesAdult *= Random.Range(0.95, 1.05);
       		reprodInterval *= Random.Range(0.95, 1.05);
       		reprodProb *= Random.Range(0.95, 1.05);
       		radiVisio *= Random.Range(0.95, 1.05);
       		edatAdult *= Random.Range(0.95, 1.05);
       		speedIdle *= Random.Range(0.95, 1.05);
       		//speedChasingX *= Random.Range(0.95, 1.05);
       		tempsGirarPerEsquivar *= Random.Range(0.95, 1.05);
	        	    	    
        }
     
   		// calculem el nou genome (encara que mutacio=0 per assignar generacio 1)
		
		SetGenomeFromVars();				// <--- ???
     
  	}
    

	//  SetGenomeFromVars
	//  SetVarsFromGenome
	//
	//		These two functions must be modified together. Calculation from gen to vars and from vars to gen must 
	//		be consistent
	//
	//   Nota: funcio linial que mapeja x=(a, b) amb y=(0,1) es y=(x-a)/(b-a)
	//
	//
  	// FORMULA LERP:
  	//		gen = lerp (0,9, (var-V0)/(V9-V0))
  	//		on V0 es valor per gen 0
  	//		   v9 es valor per gen 9
  	
	function SetGenomeFromVars() {


  	// GEN 0: not used yet
  	genome.SetGen(0, gen0var);

  	// GEN 1: chemical
  	genome.SetGen(1, CalcGen(puntsDefensaChemical, 0, 200));
  	if (nivellTrofic>0) 
	  	puntsAtacChemicalX = puntsDefensaChemical * 2;

  	// GEN 2: tolerancia temp
  	genome.SetGen(2, CalcGen(toleranciaTemp, 1, 5));
  	
  	// GEN 3: tempOptima 
  	genome.SetGen(3, CalcGen(tempOptima, -10, 30));
  	
  	// GEN 4. TAMANY - multLocalScale entre 0.5 i 2
  	//		afecta a Morfologia.MorfologiaPes
  	// multLocalScale = Mathf.Lerp(0.5, 2.0, 1.0*genNewVal/9);
	genome.SetGen(4, CalcGen(multLocalScale, 0.5, 2));
  	
  	//GEN5 - used for adjusting morphology
	genome.SetGen(5, gen5var);
  	
  	// GEN6 - REPROD - reprodInterval entre 10 i 100
  	genome.SetGen(6, CalcGen(reprodProb, 0.1, 0.001));
   	
  	// GEN 7. SPEED - 
  	genome.SetGen(7, CalcGen(speedIdle, 2, 20));
  	
  	// GEN 8. STRENGTH - puntsAtac entre 0 i 400
  	genome.SetGen(8, CalcGen(puntsAtac, 0, 400));
  	
  	
  	// GEN 9. SOCIAL
  	genome.SetGen(9, CalcGen(tempsSeguirLider, 50, 1000));
  	
  	}
	
	public function SetVarsFromGenome(){
		
			// 0 - 
					gen0var = genome.genf[0];
			// 1 - chemical defense
					puntsDefensaChemical = Mathf.Lerp(0, 200, 1.0*genome.genf[1]/9);
					if (nivellTrofic>0) 
						puntsAtacChemicalX = puntsDefensaChemical * 2;	// max 400, com punts atac
  			// 2 - adapt
				 	toleranciaTemp = Mathf.Lerp(1.0, 5.0, 1.0*genome.genf[2]/9);	
			// 3 - temp
				 	tempOptima = Mathf.Lerp(-10.0, 30.0, 1.0*genome.genf[3]/9);	
			// 4 - tamany
					multLocalScale = Mathf.Lerp(0.5, 2.0, 1.0*genome.genf[4]/9);
			// 5 - used for adjusting morphology
					gen5var = genome.genf[5];
			// 6 - Reprod
					reprodProb = Mathf.Lerp(0.1,0.001,1.0*genome.genf[6]/9);
 					reprodOffspringX = Mathf.Lerp(reprodOffspringMin, reprodOffspringMax, 1.0*genome.genf[6]/9);
			// 7 - speed
					speedIdle = Mathf.Lerp(2, 20, 1.0*genome.genf[7]/9);
					speedChasingX = speedIdle * 2;
			// 8 - strength
					puntsAtac = Mathf.Lerp(0, 400, 1.0*genome.genf[8]/9);
			// 9 - social
					tempsSeguirLider = Mathf.Lerp(50, 1000, 1.0*genome.genf[9]/9);
					
  	}
  	
	// calcula el gen entre 0 i 9 fent un lerp linial entre dos limits donats d'una variable
	
	private function CalcGen(valor:float, v0:float, v9:float): float {
		// ojo cal que min != max
		if (v0 < v9)
			return Mathf.Lerp(0.0, 9, 1.0*(valor - v0)/(v9 - v0));
			//return Mathf.Lerp(0.0, 9.99, 1.0*(valor - min)/(max - min));
		else
			return Mathf.Lerp(0.0, 9, 1.0*(valor - v0)/(v9 - v0));	// !!!! surt igual   25/8/15
			//return Mathf.Lerp(9.99, 0.0, 1.0*(valor - max)/(max - min));
			//24/8?? return Mathf.Lerp(0.0, 9.99, -1.0*(valor - min)/(max - min));
		
	}
	
	// Valor y(x) en una distribucio en forma de triangle amb 0 als extrems i 1 al mig
	
	private function DistribAssimetrica(x: float, min:float, mig: float, max:float):float {
		var d : float;
		d = x<=mig ? 
				Mathf.Lerp(0.0,1.0, 1.0*(x-min)/(mig-min))
				: Mathf.Lerp(0.0,1.0, 1.0*(max-x)/(max-mig));
		//Debug.Log("DistribAssimetrica: x,min,mig,max="+x+" "+min+" "+mig+" "+max+"  torna:"+ d);	
		return d; 
	
	}
	
	
	// Update genome and recalculate vars

	public function UpdateGenome(newGenString: String) {
		genome.CopyGenome(newGenString);
		//Debug.Log("UpdateGenome. update genome. input string="+newGenString+". final genome="+genome.ToString());
		SetVarsFromGenome();
	}	
	public function UpdateGenome(newGen: Genome) {
		// copy new genome
		genome.CopyGenome(newGen);
		//Debug.Log("UpdateGenome. update genome. input genome "+newGen.ToString()+". final genome="+genome.ToString());
		SetVarsFromGenome();
	}
	
	// Update a single gen and recalculate vars
	// WARNING: this function should be used only if genome has been already initialized (SetGenomeFromVars called at least once)

	public function UpdateGen(gen: int, val: float) {
		var g = new Genome();
		g.CopyGenome(this.genome);
		g.SetGen(gen, val);
		UpdateGenome(g);
	}
	
  
  	function NivellTrofic2String(nt: int) {
  		switch(nt) {
  			case 0: var txt = "Plant"; break;
  			case 1:  txt = "Herbivore"; break;
  			case 2:  txt = "Predator"; break;
  			case 3:  txt = "Apex predator"; break;
  			default: txt = "UNKNOWN";
  		}
  		return txt;
  	}
  
	function Etiqueta(): String {
		var s =  ""	
		+ "\n NomPantalla: "+ this.nomPantalla+" ("+this.nomPantallaCurt+")"
		+ "\n Genus:      "+ this.idGenus + "."+this.nomGenere 
		+ "\n Trophic level: "+NivellTrofic2String(this.nivellTrofic)
		+ "\n genome:      " + genome.ToString()	 //Genome2Text()
		+ "\n id:          "+ this.id
		+ "\n idPare:      "+ this.idPare
		+ "\n generacio:   " +this.generacio
		//+ "\n Prefab: "+ this.idPrefab + "."+this.nomPrefab		
		+ "\n"
        + "\nMORFOLOGIA"
		+ "\n pesAdult:      " + this.pesAdult.ToString("F1") 
		+ "\n multPesFart:   " + this.multPesFart.ToString("F3")
		+ "\n multPesMinim:  " + this.multPesMinim.ToString("F3")
		+ "\n histeresiFart: " + this.histeresiFart	
		+ "\n metabRate:  " + this.metabRate.ToString("F1")
		//+ "\n morfoLocalScale (inicial/adult): "+morfoLocalScaleInicial.ToString("F1")+ "/"+ morfoLocalScale.ToString("F1")
        + "\n morfoLocalScale: "
        + "\n     "+ morfoLocalScale.ToString("F1")
        + "\n multLocalScale : "+ multLocalScale.ToString("F1")
		+ "\n colorCos : "+ this.colorCos.ToString()
		+ "\n gen0var: " + this.gen0var.ToString("F1")
		+ "\n gen5var: " + this.gen5var.ToString("F1")
		+ "\n"
		+ "\nMETABOLISME"
		+ "\n metEnergyAtBirth:" + this.metEnergyAtBirth.ToString("F1")
		+ "\n metEficDigestio: " + this.metEficDigestio.ToString("F1")	
		+ "\n metTempsMortGana:" + this.metTempsMortGana
        + "\n"
        + "\nREPRODUCCIO"
		+ "\n edatAdult:          " + this.edatAdult.ToString("F1")
		+ "\n edatMort:           " + this.edatMort.ToString("F1")
		+ "\n reprodInterval:     " + this.reprodInterval.ToString("F1")	
		+ "\n reprodProb:         " + this.reprodProb.ToString("F3")
		+ "\n reprodOffspringX:    " + this.reprodOffspringX.ToString("F1")
		+ "\n reprodOffspringMin: " + this.reprodOffspringMin.ToString("F1")
		+ "\n reprodOffspringMax: " + this.reprodOffspringMax.ToString("F1")
		+ "\n reprodOffspringLab: " + this.reprodOffspringLab.ToString("F1")
		+ "\n reprodMaxNeighbours:" + this.reprodMaxNeighbours
		+ "\n reprodDistanceMin:  " + this.reprodDistanceMin.ToString("F1")
		+ "\n reprodDistanceMax:  " + this.reprodDistanceMax.ToString("F1")
		+ "\n reprodExpandProb:   " + this.reprodExpandProb.ToString("F2")
		+ "\n"
        + "\nADAPTACIO BIOTOP"
        + "\n precipit_Necessaries: " + this.precipitacionsNecessaries
        + "\n tempOptima:     " + this.tempOptima.ToString("F1")
        + "\n toleranciaTemp: " + this.toleranciaTemp.ToString("F1") 
		+ "\n alturaMaxima    " + this.alturaMaxima.ToString("F1") 
		+ "\n pendentMaxim:   " + this.pendentMaxim.ToString("F1") 
		+ "\n"
        + "\nVISIO, ATAC"
		+ "\n radiVisio:    " + this.radiVisio.ToString("F1")
		+ "\n VisioCurt:    " + this.radiVisioCurt.ToString("F1")
		+ "\n puntsAtac:    " + this.puntsAtac.ToString("F1") 
		+ "\n puntsDefensa: " + this.puntsDefensa.ToString("F1")
		+ "\n puntsAtacChemicalX:   " + this.puntsAtacChemicalX.ToString("F1") 
		+ "\n puntsDefensaChemical: " + this.puntsDefensaChemical.ToString("F1")
		+ "\n multMossegada: " + this.multMossegada.ToString("F3")
		;
		if (nivellTrofic > 0) {
		
		s = s +
		  "\n"
        + "\nVELOCITAT"
		+ "\n speedIdle:    " + this.speedIdle.ToString("F1") 
		+ "\n speedChasingX: " + this.speedChasingX.ToString("F1")
		+ "\n tempsGirarPerEsquivar:" + this.tempsGirarPerEsquivar.ToString("F1")
		+ "\n"
		+ "\nSOCIAL"
		+ "\n tempsSeguirLider:  " + this.tempsSeguirLider
		+ "\n tempsBuscarMenjar: " + this.tempsBuscarMenjar   	
		+ "\n probLider:         " + this.probLider
		+ "\n vSeguirLider:      " 
		+ "\n  "+ this.vSeguirLider
		+ "\n maxSeguidorsDirectes: " + this.maxSeguidorsDirectes
		;
		}

		
		return s;
	}
   

   
   static function CSVCapcalera(): String {
   	var txt : String;
   	txt = "Genus"
   		+ " ; nomPantalla"
   		+ " ; nomPantallaCurt"
   		+ " ; nivellTrofic"
   		+ " ; genome"
   		+ " ; precipitacionsNecessaries"
   		+ " ; tempOptima"
   		+ " ; toleranciaTemp"
   		+ " ; alturaMaxima"
   		+ " ; pendentMaxim"
   		+ " ; speedIdle"
   		+ " ; speedChasingX"
   		+ " ; tempsGirarPerEsquivar"
   		//+ " ; pesInicial"
   		+ " ; pesAdult"
   		+ " ; gen0var"
   		+ " ; gen5var"
   		//+ " ; morfoLocalScaleInicial"
   		+ " ; morfoLocalScale"
   		+ " ; multLocalScale"
   		+ " ; colorCos"
   		+ " ; multMossegada"
   		+ " ; multPesFart"
   		+ " ; multPesMinim"
   		+ " ; metTempsMortGana"
   		+ " ; histeresiFart"
   		+ " ; metabRate"
   		+ " ; reprodInterval"
   		+ " ; metEnergyAtBirth"
   		+ " ; metEficDigestio"
   		+ " ; tempsSeguirLider"
   		+ " ; tempsBuscarMenjar"
   		+ " ; probLider"
   		+ " ; maxSeguidorsDirectes"
   		+ " ; puntsAtac"
   		+ " ; puntsDefensa"
   		+ " ; puntsAtacChemicalX"
   		+ " ; puntsDefensaChemical"
   		+ " ; reprodMaxNeighbours"
   		//+ " ; radiVeinsReproduccio"
   		+ " ; reprodDistanceMin"
   		+ " ; reprodDistanceMax"
   		+ " ; reprodExpandProb"
   		+ " ; reprodProb"
   		+ " ; reprodOffspringX"
   		+ " ; reprodOffspringMin"
   		+ " ; reprodOffspringMax"
   		+ " ; reprodOffspringLab"
   		+ " ; edatAdult"
   		+ " ; edatMort"
   		+ " ; radiVisio"
   		+ " ; radiVisioCurt"
   		//+ " ; idPrefab"
   		//+ " ; nomPrefab"
      	;
   		//Debug.Log(txt);
   		return txt;
	}
   
   
   function CSVLinia(): String {
     	var txt : String;
   	txt = nomGenere
   		+ " ; "+ nomPantalla
   		+ " ; "+ nomPantallaCurt
   		+ " ; "+ nivellTrofic
   		+ " ; "+ genome.ToString()	//Genome2Text()
   		+ " ; "+ precipitacionsNecessaries
   		+ " ; "+ tempOptima.ToString("F1")
   		+ " ; "+ toleranciaTemp.ToString("F1")
   		+ " ; "+ alturaMaxima.ToString("F1")
   		+ " ; "+ pendentMaxim.ToString("F1")
   		+ " ; "+ speedIdle.ToString("F1")
   		+ " ; "+ speedChasingX.ToString("F1")
   		+ " ; "+ tempsGirarPerEsquivar.ToString("F1")
   		//+ " ; "+ pesInicial
   		+ " ; "+ pesAdult
   		+ " ; "+ gen0var
   		+ " ; "+ gen5var
   		//+ " ; "+ morfoLocalScaleInicial.ToString("F1")
   		+ " ; "+ morfoLocalScale.ToString("F1")
   		+ " ; "+ multLocalScale.ToString("F1")
   		+ " ; "+ colorCos.ToString()
   		+ " ; "+ multMossegada
   		+ " ; "+ multPesFart
   		+ " ; "+ multPesMinim
   		+ " ; "+ metTempsMortGana
   		+ " ; "+ histeresiFart
   		+ " ; "+ metabRate
   		+ " ; "+ reprodInterval
   		+ " ; "+ metEnergyAtBirth
   		+ " ; "+ metEficDigestio
   		+ " ; "+ tempsSeguirLider
   		+ " ; "+ tempsBuscarMenjar
   		+ " ; "+ probLider
   		+ " ; "+ maxSeguidorsDirectes
   		+ " ; "+ puntsAtac.ToString("F1")
   		+ " ; "+ puntsDefensa.ToString("F1")
   		+ " ; "+ puntsAtacChemicalX.ToString("F1")
   		+ " ; "+ puntsDefensaChemical.ToString("F1")
   		+ " ; "+ reprodMaxNeighbours
   		//+ " ; "+ radiVeinsReproduccio
   		+ " ; "+ reprodDistanceMin
   		+ " ; "+ reprodDistanceMax
   		+ " ; "+ reprodExpandProb.ToString("F2")
   		+ " ; "+ reprodProb.ToString("F3")
   		+ " ; "+ reprodOffspringX.ToString("F1")
   		+ " ; "+ reprodOffspringMin.ToString("F1")
   		+ " ; "+ reprodOffspringMax.ToString("F1")
   		+ " ; "+ reprodOffspringLab.ToString("F1")
   		+ " ; "+ edatAdult
   		+ " ; "+ edatMort
   		+ " ; "+ radiVisio
   		+ " ; "+ radiVisioCurt
   		//+ " ; "+ idPrefab
   		//+ " ; "+ nomPrefab
      	;
   		Debug.Log(txt);
   		return txt;
	
   }
                  
}