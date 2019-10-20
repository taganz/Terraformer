#pragma strict

public class OvellaMuntanya extends EspecieBase {

    public function ModificaAdn(adn: Dna): Dna {          // primer constructor no s'hereda 
  			
		var adn2 = adn;	
		adn2.tempOptima = 9;
		adn2.toleranciaTemp = 5;
		
		//adn2.DuplicaEnDefs();
		adn2.SetGenomeFromVars();
		return adn2;
	

	}

}	

