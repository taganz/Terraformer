#pragma strict

/*
 *  Genome is an array of 10 gens. 
 *	Gens are floats ranging from 0 to 9.99
 *
 *   Metodes
 *   	SetGen(num, val) - Don't set gens directly because both int and float vars needs to be assigned !!!!!
 *		GetGen(num)
 *		CopyGenome(genome or string)
 *		ToString()		 - format as "9-999-999-999"
 *		...
 *
 *	 
 */


class Genome { //extends System.ValueType {

	static var numGens = 10;
	var gen: int[]; // = new int[10];			// numGens
	var genf: float[]; //  = new float[10];		// numGens

	// inicialitza a zero
	
	public function Genome() {
		gen = new int[numGens];
		genf = new float[numGens];
		for (var i=0; i<numGens;i++) {
			gen[i] = 0;
			genf[i] = 0;
		}
	}
/*
	// inicialitza copiant valors
	
	public function Genome(genome : Genome) {
		for (var i=0; i<numGens;i++) {
			this.gen[i]= genome.gen[i];
			this.genf[i]= genome.genf[i];
		}
	}
*/
	// llegeix valor int
	
	public function GetGen(i: int): int {
		return gen[i];
	}

	// escriu valor float
	
	public function SetGen(i: int, val:float) {
		gen[i] = val;
 		if (gen[i] > 9) 
 			gen[i] = 9;
 		if (gen[i] < 0)
 			gen[i] = 0;
		
		genf[i] = val;
  		//if (genf[i] > 9.999)
  		//	genf[i] = 9.999;
 		//if (genf[i]<0)
 		//	genf[i] = 0;
	}
	
	// copia un genome
	
	public function CopyGenome(genome : Genome) {
		for (var i=0; i<numGens;i++) {
			this.gen[i]= genome.gen[i];
			this.genf[i]= genome.genf[i];
		}
	}

	// passa el string al genome. omple amb zeros si el string es massa curt 
	// salta els guions "-"

	public function CopyGenome(genStr : String) {
		var j : int;
		var n = 0;
		for (var i=0;i<genStr.length && n<numGens;i++) {
			if (genStr[i]!="-") {
				j = genStr[i];
				j -=48; // unicode de "0"
				gen[n] = j; 
				genf[n] = j; 
				n++;
			}
		}
		for (;n<numGens;n++) {
			gen[n]=0;
			genf[n]=0;
		}
		//Debug.LogWarning("genome.Genome: genStr="+genStr+"   genome="+ToString());
	}
				
	/*
		var i=0;
		for (var g=0; g<numGens;g++) {
			var j : int;
			if (genStr.Length >i) {
				while (genStr[i] == "-") {
					i++;
				}
				j = genStr[i];
				j -=48; // unicode de "0"
				gen[i] = j; 
				genf[i] = j; 
				i++;
			}
			else {
				j = 0;
			}
		}
	*/
	
	// nomes pinta els gens que tenen valors entre 0 i 9
	
	function ToString(): String {
	   	var t : int;
	   	var txt : String;
	   	txt = "";
	    for (var i = 0; i< this.numGens;i++) {
	    	t = this.gen[i];
	    	// put a "-" before this digits
	    	if (i==1 || i == 4 || i == 7)
	    		 txt = txt + "-";
		    txt = txt + ( (t<0 || t>9) ? "?" : t);	// put a "?" if gen is not 0-9

	    }
	    return txt;
	   }
	
	//function Clone() : Genome {
    // return this.MemberwiseClone();
    //}
}