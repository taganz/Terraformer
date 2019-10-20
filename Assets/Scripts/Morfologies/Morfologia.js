#pragma strict

// Classe: Morfologia
//
//	InicialitzaComportaments    (ho crida Creature a l'inicialitzar-se)
//	PosaColorCos


// constants

private var framesGracietaMenjar : int = 10;	


// punter al Creature

protected var ev : Creature;

// cache parts del cos    

@HideInInspector public var transf: Transform;   
@HideInInspector protected var localScaleInicial: Vector3;   
@HideInInspector protected var localScaleAdult: Vector3;   
 
@HideInInspector public var theCua: Transform;
@HideInInspector public var theUllD : Transform;
@HideInInspector public var theUllE: Transform;
@HideInInspector public var theCap : Transform;
@HideInInspector public var theGrupCap : Transform;
@HideInInspector public var theOrellaD : Transform;
@HideInInspector public var theOrellaE : Transform;
@HideInInspector public var theNas : Transform;
@HideInInspector public var theMorro : Transform;
@HideInInspector public var theCos : Transform;
@HideInInspector public var thePota1 : Transform;
@HideInInspector public var thePota2 : Transform;
@HideInInspector public var thePota3 : Transform;
@HideInInspector public var thePota4 : Transform;

@HideInInspector var theCuaLocalScale: Vector3;			// guarda per modificar contra aixo i no acumular variacions
@HideInInspector var theUllDLocalScale : Vector3;
@HideInInspector var theUllELocalScale: Vector3;
@HideInInspector var theCapLocalScale : Vector3;
@HideInInspector var theOrellaDLocalScale : Vector3;
@HideInInspector var theOrellaELocalScale : Vector3;
@HideInInspector var theNasLocalScale : Vector3;
@HideInInspector var theMorroLocalScale : Vector3;
@HideInInspector var theCosLocalScale : Vector3;
@HideInInspector var thePota1LocalScale : Vector3;
@HideInInspector var thePota2LocalScale : Vector3;
@HideInInspector var thePota3LocalScale : Vector3;
@HideInInspector var thePota4LocalScale : Vector3;

@HideInInspector var theCosColor : Color;				// <-- aquests haurien d'estar en una classe per genere i ser estatics?

@HideInInspector var theGrupCapInitialRotation : Quaternion;

protected var g : Genome;			// shortcut

@HideInInspector var colorOrellaD : Color;
@HideInInspector var colorOrellaE : Color;

protected var jaEsBABY = false;
protected var jaEsAdult = false;
protected var esticInicialitzat = false;


//private var multPesMinim : float;

// 
//  Recupera els punters theCap, theCos, ... 
//	Si dna.morfoLocalScale esta a zero ho assiga al tamany del cos
//

function Inicialitza() {

	// recupera punters a Creature i a transfomr
	ev = this.gameObject.GetComponent(Creature);
	biblio.Assert(ev!=null, "Morfologia. ev==null "+this.gameObject);    
	transf = this.gameObject.transform;  	
	biblio.Assert(transf!=null, "Morfologia. transf==null "+this.gameObject);    
 	        
	// recupera les parts del cos
	SetTransform();

	// posa tamany segons dna. si es 0 agafa el valor per defecte del prefab/3
	// nomes a primera generacio, despres sempre estara informat
	if (ev.dna.generacio == 1) {
		ev.dna.morfoLocalScale.x = ev.dna.morfoLocalScale.x == 0 ? transf.localScale.x : ev.dna.morfoLocalScale.x;
		ev.dna.morfoLocalScale.y = ev.dna.morfoLocalScale.y == 0 ? transf.localScale.y : ev.dna.morfoLocalScale.y;
		ev.dna.morfoLocalScale.z = ev.dna.morfoLocalScale.z == 0 ? transf.localScale.z : ev.dna.morfoLocalScale.z;
	}
	
	// shorcut a genome
	g = ev.dna.genome;	
	
	esticInicialitzat = true;
	
	
}
 //


public function AjustaMorfologia() {
	//MorfologiaPes();
}



// gen 4 = gen del tamany modifica multLocalScale

public function MorfologiaPes(percentPes: float) {
   // <--- no caldria multiplicar cada cop!!
   transf.localScale = ev.dna.morfoLocalScale * ev.dna.multLocalScale * Mathf.Lerp(0.4, 1.0, percentPes);
 	
	// presuposa que el pivot del prefab esta a nivell de terra
	transform.position.y = Terrain.activeTerrain.SampleHeight(transform.position);

}

public function MorfologiaCadaver() {
	transform.Rotate(Vector3.forward*90);
	PosaColorCos("TOT", Color.gray);
	
}

private function SetTransform() {
	//transf = transform;

	
	theUllD = BuscaPart("ulld");
	if (theUllD == null) theUllD = BuscaPart("gCap/ulld");
	   theUllE= BuscaPart("ulle");
	if (theUllE == null) theUllE = BuscaPart("gCap/ulle");
	   theOrellaD = BuscaPart("orellad");
	if (theOrellaD == null) theOrellaD = BuscaPart("gCap/orellad");
		theOrellaE = BuscaPart("orellae");
	if (theOrellaE == null) theOrellaE = BuscaPart("gCap/orellae");

	
	theCap = BuscaPart("cap");
	theGrupCap = BuscaPart("gCap");
	if (theGrupCap!=null) {
		theGrupCapInitialRotation = theGrupCap.transform.localRotation;
	}
	theCua = BuscaPart("cua");
	theNas = BuscaPart("nas");
	theMorro = BuscaPart("morro");
	theCos = BuscaPart("cos");
	thePota1 = BuscaPart("pota1");
	thePota2 = BuscaPart("pota2");
	thePota3 = BuscaPart("pota3");
	thePota4 = BuscaPart("pota4");
	
	// el tamany es calcula nomes a la generacio 1 per a evitar acumulacions
	if (ev.dna.generacio == 1) {
		if (theOrellaE != null) colorOrellaE = theOrellaE.GetComponent.<Renderer>().material.color;
		if (theOrellaD != null) colorOrellaD = theOrellaD.GetComponent.<Renderer>().material.color;
		if (theCua!= null) 		theCuaLocalScale = theCua.localScale; 
		if (theUllD != null) 	theUllDLocalScale = theUllD.localScale;
		if (theUllE!= null) 	theUllELocalScale = theUllE.localScale;
		if (theCap != null) 	theCapLocalScale = theCap.localScale;
		if (theOrellaD != null) theOrellaDLocalScale = theOrellaD.localScale;
		if (theOrellaE != null) theOrellaELocalScale = theOrellaE.localScale;
		if (theNas != null) 	theNasLocalScale = theNas.localScale;
		if (theMorro != null) 	theMorroLocalScale = theMorro.localScale;
		if (theCos != null) 	theCosLocalScale = theCos.localScale;
		if (thePota1 != null) 	thePota1LocalScale = thePota1.localScale;
		if (thePota2 != null) 	thePota2LocalScale = thePota2.localScale;
		if (thePota3 != null) 	thePota3LocalScale = thePota3.localScale;
		if (thePota4 != null) 	thePota4LocalScale = thePota4.localScale;
	}
	
	// si no s'ha inicialitzat el color en adn, recupera color real del cos del prefab
	
	if (ev.dna.colorCos == Color.clear) {
		if (theCos != null) {
			theCosColor = theCos.GetComponent.<Renderer>().material.color; 
			//Debug.LogError(ev.dna.nomPantalla+" dna.color == clear, inicialitzo a real="+theCosColor);
		}
		else {
			theCosColor = Color.white;				// <--- ojo inicialitza aixo a saco
		}
	} 
	else {
		theCosColor = ev.dna.colorCos;
	}
	
	//if (theCap == null)
	//	Debug.Log("cap null "+this);
	//else
	//	Debug.Log("cap "+theCap.gameObject.name+ " "+this);
	//Debug.Log("cos "+theCos.gameObject.name+ " "+this);
	//Debug.Log("cap "+theCap.gameObject.name+ " "+this);
	
	
} 





public function PosaColorCos(partNom: String, color: Color) {
    var part : Transform;
    switch(partNom) {
    	case "orellad": part = theOrellaD; break;
    	case "orellae": part = theOrellaE; break;
    	case "ulld": part = theUllD; break;
    	case "ulle": part = theUllE; break;
    	case "cap": part = theCap; break;
		case "cua": part = theCua; break;
  		case "nas": part = theNas; break;
  		case "morro": part = theMorro; break;
  		case "cos": part = theCos; break;
  		case "pota1": part = thePota1; break;
  		case "pota2": part = thePota2; break;
  		case "pota3": part = thePota3; break;
  		case "pota4": part = thePota4; break;
  		case "potes": // cas especial perque n'hi ha 4
  					PosaColorCos("pota1", color);
  					PosaColorCos("pota2", color);
  					PosaColorCos("pota3", color);
  					PosaColorCos("pota4", color);
  					break;
  		//case "cos": part = theCos; break;
  		case "TOT" : 
  			PosaColorCos("orellad", color);
  			PosaColorCos("orellae", color);
  			PosaColorCos("ulld", color);
  			PosaColorCos("ulle", color);
  			PosaColorCos("cap", color);
  			PosaColorCos("cua", color);
 			PosaColorCos("cos", color);
  			PosaColorCos("nas", color);
  			PosaColorCos("morro", color);
  			PosaColorCos("potes", color);
  			break;
    	default:
    		part = null;
    		Debug.LogWarning("Morfologia.PosaColorCos partNom desconegut="+partNom);
     }
	
	
	if (part != null)  
		 part.GetComponent.<Renderer>().material.color = color;
		 

	//else
		//Debug.LogWarning("morfologia. posarcolorcos partNom="+part+ " part==null "+this.gameObject);
	
}

// fa PosaColorCos pero varia entre diferents colors de manera que 
//		gen=0 		--> color0
//		gen=genA	--> colorA
//		gen=genB	--> colorB
//		gen=9		--> color9;
// genMig1 es el gen al que te color2
// genMig2 					   

protected function PosaColorGradient(partCos: String, genNum: int, col0: Color, col9: Color) {
	var gen = g.genf[genNum];
	PosaColorCos(partCos, Color.Lerp(col0, col9, 1.0*gen/9));

}
protected function PosaColorGradient(partCos: String, genNum: int, genA: int, col0: Color, colA: Color, col9: Color) {
	
	var gen = g.genf[genNum];
	
	
	if (genA==0) {			// evitar divisio per zero
		PosaColorCos(partCos, col0);
	}
	else 
	if (gen <= genA) {
		// gen=0-> 0, gen=genA -> 1
		PosaColorCos(partCos, Color.Lerp(col0, colA, 1.0*gen/genA));
	}
	else {
		// gen=genA-> 0, gen=9 -> 1
		PosaColorCos(partCos,	Color.Lerp(colA, col9, 1.0* (gen-genA)/(9-genA)));		// si genA=9 no entrara aqui
	}
}


protected function PosaColorGradient(partCos: String, genNum: int, genA: int, genB: int, col0: Color, colA: Color, colB: Color, col9: Color) {
	
	// check for division by zero
	//if ((genB-genA-1)==0 || (genA-1)==0 || (9-genB-1)==0) {
	//	Debug.LogError("Morfologia.PosaColorGradient division by zero!  genA="+genA+" genB="+genB);
	//	return;
	//}
	
	var gen = g.genf[genNum];
	
	if (genA==0) {
		PosaColorCos(partCos, col0);
	}
	else if (gen <= genA) {
		// gen=0-> 0, gen=genA -> 1
		PosaColorCos(partCos, Color.Lerp(col0, colA, 1.0*gen/genA));
		//Debug.Log("partCos="+partCos+ " gen="+gen+" genA="+genA+" genB="+genB+" "+((gen/genA)));
	}
	else if (gen < genB) {
		// gen=genA -> 0, 	gen=genB -> 1
		PosaColorCos(partCos, Color.Lerp(colA, colB, 1.0*(gen-genA)/(genB-genA)));
		//Debug.Log("partCos="+partCos+ " gen="+gen+" genA="+genA+" genB="+genB+" "+((gen-genA)/(genB-genA)));
	}
	else {
		// gen=genB -> 0, 	gen=9 -> 1
		PosaColorCos(partCos, Color.Lerp(colB, col9, 1.0*(gen-genB)/(9-genB)));
		//Debug.Log("partCos="+partCos+ " gen="+gen+" genA="+genA+" genB="+genB+" "+((gen-genB)/(9-genB)));
	
	}
	

}

//private function FindInChildren(gameObject: GameObject, name: String): Transform {

private function BuscaPart(name: String): Transform {	
	for (var t: Component in this.gameObject.GetComponentsInChildren(Transform))
	//for (var t: Transform in transform)
	{
		//Debug.Log("t.gameObject.name="+t.gameObject.name+ " name="+name);
	    //if(t.gameObject.name == name)
	    if(t.gameObject.name == name)
	        return t.gameObject.transform;
	}

	return null;
}

// efecte de menjar periodic, cada frame
//	si te cap el puja i baixa
//	si no te cap gira el cos
private var framesMenjar = 0;
public function EfecteMenjar() {
	//var sentit = Time.frameCount%framesGracietaMenjar <framesGracietaMenjar/2 ? 1 : -1;
	// ARREGLAR QUE TORNIN A LA POSICIO INICIAL QUAN HAN MENJAT <------ 
	var sentit = (framesGracietaMenjar-framesMenjar++) > framesGracietaMenjar/2 ? 1 : -1;
	if (framesMenjar >= framesGracietaMenjar)
		framesMenjar = 0; 
	if (theGrupCap!=null) {
		theGrupCap.transform.Rotate(sentit * Vector3.right * Time.deltaTime * 300);	
	}
	else {
		transform.Rotate(sentit * Vector3.up * Time.deltaTime * 300);
	}
}

// deixa el cap com estava
public function EfecteMenjarFi() {
	if (theGrupCap != null) {
		 theGrupCap.transform.localRotation = theGrupCapInitialRotation;
	}
	framesMenjar = 0;
}


public function EfecteParir() {
	var sentit = Time.frameCount%framesGracietaMenjar <=framesGracietaMenjar/2 ? 1 : -1;
	transform.Rotate(sentit * Vector3.up * Time.deltaTime * 300);
}
