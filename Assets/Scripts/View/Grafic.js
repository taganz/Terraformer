#pragma strict

/*
 Grafic
 
 Draws a graphic up to 5 values
 
 Use:
	graf = new Grafic (numdatasets, y, x, w, h)
	graf.SetDataNames("string1", "string2",...)
	graf.SetDataColors(color1, color2,...)
	graf.SetDataYMax(yMax1, yMax2, ...) // si zero no el canvia
	graf.Open();                
	graf.Log(y1, y2, y3, y4, y5);          // afegeix un nou valor
	graf.Toogle();                              // mostra/oculta
	OnGUI() 
        graf.DoGUI();
*/

class Grafic {


	private var tempsRefrescGrafic = 100; // cada quan refresquem el grafic

	private var imW : int;			// graph size
	private var imH : int;	
	private var wX : int;			// graph position
	private var wY : int;

	private var numDataSets: int;		// number of datasets				<-- EN REALITAT ELS ASSIGNO TOTS...
	private var setName: Array;		// the screen name for each dataset
	private var setColor : Color[];	// the color for painting each dataset
	private var image : Texture2D;	// the object where the graph is paint
	private var lineWidth = 3; 		//draw a curve 3 pixels wide

	private var maxX : int;			// numero valors per cada dataset
	private var escalaX : float;
//	var numDataSets: int;			// en realitat els asssigno tots i nomes pinto els que calgui  <---CANVIAR
	
	private var y1: int[];			// the dataset
	private var y2: int[];
	private var y3: int[];
	private var y4: int[];
	private var y5: int[];
	private var y1MaxFound : int;		// higher y value found
	private var y2MaxFound : int;
	private var y3MaxFound : int;
	private var y4MaxFound : int;
	private var y5MaxFound : int;
	private var yMax1 : float;	// y value that should appear at top (higher values to be clipped)
	private var yMax2 : float;
	private var yMax3 : float;
	private var yMax4 : float;
	private var yMax5 : float;
	private var y1Norm: int[];		// normalized version of datasets
	private var y2Norm: int[];
	private var y3Norm: int[];
	private var y4Norm: int[];
	private var y5Norm: int[];

	// state
	
	var isOpen : boolean;				// graph windows is visible
	private var tempsGraficObert : int;	// control refresc grafic
	private var drawRequired = false;	
	private var t : int;				// current x axis cursor (last x set by Log())


	public function Grafic() {
		maxX = 1000;
		imW = 0;
		imH = 0;
		wX = 0;
		wY = 0;
		y1 = new int[maxX+1];		
		y2 = new int[maxX+1];
		y3 = new int[maxX+1];
		y4 = new int[maxX+1];
		y5 = new int[maxX+1];
		y1Norm = new int[maxX+1];		
		y2Norm = new int[maxX+1];
		y3Norm = new int[maxX+1];
		y4Norm = new int[maxX+1];
		y5Norm = new int[maxX+1];
		y1MaxFound = 0;
		y2MaxFound = 0;
		y3MaxFound = 0;
		y4MaxFound = 0;
		y5MaxFound = 0;
	}

	// constructor
	//	wX, wy = top left position of window
	//	imW, imH = size of image
	//public function AlGrafic(speciesMax: int, imW0:int, imH0:int, wX0: int, wY0: int) {
	public function Grafic(numDataSets: int, wX0: int, wY0: int,imW0:int, imH0:int ) {
		Debug.Log("Grafic: datasets:"+numDataSets + " pos: "+ wX0+", "+wY0+"  size: "+imW0+", "+imH0);
		
		maxX = 1000;				// <--- a piñon!
		this.imW = imW0;
		this.imH = imH0;
		this.wX = wX0;
		this.wY = wY0;
		escalaX = 1.0*imW/maxX;
		
		y1 = new int[maxX+1];		//  <-- shouldn't be creating all arrays if numDataSets < 5!
		y2 = new int[maxX+1];
		y3 = new int[maxX+1];
		y4 = new int[maxX+1];
		y5 = new int[maxX+1];
		y1Norm = new int[maxX+1];		
		y2Norm = new int[maxX+1];
		y3Norm = new int[maxX+1];
		y4Norm = new int[maxX+1];
		y5Norm = new int[maxX+1];

		y1MaxFound = 0;
		y2MaxFound = 0;
		y3MaxFound = 0;
		y4MaxFound = 0;
		y5MaxFound = 0;

		// this is where the real image is drawn
		image = new Texture2D(imW, imH); 
				
		// default values
		yMax1 = 10;
		yMax2 = 10;
		yMax3 = 10;
		yMax4 = 10;
		yMax5 = 10;
	
		setName = new Array();
		SetDataNames("1", "2", "3", "4", "5");
		setColor = new Color[5];
	    SetDataColors(Color.green, Color.yellow,Color.red, Color.blue, Color.gray);

		this.numDataSets = numDataSets;
		biblio.Assert(numDataSets >=1 && numDataSets <=5, "Grafic1.SetNumDataSets error num datasets: "+numDataSets);

		isOpen = false;
		drawRequired = true;
		
	}
	
	public function SetDataNames(n1: String, n2: String, n3: String, n4: String, n5: String) {
		setName.Clear();
		setName.Push(n1);
		setName.Push(n2);
		setName.Push(n3);
		setName.Push(n4);
		setName.Push(n5);
	}

	public function SetDataColors(n1: Color, n2: Color, n3: Color, n4: Color, n5: Color) {
		setColor[0]=n1;
		setColor[1]=n2;
		setColor[2]=n3;
		setColor[3]=n4;
		setColor[4]=n5;
		
	}
	
	// datasets will be normalized so those value will appear at top
	// if n# == 0 yMax# is not changed
	public function SetDataYMax(n1: float, n2: float, n3: float, n4: float, n5: float) {
		if (n1!=0) yMax1=n1 / imH;
		if (n2!=0) yMax2=n2 / imH;
		if (n3!=0) yMax3=n3 / imH;
		if (n4!=0) yMax4=n4 / imH;
		if (n5!=0) yMax5=n5 / imH;
		drawRequired = true;
	}

	
	// open graph windoww
	public function Open() {
		isOpen = true;
		DrawGraph();
	}
	
	// close graph windoww
	public function Close() {
		isOpen = false;
	}

			
	public function Toogle() {
		isOpen = !isOpen;
	}
	
	// get next values
	// posar a 0 els que no calgui <---
	public function Log(v1: int, v2: int, v3: int, v4:int, v5: int )	{
		
		//Debug.Log("Grafic. Logging: "+t +" max:"+maxX + " " + v1 +" "+ v2 +" "+ v3+ " " + v4+" " + v5);

		if (t >= maxX) {
			t = 0;
			// we don't reset data. new values will start at left of graphic but we keep old ones to the right
		}
		y1[t] = v1;
		y1MaxFound = y1[t]>y1MaxFound ? y1[t] : y1MaxFound;
		y2[t] = v2;
		y2MaxFound = y2[t]>y2MaxFound ? y2[t] : y2MaxFound;
		y3[t] = v3;
		y3MaxFound = y3[t]>y3MaxFound ? y3[t] : y3MaxFound;
		y4[t] = v4;
		y4MaxFound = y4[t]>y4MaxFound ? y4[t] : y4MaxFound;
		y5[t] = v5;
		y5MaxFound = y5[t]>y4MaxFound ? y5[t] : y5MaxFound;
		t++;
	}
		
	
	// draw datasets in "image" and show "image"
	
	private function DrawGraph(){

		// need redraw -> erase previous image
		if (drawRequired) {
			EraseImage();
		}

		// borrem les columnes posteriors on anem a pintar i pintem la ratlla vermella
		for ( var yw = 0; yw < image.height; yw++) {
	        for (var xw = 1.0*t*escalaX; xw < 1.0*t*escalaX+25 && xw<image.width; xw++) {	
		            image.SetPixel(xw, yw, Color.black);
	        }
	    }

		// normalize and draw each dataset
		switch (numDataSets) {
		case 5:
			// normalize
			for (var i=0;i<=t;i++) {
				y5Norm[i] = y5[i] / yMax5;
				y5Norm[i] = y5Norm[i] > imH ? imH-5 : y5Norm[i];
			}
			// draw
			DrawDataSet(y5Norm, t, setColor[4]);	
		case 4:
			for (i=0;i<=t;i++) {
				y4Norm[i] = y4[i] / yMax4;
				y4Norm[i] = y4Norm[i] > imH ? imH-5 : y4Norm[i];
				}
			DrawDataSet(y4Norm, t, setColor[3]);	
		case 3:
			for (i=0;i<=t;i++) {
				y3Norm[i] = y3[i] / yMax3;
				y3Norm[i] = y3Norm[i] > imH ? imH-5 : y3Norm[i];
				}
			DrawDataSet(y3Norm, t, setColor[2]);		
		case 2:
			for (i=0;i<=t;i++) {
				y2Norm[i] = y2[i] / yMax2;
				y2Norm[i] = y2Norm[i] > imH ? imH-5 : y2Norm[i];
				}
			DrawDataSet(y2Norm, t, setColor[1]);		
		case 1:
			for (i=0;i<=t;i++) {
				y1Norm[i] = y1[i] / yMax1;
				y1Norm[i] = y1Norm[i] > imH ? imH-5 : y1Norm[i];
				}
			DrawDataSet(y1Norm, t, setColor[0]);		
		}
		
		// apply image to screen
		
		image.Apply();
		tempsGraficObert = 0;
		drawRequired = false;
	}
	
	
	// plot one array of data in the image from 0 to xActual
	
	private function DrawDataSet(dataNorm: int[], xActual: int, color: Color) {
			
	    for (var x = 0; x < xActual-1; x++)
	    {
	    	var xf = x*escalaX;
	    	
	    	// fa la linia mes groixuda	        
	    	var fx = dataNorm[x];
	        for (var y = fx; y < fx + lineWidth; y++) {
	            image.SetPixel(xf, y, color);
	        }
	    }

	}
	
	// this should be called inside OnGUI

	public function DoGUI() {
		if (isOpen) {
			// refresca automaticament
			if (drawRequired || tempsGraficObert++ > tempsRefrescGrafic) {	// ojo, OnGUI es pot cridar diversos cops cada frame
				DrawGraph();
			}
		//GUI.Window (0, new Rect(wX, wY, image.width+30, image.height+30), windowGUI1, "");	
		GUI.Window (0, new Rect(wX, wY, image.width+30, image.height+90), windowGUI1, "");	
		}
	}

	function windowGUI1(windowID:int)
	{
	
		// box for image
	// 	GUILayout.Box(image);
/* ????	
		for (var s=0;s<numDataSets;s++) {
		    var st : String = setName[s] as String;  // to avoid warning implicit downcasting
	        //GUI.Box(Rect(10, 10*numDataSets, 30, 10), st);
	        GUI.Box(Rect(10, 10*numDataSets+100, 30, 10), st);
	    }
	    
*/ 
		var n : int;
		var backupGUIColor : Color;
		backupGUIColor = GUI.contentColor;

		//GUILayout.BeginArea(new Rect(5,5, imW ,20));
		//GUILayout.BeginArea(new Rect(5,5, imW ,100));
		//GUILayout.BeginArea(new Rect(5,5, imW ,600));
		GUILayout.BeginVertical();
		
		// info line
		
		GUILayout.BeginHorizontal();
			
			// time
			GUILayout.Label("T: "+SimTime.simTime.ToString("F0")+" ");
			
			// color code for datasets 
			for (var x=0;x<numDataSets;x++) {
				GUI.contentColor = setColor[x];
				GUILayout.Label(setName[x]+" ");
			}
			
			// close button
			GUI.contentColor = backupGUIColor;		
			if (GUILayout.Button ("Close"))       isOpen = false;
		GUILayout.EndHorizontal();
		
		// box for image
		
	 	GUILayout.Box(image);
		
				
		// scale adjust line
		
		GUILayout.BeginHorizontal();
			//GUILayout.Label(setName[0]+":");
			GUI.contentColor = setColor[0];
		    if (GUILayout.Button ("-"))       CanviEscala(1,0.5);
		    n = yMax1 * imH;
		    GUILayout.Label (" "+n.ToString("n0") );
		    if (GUILayout.Button ("+"))       CanviEscala(1,2);;

			if (numDataSets > 1) {
				GUI.contentColor = backupGUIColor;
				//GUILayout.Label(setName[1]+":");
				GUI.contentColor = setColor[1];
				if (GUILayout.Button ("-"))       CanviEscala(2,0.5);
			    n = yMax2 * imH;
			    GUILayout.Label (" "+n.ToString("n0") );
			    if (GUILayout.Button ("+"))       CanviEscala(2,2);
			}

			if (numDataSets > 2) {
				GUI.contentColor = backupGUIColor;
				//GUILayout.Label(setName[2]+":");
			    if (GUILayout.Button ("-"))       CanviEscala(3,0.5);
				GUI.contentColor = setColor[2];
			    n = yMax3 * imH;
			    GUILayout.Label (" "+n.ToString("n0") );
			    if (GUILayout.Button ("+"))       CanviEscala(3,2);
			}
			
			
			if (numDataSets > 3) {
				GUI.contentColor = backupGUIColor;
				//GUILayout.Label(setName[3]+":");
				GUI.contentColor = setColor[3];
			    if (GUILayout.Button ("-"))       CanviEscala(4,0.5);
			   	n = yMax4 * imH;
			    GUILayout.Label (" "+n.ToString("n0") );
			    if (GUILayout.Button ("+"))       CanviEscala(4,2);
			}

			if (numDataSets > 4 ) {
				GUI.contentColor = backupGUIColor;
				//GUILayout.Label(" "+setName[4]+":");
				GUI.contentColor = setColor[4];
			    if (GUILayout.Button ("-"))       CanviEscala(5,0.5);
			    n = yMax5 * imH;
			    GUILayout.Label (" "+n.ToString("n0") );
			    if (GUILayout.Button ("+"))       CanviEscala(5,2);
			}

		GUILayout.EndHorizontal();
		GUI.contentColor = backupGUIColor;		
		
			
		GUILayout.EndVertical();
		//GUILayout.EndArea();	


		GUI.DragWindow (Rect (0,0,10000,10000));			// <-- NO FUNCIONA

	}

	private function CanviEscala(dataSet: int, factor: float) {
		switch(dataSet) {
		case 1: yMax1 *= factor; break;
		case 2: yMax2 *= factor; break;
		case 3: yMax3 *= factor; break;
		case 4: yMax4 *= factor; break;
		case 5: yMax5 *= factor; break;
		}
		drawRequired = true;
	}

	

/*
	private function ResetData(){
		t = 0;
		for (var x = 0; x<maxX;x++) {
			y1[x] = 0;
			y2[x] = 0;
			y3[x] = 0;
			y4[x] = 0;
			y5[x] = 0;
		}
		y1MaxFound = 0;
		y2MaxFound = 0;
		y3MaxFound = 0;
		y4MaxFound = 0;
		y5MaxFound = 0;
	}
	
*/

	private function EraseImage() {
		// erase image (set all pixels to black)
		 for (var y = 0; y < image.height; y++)
	        for (var x = 0; x < image.width; x++)
	            image.SetPixel(x, y, Color.black);
	}
		

}

