#pragma strict

/*
 * Animal extends Creature
 *
 * Animal()
 * Inicialitzat()
 * Update()
 * CanviEstat()
 * GetEtiqueta()
 * OnTriggerEnter(collider)
 * OnDestroy()
 *
 */ 


public class Animal extends Creature 
{

	private var probLider :float;		// s'assigna a start. els followers segueixen els liders. plantes i carnivors son liders.
	private var socLider : boolean;

	@HideInInspector var presaImpossible : Creature;			// una presa que sabem que no podem agafar perque esta molt alta
													// public perque la crida radar!
	private var presaEnAtac : Creature;
	
	private var distanciaMenjar = 1.0;		// distancia a la que menja le presa

	private var dirVelocitat : Vector3;		// direccio de la speed   -- ?? no cal, rigidbody.velocity ???
	private var angleGirar : float;
	private var estatAbansGirar : CreatureStatus;
	private var framesGirar : int;		// comptador de frames en els que canvia de direccio
	
	// variables d'estat

	private var tempsEnAquestaDireccio = 0.0;			// es resseteja quan canvia direccio en mode IDLE
	private var simTimeEnAquestaDireccio : float;  


	// variables de comunicacio

	//@HideInInspector 	var llocFart = Vector3.zero;	// ultim lloc on hi havia molt menjar

	private var intervalBandaCheck = 2.0;	// update leader position seconds 
	private var lastBandaCheck = 0.0;
	private var intervalAtacCheck = 2.0;
	private var lastAtacCheck = 0.0;
	private var intervalVictimaAtacCheck = 2.0;
	private var lastVictimaAtacCheck = 0.0;
	//private var intervalPerduaPesCheck = 2.0;
	//private var lastPerduaPesCheck = 0.0;
	private var intervalAdultCheck = 0.5;
	private var lastAdultCheck = 0.0;
	private var menjarOParir = false;	// switch per a que no tingui prioritat una decisio sobre l'altra
//	private var lastSimTime : float;
//	static var totalAnimals = 0;			--> to Creatures

	@HideInInspector var banda : Banda;
	private var radar : Radar;

	public function Animal() {

	}

	public function Inicialitzat(adnPare: Dna) {
 	  
	 	  super.Inicialitzat(adnPare);
		  if (!esticInicialitzat){
			return;
		  }
	 	 
		//totalAnimals++;
		
		CanviEstat(CreatureStatus.BABY);	  // estat inicial
		
	 	socLider = false;		// fins que no son adults no son liders
	 	
	 	 banda = gameObject.GetComponent(Banda);
		 if (banda!=null) {
			 banda.InicialitzaBanda(this);						// no estic seguint a ningu
		 } 
		 
		 radar = new Radar(this);
		 biblio.Assert(radar!=null, "Animal.Inicialitzat "+CreatureToString(this)+" radar==null");
		 
		 radar.apropVei = null;
		 radar.apropPresa = null;
		 radar.apropEnemic = null;
   
	}


	
	public function Update() {
	
		// passa a l'inici de la escena, mentre la biocenosi no s'ha activat i els animals comencen a funcionar
		if (esticEnPause || !esticInicialitzat) {
			return;
		}
		
		// fes processos d'Update en classe mare (abans era super.Update())
		
		FesUpdateCreature();
		        
		// actuacions que depenen de l'estat
								
		switch(estat) {

		case CreatureStatus.BABY:
			radar.Scan();
			MouIDLE();		// <--- hauria d'estar al final del case?
			// are we already an adult?
			// first generation starts already as adult
			if ((SimTime.simTime - lastAdultCheck > intervalAdultCheck) || (dna.generacio == 1))	  {
				lastAdultCheck = SimTime.simTime;
				if ((metab.edat > dna.edatAdult) || (dna.generacio == 1)) {
					CanviEstat(CreatureStatus.IDLE);
					// 26/5/15 - incremento pes quan passa a adult
					//pes = dna.pesAdult * 0.75;
					metab.SocAdult();
					socLider = Random.value < dna.probLider;	// soc un lider?
					if (socLider) {
						PosaColorCosSeleccionat("cua", Color.red);
					}
					else {
						PosaColorCosSeleccionat ("cua", Color.white);
					}
					Rajo("M'he fet adult. Peso: "+metab.pes+ " Soc lider: "+socLider);
				}
			}
			break;
			
		case CreatureStatus.ATTACKED:
			// es queda parat mentre l'altre esta menjant
			// espera 0.5 s per si l'altre segueix atacant despres
			if (SimTime.simTime - lastVictimaAtacCheck > intervalVictimaAtacCheck+0.5) {
				lastVictimaAtacCheck = SimTime.simTime;
				CanviEstat(CreatureStatus.IDLE);
			}
			break;
		case CreatureStatus.EATING:
		
			// despres de cada mossegada espero 2 segons menjant (intervalAtacCheck)
			//(la presa s'ha d'esperar com a minim aquest temps per sortir d'estat ATTACKED

			if (SimTime.simTime - lastAtacCheck < intervalAtacCheck) {
		
		 		// fa una gracia
		 		if (!SimTime.simSpeedFast) {
					morfologia.EfecteMenjar();
	 			}
			}
			else {
					
				morfologia.EfecteMenjarFi();
					
				// si encara no m'he acabat la presa o si no m'he afartat seguim menjant
				if (radar.apropPresa != null && !metab.esticATope()) {
					CanviEstat(CreatureStatus.IDLE);			// he de passar per IDLE perque si no CanviaEstat no faria el EATING
					CanviEstat(CreatureStatus.EATING, radar.apropPresa);
				}
				else {
					CanviEstat(CreatureStatus.IDLE);					
				}
			}
			break;
			
		case CreatureStatus.PENDING_BIRTH:
			if (tempsEnEstat > tempsGestacio) {
//				if (totalAnimals < Biocenosi.instance.maxAnimals) {
					// intenta parir
					Rajo("Vaig a parir");
					Parir();
					CanviEstat(CreatureStatus.IDLE);
//				}
//				else {
//					// pot ser que s'hagin posat apuntdeparir tants que alguns ja passarien de maxAnimals
//					Rajo("No puc parir perque totalAnimals > Biocenosi.instance.maxAnimals");
//					CanviEstat(CreatureStatus.IDLE);
//				}
			}	
			else {
				// fa un efectillo abans de parir
				if (!SimTime.simSpeedFast){
						// <---- FALTA L'EFECTE !!! 
				}
			}
			break;
		case CreatureStatus.BANDA:
		case CreatureStatus.IDLE:
		
			radar.Scan();
		
			if (estat==CreatureStatus.BANDA)
				MouBanda();
			if (estat==CreatureStatus.IDLE)
				MouIDLE();
			
			// si te un depredador aprop intenta escapar 
			if (radar.apropEnemic != null) {
				Rajo("Detectat enemic "+CreatureToString(radar.apropEnemic));
				CanviEstat(CreatureStatus.ESCAPING, radar.apropEnemic);
			}			
			else {
			
				// if we are not escaping from a predator we can choose between checking for food or for giving birth
				 
				// hem hagut de menjar almenys un cop per parir per evitar que es reprodueixen indefinidament sense menjar (o herbivors sempre farts)
				// test esticFart per si son herbivors sempre farts
//				if (totalAnimals < Biocenosi.instance.maxAnimals*0.9 
//					&& menjarOParir
				if (menjarOParir
					&& !metab.tincGana()
					&& tempsDesDeParir > dna.reprodInterval
					&& (heMenjatPesDesDePart > 0 || (dna.nivellTrofic == 1 && Biocenosi.instance.herbivorsSempreFarts))) {   
		
						// testejo la probabilitat a intervals de temps fixes per evitar que depengui del framerate
		          	   if (SimTime.simTime - lastParirCheck > intervalParirCheck) {
		               	   	lastParirCheck = SimTime.simTime;
			 				if (Random.value < dna.reprodProb) {
								//Debug.Log(dna.nomPantallaCurt+" Em poso a gestar   (IDLE) heMenjatPesDesDePart="+heMenjatPesDesDePart+ " tempsDesDeParir="+tempsDesDeParir);
								Rajo("Em poso a gestar   (IDLE) heMenjatPesDesDePart="+heMenjatPesDesDePart+ " tempsDesDeParir="+tempsDesDeParir);
								CanviEstat(CreatureStatus.PENDING_BIRTH);
							}
					   }
					}		
				else {
				
					// si no parim mirem si tenim algu per perseguir
				
					if (radar.apropPresa != null && !metab.esticFart()) {
						Rajo("He descobert a "+CreatureToString(radar.apropPresa)+" i comenco a perseguir");
						CanviEstat(CreatureStatus.CHASING, radar.apropPresa);
					}	
					//else {
					//	if (radar.apropPresa!=null) {
					//		Rajo("No persegueixo a presa "+CreatureToString(radar.apropPresa)+" perque estic fart, energia="+metab.energia);
					//	}
					//}
				}
			}
			menjarOParir = !menjarOParir;
			break;
			
		case CreatureStatus.ESCAPING:
			radar.Scan();
			if (radar.apropEnemic==null) {
				Rajo ("M'he escapat");
				CanviEstat(CreatureStatus.IDLE);
			}
			else {
				MouFugida();
			}
			break;

		case CreatureStatus.CHASING:
			// quan persegueixo no faig radar, vaig a saco a per la presa que si no em despisto
			MouPersecucio();
			// chequejem que no hagi desaparegut
			if (radar.apropPresa != null) {
				// segons distancia: o l'hem pillat, o encara la perseguim o s'ha escapat
				var vDif = radar.apropPresa.gameObject.transform.position - gameObject.transform.position;
				// l'hem pillat
				if (vDif.sqrMagnitude < distanciaMenjar * distanciaMenjar) {
					Rajo("He pillat a "+CreatureToString(radar.apropPresa));
					//MenjarPresa();
					CanviEstat(CreatureStatus.EATING, radar.apropPresa);
				}
				// s'ha escapat
				else if (vDif.sqrMagnitude > dna.radiVisio * dna.radiVisio) {
					Rajo ("S'ha escapat...");
					CanviEstat(CreatureStatus.IDLE);
				}
			}
			else {
				// aixo deu passar quan un altre se l'ha menjat abans <-- TBC
				//Debug.Log(meuId +" "+ "AVIS: presa null en estat CHASING - "+GameObject);
				Rajo("Ha desaparegut la presa...! (Se l'ha menjat algu altre?)");
				CanviEstat(CreatureStatus.IDLE);
			}
			break;
		case CreatureStatus.TURNING:
			if (framesGirar-- > 0) {
					transform.Rotate(Vector3.up * angleGirar);		
			}
			else {
				CanviEstat (estatAbansGirar);
				simTimeEnAquestaDireccio = SimTime.simTime;
			}
			break;
		case CreatureStatus.WRECK: 		
			// cadaver ho posa Creature, no cal fer res
			break;
		case CreatureStatus.LABORATORI: 		
			break;
		//case CreatureStatus.PENDINGTERMINATE: ;
		default:
			Debug.Log(meuId+ "*** ERROR *** Update. Estat desconegut: "+estat);
		}
	
	}
	
	public function CanviEstat(nouEstat:int) {
		CanviEstat(nouEstat, null);
	}
	
	public function CanviEstat(nouEstat: int, objecte: Creature) {

		biblio.Assert(esticInicialitzat, meuId+"animal canviestat encara no inicialitzat");
		

		// si realment ha canviat l'estat
		if (nouEstat != estat) {

			CreatureStatusObjecte = objecte;
			
			//super.CanviEstat(nouEstat);
			
			if (estat!=CreatureStatus.TURNING && nouEstat !=CreatureStatus.TURNING) // gira massa vegades i spameja
				Rajo("CanviEstat: "+getEstatString(estat) + " --> "+ getEstatString(nouEstat));
						
			if (nouEstat == CreatureStatus.BABY) {
				//elColor = colorADULT;
				lastAdultCheck = SimTime.simTime;

			}
			else if (nouEstat == CreatureStatus.IDLE) {
				// pas de BABY a adult
				if (estat == CreatureStatus.BABY) {
					// que comenci ja a menjar al fer-se adult
					//tempsDesDeMenjar = SimTime.simTime - dna.intervalGana;
				}
				PosaColorCosSeleccionat("orellae", Color.white);
				PosaColorCosSeleccionat("orellad", Color.white);
			}
			else if (nouEstat == CreatureStatus.ATTACKED) {
				PosaColorCosSeleccionat("orellae", Color.magenta);
				PosaColorCosSeleccionat("orellad", Color.magenta);
				lastVictimaAtacCheck = SimTime.simTime;
			}
			else if (nouEstat == CreatureStatus.BANDA) {
				PosaColorCosSeleccionat("orellae", Color.blue);
				PosaColorCosSeleccionat("orellad", Color.blue);
				lastBandaCheck = 0.0;
			}
			else if (nouEstat == CreatureStatus.EATING) {
				
				// guardo la presa que estic atacant
				
				presaEnAtac = radar.apropPresa;
				biblio.Assert(presaEnAtac!=null, "animal.menjarpresa presaenatac == null");
				Rajo("Ataco un " + presaEnAtac.meuId + " puntsDefensa: "+presaEnAtac.dna.puntsDefensa+ " jo puntsAtac: "+dna.puntsAtac);
				Rajo("               puntsDefensaChemical: "+presaEnAtac.dna.puntsDefensaChemical+ " jo puntsAtacChemicalX: "+dna.puntsAtacChemicalX);
				
				// mossego i incremento pes
				
				var mossego : float;
				mossego = presaEnAtac.EtMossego(this);
				metab.FerMossegada(mossego);

				heMenjatPes += mossego;
				heMenjatPesDesDePart += mossego;
				//simTimeDesDeMenjar = SimTime.simTime;;				
				lastAtacCheck = SimTime.simTime;
				
				// orelles magenta
				
				PosaColorCosSeleccionat("orellae", Color.magenta);
				PosaColorCosSeleccionat("orellad", Color.magenta);
			}
			else if (nouEstat == CreatureStatus.CHASING) {
				//elColor = colorPERSEGUINT;
				PosaColorCosSeleccionat("orellae", Color.red);
				PosaColorCosSeleccionat("orellad", Color.red);
			}
			else if (nouEstat == CreatureStatus.PENDING_BIRTH) {
				PosaColorCosSeleccionat("orellae", Color.yellow);
				PosaColorCosSeleccionat("orellad", Color.yellow);
				//elColor = Color.yellow;
			}
			else if (nouEstat == CreatureStatus.TURNING) {
				// no fa res
			}
			else if (nouEstat == CreatureStatus.ESCAPING) {
				// no fa res
			}
			/*
			else if (nouEstat == CreatureStatus.WRECK) {
				PosaColorCosSeleccionat("TOT", Color.gray);
			}
			else if (nouEstat == CreatureStatus.PENDINGTERMINATE) {
				PosaColorCosSeleccionat("TOT", Color.black);
				Terminate();
			}
			*/	 
		
		
		//gameObject.renderer.material.color = elColor;

		estat = nouEstat;
		//tempsEnEstat = 0;
		simTimeCanviEstat = SimTime.simTime;
		}

	}



	// canvio de direccio si
	//	- fa molt temps que no trobo menjar en aquesta direccio
	//	- o he entrat en una zona on tinc fred o calor
	// si soc lider canvio de direccio directament
	// si soc follower busco un lider per seguir-lo i si no el trobo, canvio de direccio
	// 
	// despres avanço. si estic fart, vaig mes a poc a poc

	private function MouIDLE() {
		  
		var canviaDireccio = false;
  		tempsEnAquestaDireccio = SimTime.simTime - simTimeEnAquestaDireccio;
		  	  
	  	// si fa temps que no trobem res canviem de direccion (sino seguirem com anavem) 
	    //if (tempsEnAquestaDireccio > dna.tempsBuscarMenjar || !tempOk) {
	    if (tempsEnAquestaDireccio > dna.tempsBuscarMenjar) {
	    
	    		// si soc lider girem a l'atzar
				if (socLider)  {
					canviaDireccio = true;
					//Rajo("Soc lider, vaig a girar");
				}
				// si soc follower i no hi ha ningu aprop tambe
				else if (radar.apropVei == null) {	
					canviaDireccio = true;
					//Rajo("Ningu a la vista, vaig a girar");
 	 			}
 	 			// si tinc un vei potser es un lider
 	 			//else if (banda.CheckLider(radar.apropVei.gameObject.GetComponent(Animal))) {
 	 			//	banda.SegueixLider(radar.apropVei.gameObject.GetComponent(Animal));
 	 			else if (banda.CheckLider(radar.apropVei)) {
 	 				banda.SegueixLider(radar.apropVei);
 	 				if (banda.elMeuLider != null) {
	 	 				banda.UpdateInfoLider();	  	 
	 	 				simTimeEnAquestaDireccio = SimTime.simTime;
	 	 				//Rajo("Vaig a provar si pot ser lider: "+banda.elMeuLider.meuId);
 		 				CanviEstat(CreatureStatus.BANDA);
 		 			}
 	 			}
 	 			else {
					canviaDireccio = true;
					//Rajo("He trobat un vei "+radar.apropVei.gameObject.GetComponent(Animal).meuId+ "pero no pot ser lider");
 	 			}
 	 	}
		 	 
		// i finalment, ara que ja sabem on anem, ens movem
		if (canviaDireccio) {
			// si recordem la ultima presa ho fem servir com a pista d'on volem anar 
			if (metab.tincGana() && lastPresaPos1 != biblio.vectorNull) {
				LookAtSenseElevarte(lastPresaPos1);
				Rajo("Vaig a buscar la posicio de la ultima presa "+lastPresaPos1);
				// pero si ja estem molt aprop i no hem vist res, borrem la memoria
				//var vDif = lastPresaPos1 - gameObject.transform.position;
				//if (vDif.sqrMagnitude < dna.radiVisio) {		// 10*10		<-- podria ser radiVisio o radiVisioCurt
				if (Vector3.Distance(lastPresaPos1, gameObject.transform.position) < dna.radiVisio) {
					lastPresaPos1 = lastPresaPos2;
					lastPresaPos2 = lastPresaPos3;
					lastPresaPos3 = biblio.vectorNull;
					Rajo("Crec que ja no hi ha res a lastPresaPos1 i la canvio per l'anterior");
				}
			}
			else {
				CanviaDireccioAtzar();
			}
		  	simTimeEnAquestaDireccio = SimTime.simTime;
		}
		// si esta fart, es mou mes a poc a poc
  		if (!metab.esticFart()) 
	  		FesTranslate(dna.speedIdle);
	  	else	
	  		FesTranslate(dna.speedIdle/4);
	  	
	}

	// si esta en mode banda va seguint el seu lider
	// el deixa si fa molt temps que va darrera seu i no ha trobat res
	// s'intercanvia informacio amb el lider
	private function MouBanda() {
		  
		var abandonaLider = false;
  		tempsEnAquestaDireccio = SimTime.simTime - simTimeEnAquestaDireccio;

		// abandono el lider si s'ha mort o si fa temps que no trobem res 
		
	  	if (banda.elMeuLider==null || tempsEnAquestaDireccio > dna.tempsSeguirLider) {
 	 		abandonaLider = true;
 	 		Rajo("Abandono al lider");
 	 	}
 	 	
 	 	// si el segueixo, actualitzo la meva posicio cada 2 segons
 	 	
 	 	//else if (Time.frameCount%10==0) 
 	 	else if (SimTime.simTime - lastBandaCheck > intervalBandaCheck)
 	 	 {
			lastBandaCheck = SimTime.simTime;
			//Rajo("*** Banda update position ***");
 	 	 
 	 		Debug.DrawLine(transform.position, banda.elMeuLider.transform.position,Color.blue);

 	 		// ens actualitzem la informacio amb el lider
 	 		
 	 		banda.UpdateInfoLider();
			
			// calculem on hem de mirar segons posicio del lider i en quin slot de cua estem
			
			// AIXO ES LENT: GiraCapAWorld(elMeuLider.transform.position+dna.vSeguirLider);
 		  	switch(banda.slotMeu) {
 		  	case 1:
	 			var onMiro = dna.vSeguirLider+Vector3(3,0,0);
	 			//var col = Color.gray;
	 			break;
 		  	case 2:
	 			onMiro = dna.vSeguirLider+Vector3(0,0,-3);
	 			//col = Color.black;
	 		  	break;
 		  	case 3:
	 			onMiro = dna.vSeguirLider+Vector3(-3,0,0);
	 			//col = Color.blue;
	 		  	break;
	 		default:
	 			Debug.Log("MouBanda error slot meu: "+banda.slotMeu);
	 		}
			onMiro = banda.elMeuLider.transform.position + banda.elMeuLider.transform.TransformDirection(onMiro);
		  	//23feb//transform.LookAt(onMiro, Vector3.up);
 		  	LookAtSenseElevarte(onMiro);
 		  	if (esticSeleccionat) {							
 		  		Debug.DrawLine(transform.position, onMiro, Color.blue);	
 		  	}
 		  	//Debug.Log("meva posicio: "+transform.position+", posicio lider: "+banda.elMeuLider.transform.position+", on mira lider (local): "+banda.elMeuLider.transform.forward+ ", on miro (global): "+onMiro);
		
		  	
	 		  	
					// *** OJO, SI ESTA EN UNA PENDENT GIRARA MALAMENT!!!??? ***
	 	 }	 	
		
	
	if (abandonaLider) {	
 		banda.AbandonaLider();
 		CanviEstat(CreatureStatus.IDLE);
		CanviaDireccioAtzar();
 		simTimeEnAquestaDireccio = SimTime.simTime;
 	}
 	else {
		// si esta molt aprop del lider no es moura per a no menjar-se'l
		// OJO - OPTIMITZAR RENDIMENT, POTSER NO CAL CALCULAR AIXO CADA COP?
		var vDif = banda.elMeuLider.gameObject.transform.position - gameObject.transform.position;
		if (vDif.sqrMagnitude > 5 * 5) {			// <--- OJO, DISTANCIA A HUEVO		
			FesTranslate(dna.speedIdle);
		}
	}
	


}
	//FesTranslate()
	// fa translates segons speed vigilant l'alçada

	// avança. l'animal sempre hauria de tenir l'orientacio en el pla xz per lo que sempre avança en horitzontal. 
	// despres corrigeix l'alçada segons el terreny
	
	// <-- FUNCIO COSTOSA??
	// El calcul del desnivell es molt costos? Potser no caldria fer-lo sempre si el terreny es pla

	private function FesTranslate(speed: float) {
	
		// calculem on aniriem si avancessim recte
		var gap = transform.forward * speed * Time.deltaTime;	// el que avancem
		var dest = transform.position + gap;						// desti teoric
		var desty = Terrain.activeTerrain.SampleHeight(dest);		// desti.y
		var desnivell = desty - transform.position.y;				// desnivell fins desti

		// si es un pendent massa gros, donem mitja volta i ens quedem on som
		if (desnivell > 0.1 && planeta.y2h(desnivell) > dna.pendentMaxim) {
		  	Rajo("Pendent massa alt!! "+planeta.y2h(transform.position.y - desty)+ " gap:" + gap);
			transform.LookAt(-Vector3.forward);  // mitja volta a saco
			if (estat == CreatureStatus.CHASING)
				presaImpossible = radar.apropPresa;
			
		}		 
		// si podem avançar, avancem corregint l'alçada si cal
		else {
			// si esta en pendent, afluixem la speed
			if (desnivell > 0.5) 
				transform.Translate(Vector3.forward * Mathf.Lerp(speed, speed*0.1, planeta.y2h(desnivell)/dna.pendentMaxim)  * Time.deltaTime);
			else
				transform.Translate(Vector3.forward * speed * Time.deltaTime);
			transform.position.y = Terrain.activeTerrain.SampleHeight(transform.position);		

		}	

	}


	// rota 
	private function CanviaDireccioAtzar() {
		
		var angleInicial : float = Random.Range(15,30); // mes o menys entre +- 30º i 45º
		var gir : Vector3;
		var signe : int;
	  	signe =  (Random.value > 0.5) ? 1 : -1; 
	  	
		gir = Vector3.right*angleInicial*signe;  // giro cap a (+-gir, 0, 30)
  
	  	// mirem si per davant la temperatura es correcta
	  	var p = transform.position + transform.TransformDirection(gir + Vector3.forward * 30);
	  	if (esticSeleccionat) {
	  		Debug.DrawLine(transform.position, p, Color.black, 0.2f);
	  	}
	  	var intents = 0;
	  	var difTempAnt = TempDiferenciaOptima(p);
		while (difTempAnt > 0  && intents++ < 12) {
			if (esticSeleccionat) {
		  		Debug.DrawLine(transform.position, p, Color.black, 0.3f);
			  	Rajo("Temperatura en "+p+" = "+ difTempAnt+". Provo nova direccio ("+intents+") " +gir);
		  	}		
		  	// si no es bona temperatura, anirem provant a diferencies de 15º (<-- ojo, aixo no ho faig be)
			// si en un moment donat, la diferencia de temperatura creix, anire girant cap a l'altre costat
			// com a molt fare 12 proves, despres sortire passi el que passi
		  	gir = gir + Vector3.right*15*signe;  // 15º, maxim 15*12=180
		  	p = transform.position + transform.TransformDirection(gir + Vector3.forward * 30);
		  	var difTempNew = TempDiferenciaOptima(p);
		  	if (difTempNew > difTempAnt) {
		  		gir = -gir;
			  	difTempAnt = difTempNew;
			}
		}
	
		// girar es fa en diferents frames
	  	GiraCapALocal(Vector3.forward*30 + gir); 
	
	
	}


	private function MouPersecucio() {
		tempsEnAquestaDireccio = SimTime.simTime - simTimeEnAquestaDireccio;

		if (dna.speedChasingX >0) 
		    if (radar.apropPresa != null) {
			    Debug.DrawLine(transform.position, radar.apropPresa.transform.position,Color.green);
			  //Rajo("persegueixo "+CreatureToString(radar.apropPresa)+" que esta a " + Vector3.Distance(radar.apropPresa.transform.position, transform.position)+" amb dna.speedChasingX: "+dna.speedChasingX + " tempsEnAquestaDireccio: "+tempsEnAquestaDireccio);	
		  	 //10/10/14 transform.LookAt(radar.apropPresa.transform.position, Vector3.up);
		  	 LookAtSenseElevarte(radar.apropPresa.transform.position);
		  	 FesTranslate(dna.speedChasingX);
		  	  }
	}

// de moment s'escapa amb la mateixa speed que persegueix
private var cicle = 0;
private var gir = Vector3(0,0,0);
private function MouFugida() {

	tempsEnAquestaDireccio = SimTime.simTime - simTimeEnAquestaDireccio;
	
    if (radar.apropEnemic != null) {
	//3/7 ?????  if (radar.apropVei != null) {
	
	   Debug.DrawLine(transform.position, radar.apropEnemic.transform.position,Color.red);
	
		// si tenen lider s'escapen anant cap a ell, suposem que el lider tambe s'estara escapant (<--- REVISAR)
		if (!socLider && banda.elMeuLider) {
			LookAtSenseElevarte(banda.elMeuLider.transform.position);
		}
		// sino van en direccio oposada a la posicio de l'enemic
		else {

			// Canviem aleatoriament la direccio
			if (tempsEnAquestaDireccio > dna.tempsGirarPerEsquivar) {
				gir = Vector3(cicle * Random.Range(-2,2), 0, cicle * Random.Range(-2,2));
				simTimeEnAquestaDireccio = SimTime.simTime;
				//Debug.Log("MouFugida giro" + gir);
			}
			LookAtSenseElevarteFugir(radar.apropEnemic.transform.position+gir);	  		
		} 
		FesTranslate(dna.speedChasingX);
	}
}

private function LookAtSenseElevarte(pos: Vector3) {
	var dif : Vector3 = pos - transform.position;
	dif.y = 0;
	transform.LookAt(dif+transform.position, Vector3.up);
 
}

private function LookAtSenseElevarteFugir(pos: Vector3) {
	var dif : Vector3 = pos - transform.position;
	dif.y = 0;
	transform.LookAt(-dif+transform.position, Vector3.up);
 
}


	// Quan et mosseguen
	// es public perque es crida des de Update()
 	//function EtMossego(puntsAtac:int, mossegadaPes: float, atacant : Creature): float {
	function EtMossego(atacant : Creature): float {
	
		//if (estat!= CreatureStatus.WRECK && estat!= CreatureStatus.PENDINGTERMINATE ) {
		if (estat!= CreatureStatus.WRECK) {
			CanviEstat(CreatureStatus.ATTACKED);
		}
		//return super.EtMossego(puntsAtac, mossegadaPes, atacant);
		return super.EtMossego(atacant);
	} 


	public function GetEtiqueta(): String {
	
		var txt=super.GetEtiqueta();
		
		if (estat == CreatureStatus.BANDA) {
			if (banda.elMeuLider == null)
				txt += "\nSoc el lider";
			else
				txt += "\nLider: "+banda.elMeuLider.meuId;
				
			txt += "\nSeg.del lider: "+banda.elMeuLider.banda.seguidorsTotal;
			txt += "\nSeguidors: "+banda.seguidorsTotal;
		}

		if (radar.apropEnemic != null)
			txt+="\nEnemic: "+radar.apropEnemic.meuId;
		if (radar.apropPresa != null)
			txt+="\nPresa: "+radar.apropPresa.meuId;
		if (radar.apropVei != null)
			txt+="\nVei: "+radar.apropVei.meuId;

		return txt;
	}


	public function OnTriggerEnter(col: Collider){ 
		
	
		
		// si xoca amb els limits del camp, gira
	 	
	 	if (col.gameObject.layer == 12)  {
	 		
	 		Rajo("OnTriggerEnter amb limits");
	    	
	 		// si he fet spawn en un limit sense estar inicialitzat em moro
			if (!esticInicialitzat) {   // ??? POT PASSAR
				//28/6: salut = 0;
				//noArribaANeixer = true;
				//biblio.RajaMolt("Animal OnTriggerEnter sense estar inicialitzat. Es mor. Genus: "+dna.idGenus);
				Debug.LogError("Animal OnTriggerEnter sense estar inicialitzat. Es mor. Genus: "+dna.idGenus);
				return;
			}
		 	
	 	  	 //transform.Rotate(Vector3.up * 180);		// mitja volta a saco   <--- FER MES FI!!!!
			if (estat!=CreatureStatus.TURNING) {
			  	 GiraCapALocal(-Vector3.forward);				// mitja volta a saco   <--- FER MES FI!!!!
			}
		  	 	 //transform.LookAt(Vector3.zero);
	    }
		else {
		
			// si xoca amb un Creature mira qui menja a qui
			var go = col.transform.parent.gameObject;		// el esser viu esta al parent del collider
			if (go != null) {
				// layer plantes ==  8, herbivors == 9, etc...
			  	if ((estat==CreatureStatus.IDLE || estat==CreatureStatus.BANDA) && (go.layer - dna.nivellTrofic == 7)) {
					Rajo("OnTriggerEnter amb un animal:" + CreatureToString(go)+ " puntsDefensa: "+go.GetComponent(Creature).dna.puntsDefensa+" puntsAtac: "+dna.puntsAtac);			
					if (col.transform.parent.GetComponent(Creature).dna.puntsDefensa <= dna.puntsAtac) {
				  		radar.apropPresa = go.GetComponent(Creature);
						if (radar.apropPresa!=null) {
							Rajo("OnTriggerEnter amb un animal:" + CreatureToString(go));
							// se'l menja encara que estigui fart
				    		//MenjarPresa();	
				    		CanviEstat(CreatureStatus.EATING);
						}
					}
			      }
			}
			else {
				Debug.LogWarning("OnTriggerEnter - No se que es el collider: "+col);
			}
		}
	}


	// Calcula els graus que ha de girar per a apuntar al target "pos" en "framesGirar" iteracions
	// Canvia l'estat per a que en Update() el faci girar "grausGirar"

	// gira cap a un punt en coordenades locals
	private function GiraCapALocal(localPos: Vector3) {
		//var angle = Vector3.Angle(transform.TransformDirection(Vector3.forward), pos - transform.position);
		var angle = Vector3.Angle(localPos,Vector3.forward);   // ordre ok???
		// calculem signe amb producte vectorial perque Angle torna valor absolut
		var cross:Vector3 = Vector3.Cross(Vector3.forward, localPos);
	    if (cross.y < 0) angle = -angle;          // o >

		//	framesGirar = 10;		// frames que tardara en girar 			<---- POSAR LERP ANGLE?
		framesGirar = SimTime.simSpeedFast ? 1 : 10;		// frames que tardara en girar 			<---- OJO!!!
		
		angleGirar = angle/framesGirar;
		
		estatAbansGirar = estat;
		//Rajo(" Vaig a girar (coords local). Soc a (world) " + transform.position + " i vull apuntar a (local) " + localPos + ". Em surt angleGirar="+angleGirar+" en "+framesGirar+" frames");
		CanviEstat(CreatureStatus.TURNING);
	}


	

	public function OnDestroy() {
		super.OnDestroy();
		if (esticInicialitzat) {
			if (banda!=null)
				banda.AbandonaLider();
			//totalAnimals--;
			if (esticSeleccionat && ObjecteSeleccionat != null) {
				ObjecteSeleccionat.instance.AnimalSeleccionatHaMort(this);
			}

		}
		// R.I.P
 	}

}


