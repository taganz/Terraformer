#pragma strict
//static var instance : BiocenosiData;			--> controller.biocenosiData


// les especies
var titolNivell = "titol no inicialitzat";
var comments = "comentaris del nivell";

// limits de poblacio. a partir d'aqui no pareixen
//var maxPlantes = 500;		
//var maxAnimals = 400;	

// for performance reasons, we must keep creatures under some level
// class creatures will not give birth to a new creature if its species has a population bigger than capacityReference * capcityTL
// a warning will be logged
// <--- can this be related to some "carring capacity" concept?
var capacityReference = 500;
var capacityTL = [0.1, 0.2, 0.3, 0.4];

var grafNTYMax = [0, 0, 0, 0];	// escala del graf per cada nivell trofic. si zero s'omple segons maxPlantes i maxAnimals

var hInitCamaraZenital = 100;		// alçada inicial camara zenital. ajustar segons posicio spawners
var hInitCamaraJetPack = 0;		// alçada inicial camara jetpack. si es zero es posa al minim
var camaraInitPosition : Vector3 = Vector3(0,0,0);
var camaraLookAt : Vector3 = Vector3(0,0,0);

var biomassaObjectiu = 1000;	// T per sobre de les quals hem d'estar

var herbivorsSempreFarts = false;		// tests: els herbivors sempre tenen pes > pesFart

