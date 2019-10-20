#pragma strict


// nom dels planetes del menu principal


function Start () {

	gameObject.transform.Find("btn_e1/Text").GetComponent(UI.Text).text = Textos.instance.msg("PlanetName9099");
	gameObject.transform.Find("btn_e2/Text").GetComponent(UI.Text).text = Textos.instance.msg("PlanetName9001");
	gameObject.transform.Find("btn_e3/Text").GetComponent(UI.Text).text = Textos.instance.msg("PlanetName9002");
	gameObject.transform.Find("btn_e4/Text").GetComponent(UI.Text).text = Textos.instance.msg("PlanetName9003");
}

function Update () {

}

