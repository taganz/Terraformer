#pragma strict

// genere = g_cilindre

var nom = "HerbaPocDensa";


public class HerbaPocDensa extends EspecieBase {

    public function ModificaAdn(adn: Dna): Dna {          // primer constructor no s'hereda 
  			
  		nomPantalla = nom;
  		
		var adn2 = adn;	
	
		adn2.reprodDistanceMin = 1;
		adn2.reprodDistanceMax = 20;
		adn2.reprodMaxNeighbours = 3;
		


		
		return super.ModificaAdn(adn2);

	}

}	
