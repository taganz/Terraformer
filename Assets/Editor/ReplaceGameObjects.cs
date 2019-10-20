using UnityEngine;
using UnityEditor;
using System.Collections;

public class ReplaceGameObjects : ScriptableWizard
{
	public bool copyValues = true;
	public GameObject NewType;
	public GameObject[] OldObjects;
	
	[MenuItem("Custom/Replace GameObjects")]
	
	
	static void CreateWizard()
	{
		ScriptableWizard.DisplayWizard("Replace GameObjects", typeof(ReplaceGameObjects), "Replace");
	}
	
	void OnWizardCreate()
	{
		foreach (GameObject go in OldObjects)
		{
			GameObject newObject;
			newObject = (GameObject)EditorUtility.InstantiatePrefab(NewType);
			newObject.transform.position = go.transform.position;
			newObject.transform.rotation = go.transform.rotation;
			newObject.transform.parent = go.transform.parent;
			
			DestroyImmediate(go);
			
		}
		
	}
}