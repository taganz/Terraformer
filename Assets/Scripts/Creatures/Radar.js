#pragma strict

/*
 *  Radar es la classe que recull informacio de l'entorn per un animal
 *
 *	- apropPresa
 *	- apropVei
 *  - apropEnemic
 *
 *	 per mirar: <-- encara fa servir algunes variables del pare que potser caldria desacoplar i viceversa. 
 */

public class Radar {

	public var apropVei    : Animal;
	public var apropPresa  : Creature;
	public var apropEnemic : Creature;
	
	
	private var ev : Animal;
	
	static var intervalRadarCheck = 2.0;	// check radar every 2 simTime seconds 
	private var lastRadarCheck : float;
	
	private var maskPreses : LayerMask;				// 1<<8
	private var maskIguals : LayerMask;				// 9
	private var maskPredadors : LayerMask;			// 10
	private var maskPresesOVeins : LayerMask;			// 11 menjar i veins
	//private var maskLimits : LayerMask = 1 << 12;		// 12 <-- limits cal posar-lo en setup d'escena
	//private var maskLimitsAndWater : LayerMask = 1 << 12 | 1<<4;  // water es 4
	private var maskMateixGenere : LayerMask;			// 13 + idgenere
	private var pendentMaximPresa : float;

	public function Radar(ev: Animal) {
	
		this.ev = ev;
		lastRadarCheck = 0.0;
		pendentMaximPresa = Planeta.instance.y2h(ev.dna.pendentMaxim);

		maskMateixGenere = 1 << (13 + ev.dna.idGenus);
		

		switch(ev.dna.nivellTrofic) {
		case 0:
		  maskPreses = 0;
		  maskIguals = Biocenosi.instance.maskNT[0];			
		  maskPredadors = Biocenosi.instance.maskNT[1];		
		  maskPresesOVeins = Biocenosi.instance.maskNT[0];
		  break; 
		case 1:
		  maskPreses = Biocenosi.instance.maskNT[0];
		  maskIguals = Biocenosi.instance.maskNT[1];			
		  maskPredadors = Biocenosi.instance.maskNT[2];			
		  maskPresesOVeins = Biocenosi.instance.maskNT[0].value | Biocenosi.instance.maskNT[1].value;
		  break; 
		case 2:
		  maskPreses = Biocenosi.instance.maskNT[1];
		  maskIguals = Biocenosi.instance.maskNT[2];			
		  maskPredadors = Biocenosi.instance.maskNT[3];			
		  maskPresesOVeins = Biocenosi.instance.maskNT[1].value | Biocenosi.instance.maskNT[2].value;
		  break; 
		case 3:
		  maskPreses = Biocenosi.instance.maskNT[2];
		  maskIguals = Biocenosi.instance.maskNT[3];			
		  maskPredadors = 0;			
		  maskPresesOVeins = Biocenosi.instance.maskNT[2].value | Biocenosi.instance.maskNT[3].value;
		  break; 
		default:
		  Debug.Log("*** ERROR *** Radar.inicialitza. escala alimentaria= "+ev.dna.nivellTrofic);
		}
	}

	public function Scan() {	

		// nomes ho fem cada x frames per rendiment  <-- OJO)

		if (SimTime.simTime - lastRadarCheck > intervalRadarCheck) {
			lastRadarCheck = SimTime.simTime;
							
			// resseteja variables
			
			apropVei = null;
			apropPresa = null;  
			apropEnemic = null;
			
			// primer mirem si tenim un predador perque si ens persegueixen no cal mirar res mes
			
			RadarBuscaEnemic();
			
			// si no hi ha enemics (o no tinc visio directa) busco menjar i veins
			
			if (apropEnemic == null) {
				RadarBuscaPresaOVeins();
			}		
		}
 	}


	private function RadarBuscaEnemic() {
	
		// busca enemics en un radiVisio
		
		var hitColliders = Physics.OverlapSphere(ev.transform.position+Vector3.up*5, ev.dna.radiVisio, maskPredadors);
		if (hitColliders.Length > 0) {
			
			// si hi han enemics, els recorro i em quedo amb el primer que tingui visio directa 
			// ojo, no te per que ser el mes proper
			
			for (var k = 0; k < hitColliders.Length && apropEnemic == null; k++) {
				// l'objecte amb el component animal es el pare del collider
				var candidat = hitColliders[k].transform.parent;
				
				// check tinc visio directa
				// sumo una component y a les posicions perque si queden una mica per sota terra enganya
				if (ev.esticSeleccionat) {
					Debug.DrawLine(ev.transform.position, hitColliders[k].transform.position,Color.white);
				}
				if ( !Physics.Linecast(ev.transform.position+Vector3.up*5, hitColliders[k].transform.position+Vector3.up*5, Planeta.instance.maskLimits)) {
					apropEnemic = candidat.GetComponent(Animal);
					ev.Rajo("Radar. Detectat enemic "+ev.CreatureToString(apropEnemic)+" amb visio directa");			
					if (ev.esticSeleccionat) {
						Debug.DrawLine(ev.transform.position, hitColliders[k].transform.position,Color.red, 0.3f);
					}
				}
			}
		}
	}


	private function RadarBuscaPresaOVeins() {
	
		// get a list of prey nearby
		
		var hitColliders = Physics.OverlapSphere(ev.transform.position, ev.dna.radiVisioCurt, maskPreses);
		//ev.RajoMolt("RadarBuscaPresaOVeins: Preses en radiVisioCurt="+hitColliders.Length);
		if (hitColliders.Length == 0) {

			// if no prey nearby, get a list of prey or neighbours a bit farther (we'll find at least ourselves)
			
			hitColliders = Physics.OverlapSphere(ev.transform.position, ev.dna.radiVisio, maskPresesOVeins);
			//ev.RajoMolt("RadarBuscaPresaOVeins: Preses o veins en radiVisio="+hitColliders.Length);
		}

		// select a prey and a neighbour from the list		
		
		var n = hitColliders.Length;
		var jaHeTrobatPresa = false; 	// si trobem una presa a la mateixa alçada que nosaltres ja no busquem mes
		var j = Random.Range(0, n-1);	// we'll start from a diferent item in the list every time
										// because OverlapSphere doesn't return items in any particular 
										// order and everybody is finding the same prey 	
		for (var i = j; i < n+j && (jaHeTrobatPresa == false || apropVei ==null); i++) {
			var k=i%n; // resto
			
			// evVist es el Creature que estem avaluant
			var evVist = hitColliders[k].transform.parent.gameObject.GetComponent(Creature);			
			if (ev.esticSeleccionat) {
				Debug.DrawLine(ev.transform.position+Vector3.up*3, evVist.transform.position+Vector3.up*3,Color.white, 0.3f);
				//ev.Rajo ("Radar. Analitzant "+ev.CreatureToString(evVist));
			}

			//28/6: if (candidat.gameObject != this.gameObject) {  // no se perque de vegades es el mateix
			if (evVist != ev) {  // no se perque de vegades es el mateix

				// ojo, el collider esta a sota del esser viu
				biblio.Assert(evVist!=null, "Radar evVist es null i no hauria de ser-ho. evVist="+ev.CreatureToString(evVist));
				
				// segons si es vei o presa fem coses diferents
					
				switch(ev.dna.nivellTrofic - evVist.dna.nivellTrofic) {
				case 0:		// es un vei
					// <--- OJO nomes en troba un (i no te per que ser el mes aprop!!) 
					if (apropVei != null) {
						if (ev.dna.idGenus == evVist.dna.idGenus){
							// esta en linia de visio
							if (!Physics.Linecast(ev.transform.position+Vector3.up*5, evVist.transform.position+Vector3.up*5, Planeta.instance.maskLimits)) {
								apropVei = evVist;
								if (ev.esticSeleccionat) {
									Debug.DrawLine(ev.transform.position+Vector3.up*3, apropVei.transform.position+Vector3.up*3,Color.blue);
									//ev.Rajo ("Radar. Detectat vei "+ev.CreatureToString(apropVei)+ " en visio");
								}
							}
							else {
								//ev.Rajo ("Radar. Detectat vei "+ev.CreatureToString(evVist)+ " pero fora de visio");
							}
						}
					}
					break;
				case 1:		// es una presa
					if (!jaHeTrobatPresa) {
						if (ev.esticSeleccionat) {
								Debug.DrawLine(ev.transform.position, evVist.transform.position,Color.green);
						}
						
						// si encara no tinc una presa a la meva alçada avaluem aquest candidat
						// no ha de ser una presa que estigui en una posicio impossible (molt altes)
						// 			<-- OJO, Nomes recorda una presa impossible i n'hi poden haver mes!!
						if (!jaHeTrobatPresa 
							&& evVist != ev.presaImpossible
							&& evVist.dna.puntsDefensa < ev.dna.puntsAtac 
							&& evVist.dna.puntsDefensaChemical <= ev.dna.puntsAtacChemicalX ) {
							
							// he descobert una presa i esta en linia de visio. comprovem que no hi hagi obstacles pel mig
							if (!Physics.Linecast(ev.transform.position+Vector3.up*5, evVist.transform.position+Vector3.up*5, Planeta.instance.maskLimits)) {
							
								// si no tinc presa i en tinc una a l'abast l'agafo
								if (apropPresa == null ) { 
								
									// miro si per pendent hi puc arribar
									var distanciaProjectada = Vector2.Distance(Vector2(evVist.transform.position.x, evVist.transform.position.z), Vector2(ev.transform.position.x, ev.transform.position.z));
									if ((evVist.transform.position.y - ev.transform.position.y)/distanciaProjectada  <= ev.dna.pendentMaxim) {
										apropPresa = evVist;
										biblio.Assert(apropPresa!=null, "Animal.Radar. apropPresa==null! evVist.gameObject:"+evVist.gameObject);
										ev.presaImpossible = null;
										//ev.Rajo("Selecciono la presa "+ev.CreatureToString(evVist));									
									}
								}
								else {	
									//ev.Rajo("Presa en pendent massa alt: "+ev.CreatureToString(evVist));									
									// si en tinc, nomes l'agafo si esta mes abaix
									if (evVist.transform.position.y <= apropPresa.transform.position.y) {
										apropPresa = evVist;
										ev.presaImpossible = null;
										//ev.Rajo("Tenia una presa pero la canvio per aquesta que esta mes abaix "+evVist.gameObject);									
									}
								}
							}
							else {
								//ev.Rajo("Presa tenia algun obstacle pel mig");
							}

						}
						else {
								//ev.Rajo("Presa impossible: "+ev.CreatureToString(evVist)+" en "+evVist.transform.position+ " jaHeTrobatPresa="+jaHeTrobatPresa + " ev.presaImpossible="+ev.CreatureToString(ev.presaImpossible)+ " evVist.dna.puntsDefensa/Chem="+evVist.dna.puntsDefensa+"/"+evVist.dna.puntsDefensaChemical+"  ev.dna.puntsAtac/Chem="+ev.dna.puntsAtac+"/"+ev.dna.puntsAtacChemicalX);
						}
						
						// quan trobi una presa a la meva alçada ja no busco mes preses
						if (apropPresa != null && !jaHeTrobatPresa) {
							jaHeTrobatPresa = Mathf.Abs(1.0*apropPresa.transform.position.y - ev.transform.position.y) < pendentMaximPresa;
							// guardem la posicio de la ultima presa vista. si mai tinc gana pot ser que aqui n'hi hagi mes
							if (jaHeTrobatPresa) {
								// keep last home position if it is not close to the new one
								if (Vector3.Distance(ev.lastPresaPos1, apropPresa.transform.position) > evVist.dna.radiVisio * 3 ) {
									if (Vector3.Distance(ev.lastPresaPos2, ev.lastPresaPos1) > ev.dna.radiVisio * 3) {
										if (Vector3.Distance(ev.lastPresaPos3, ev.lastPresaPos2) > ev.dna.radiVisio * 3) {
											ev.lastPresaPos3 = evVist.lastPresaPos2;
										}
										ev.lastPresaPos2 = evVist.lastPresaPos1;
									}
									ev.lastPresaPos1 = apropPresa.transform.position;
								//ev.Rajo("Ultima presa vista a "+ev.lastPresaPos1	);
								}
								if (ev.esticSeleccionat) {
									//ev.Rajo("Confirmo la presa: "+apropPresa);
									Debug.DrawLine(ev.transform.position, apropPresa.transform.position,Color.green);
								}
							}
							else {
								//ev.Rajo("Descarto la presa per diferencia de posicio. Ella "+apropPresa.transform.position.y+" i jo "+ev.transform.position.y+ " diferencia > pendentMaximPresa="+pendentMaximPresa.ToString("F2"));
							}								
						}	
												
					/*  --- 3/7/15: crec que hi ha un else mal posat
						// quan trobi una presa a la meva alçada ja no busco mes preses
						if (apropPresa != null && !jaHeTrobatPresa) {
							jaHeTrobatPresa = Mathf.Abs(apropPresa.transform.position.y - ev.transform.position.y) < 10.0;
							// guardem la posicio de la ultima presa vista. si mai tinc gana pot ser que aqui n'hi hagi mes
							if (jaHeTrobatPresa) {
								ev.lastPresaPos1	 = apropPresa.transform.position;
								ev.Rajo("Ultima presa vista a "+ev.lastPresaPos1	);
							}	
							if (jaHeTrobatPresa && ev.esticSeleccionat) {
								ev.Rajo("Confirmo la presa: "+apropPresa);
								Debug.DrawLine(ev.transform.position, apropPresa.transform.position,Color.green);
							}
							else {
								ev.Rajo("Descarto la presa per diferencia de posicio. Ella "+apropPresa.transform.position.y+" i jo "+ev.transform.position.y+ " diferencia > 10");
							}
						}	
					*/
					}
					break;
				}
	
			}
		}

	}


}