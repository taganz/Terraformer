#pragma strict

class MorfDino extends MorfAnimalComu {


	static var colorGen : Color [];
	static var colorBase : Color;

	public function Inicialitza() {

		super.Inicialitza();
		//colorGen = new Color[10];
		//colorBase = Color.green;
		colorBase = theCos.GetComponent.<Renderer>().material.color;

		colorGen[0] = colorBase + 2* Color.grey;
		colorGen[1] = colorBase + 2* Color.green;
		colorGen[2] = colorBase + 2* Color.green;
		colorGen[3] = colorBase + 2* Color.gray;               // gen de l'alta muntanya
		colorGen[4] = colorBase + 2* Color.blue;
		colorGen[5] = colorBase + 2* Color.white;
		colorGen[6] = colorBase + 2* Color.red;
		colorGen[7] = colorBase + 2* Color.green;
		colorGen[8] = colorBase + 2* Color.blue;
		colorGen[9] = colorBase + 2* Color.red;

	}

	// quan neixen es fan petits i tornen a creixer de grans





	// ajusta
	//		transform.localScale += Vector3(1,0,0)
	// 		transform.localScale.x = n;



	public function AjustaMorfologia()		// hauria de ser un tipus especial per a saber quins components te
	{

		if (theUllD!= null) theUllD.GetComponent.<Renderer>().material.color = Color.Lerp(colorBase, colorGen[ev.dna.genome.gen[7]], 1.0*ev.dna.genome.gen[1]/5);
		if (theUllE!= null) theUllE.GetComponent.<Renderer>().material.color = Color.Lerp(colorBase, colorGen[ev.dna.genome.gen[8]], 1.0*ev.dna.genome.gen[2]/5);
		if (theCua!= null) theCua.GetComponent.<Renderer>().material.color = Color.Lerp(colorBase, colorGen[ev.dna.genome.gen[9]], 1.0*ev.dna.genome.gen[3]/5);
		if (theOrellaD!= null) theOrellaD.GetComponent.<Renderer>().material.color = Color.Lerp(colorBase, colorGen[ev.dna.genome.gen[5]], 1.0*ev.dna.genome.gen[4]/5);
		if (theOrellaE!= null) theOrellaE.GetComponent.<Renderer>().material.color = Color.Lerp(colorBase, colorGen[ev.dna.genome.gen[4]], 1.0*ev.dna.genome.gen[5]/5);
		if (theCap!= null) theCap.GetComponent.<Renderer>().material.color = Color.Lerp(colorBase, colorGen[ev.dna.genome.gen[3]],1.0* ev.dna.genome.gen[6]/5);
		if (theNas!= null) theNas.GetComponent.<Renderer>().material.color = Color.Lerp(colorBase, colorGen[ev.dna.genome.gen[2]], 1.0*ev.dna.genome.gen[7]/5);
		if (theCos!= null) theCos.GetComponent.<Renderer>().material.color = Color.Lerp(colorBase, colorGen[ev.dna.genome.gen[1]], 1.0*ev.dna.genome.gen[6]/5);

		

	    	 
		if (theUllD!= null) theUllD.localScale.y = ev.dna.genome.gen[2]/6; 
		if (theUllE!= null) theUllE.localScale.y = ev.dna.genome.gen[3]/6; 
		if (theOrellaD!= null) theOrellaD.localScale.y = ev.dna.genome.gen[4]/2; 
		if (theOrellaE!= null) theOrellaE.localScale.y = ev.dna.genome.gen[4]/2; 

		if (theCua!= null)      theCua.localScale.y    = Mathf.Lerp(1, 3, 1.0*ev.dna.genome.gen[1]/9);
		//if (theCos!= null)      theCos.localScale.y    = Mathf.Lerp(1, 1.5, ev.dna.genome.gen[6]/9);
		if (theCap!= null)      theCap.localScale.y    = Mathf.Lerp(1, 1.5, 1.0*ev.dna.genome.gen[7]/9);
		if (theNas!= null)      theNas.localScale.y    = Mathf.Lerp(1, 2, 1.0*ev.dna.genome.gen[8]/9);


		//MorfologiaPes();
	}
	
}