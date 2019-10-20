#pragma strict


public class EspAnimalComu extends EspecieBase {

    public function ModificaAdn(adn: Dna): Dna {          // primer constructor no s'hereda 
  			
		var adn2 = adn;	
		
		return super.ModificaAdn(adn2);
	

	}

}	

