using UnityEngine;
using UnityEditor;
using System.Collections;

public class RenameGameObjects : ScriptableWizard
{
	/*
	 * public bool copyValues = true;
	public GameObject NewType;
	private GameObject[] OldObjects;

	public string nom = "original name";
	*/

	public string comment = "fare rename a g_xxxxx // ojo no hi ha confirmacio";
	public string nomVell;
	public string nomNou;



	[MenuItem("Custom/Rename GameObjects")]
	
	
	static void CreateWizard()
	{
		ScriptableWizard.DisplayWizard("Rename GameObjects", typeof(RenameGameObjects), "Rename");
	}
	
	void OnWizardCreate()
	{
		FesRename (nomVell, nomNou);





	}

	void FesRename(string nom_original, string nomNou) {
		GameObject gobj;
		gobj = GameObject.Find (nom_original);
		while (gobj!=null) {
				gobj.name = nomNou;
				Debug.Log ("Canviat un "+nom_original+" a "+nomNou);
				gobj = GameObject.Find (nom_original);
		}
	}

}