#pragma strict

class MorfAnimalComu extends Morfologia {

	public function AjustaMorfologia()		// hauria de ser un tipus especial per a saber quins components te
	{
	
		//PosaColorCos("cos", ev.dna.colorCos);
		PosaColorCos("cos", theCosColor);
	
		// gen 2 (adaptacio) - canvia tamany ulls
		
		   
		if (theUllD!= null) theUllD.localScale.x 		= theUllDLocalScale.x * Mathf.Lerp(0.8, 1.5, 1.0* ev.dna.genome.gen[3]/9);
		if (theUllD!= null) theUllD.localScale.y 		= theUllDLocalScale.y * Mathf.Lerp(0.8, 1.5, 1.0* ev.dna.genome.gen[2]/9);
		if (theUllE!= null) theUllE.localScale.x		= theUllELocalScale.x * Mathf.Lerp(0.8, 1.5, 1.0* ev.dna.genome.gen[2]/9);
		if (theUllE!= null) theUllE.localScale.y		= theUllELocalScale.y * Mathf.Lerp(0.8, 1.5, 1.0* ev.dna.genome.gen[3]/9);

	
		// gen 3 (temperatura) - canvia color cos de blanc - gray - blue - yellow
				
		// 4 colors -- PosaColorGradient("cos", g.genf[3], Color.white, Color.gray, Color.blue,Color.yellow);
		// prova -- PosaColorGradient("cos", g.genf[3], Color.white, theCosColor+Color.white, theCosColor, theCosColor * 2 + Color.yellow);
		//PosaColorGradient("cos", g.genf[3], 8, theCosColor+Color.white, theCosColor, theCosColor+Color.yellow);
		
		// gen 4 (size) - el tracta morfologia
	
		// gen 5 (TBD) - canvia tamany orelles	
	
		if (theOrellaD!= null) theOrellaD.localScale 	= theOrellaDLocalScale * Mathf.Lerp(1, 2, 1.0* ev.dna.genome.gen[5]/9);
		if (theOrellaE!= null) theOrellaE.localScale 	= theOrellaELocalScale * Mathf.Lerp(1, 2, 1.0* ev.dna.genome.gen[5]/9);



		// gen 6 (reprod strategy) - li canvia la z dels ulls
				
		if (theUllD!= null) theUllD.localScale.z 		= theUllDLocalScale.z * Mathf.Lerp(0.8, 1.5, 1.0* ev.dna.genome.gen[6]/9);
		if (theUllE!= null) theUllE.localScale.z		= theUllELocalScale.z * Mathf.Lerp(0.8, 1.5, 1.0* ev.dna.genome.gen[6]/9);
		
		
		// gen 7 (speed) - color cames de blanc a vermell
		
		PosaColorCos("potes", Color.Lerp(Color.gray, Color.red, g.genf[7] / 9.0));		
			
					
		// gen 8 (strength) - allarga cua i posa morro de blanc a vermell
	    	 
		PosaColorCos("morro", Color.Lerp(Color.gray, Color.red, g.genf[8] / 9.0));		
    	 
		if (theCua!= null)  {
		    theCua.localScale.y    = theCuaLocalScale.y * Mathf.Lerp(1, 2, 1.0* ev.dna.genome.gen[8]/9);
    	} 
    	
    	
	
		// gen 9 (social) - canvia color del cap
		
		PosaColorGradient("cua", g.genf[9], 2, 7, Color.red, Color.blue, Color.green,Color.yellow);
		    	
		
	}
	
	
	
	
	
}
