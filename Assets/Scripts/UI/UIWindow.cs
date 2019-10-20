using System;
using UnityEngine;
using UnityEngine.EventSystems;

// arrossegar per fer un windows draggable
//http://forum.unity3d.com/threads/scripts-useful-4-6-scripts-collection.264161/#post-1780612 

public class UIWindow : MonoBehaviour, IDragHandler
{
	private RectTransform rectTransform;
	private Canvas canvas;
	private RectTransform canvasRectTransform;
	
	private void Start()
	{
		rectTransform = GetComponent<RectTransform>();
		canvas = GetComponentInParent<Canvas>();
		canvasRectTransform = canvas.GetComponent<RectTransform>();
	}
	
	public void OnDrag(PointerEventData eventData)
	{
		var delta = ScreenToCanvas(eventData.position) - ScreenToCanvas(eventData.position - eventData.delta);
		rectTransform.localPosition += delta;
	}
	
	private Vector3 ScreenToCanvas(Vector3 screenPosition)
	{
		Vector3 localPosition;
		Vector2 min;
		Vector2 max;
		var canvasSize = canvasRectTransform.sizeDelta;
		
	//rd 26/1/15	if (canvas.renderMode == RenderMode.Overlay || (canvas.renderMode == RenderMode.OverlayCamera && canvas.worldCamera == null))
		if (canvas.renderMode == RenderMode.ScreenSpaceOverlay || (canvas.renderMode == RenderMode.ScreenSpaceCamera && canvas.worldCamera == null))
		{
			localPosition = screenPosition;
			
			min = Vector2.zero;
			max = canvasSize;
		}
		else
		{
			var ray = canvas.worldCamera.ScreenPointToRay(screenPosition);
			var plane = new Plane(canvasRectTransform.forward, canvasRectTransform.position);
			
			float distance;
			if (plane.Raycast(ray, out distance) == false)
			{
				throw new Exception("Is it practically possible?");
			};
			var worldPosition = ray.origin + ray.direction * distance;
			localPosition = canvasRectTransform.InverseTransformPoint(worldPosition);
			
			min = -Vector2.Scale(canvasSize, canvasRectTransform.pivot);
			max = Vector2.Scale(canvasSize, Vector2.one - canvasRectTransform.pivot);
		}
		
		// keep window inside canvas
		localPosition.x = Mathf.Clamp(localPosition.x, min.x, max.x);
		localPosition.y = Mathf.Clamp(localPosition.y, min.y, max.y);
		
		return localPosition;
	}
}