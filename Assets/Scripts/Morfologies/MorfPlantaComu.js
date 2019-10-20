#pragma strict

class MorfPlantaComu extends Morfologia {

	// InicialitzaComportaments
	// MorfologiaBABY
	// MorfologiaAdult(percentPes)
	// MorfologiaCadaver
	// AjustaMorfologia

	
	static var colorGen : Color [];
	static var colorCalid : Color [];
	//protected var colorGen : Color [];
	//protected var colorCalid : Color [];


	function Awake() {
	
		// la idea es poder fer servir un gen com a index per tenir colors diferents (o la suma de dos gens...)
		colorGen = new Color[10];
		
		colorGen[0] = Color.green + 2* Color.grey;
		colorGen[1] = Color.green + 2* Color.yellow;
		colorGen[2] = Color.green + 2* Color.yellow;
		colorGen[3] = Color.green + 2* Color.gray;               // gen de l'alta muntanya
		colorGen[4] = Color.green + 2* Color.blue;
		colorGen[5] = Color.green + 2* Color.white;
		colorGen[6] = Color.green + 2* Color.red;
		colorGen[7] = Color.green + 2* Color.yellow;
		colorGen[8] = Color.green + 2* Color.blue;
		colorGen[9] = Color.green + 2* Color.red;

		colorCalid = new Color[10];
		
		colorCalid[0] = Color.yellow;
		colorCalid[1] = 2* Color.yellow;
		colorCalid[2] = Color.yellow;
		colorCalid[3] = Color.blue;               // gen de l'alta muntanya
		colorCalid[4] = 2* Color.blue;
		colorCalid[5] = 2* Color.blue;
		colorCalid[6] = Color.blue;
		colorCalid[7] = Color.red;
		colorCalid[8] = 2* Color.red;
		colorCalid[9] = Color.red;
	
	}




	public function MorfologiaCadaver() {
		transform.Rotate(Vector3.forward*30);
		PosaColorCos("TOT", Color.gray);
		
	}



	public function AjustaMorfologia()          // hauria de ser un tipus especial per a saber quins components te
	{

		PosaColorCos("ulld", Color.Lerp(Color.green, colorGen[ev.dna.genome.genf[7]], 1.0*ev.dna.genome.genf[1]/5));
		PosaColorCos("ulle", Color.Lerp(Color.green, colorGen[ev.dna.genome.genf[8]], 1.0*ev.dna.genome.genf[2]/5));
		PosaColorCos("cua", Color.Lerp(Color.green, colorGen[ev.dna.genome.genf[9]], 1.0*ev.dna.genome.genf[3]/5));
		PosaColorCos("orellad", Color.Lerp(Color.green, colorGen[ev.dna.genome.genf[5]], 1.0*ev.dna.genome.genf[4]/5));
		PosaColorCos("orellae", Color.Lerp(Color.green, colorGen[ev.dna.genome.genf[4]], 1.0*ev.dna.genome.genf[5]/5));
		PosaColorCos("cap", Color.Lerp(Color.green, colorGen[ev.dna.genome.genf[3]], 1.0*ev.dna.genome.genf[6]/5));
		PosaColorCos("nas", Color.Lerp(Color.green, colorGen[ev.dna.genome.genf[2]], 1.0*ev.dna.genome.genf[7]/5));
		
		if (ev.dna.colorCos == Color.clear) {
			PosaColorCos("cos", Color.Lerp(Color.green, colorGen[ev.dna.genome.genf[1]], 1.0*ev.dna.genome.genf[6]/5));
		}
		else {
			PosaColorCos("cos", ev.dna.colorCos);
		}
		if (theUllD!= null)      theUllD.localScale.y    = Mathf.Lerp(1, theUllDLocalScale.y*2, 1.0*ev.dna.genome.genf[2]/9);
		if (theUllE!= null)      theUllE.localScale.y    = Mathf.Lerp(1, theUllELocalScale.y*2, 1.0*ev.dna.genome.genf[3]/9);
		if (theCap!= null)       theCap.localScale.y     = Mathf.Lerp(1, theCapLocalScale.y*1.2, 1.0*ev.dna.genome.genf[3]/9);
		if (theCap!= null)       theCap.localScale.x     = Mathf.Lerp(1, theCapLocalScale.x*3, 1.0*ev.dna.genome.genf[4]/9);
		if (theCap!= null)       theCap.localScale.z     = Mathf.Lerp(1, theCapLocalScale.z*3, 1.0*ev.dna.genome.genf[5]/9);
		if (theOrellaD!= null)   theOrellaD.localScale.y = Mathf.Lerp(1, theOrellaDLocalScale.y*2, 1.0*ev.dna.genome.genf[5]/9);
		if (theOrellaE!= null)   theOrellaE.localScale.y = Mathf.Lerp(1, theOrellaELocalScale.y*2, 1.0*ev.dna.genome.genf[6]/9);
		if (theCua!= null)       theCua.localScale.y     = Mathf.Lerp(1, theCuaLocalScale.y*2, 1.0*ev.dna.genome.genf[7]/9);
		if (theNas!= null)       theNas.localScale.y     = Mathf.Lerp(1, theNasLocalScale.y*2, 1.0*ev.dna.genome.genf[8]/9);
		if (theCos!= null)       theCos.localScale.y     = Mathf.Lerp(1, theCosLocalScale.y*2, 1.0*ev.dna.genome.genf[9]/9);

		//MorfologiaPes();
	}
	
}