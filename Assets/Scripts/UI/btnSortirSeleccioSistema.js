#pragma strict

/*
	Quan fas click en el btnSortir desactiva gameobjet
*/

@HideInInspector var	btnSortir : UI.Button;


function Start () {

	if (btnSortir==null) {
		btnSortir = this.transform.Find("btnSortir").GetComponent(UI.Button);
		biblio.Assert(btnSortir!=null, "btnSortir btnSortir == null");
	}
		
	btnSortir.onClick.RemoveAllListeners();
	btnSortir.onClick.AddListener(function () {   Sortir(); } );  
			
}
		
		
function Sortir(){
	//this.gameObject.SetActive(false);
	Application.LoadLevel("n0");
}

