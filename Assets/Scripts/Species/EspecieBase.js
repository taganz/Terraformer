#pragma strict

// faig aquesta per a poder trobar les altres per GetType

var genomeBase = "";			// si el genome esta informat, les altres no apliquen

var nomPantalla = "";
var comment = "";
var pesAdultBase = -1;
var tamanyBase : Vector3 = Vector3(0, 0, 0);
var tempOptimaBase = -1;
var reprodProb = -1;
var reproduccioRapida = false;
var noEscamparse = false;
var reprodMaxNeighbours = -1;
var radiParirMinMax : Vector2 = Vector2(0,0);
var edatMort = -1;
var reprodInterval = -1; 

public class EspecieBase extends MonoBehaviour {

 	public function ModificaAdn(adn: Dna): Dna {  
		var adn3 : Dna;
		adn3 = adn;
		
		if (genomeBase != "") {
		
			adn3.UpdateGenome(genomeBase);
		
		}
		else {
			
			if (nomPantalla != "")
				adn3.nomPantalla = nomPantalla;
				
			if (reprodProb != -1)
				adn3.reprodProb = reprodProb;
				
			if (tempOptimaBase > -1)
				adn3.tempOptima = tempOptimaBase;
			
			if (pesAdultBase>-1) 
				adn3.pesAdult = pesAdultBase;
			
			if (tamanyBase != Vector3(0,0,0))
				adn3.morfoLocalScale = tamanyBase;
				
			if (reproduccioRapida) {
				adn3.edatAdult /= 10;
				//adn3.edatMort /= 10;
				adn3.reprodProb *= 10;
				adn3.reprodInterval /= 10;	
	 		}
 		
	 		if (noEscamparse)
	 			adn3.reprodExpandProb = 0;
	 		
	 		if (radiParirMinMax != Vector2(0,0)) {
	 			biblio.Assert(radiParirMinMax.x < radiParirMinMax.y, "Especies Base error radiParirMinMax");
	 			adn3.reprodDistanceMin = radiParirMinMax.x;
	 			adn3.reprodDistanceMax = radiParirMinMax.y;
	 		}
	 		
	 		if (reprodMaxNeighbours >-1) 
	 			adn3.reprodMaxNeighbours = reprodMaxNeighbours;
	 			
	 			
			if (edatMort>-1) 
				adn3.edatMort = edatMort;
				
			if (reprodInterval>-1) 
				adn3.reprodInterval = reprodInterval;
	
		}
				
		//adn3.DuplicaEnDefs();
		adn3.SetGenomeFromVars();
 		return adn3;
  	}

}


