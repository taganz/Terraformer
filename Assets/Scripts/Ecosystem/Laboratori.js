#pragma strict
static var instance : Laboratori;

// Especies que porto a la nau i que puc enviar a l'ecosistema

//var ousNumEspecies = 4;

// especies alien en aquesta pantalla

var ousNomEspecie = ["g_alien0", "g_alien1", "g_alien2", "g_alien3"];  // biocenosi 
var ousQuantitat = [100, 30, 20, 10];  // els "ous" que porto a la nau		
var ousInfinits = false;				// els ous no s'acaben mai		
				

var ousGenome : Genome[];				// aixo esta pensat per poder forçar el genome
				// <--- FALTARIA QUE ES PUGUES POSAR EL GENOMA DES DE L'INSPECTOR I 
				// DESPRES FORÇAR-LO EN GENERESNIVELL !!
//var ousUltimAdn : Dna[] = new Dna[10];  
//private var genere : Genus;  
private var dna : Dna;
private var inicialitzat = false;
private var biocenosi : Biocenosi;

function Awake() {
	instance = this;
}
function Start() {
	biocenosi = Biocenosi.instance;
}

function Inicialitza() {

	//Debug.Log("Laboratori. Inicialitza. ousNumEspecies="+ousNumEspecies);	
	Debug.Log("Laboratori. Inicialitza");	
	//15/6:
	//16/7: biocenosi = Biocenosi.instance;
	//15/6: ousGenome = new Genome[10];
	ousGenome = new Genome[biocenosi.speciesMax];
	//ousNumEspecies = biocenosi.speciesMax;

	
	//15/6: for (var i=0;i<ousNumEspecies;i++) {
	for (var i=0;i<biocenosi.speciesMax;i++) {
		ousGenome[i] = Biocenosi.instance.species[i].dna.genome;
		// si casca a la linia d'adalt mirar que no hi hagi un genere repetit a laboratori
		// perque fa que species tingui un element menys que ousNumEspecies
		
		//15/6:Debug.Log("Laboratori: "+i +" - "+ousNomEspecie[i]+" - "+ousGenome[i].ToString());
		Debug.Log("Laboratori: "+i +" - "+biocenosi.species[i].dna.nomPantalla+" - "+ousGenome[i].ToString());
	}
	dna = new Dna();
	inicialitzat = true;
	Debug.Log("Laboratori.Inicialitza - fi. Inicialitzats "+i+" generes");
}

// resta ous i torna quants n'ha pogut treure
// - nom: especie
// - quant: quantitat que intento treure
// - return: els que he conseguit treure (si ousInfinits sempre puc treure el que em demanen)

// adapts dna.tempOptima to match temperature at spawn point

function FesSpawn(idGenus: int) {

	// recuperem posicio on esta apuntant el mouse
	
	var vSpawn = Planeta.instance.MousePositionToSimPosition();
	if (vSpawn == biblio.vectorNull) {
		Debug.Log("controller.fesspawn: no he trobat terreny  "+Input.mousePosition);
	}

	// fem spawn
	if (idGenus < biocenosi.speciesMax) {	
		for (var i=0;i<biocenosi.species[idGenus].dna.reprodOffspringLab;i++) {
			FesSpawnNauUn(idGenus, vSpawn + biblio.VectorAleatori(1,5)); 
		}
	}
	else {
		Debug.LogWarning("FesSpawn Especie no esta en labo:"+idGenus);
		UIMgr.instance.AvisUsuari("<"+idGenus+"> is not available in lab");
	}
}

private function FesSpawnNauUn(idGenus: int, vSpawn:Vector3) {
	//biblio.Assert(inicialitzat, "laboratori fesspawnau no inicialitzat???"); // <--- ES POT TREURE? (8/3/15)

	var n = treuEspeciesOu(idGenus, 1);
	if (n== -1) {
		Debug.LogWarning("FesSpawnNauUn Especie no esta en labo:"+idGenus+" ousQuantitat.Length:"+ousQuantitat.Length);
		UIMgr.instance.AvisUsuari("<"+idGenus+"> is not available in lab");
		return;			// idGenus no esta en laboratori?
	}
		
	if (n>0) {
	
		// gets default dna from biocenosi and adapts it to laboratory genome
		dna = Biocenosi.instance.species[idGenus].dna;
		dna.UpdateGenome(ousGenome[idGenus]);
		
		// corrects tempOptima to spawn point temperature and updates gen3
		var tempAtSpawnPosition = GameController.instance.biotop.TempSobreTerreny(vSpawn);
		dna.tempOptima = tempAtSpawnPosition;
		dna.SetGenomeFromVars();
		
		// del laboratori sempre enviem generacio 1
		dna.generacio = 0;
		
		// do spawn!
		Biocenosi.instance.FesSpawn(idGenus, vSpawn, dna);		// els primers ids de idGenus son sempre els ous
		
		//15/6: UIMgr.instance.AvisUsuari(" <"+ousNomEspecie[idGenus]+"> spawned "+ (ousInfinits ? "" : ousQuantitat[idGenus]+". left in lab "));
		UIMgr.instance.AvisUsuari(" <"+biocenosi.species[idGenus].dna.nomPantalla+"> spawned "+ (ousInfinits ? "" : ousQuantitat[idGenus]+". left in lab "));
		}
	else {
		//15/6: UIMgr.instance.AvisUsuari("No more <"+ousNomEspecie[idGenus]+"> in lab");
		UIMgr.instance.AvisUsuari("No more <"+biocenosi.species[idGenus].dna.nomPantalla+"> in lab");
		Debug.Log("laboratori.FesSpawnNau - No queden mes ous - especie "+idGenus);
	}	
}


function treuEspeciesOu(especie: int, quant: int): int {
	var trets: int;
	
	// si es local i no hi ousInfinits torna -1
	if (especie > ousQuantitat.Length-1 && !ousInfinits) {
		return -1;
	}
		
	// si esta el cheat ous infinits activat no resta
	if (ousInfinits) {
		trets = quant;
	}
	else {
		// hi ha prous ous encara?
		if (quant < ousQuantitat[especie]) {
			ousQuantitat[especie] -= quant;
			trets = quant;
		}
		else {
			trets = ousQuantitat[especie];
			ousQuantitat[especie] = 0;
		}
	}
	return trets;
}


// quants ous queden d'aquesta especie
// -1 si el nom es incorrecte
public function Nom2Quant(nom: String): int {
	var i = Nom2Ou(nom);
	if (i>=0) {
		return ousQuantitat[i];
	}
	else {
		//Debug.LogWarning("Laboratori.Nom2Quant no tinc ous d'aquesta especie, nom: "+nom);
		return -1;
	}

}


// torna id de l'ou amb l'especie demanada
// -1 si el nom es incorrecte
private function Nom2Ou(nom: String) {
//15/6	for (var j=0;j<ousNumEspecies;j++)  {
	for (var j=0;j<biocenosi.speciesMax;j++)  {
//15/6:		if (ousNomEspecie[j].ToUpper() == nom.ToUpper())
			if (biocenosi.species[j].dna.nomPantalla.ToUpper() == nom.ToUpper())
			return j;
	}
	return -1;	
}


function TextLlistaOus() : String {
	var s = "";
//	for (var j=0; j<ousNumEspecies;j++) {
	for (var j=0; j<biocenosi.speciesMax;j++) {
//15/6:		if (ousNomEspecie[j]!="") {
		if (biocenosi.species[j].dna.nomPantalla!="") {
			//s += "\n"+String.Format("{0,2}: {1,-15}  {2,4}", j, ousNomEspecie[j], ousQuantitat[j]);
			if (j<ousNomEspecie.Length) {
				s += "\n"+String.Format("({0,1}) -->   {1,-15}    [{2,4} left]", j, Biocenosi.instance.species[j].dna.nomPantalla, ousQuantitat[j]);
			}
		}
	}
	return s;	
}