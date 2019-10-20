#pragma strict

// genere = g_cilindre

var genome = "00-5830-5000";
//var pesAdult = 1000;
//var tamany : Vector3 = Vector3(2, 7, 2);
//var tempOptima = 25;


public class EspArbre extends EspecieBase {

    public function ModificaAdn(adn: Dna): Dna {         
  			
		var adn2 = adn;	
		adn2.UpdateGenome(genome);
		//adn2.toleranciaTemp = 3;
		//adn2.tempOptima = tempOptima;
		//adn2.pesAdult = pesAdult;
		//adn2.morfoLocalScale = tamany;


		
		return super.ModificaAdn(adn2);

	}

}	
