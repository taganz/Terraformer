#pragma strict

static var instance : FormatBiocenosi;
private var biocenosi : Biocenosi;
private var laboratori : Laboratori;
function Awake() {
	instance = this;
}

function Start() {
	biocenosi = Biocenosi.instance;
	laboratori = Laboratori.instance;
}

// poblacio per generes

function InfoBiocenosi(): String {
	var tt : String;	
 	
	tt= "\nPLANTS";
	tt+= InfoPopulationNT(0);
	tt+= "\n\nHERBIVORES";
	tt+= InfoPopulationNT(1);
	tt+= "\n\nPREDATORS";
	tt+= InfoPopulationNT(2);
	tt+= "\n\nAPEX PREDATORS";
	tt+= InfoPopulationNT(3);
	tt+="\n\nPress (G) for population graph";

	return tt;
}

// poblacio per nivells trofics

function InfoBiocenosiAgregats(): String {
	var plantesVives = biocenosi.animalsViusTotal - biocenosi.animalsViusSensePlantes;			

	return
	  "\n"+String.Format("{0,-8}             ", "Trophic levels")
	+ "\n"+String.Format("{0,-8}{1,5}{2,8}   ", "       ", "Popul.", "Biomass")
	+ "\n"+String.Format("{0,-8}{1,5}{2,7} T", "Plants: ",biocenosi.viusNTrofic[0], (biocenosi.biomassaNT[0]/1000).ToString("F1"))
	+ "\n"+String.Format("{0,-8}{1,5}{2,7} T", "Herbiv: ",biocenosi.viusNTrofic[1], (biocenosi.biomassaNT[1]/1000).ToString("F1"))
	+ "\n"+String.Format("{0,-8}{1,5}{2,7} T", "Predat: ",biocenosi.viusNTrofic[2], (biocenosi.biomassaNT[2]/1000).ToString("F1"))
	+ "\n"+String.Format("{0,-8}{1,5}{2,7} T", "Apex:   ",biocenosi.viusNTrofic[3], (biocenosi.biomassaNT[3]/1000).ToString("F1"))
	+ "\n"
	//+ "\n"+String.Format("{0,-8}{1,5}       ", "Live:   ",biocenosi.animalsViusTotal);
	+ "\nLive:     " + biocenosi.animalsViusTotal
	//+ "\n   animals: " + biocenosi.animalsViusSensePlantes
	//+ "\n   plants:  " + plantesVives
	//+ "\n"
	+ "\nBorn:     " + biocenosi.parts
	+ "\nDied: 	  " + (biocenosi.parts - biocenosi.animalsViusTotal)
	+ "\n   old:     " + biocenosi.mortsVell
	+ "\n   cold:    " + biocenosi.mortsFred
	+ "\n   hot:     " + biocenosi.mortsCalor
	+ "\n   starve:  " + biocenosi.mortsGana
	+ "\n   predated:" + biocenosi.mortsPresa
	;


}


// torna linies amb "nom especie + population" per nivell trofic demanat
function InfoPopulationNT(nt: int) : String{
	var tt="";
	for (var j=0; j<biocenosi.speciesMax;j++) {
		var nOus = laboratori.Nom2Quant(biocenosi.species[j].nomGenere);
		//if (biocenosi.species[j].dna.nivellTrofic == 0 && ( biocenosi.viusEspecie[j]>0)) {
		if (biocenosi.species[j].dna.nivellTrofic == nt) {
			var e = biocenosi.species[j].dna.nomPantalla + "          ";
			// els pinta si n'hi ha algun de viu 
			if (biocenosi.viusEspecie[j] > 0) {
				//tt+= "\n"+e.Substring(0,12)+": "+biocenosi.viusEspecie[j];
				tt+= "\n"+e.PadRight(12).Substring(0,12)+": "+biocenosi.viusEspecie[j];
			}
			else {
				// si no n'hi han pero n'hi han hagut es que s'han extingit
				if (biocenosi.partsEspecie[j]>0) {
					tt+= "\n"+e.PadRight(12).Substring(0,12)+": extinct";
				}
			}
		}
	}
	return tt;
}
