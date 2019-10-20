#pragma strict

static var instance : Version;

// cal tocar-la a ma des de codi. 
@HideInInspector static var buildVersion = "0.8 (Development version)";
@HideInInspector static var buildDate = "2016-08-10";
@HideInInspector static var buildPlatform = "";


function Awake() {
	instance = this;
#if UNITY_WEBPLAYER
	buildPlatform = "Webplayer (Log files not available!)\nUse desktop version to generate csv stats.";
#elif UNITY_STANDALONE
	buildPlatform = "Desktop";
#else
	buildPlatform = "Unknow platform";
#endif
	
}

function Start() {

	Debug.Log("Version: "+buildVersion);

}

/*
function UpdateBuildDate() {

	buildDate = System.DateTime.Now.ToString("yyyy-MM-dd HH");
	Debug.Log("Updating BUILD DATE: "+buildDate);
	
}
*/