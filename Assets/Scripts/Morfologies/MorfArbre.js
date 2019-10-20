#pragma strict

class MorfArbre extends MorfPlantaComu {

	// Els avets son verds a una T aprox 20º

/*
	public function Inicialitza() {
		super.Inicialitza();
		//biblio.Assert(theCap!=null, "MorfAvet no te theCap");
		//Debug.Log("MorfAvet  inicialitza un altre avet genome:"+g);
		//Debug.Log("morfavet. gen2="+g.gen[2]+" colorCalid[1]="+colorCalid[1]+ " colorCalid[2]="+colorCalid[2]+" colorCalid[3]="+colorCalid[3]);
	}
*/	
	public function AjustaMorfologia()          // hauria de ser un tipus especial per a saber quins components te
	{


		
		

	
		// gen 2 

		CanviaFulla(theCua, theCuaLocalScale,			 g.genf[2], g.genf[7]+ g.genf[7], g.genf[7]+ g.genf[9]);
				
				
		// gen3 canvia color cap i cos
		
		if (ev.dna.colorCos == Color.clear) {
			PosaColorGradient("cos", 3, 2, 5, Color.white, Color.gray, Color.gray+Color.green, Color.yellow );
		}
		else {
			PosaColorCos("cos", ev.dna.colorCos);
		}
		//PosaColorGradient("cap", 3, 2, 5, Color.white, Color.gray+colorCalid[1], Color.green+colorCalid[2], 2*Color.green+colorCalid[3] );
		PosaColorGradient("cap", 3, 2, 5, Color.green+Color.white, Color.green+colorCalid[(g.genf[2]+1)%10], Color.green+colorCalid[(g.genf[2]+2)%10], 2*Color.green+colorCalid[(g.genf[2]+3)%10] );
		//PosaColorGradient("cap", gen[3], 2, 5, Color.white, Color.gray, Color.green, Color.yellow );
		
					// <--- PROVAR AMB COSES TIPUS... colorCalid[(1+gen2)%10]
					
		// gen 4 i 7
		
		PosaColorGradient("ulld", 4, Color.green, colorGen[g.genf[7]]);
		PosaColorGradient("orellad", 4, Color.green, colorGen[g.genf[5]]);
		
		CanviaFulla(theNas, theNasLocalScale,			 g.genf[4], g.genf[3]+ g.genf[6], g.genf[5]+ g.genf[4]);
		
		// gen 5 i 8		
		
		PosaColorGradient("ulle", 5, Color.green, colorGen[g.genf[8]]);
		CanviaFulla(theOrellaD, theOrellaDLocalScale,	 g.genf[5], g.genf[4]+ g.genf[7], g.genf[4]+ g.genf[8]);
	
		
		if (theCap!= null) {
				//Debug.Log("morfavet.ajustamorfologia: theCap.localScale="+theCap.localScale+ " theCapLocalScale="+theCapLocalScale);
		       	theCap.localScale.y = Mathf.Lerp(1, theCapLocalScale.y*(1+g.genf[6]/20+g.genf[8]/5), 	1.0*g.genf[5]/9);
		       	theCap.localScale.x = Mathf.Lerp(1, theCapLocalScale.x*(1+g.genf[7]/10+g.genf[8]/5), 	1.0*g.genf[5]/9);
		       	theCap.localScale.z = Mathf.Lerp(1, theCapLocalScale.z*(1+g.genf[3]/10)+g.genf[8]/5, 	1.0*g.genf[5]/9);
		}
	
				
					
			
		// gen 6 i 9	
		PosaColorGradient("cua", 6, Color.green, colorGen[g.genf[9]]);
		CanviaFulla(theOrellaE, theOrellaELocalScale,	 g.genf[6], g.genf[5]+ g.genf[8], g.genf[3]+ g.genf[7]);
		
		// gen 7 i 2
		
		PosaColorGradient("nas", 7, Color.green, colorGen[g.genf[2]]);
		
		// gen 8 (strength) afecta tamany del tronc 
		
		if (theCos!=null) {
			theCos.localScale.x = Mathf.Lerp(theCosLocalScale.x/2, theCosLocalScale.x*(2+g.genf[7]/9), 	1.0*g.genf[8]/9);
	       	theCos.localScale.z = Mathf.Lerp(theCosLocalScale.z/2, theCosLocalScale.z*(2+g.genf[9]/9), 	1.0*g.genf[8]/9);
		}
		
		// gen 9 i 4
				
		PosaColorGradient("orellae", 9, Color.green, colorGen[g.genf[4]]);
		
		
	}
	
	
	private function CanviaFulla(thePart: Transform, localScale: Vector3, gen1:int, gen2:int, gen3: int) {
		if (thePart!=null) {
			thePart.localScale.x = Mathf.Lerp(localScale.x/2, localScale.x*(2+gen2/9), 	1.0*gen1/9);
	       	thePart.localScale.z = Mathf.Lerp(localScale.z/2, localScale.z*(2+gen3/9), 	1.0*gen1/9);	       	
		}
	}
	
	
}




