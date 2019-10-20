#pragma strict

static var instance : Textos;

function Awake() {
	if (instance==null)
		instance = this;
}

// es crida des de seleccio ecosistemes en cada pantalla
// ho necessita el menu de la pantalla principal, per aixo estan aqui
//function nomPlaneta(): String {
//	return nomPlaneta(Application.loadedLevel);
//}

/*
// <---- CRIDAR DIRECTAMENT MSG?
function nomPlaneta(i: int): String {

	switch(i) {
	case 9001: var txt = msg_eng("PlanetName1"); break;
	case 9002: txt = msg_eng("PlanetName2"); break;
	case 9003: txt = msg_eng("PlanetName3"); break;
	case 9004: txt = msg_eng("PlanetName4"); break;
	default:   txt = "DESCONEGUT: "+i;
	}
	return txt;
}
*/

// 9 = textos generals


static function msg(i: String): String {
	return msg_eng(i);
}

static private function msg_eng(i: String): String {
	// in case
	var txt : String;
	switch(i) {
	
	// el meu mail
	case "ContactMail": txt = "terraformersim@outlook.com"; break; 
	
	// genome
	// noms dels gens
	case "GenName0": txt = "0.TBD";	break;
	case "GenLow0" : txt = ""; break;
	case "GenHigh0" : txt = ""; break;
	
	case "GenName1": txt = "1.Chemic def";	break;
	case "GenLow1" : txt = ""; break;
	case "GenHigh1" : txt = ""; break;

	case "GenName2": txt = "2.Adaptation";		break;
	case "GenLow2" : txt = "Low"; break;
	case "GenHigh2" : txt = "High"; break;
	
	case "GenName3": txt = "3.Temperatur";	break;
	case "GenLow3" : txt = "Cold"; break;
	case "GenHigh3" : txt = "Warm"; break;
	
	case "GenName4": txt = "4.Size";		break;
	case "GenLow4" : txt = "Small"; break;
	case "GenHigh4" : txt = "Big"; break;
	
	case "GenName5": txt = "5.TBD";		break;
	case "GenLow5" : txt = "Low"; break;
	case "GenHigh5" : txt = "High"; break;
	
	case "GenName6": txt = "6.Repr strat";		break;
	case "GenLow6" : txt = "r-sel"; break;
	case "GenHigh6" : txt = "K-sel"; break;
	
	case "GenName7": txt = "7.Speed";		break;
	case "GenLow7" : txt = "Slow"; break;
	case "GenHigh7" : txt = "Fast"; break;
	
	case "GenName8": txt = "8.Strength";		break;
	case "GenLow8" : txt = "Low"; break;
	case "GenHigh8" : txt = "High"; break;
	
	case "GenName9": txt = "9.Social";	break;
	case "GenLow9" : txt = "Indiv"; break;
	case "GenHigh9" : txt = "Social"; break;

	// generes
	
	case "TrophicLevel0": txt = "Plant"; break;
	case "TrophicLevel1": txt = "Herbivore"; break;
	case "TrophicLevel2": txt = "Predator"; break;
	case "TrophicLevel3": txt = "Apex predator"; break;
	case "TrophicLevel0plural": txt = "Plants"; break;
	case "TrophicLevel1plural": txt = "Herbivores"; break;
	case "TrophicLevel2plural": txt = "Predators"; break;
	case "TrophicLevel3plural": txt = "Apex predators"; break;
	case "TrophicLevel0short": txt = "Plant"; break;
	case "TrophicLevel1short": txt = "Herb"; break;
	case "TrophicLevel2short": txt = "Pred"; break;
	case "TrophicLevel3short": txt = "Apex"; break;
	case "TrophicLevel0shortPlural": txt = "Plants"; break;
	case "TrophicLevel1shortPlural": txt = "Herbs"; break;
	case "TrophicLevel2shortPlural": txt = "Preds"; break;
	case "TrophicLevel3shortPlural": txt = "Apex"; break;
	
		
	// planet names
	
	case "PlanetName9001": txt =  "2125 MA"; break;
	case "PlanetName9002": txt =  "2098 MA"; break;
	//<--- ELS CONDICIONALS HAURIEN D'ESTAR AL CODI NO AQUI, O DEFINR UNS STRINGS DIFERENTS AMB EL NOT AVAILABLE
	#if UNITY_WEBPLAYER
	case "PlanetName9003": txt =  "2034 MB\nNot available"; break;
	//case "PlanetName9004": txt =  "2018 JC\nNot available"; break;
	#else
	case "PlanetName9003": txt =  "2034 MB\nNot available"; break;
	//case "PlanetName9004": txt =  "2018 JC"; break;
	#endif
	case "PlanetName9099": txt =  "Sandbox"; break;
	
	
	// help inside levels
	
	case "HelpKeys":  txt =""
				+"\n(H): open/close HELP. Window can be dragged"
				+"\n"
				+"\nBASIC CONTROLS"
				+"\n"
				+"\n   Move:       ASDW or cursor"
				+"\n   Fix camera:  mouse right button"
				+"\n   Up/Down:    mouse wheel or PgUp/PgDn"
				+"\n"			
				+"\nChange view"
				+"\n"
				+"\n"+"  (C): Board ship (zenital view)"
				+"\n"+"  (J): Use Jet Pack (flying view)"
				+"\n"+"  SPACE: Land (walking view)"
				+"\n"			
				+"\nSelect a creature by clicking on it"
				+"\n"
				+"\n  (T): Creature details"
				+"\n  (U): Unselect creature"
				+"\n"
				+"\nAnalyze ecosystem"				
				+"\n"
				+"\n  (E): Ecosystems info panel"
				+"\n  (G): Population plot"
				+"\n  (B): Biomass plot"
				+"\n  (O): Level options"
				+"\n  Desktop version generates log files"
				+"\n"	
				+"\nSpawn foreign species"
				+"\n"
				+"\n  (L) to open foreign species lab"
				+"\n  (0) - (9) to spawn creatures"
				+"\n"
				+"\n(F2): Menu"
				+"\n(M): Change sim speed (Normal/Fast)"
				+"\n(P): Pause/resume"
				+"\n(F): Screenshot (desktop version only)"
				+"\n(F8): Debug menu"
				+"\nESC: Quit"
				+"\n"
				+"\nInfo panels can be dragged"
				+"\n"
				+"\nThis is a development version"
				+"\n"
				+"\nMore info about the project at:"
				+"\n  terraformersim.wordpress.com"
				+"\n"
				+"\nSend feedback to: "+Textos.msg("ContactMail")
				;
				

				break;
	default:
		txt = "ERROR msg "+i;
	}
			
	return txt;
}

function Ajuda() {
	return Ajuda_cat();
}

function Ajuda_cat() {
	return 

"MISSIO"
+"\n\nLa Terra está preparant l'atac a l'Imperi i necessita crear bases amb reserves d'aliments pels exercits."

+"\n\nEl servei de Terraformers ha seleccionat planetes semblants a la Terra per a convertir-los en granjes galactiques."

+"\n\nLa teva missio es aterrar en aquests planetes i crear poblacions d'animals suficients per alimentar una divisio."

+"\n\nINSTRUCCIONS"
+"\n\nEn cada planeta l'ordinador ha seleccionat biomes amb bones condicions. "
+"Sobrevola el biotop, analitza'l i envia-hi especies que hi encaixin. Vigila l'equilibri entre les especies per a que no s'extingessin."

+"\n\nA la nau portes un numero limitat d'animals. Tambe tens un laboratori genetic que et permetra modificarlos."

+"\n\nRecorda, els ecosistemes s'han d'automantenir perque no sabem quan podem necessitar aterrar al planeta."
;
}

	
function Credits1() {
return
       "TERRAFORMER SIM"
+"\n"
+"\n"+"   Ecosystem Simulator"
+"\n"
+"\n"+"      Ricard Dalmau"
+"\n"+"https://terraformersim.wordpress.com/"
+"\n"+"Send feedback to: "+Textos.msg("ContactMail")
+"\n"
+"\n"+"Version: "+Version.instance.buildVersion
+"\n"+"Build date: "+Version.instance.buildDate
+"\n"+"Platform: "+Version.instance.buildPlatform
+"\n"
;
 
}
function Credits2() {
return
      "Accordion script by ChomPi"
+"\n"+"http://forum.unity3d.com/threads/ accordion-type-layout.271818/"
+"\n"+"Cube animals by AIOlover"
+"\n"+"http://www.blendswap.com/blends/view/64776"
;
}

