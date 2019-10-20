#pragma strict

static var instance : FormatGeneres;

function Awake() {
	instance = this;
}

// stats vius

public function StatsVius(nt: int): String {
	var txt =
	    "Born:       " + StatsVar(Biocenosi.instance.partsEspecie, nt)
	+ "\nLive:       " + StatsVar(Biocenosi.instance.viusEspecie, nt)
	+ "\nDied        " + StatsVar(Biocenosi.instance.mortsEspecie, nt)
	+ "\n\nGENOME"
	+ "\n"
	+ StatsGenome(nt);
	;
	return txt;
}


// donat un genere, torna les stats de mort d'ell i dels del seu nivell trofic
// estadistiques de morts per un genere determinat
// 
//public function StatsMortsToString(idGenus: int): String {

public function StatsMortsToString(nt: int): String {
	var txt =
	    "Born:       " + StatsVar(Biocenosi.instance.partsEspecie, nt)
	+ "\nLive:       " + StatsVar(Biocenosi.instance.viusEspecie, nt)
	+ "\nDied        " + StatsVar(Biocenosi.instance.mortsEspecie, nt)
	+ "\n"
	+ "\nDEATH CAUSE"
	+ "\n old:       " + StatsVarPerc(Biocenosi.instance.mortsVellPerGenere, nt, Biocenosi.instance.mortsEspecie)
	+ "\n cold:      " + StatsVarPerc(Biocenosi.instance.mortsFredPerGenere, nt, Biocenosi.instance.mortsEspecie)
	+ "\n hot:       " + StatsVarPerc(Biocenosi.instance.mortsCalorPerGenere, nt, Biocenosi.instance.mortsEspecie)
	+ "\n starve:    " + StatsVarPerc(Biocenosi.instance.mortsGanaPerGenere,  nt, Biocenosi.instance.mortsEspecie)
	+ "\n predated:  " + StatsVarPerc(Biocenosi.instance.mortsPresaPerGenere,  nt, Biocenosi.instance.mortsEspecie)
	+ "\n"
	//+ "\n ( "+generacionsEspecie[idGenus]+ " generations)"
	+ "\nPREDATORS"
	+ StatsPredadors(nt)
	//+ "\nPREY"
	//+ StatsPredadorsPreses(nt, false)
	//+ "\n\nGENOME"
	//+ StatsGenome(nt);
	;
	return txt;
}

public function StatsPrey(nt: int): String {

	var txt : String;
	txt = StatsPreses(nt);
	return txt;
}

// torna la capcalera per l'anterior
public function StatsMortsCapcalera(nt: int): String {
	var txt : String = "            " ; //= "["+Textos.msg("TrophicLevel"+Biocenosi.instance.species[idGenus].dna.nivellTrofic+"shortPlural")+"]";
	var liniaPlena = false;
	for(var i=0;i<Biocenosi.instance.speciesMax;i++) {
		if (Biocenosi.instance.species[i].dna.nivellTrofic == nt && Biocenosi.instance.partsEspecie[i]>0) {
			txt+=" "+Biocenosi.instance.species[i].dna.nomPantallaCurt.PadRight(5);
			liniaPlena = true;
		}
	}
	if (!liniaPlena) {
		txt += "(No "+Textos.msg("TrophicLevel"+nt+"plural")+" found!)";
	}
	return txt;
}

// torna un string amb els valors de l'array elArray pels generes d'aquest nivell trofic (que n'hagi nascut algun).
// el primer que torna es idGenus

private function StatsVar(elArray: int[], nt: int): String {
	var txt : String;
	//txt = elArray[idGenus].ToString().PadLeft(3);
	for(var i=0;i<Biocenosi.instance.speciesMax;i++) {
		//if (Biocenosi.instance.species[i].dna.nivellTrofic == nt && i!=idGenus && Biocenosi.instance.partsEspecie[i]>0) {
		if (Biocenosi.instance.species[i].dna.nivellTrofic == nt && Biocenosi.instance.partsEspecie[i]>0) {
			txt+="   "+elArray[i].ToString().PadLeft(3);
		}
	}
	return txt;
}
// idem en percentatges

private function StatsVarPerc(elArray: int[], nt: int, total: int[]): String {
	var txt : String;
	for(var i=0;i<Biocenosi.instance.speciesMax;i++) {
		if (Biocenosi.instance.species[i].dna.nivellTrofic == nt && Biocenosi.instance.partsEspecie[i]>0) {
			if (total[i]==0) {
				txt+="   "+"".PadLeft(3);
			}
			else {
				var valor : float = elArray[i];
				valor = valor/total[i]*100;
				txt+=( valor > 0 ? valor.ToString("F0")+"%" : ".").PadLeft(6);
			}
		}
	}
	return txt;
}


// torna llista de predadors/preses per les especies del nivell trofic
// si pred es true torna els predadors, sino les preses
// posa primer el idGenus si es > -1

function StatsPreses(nt: int): String {
	var txt : String;
	var lin : String = "";
	var preses : int = 0;
	var liniaPlena : boolean;
	var txtPle = false;
	var subTotal : int[] = new int[Biocenosi.instance.speciesMax];	
	//var subTotalIndex = 0;
	for (var i = 0;i< Biocenosi.instance.speciesMax;i++)
		subTotal[i] = 0;
	// recorrem llista de predadors
	for (var a = 0;a < Biocenosi.instance.speciesMax; a++) {
		
		// a: es un predador/presa de nt per posar-lo a les files
		if (Biocenosi.instance.species[a].dna.nivellTrofic == nt -1) {
			liniaPlena = false;
			// formateja linia del predador 
			lin = "\n "+Biocenosi.instance.species[a].dna.nomPantallaCurt.PadRight(8);
			liniaPlena = false;
			lin += "".PadLeft(3);
			for (var b = 0; b < Biocenosi.instance.speciesMax; b++) {
			
				// b: un genere de NT que te almenys un Creature per posar-lo a les columnes
				if (Biocenosi.instance.species[b].dna.nivellTrofic == nt && Biocenosi.instance.partsEspecie[b]>0) {
					preses = Biocenosi.instance.species[b].presesGenere[a];
					lin += preses.ToString().PadLeft(6);
					liniaPlena = liniaPlena || preses > 0;
					// anem guardant els absoluts de predadors per posar-ho al final
					//subTotalIndex = subTotalIndex < b ? b : subTotalIndex;
					subTotal[b]+= preses;
				}
			}
			// nomes mostrem linia si hi havia algun numero > 0, es a dir si aquell predador s'havia menjat algo
			if (liniaPlena) {
				txt += lin;
				txtPle = true;
			}
		}
	}
	if (txtPle==false) {
		txt="\n    No prey data found";
	}
	else {
		// pinta linia totals a dalt
		lin = "\n Total ".PadLeft(10);
		lin += " ".PadLeft(3);
		for (b = 0; b < Biocenosi.instance.speciesMax; b++) {
			if (Biocenosi.instance.species[b].dna.nivellTrofic == nt && Biocenosi.instance.partsEspecie[b]>0) {
				var s : String;
				s = ""+subTotal[b];
				lin+=s.PadLeft(6);
			}
		}
		txt = lin+"\n"+txt;
	}
	return txt;
}

// detall de predadors

function StatsPredadors(nt: int): String {
	var txt : String;
	var lin : String = "";
	var valor : float = 0;
	var subTotal : int[] = new int[Biocenosi.instance.speciesMax];	
	var liniaPlena : boolean;
	var txtPle = false;
	for (var i = 0;i< Biocenosi.instance.speciesMax;i++)
		subTotal[i] = 0;
	// recorrem llista de predadors
	for (var a = 0;a < Biocenosi.instance.speciesMax; a++) {
		// a: es un predador/presa de nt per posar-lo a les files
		if (Biocenosi.instance.species[a].dna.nivellTrofic == nt+1) {
			liniaPlena = false;
			// formateja nom del predador 
			lin = Biocenosi.instance.species[a].dna.nomPantallaCurt.PadRight(8);
			liniaPlena = false;
			lin += "".PadLeft(3);
			for (var b = 0; b < Biocenosi.instance.speciesMax; b++) {
			
				// b: un genere de NT que te almenys un Creature per posar-lo a les columnes
				if (Biocenosi.instance.species[b].dna.nivellTrofic == nt && Biocenosi.instance.partsEspecie[b]>0) {
					if (Biocenosi.instance.mortsPresaPerGenere[b] > 0) {
						//subTotalIndex = subTotalIndex < b ? b : subTotalIndex;
						valor = Biocenosi.instance.species[b].predadorsGenere[a];
						// anem guardant els absoluts de predadors per posar-ho al final
						subTotal[b]+= valor;
						// calculem %
						valor = valor / Biocenosi.instance.mortsPresaPerGenere[b] * 100;
						lin += (valor > 0 ? valor.ToString("F0")+"%" : ".").PadLeft(6);
						liniaPlena = liniaPlena || valor > 0;
					}
					else {
						lin += "".PadLeft(6);
					}
				}
			}
			// nomes mostrem linia si hi havia algun numero > 0, es a dir si aquell predador s'havia menjat algo
			if (liniaPlena) {
				txt += lin+"\n";
				txtPle = true;
			}
		}
	}
	if (txtPle==false) {
		txt="\n    No predators data found";
		if (nt==3) {
			txt = "\n   Apex predators don't have predators";
		}
	}
	else {
		// pinta linia totals a dalt
		lin = "\nTotal".PadLeft(12);
		lin += "".PadLeft(3);
		for (b = 0; b < Biocenosi.instance.speciesMax; b++) {
			if (Biocenosi.instance.species[b].dna.nivellTrofic == nt && Biocenosi.instance.partsEspecie[b]>0) {
				var s : String;
				s = ""+subTotal[b];
				lin+=s.PadLeft(6);
			}
		}
		txt = lin+"\n"+txt;
	}
	return txt;
}

// torna els valors dels gens
private function StatsGenome(nt: int) : String {

	var txt = "";
	
	// per cada un dels 9 gens
	for (var gen=0;gen<Genome.numGens;gen++) {
	
		// el del genere seleccionat
		txt += "\n"+Textos.msg("GenName"+gen).PadRight(12);	//+Biocenosi.instance.species[idGenus].dna.genome.GetGen(gen).ToString().PadLeft(3);
		// la resta de generes
	
		for(var i=0;i<Biocenosi.instance.speciesMax;i++) {
			if (Biocenosi.instance.species[i].dna.nivellTrofic == nt && Biocenosi.instance.partsEspecie[i]>0) {
				txt+="   "+Biocenosi.instance.species[i].dna.genome.GetGen(gen).ToString().PadLeft(3);
			}
		}
	}
	
	return txt;


}

// torna una llista amb els generes dels spawners detectats

static function TextLlistaEspeciesSpawners() : String {
	var s = "";
	if (Biocenosi.instance.spawnersNumEspecies == 0) {
		s = "No local species detected";
	}
	else {
		for (var j=0; j<Biocenosi.instance.spawnersNumEspecies;j++) {
			if (Biocenosi.instance.spawnersNomEspecie[j]!="") {
				//s += "\n"+String.Format("{0,2}: {1,-15}", j, spawnersNomEspecie[j]);
				s += "\n"+String.Format("{0,-15}", Biocenosi.instance.spawnersNomEspecie[j]);
			}
		}
	}
	return s;	
}

