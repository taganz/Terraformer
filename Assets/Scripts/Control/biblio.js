#pragma strict

// 

static var vectorNull = Vector3(-999, -999, -999);

// torna un vector aleatori amb distancia maxima i minima i amb la y==0 (x, 0, z)

static function VectorAleatori(dmin: int, dmax: int): Vector3 {

		var intents = 4;
		do {
			var v : Vector2 = Random.insideUnitCircle * dmax;
		} while (dmin > 0 && v.magnitude < dmin && intents-- > 0); 
		
		if (intents == 0) {
			Debug.LogWarning("biblio.VectorAleatori: No he pogut trobar vector entre "+dmin+" i "+dmax+". Torno: "+v);
		}
		return Vector3(v.x, 0, v.y);
}

// draw square in points p1..p4
static function DebugDrawPoly(p1: Vector3, p2: Vector3, p3: Vector3, p4: Vector3, color: Color, duracio: float) {

		Debug.DrawLine(p1, p2, color, duracio);
		Debug.DrawLine(p2, p3, color, duracio);
		Debug.DrawLine(p3, p4, color, duracio);
		Debug.DrawLine(p4, p1, color, duracio);
	
}

// draw a square centered in "center". side= side size
static function DebugDrawSquare(center: Vector3, side: float, color: Color, duracio: float) {
		var half = side/2;
		DebugDrawPoly(
		center+Vector3.left*half+Vector3.forward*half
		, center+Vector3.right*half+Vector3.forward*half
		, center+Vector3.right*half+Vector3.back*half
		, center+Vector3.left*half+Vector3.back*half
		, color
		, duracio);	

}


// per a debug
static var RajaOn = false;
static var RajaMoltOn = false;			// per a msg molt basics


static function SetRaja(onoff: boolean) {
	RajaOn = onoff;
	Debug.Log("RajaOn esta " +RajaOn);
}

static function SetRajaMolt(onoff: boolean) {
	RajaMoltOn = onoff;
	Debug.Log("RajaMoltOn esta " +RajaMoltOn);
}


static function Raja(msg: String) {
	if (RajaOn)
		Debug.Log(msg + " [raja]");		
}

static function RajaMolt(msg: String) {
	if (RajaMoltOn)
		Debug.Log(msg + " [rajaMolt]");		
}

static function RajaSi(cond:boolean, msg: String) {
	if (RajaOn && cond)
		Debug.Log(msg + " [rajaSi]");		
}

// calcula si v1 i v2 estan mes aprop que un rang donat
static function MesApropDe(v1: Vector3, v2: Vector3, rang: float) {
	var heading = v2 - v1;
	// normalitzar 
	//var distance = heading.magnitude;
	//var direction = heading / distance;           // This is now the normalized direction.
	// per comparar aixo es mes rapid perque no cal fer arrels quadrades
	return (heading.sqrMagnitude < rang * rang);
	    // Target is within range.
}

static function Assert(cond: boolean, txt: String) {

	if(cond == false)
		Debug.LogError(txt + "     [Error biblio.Assert]");
			
}

static function Char2Digit(c: String): int {
	var j: int;
	j = c[0];
	j -=48; // unicode de "0"
	return j;
	//Debug.LogWarning("biblio.Char2Digit c="+c+" return="+j);
}

static function Fahrenheit(tempC: float):float {
	return 1.8*tempC+32;
}

static function Celsius(tempF: float):float {
	return (tempF-32)/1.8;
}
