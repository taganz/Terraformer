#pragma strict


public class LlopVistaLlarga extends EspecieBase {

    public function ModificaAdn(adn: Dna): Dna {          // primer constructor no s'hereda 
  			
		var adn2 = adn;	
		adn2.pesAdult = 150;
		adn2.puntsAtac = 170;
		adn2.puntsDefensa = 170;
		adn2.edatMort = 15000;
		adn2.multPesFart = 1.1;
		adn2.radiVisio = 100;
		
		//adn2.DuplicaEnDefs();
		adn2.SetGenomeFromVars();
		
		return adn2;
	

	}

}	

