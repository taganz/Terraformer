#pragma strict

/* les plantes son un tipus especial de esser viu
 * - no tenen cicle "update", van amb InvokeRepeating
 * - sempre estan en estat IDLE (fins que es moren, pero aixo ho gestiona Creature)
 */


 
public class Planta extends Creature
{

    // static var totalPlantes = 0;

     public function Planta() {
              
     }

     public function Inicialitzat(adnPare: Dna) {
      
		super.Inicialitzat(adnPare);
		if (!esticInicialitzat) {
			return;
		}

		estat = CreatureStatus.IDLE;      			 // nomes tenen aquest estat 
  		//totalPlantes ++;

		// les plantes no fan update() perque tenen poca logica
		 
		InvokeRepeating("FesUpdate", Random.value/0.3, 1);	// <--- *** AJUSTAR ELS INTERVALS ***

     }


	

      public function FesUpdate() {
		
		if (esticEnPause) {
			return;
		}
		

		//var estatAnterior = estat;

		// proces comu Creature - equivalent a super.update()
		FesUpdateCreature();		


          switch(estat) {

			// en IDLE l'unic que ha de fer es parir si li toca          
			case CreatureStatus.IDLE:

               // li toca parir?
               // <--- Aquests haurien d'estar en lerps?
 //              if (totalPlantes < Biocenosi.instance.maxPlantes
 //              		 && biotop.precipitacions > dna.precipitacionsNecessaries
               	  if (biotop.precipitacions > dna.precipitacionsNecessaries
               		 && metab.edat > dna.edatAdult
               		 && tempsDesDeParir > dna.reprodInterval
               	   ) {
               	   // la probabilitat es pot multiplicar per 30 com a maxim
               	   // 
               	   // <-- FER QUE LA PROB BAIXI SI ESTIC AL LIMIT DE CAPACITAT. LO DE L'AIGUA NO SE SI VAL LA PENA 
               	   //
               	   if (SimTime.simTime - lastParirCheck > intervalParirCheck) {
               	   	lastParirCheck = SimTime.simTime;
                    if (Random.value < dna.reprodProb * Mathf.Lerp(1, 30, 1.0*(biotop.precipitacions-dna.precipitacionsNecessaries)/100) ) {
						Rajo("Vaig a parir");
						Parir();
                    }
                   }
               }
               break;
    		// estat especial on FesUpdateCreature el fa girar           
            case CreatureStatus.LABORATORI:
            	break;
    		// si esta per sota pesMinim es morira en super.Update i tornara com Cadaver
			case CreatureStatus.WRECK: 	
				// no podem cancelar l'invoke perque el destroy esta a Creature
				//if (estatAnterior!=CreatureStatus.WRECK)		
				//	CancelInvoke();
				break;
			case CreatureStatus.ATTACKED:
			//case CreatureStatus.PENDINGTERMINATE: 	;
			case CreatureStatus.BABY:				;
			case CreatureStatus.PENDING_BIRTH:		;
			default:
               Debug.Log(meuId+ "*** ERROR *** Update. Estat desconegut: "+estat);
          }
    
	
     }

/*
    public function OnDestroy(){
    	super.OnDestroy();
    	if (esticInicialitzat) {
	        //totalPlantes --;
	        // faltaria treure la seleccio com fem a animal?
	    }
    
     }

*/

	 // <---- faltaria treure la seleccio com fem a animal?
	 // <---- faltaria treure la seleccio com fem a animal?




}

