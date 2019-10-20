#pragma strict

/*
 * Metabolisme es la classe que gestiona energia, pes i salut dels EssersVius
 *
 *	energia
 *		- 0 a 100
 *		- baixa si no consumeixes la que necessites al dia (consumDiariEnergia) - tassa metabolica
 *			- baixa a un ritme tal que si no menges res mors en dna.metTempsMortGana
 *			- si ets BABY no baixa
 *		- puja si mossegues
 *		- si energia == 0 mors de gana, fred o calor
 *
 *	pes
 *		- puja si energia esta a 100?
 *		- baixa si energia < energiaGana
 *		- baixa si et mosseguen i ets una planta o si ets un animal mort
 *		- si pes < pesMinim mors de gana
 *
 *	salut
 *		- puja si energia = 100?
 *		- baixa si et mosseguen i ets un animal
 *		- si salut == 0 et morts per atac
 *
 *	edat
 *
 *   FesUpdate()
 *		- incrementa edat
 *		- animals tenen necessitats energia: dna.metEnergiaDiaria
 *		- si en un interval no han arribat a les necessitats, l'energia baixa de forma
 *		  tal que es moririen en dna.metTempsMortGana
 *		- els BABYs no consumeixen energia
 *
 *	 RebreMossegada()
 *		- quan et mosseguen et baixen el pes si ets una planta o un animal mort
 *		- et baixen la salut si ets un animal viu
 *
 *   FerMossegada()
 *		- cada mossegada es transforma en energia segons dna.metEficDigestio
 *		- s'acumula el que menges en cada interval
 *
 */
 

public class Metabolisme {

	// les vars publiques son read-only

	var energia : float;	// 0 - 100
	var salut : float;		// 0 - 100
	var pes : float;		// 0 - pesAdult
	var edat : float;
	
	var mort : boolean;
	var raoMort : String;
	
	var tempOk : boolean;
	var tempNoOkFred : boolean;
	
	var consumDiariEnergia : float;	
	
	// constants a revisar  (<--- I A POSAR A DNA??)
	static var energiaGana : int = 50;		// per sota el Creature te molta gana 
	static var energiaFart : int = 70;		// quan baixen per sota comencen a menjar
	static var energiaATope : int = 90;		// quan pugen per sobre deixen de menjar
	
	private var me : Creature;		// punter a la classe Creature que la crida
	private var dna : Dna;		// punter a l'adn de l'Creature que la crida
	private	var pesFart : float;
	private var pesHisteresiFart : int;
	private	var lastPes : float;				
	//private 	var esticFart = false;
	//private 	var tincGana = false;  // animals
	private var pesMinim : float;
	private	var perduaPesDia : float;
	private var incrementPes : float;
	private var energiaAcumuladaInterval : float;
	private var lastSimTimeConsum : float;
	private var simTimeBorn : float;


	public function Metabolisme(myCreature: Creature) {

		me = myCreature;
		dna = me.dna;
		
		energia = dna.metEnergyAtBirth;				// usually 100
		salut = 100;
		edat = 0;
		simTimeBorn = SimTime.simTime;
		mort = false;
		raoMort = "";
		
		
		pesFart = dna.pesAdult * dna.multPesFart;
		pesHisteresiFart = dna.pesAdult * dna.histeresiFart;
		pesMinim = dna.pesAdult * dna.multPesMinim;
		pes = pesMinim * 1.1;				// els BABYs pesen una mica mes del pes minim
		lastPes = pes;
		
		perduaPesDia = (dna.pesAdult - pesMinim) / dna.metTempsMortGana;	// perdua de pes tal que es mor en metTempsMortGana	    	
		tempOk = true;
		
		// aproxim consum d'energia segons formula de pes, de moment igual per tothom
		//consumDiariEnergia = 0.05 * Mathf.Pow(dna.pesAdult, 3/4);
		consumDiariEnergia = dna.metabRate * Mathf.Pow(dna.pesAdult, 3/4);
		
		lastSimTimeConsum = SimTime.simTime;	// per calcular interval passat des d'ultim calcul de consum d'energia
	
		energiaAcumuladaInterval = 0;
		
		// <---- REVISAR AIXO:
		incrementPes = (dna.pesAdult-pes)/dna.edatAdult;	// increment pes cada frame per arribat a pes adult en edat adult
   		
	}

		
	// de moment el consum d'energia depen de la temperatura
	// <-- pendent de fer que depengui de metabolic rate
	// energia esta entre 0 - energiaGana - energiaFart - 100
	// - si energia < energiaGana crida PesBaixa()
	//			
	// tempsInterval: temps des de la ultima vegada que el van cridar  <-- HO PODRIA GUARDAR ELL
	// temperaturaAmbient: temperatura en la posicio del Creature

	public function FesUpdate(temperaturaAmbient:float) {
		
		// incrementem edat i mirem si morim de vells
		
		edat = SimTime.simTime - simTimeBorn;
		if (edat > dna.edatMort) {
			mort = true;
			raoMort = "OLD";
		}
		else {
		
			// si encara estem vius i som adults consumim energia i mirem si morim de gana, etc.
			// <--- ojo, no es moriran de calor ni de fred!!!
			if (me.estat!=CreatureStatus.BABY) {
				ConsumEnergia(temperaturaAmbient);
			}
		}
	}
	
	private function ConsumEnergia(temperaturaAmbient: float) {
	
		// hi ha casos especials que no consumeixen energia 
		//	- herbivors sempre farts		
		
		//if ((me.estat==CreatureStatus.BABY) || (dna.nivellTrofic == 1 && Biocenosi.instance.herbivorsSempreFarts)) {
		if (dna.nivellTrofic == 1 && Biocenosi.instance.herbivorsSempreFarts) {
			energia = 100;
		}
		else {			
	
			// quan temps ha passat des d'ultim calcul de consum d'energia
			
			var tempsInterval = SimTime.simTime - lastSimTimeConsum;
			lastSimTimeConsum = SimTime.simTime;	
			
			// calculem si l'energia ens ha variat
			
			// energia que hem conseguit aquest interval
			var deficitEnergia : float;   // indicador 0 - 1
			if (dna.nivellTrofic == 0) {
				// les plantes necessiten aigua
				// <--- REVISAR
				deficitEnergia = me.biotop.precipitacions > dna.precipitacionsNecessaries ? 0.0 : 1.0*(dna.precipitacionsNecessaries - me.biotop.precipitacions)/dna.precipitacionsNecessaries;
				//me.Rajo("me.biotop.precipitacions="+me.biotop.precipitacions+" dna.precipitacionsNecessaries="+dna.precipitacionsNecessaries+" deficitEnergia="+deficitEnergia);
			}
			else {
				// els animals han d'haver menjat
				deficitEnergia = 1 - energiaAcumuladaInterval / (consumDiariEnergia * tempsInterval);
			}
				
			// variacio de l'energia es calcula de forma que si no conseguieixo energia em mori en dna.metTempsMortGana
			//		si deficit energia = 0, mor en dna.metTempsMortGana
			//		si deficit energia = 0.5, mor en 2 * metTempsMort Gana
			//		etc.
			var variacioEnergia =  - 100 * deficitEnergia / dna.metTempsMortGana;
			energia += variacioEnergia * tempsInterval;	
			// si esta menjant recupera energia
			energia += (energia < 100 && deficitEnergia < 0.01 ? 5 : 0);		// <--- REVISAR 5, es arbitrari
			// energia esta entre 0 i 100
			energia = energia > 100 ? 100 : energia;
			
			//me.Rajo("metab.tempsInterval="+tempsInterval+" energia="+energia+" deficitEnergia="+deficitEnergia+" variacio energia="+variacioEnergia);
			//me.Rajo("SimTime.simTime="+SimTime.simTime+" lastSimTimeConsum="+lastSimTimeConsum);		
			//if (energiaAcumuladaInterval>0) {
			//	me.Rajo("ConsumEnergia: energiaAcumuladaInterval="+energiaAcumuladaInterval.ToString("F3")+" deficitEnergia="+deficitEnergia.ToString("F3")+ " variacioEnergia="+variacioEnergia.ToString("F3")+ " energia="+energia.ToString("F3")+" tempsInterval="+tempsInterval.ToString("F1");
			//}
			
		/*		
			// <--- ENCARA FALTA AFEGIR EFECTE TEMPERATURA
			// <--- ENCARA FALTA AFEGIR EFECTE TEMPERATURA
			// <--- ENCARA FALTA AFEGIR EFECTE TEMPERATURA
			
			
			// <--- OJO, TAL COM ESTA ARA, NI ELS BABY NI ELS HERBIVORS SEMPRE FARTS ES MORIRAN DE FRED O DE CALOR!!!
								
			var deltaTemp = Mathf.Abs(temperaturaAmbient - dna.tempOptima); 
			if (deltaTemp > dna.toleranciaTemp) {

				// per cada grau de diferencia de temperatura baixa .1 d'energia
				energia -= Mathf.Lerp(0, 1, (deltaTemp-dna.toleranciaTemp)/10);
				tempOk = false;
				tempNoOkFred = temperaturaAmbient < dna.tempOptima;  // si !tempOk i !tincFred, tinc calor
				
			}
			else {
				tempOk = true;
			}
		}
*/

		// si ens quedem sense energia ens morim
				
		if (energia <= 0) {
			mort = true;
			raoMort = "STARVE";				// <-- REVISAR
		}
		else {

			// si l'energia baixa per sota un limit comença a perdre pes. si baixa massa es mort
			
			if (energia < energiaGana) {
				pes -= perduaPesDia*tempsInterval;
				if (pes < pesMinim) {
					mort = true;
					if (tempOk) {
						raoMort = "STARVE";
					}
					else {
						if (tempNoOkFred) {
							raoMort = "COLD";
						}
						else {
							raoMort = "HOT";
						}
					}
				}
			}
			else {
				
				// si no te gana i esta per sota pesAdult incrementa pes
				
				if (pes < dna.pesAdult) {
					pes += perduaPesDia;
				}
				
			}
		}
		
		energiaAcumuladaInterval = 0;
		}
	}


	// Els atacs afecten la salut i el pes
	// - A plantes: disminueix el pes
	// - A animals: disminueix la salut fins que es moren, despres disminueix el pes
	// 
	// Return: pes que s'ha menjat l'atacant
	 
	public function RebreMossegada(atacant: Creature): float {
	
		var mossegadaReal : float = 0;

		// als animals vius els disminueix la salut pero fins que no moren no perden pes
		
		if (dna.nivellTrofic > 0 && salut > 0) {
		
			salut -= (atacant.dna.puntsAtac - dna.puntsDefensa);
			if (salut <= 0) {
				salut = 0;
				mort = true;
				raoMort = "PREY";
			}
			
		}
	
		// a les plantes o als animals mort els disminueix el pes
		
		if (dna.nivellTrofic == 0 || salut <=0 ) {
		
			// queda carn per mossegar del tot?
			var mossegadaAtacant : float = atacant.dna.pesAdult * atacant.dna.multMossegada;
			mossegadaReal = pes > mossegadaAtacant ? mossegadaAtacant : pes;
			
			// mosseguem
			pes -= mossegadaReal;
			if (pes <0) {
				pes = 0;
			}
	
			if (dna.nivellTrofic == 0 && pes < pesMinim) {
				salut = 0;
				mort = true;
				raoMort = "PREY";
			}
		}
	
		//me.Rajo("Metabolisme.Rebre mossegada "+me.CreatureToString(ev)+" em mosseguen. MossegadaReal="+mossegadaReal.ToString("F2")+" i em queda pes="+me.metab.pes);
		return mossegadaReal;
	}
	
	// mossegada son kg
	public function FerMossegada(mossegada: float) {
	
		energiaAcumuladaInterval += mossegada * dna.metEficDigestio;
		//me.Rajo("FerMossegada: energiaAcumuladaInterval="+energiaAcumuladaInterval.ToString("F1")+" mossegada="+mossegada.ToString("F1")+ " mossegada * dna.metEficDigestio="+(mossegada * dna.metEficDigestio));
	
	}
	
	// <-- eliminar?   -- haurien d'anar creixent mica a mica?
	// fer servir aixo?? 
	//    	incrementPes = (dna.pesAdult-pes)/dna.edatAdult;	// increment pes cada frame per arribat a pes adult en edat adult
   	
	public function SocAdult() {
		pes = dna.pesAdult * 0.75;
	}
	
	public function tincGana(): boolean {
		return energia < energiaGana;
	}
	
	public function esticFart(): boolean {
		return (energia > energiaFart || (dna.nivellTrofic == 1 && Biocenosi.instance.herbivorsSempreFarts));
	}
	
	// mengen fins que arriben aqui. despres tornen a menjar quan arriben a energiaFart
	public function esticATope(): boolean {
		return energia > energiaATope;
	}

}