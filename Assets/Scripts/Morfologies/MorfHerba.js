#pragma strict

class MorfHerba extends MorfPlantaComu {

	

	public function AjustaMorfologia()          // hauria de ser un tipus especial per a saber quins components te
	{

						
		// color del cos depenent de adaptacio a temperatura 
			var colorPrincipal : Color;
			switch (g.gen[3]) {
			case 0:
			case 1:
			case 2:
//				colorPrincipal = Color.Lerp(Color.white, Color.gray+Color.green, 1.0*g.genf[3]/2);
				colorPrincipal = Color.Lerp(Color.white, theCosColor+Color.green, 1.0*g.genf[3]/2);
				break;
			case 3: 
			case 4:
			case 5:
			case 6:
//				colorPrincipal = Color.Lerp(Color.gray+Color.green, Color.yellow, 1.0*(g.genf[3]-3)/3);
				colorPrincipal = Color.Lerp(theCosColor+Color.green, theCosColor+Color.yellow, 1.0*(g.genf[3]-3)/3);
				break;
			case 7:
			case 8:
			case 9:
//				colorPrincipal = Color.Lerp(Color.gray+Color.yellow, Color.green, 1.0*(g.genf[3]-7)/2);
				colorPrincipal = Color.Lerp(theCosColor+Color.yellow, Color.green, 1.0*(g.genf[3]-7)/2);
				break;
			}
		
		// color fulles
	
		PosaColorCos("ulld", colorPrincipal);			
//		PosaColorCos("ulle", colorPrincipal);			
		PosaColorCos("orellad", colorPrincipal);			
//		PosaColorCos("orellae", colorPrincipal);	
//		PosaColorCos("ulld", colorPrincipal + Color.green);			
//		PosaColorCos("ulle", colorPrincipal + Color.green);			
//		PosaColorCos("orellad", colorPrincipal + Color.green);			
//		PosaColorCos("orellae", colorPrincipal + Color.green);	
		if (ev.dna.colorCos == Color.clear) {			
//			PosaColorCos("cos", colorPrincipal + Color.gray);		
			PosaColorCos("cos", colorPrincipal + Color.gray);		
			PosaColorCos("orellae", colorPrincipal);	
			PosaColorCos("ulle", colorPrincipal);			
		}
		else {	
			PosaColorCos("cos", ev.dna.colorCos);	
			PosaColorCos("orellae", ev.dna.colorCos);	
			PosaColorCos("ulle", ev.dna.colorCos);			
		}
		PosaColorCos("cap", colorPrincipal + Color.white);			
		PosaColorCos("nas", colorPrincipal + Color.green);			
		PosaColorCos("cua", colorPrincipal + Color.blue);
		
		
		//MorfologiaPes();
	}
	
	
}




