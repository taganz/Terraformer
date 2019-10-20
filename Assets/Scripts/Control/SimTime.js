#pragma strict


/*
 * SimTime
 *
 * 	 manages time, pause, sim speed
 *
 *	Vars
 *  - simTime:  this is the real simulation time
 *				simTime = time.time from level start - total pause time. 
 *				it is updated every frame, for this reason, no sim interval should take longer than a frame in fast mode)
 *
 *  - simIsPaused
 *
 *	StartNivell()		- arranca uns frames i es posa en pause
 *	Pause()
 *	PauseToogle()
 *	SimSpeedFast()
 *	SimSpeedNormal()
 *
 */

static var instance : SimTime;
static var simTime : float;
static var simSpeedFast : boolean;


var simSpeedFastTimeScale = 20;					// fast simulation speed (frames)
var pauseIfZeroAnimals = true;					// should simulatin pause if all animals have died?

@HideInInspector var simIsPaused = true;					// game is paused   (per que no son statics??)
@HideInInspector var hePausatPerZero : boolean;
														
private var simTimeStartLevel : float;					
private var simTimePauseOn : float;						// time of start of last pause
private var pauseAccumulatedTime : float;				// total pause time 

function Awake () {
	instance = this;
}


function StartNivell() {

	simTime = 0;
	simSpeedFast = false;
	simIsPaused = false;
	pauseAccumulatedTime = 0;
	simTimeStartLevel = Time.time;
	//simTime = 0;
	Creature.esticEnPause = false;
	hePausatPerZero = false;
	SimSpeedNormal();
	Debug.Log("SIMTIME.StartNivell simTime="+simTime.ToString("F0")+ " simTimeStartLevel="+simTimeStartLevel.ToString("F1") + " simSpeedFast= "+simSpeedFast);



}


function Update() {

	// real simulation time excluding pause

	if (simIsPaused)
		simTime = simTimePauseOn - simTimeStartLevel - pauseAccumulatedTime;
	else
		simTime = Time.time - simTimeStartLevel - pauseAccumulatedTime;

	
}


// toogle pause
//
// call biocenosi to pause/resume all creatures

function PauseToogle() {
	Pause(!simIsPaused);
}
function Pause(onoff: boolean){
	simIsPaused = onoff;	
	UIMgr.instance.AvisPause(simIsPaused);	
	
	//Biocenosi.instance.Pause(simIsPaused);
	Creature.esticEnPause = onoff;
				
	if (onoff) {
		// activate paused time counter
		simTimePauseOn = Time.time;
	}
	else {
		// calculates accumulated time
		pauseAccumulatedTime += (Time.time - simTimePauseOn); 
		// reset zero animals detected flag
		hePausatPerZero = false;
	}
	Debug.Log("Paused="+onoff+" - Time.time="+Time.time.ToString("F0")+ " getSimTime:"+simTime+" simTimePauseOn="+simTimePauseOn+" pauseAccumulatedTime="+pauseAccumulatedTime);
}


function PauseZeroAnimals() {
	if (pauseIfZeroAnimals) {
		Debug.Log("SimTime.PauseZeroAnimals");
		hePausatPerZero = true;		// si vol continuar ho ressetejarem
		Pause(true);
	}
	else {
		Debug.Log("SimTime.PauseZeroAnimals - pauseIfZeroAnimals == false, simulation will not pause");
	}
}


// Set simulation speed to Normal / Fast

function SimSpeedFast(){
	simSpeedFast = true;
	Time.timeScale = simSpeedFastTimeScale;
	//Creature.simSpeedFast = true;
	Debug.Log("Simulation Speed: FAST. timeScale: "+Time.timeScale);
}
function SimSpeedNormal(){
	simSpeedFast = false;
	//Creature.simSpeedFast = false;
	Time.timeScale = 1;
	Debug.Log("Simulation Speed: NORMAL. timeScale: "+Time.timeScale);
}
