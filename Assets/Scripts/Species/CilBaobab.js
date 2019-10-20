#pragma strict

var pesAdult = 6000;
var tamany : Vector3 = Vector3(4, 6, 4);
public class CilBaobab extends EspecieBase {

    public function ModificaAdn(adn: Dna): Dna {          // primer constructor no s'hereda 
  			
		var adn2 = adn;
		adn2.pesAdult = this.pesAdult;
		adn2.morfoLocalScale = this.tamany;
		adn2.edatMort = 55000;
		
		
		return super.ModificaAdn(adn2);
	

	}

}	
