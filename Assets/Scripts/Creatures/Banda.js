#pragma strict
/*
Bandes
	- Els animals IDLEls poden decidir ajuntar-se a una banda.
	- Les bandes acostumen a estar dirigides per un lider.
	- Les bandes son jerarquiques. Cada membre segueix un altre membre, que es el seu lider. Al final hi ha el lider de la banda que no segueix a ningu.
	- Els membres de les bandes s'intercanvien informacio.
		○ Quans membres els estan seguint
		○ On creuen que hi ha menjar i el lider pot decidir anar-hi (PTE)
		○ Si un membre de la banda ha vist un enemic pot informar la banda per a que fugi encara que no l'hagi vist (?) (PTE)
	- Quan veuen menjar o amenaces surten de la banda.

Com es crida la banda?
	- Animals tenen una variable "banda".
	- Creature te un estat BANDA.
	- Animal, en estat BANDA, fa el mateix que en estat IDLE pero en comptes de Mou() fa MouBanda()
	- En MouIDLE(), testeja si els veins poden ser liders i si en troba un canvia a estat banda
	
	CheckLider()
	SegueixLider()
	UpdateInfoLider()
	En MouFugida() tambe segueix el lider

Banda
	
	no caldria que fos monobehaviour  !!!???

	la "banda" es una estructura en arbre
		a qui segueixo i en quin dels seus "slots" estic
		qui em segueix en cada un dels meus "slots"
	
	InicialitzaBanda()
	UpdateInfoLider()
		actualitza seguidorsTotal del meu lider sumant-li els meus
	CheckLider(animal)
		animal pot ser lider si 
			seguidorsDirectes < max
			&& no soc jo mateix
			&& te mes seguidors que jo
	AbandonaLider()
	SegueixLider()
	DonamSlot()
	AlliberaSlot()
*/


public class Banda extends MonoBehaviour {

		
	@HideInInspector var jo: Animal;						// punter al meu component animal
	@HideInInspector var elMeuLider : Animal;				// el que estic seguint
	@HideInInspector var elMeuLiderTornAnterior : Animal;	
	@HideInInspector var slotMeu = 0;	// 1=E, 2=C, 3=D   -- en quin slot estic seguint al pare
	
	// seguidors
	@HideInInspector var slotEsquerra : Animal;				// el meu seguidor en cada slot
	@HideInInspector var slotCentre : Animal;
	@HideInInspector var slotDreta : Animal;
	@HideInInspector var seguidorsTotal = 0;				// gent que m'esta seguint en total
	@HideInInspector var seguidorsDirectes = 0;				// gent que m'esta seguint directament
	private var maxSeguidorsDirectes : int;					// cache valor
	private var seguidorsTotalAnterior = 0;		// seguidors totals


	public function InicialitzaBanda(jo: Animal) {
		this.jo = jo;
		elMeuLider = null;
		elMeuLiderTornAnterior = null;
		seguidorsTotalAnterior = 0;
		slotEsquerra = null;
		slotCentre = null;
		slotDreta = null;
		slotMeu = 0;
		//maxSeguidorsDirectes = jo.getMaxSeguidorsDirectes();	// cache
		maxSeguidorsDirectes = jo.dna.maxSeguidorsDirectes;
	}
	
	// a cada torn han de traspassar cap endavant el numero de seguidors que s'han afegit o sortit de la cua
	public function UpdateInfoLider() {
		if (elMeuLider==null) {
			Debug.Log("*** ERROR *** Banda.UpdateInfoLider elMeuLider == null");
			return;
		}
			
		elMeuLider.banda.seguidorsTotal += (seguidorsTotal + 1 - seguidorsTotalAnterior);
		elMeuLiderTornAnterior = elMeuLider;
		seguidorsTotalAnterior = (seguidorsTotal + 1);
		
	}
	// l'animal compleix les condicions per ser lider?
	public function CheckLider(animal: Animal): boolean {
	//public function CheckLider(animal: Creature): boolean {
		if (animal==null || animal.banda == null) {
			Debug.Log("*** ERROR **** Banda.CheckLider: "+animal.EtiquetaSobreAnimal());
			return false;
		}
		
		jo.Rajo("seguidors directes ell: "+animal.banda.seguidorsDirectes + ", max :"+ animal.banda.maxSeguidorsDirectes);
		if (animal.banda.elMeuLider==null)
			jo.Rajo("seu lider: null, jo: "+jo.meuId);
		else
			jo.Rajo("seu lider: "+animal.banda.elMeuLider.meuId + ", jo: "+jo.meuId);
		jo.Rajo("seguidorsTotal -  ell: "+animal.banda.seguidorsTotal+ ",  meus: "+seguidorsTotal);

		return
			// encara te un slot per a que el segueixin?
			//animal.banda.seguidorsDirectes < animal.dna.maxSeguidorsDirectes
			animal.banda.seguidorsDirectes < animal.banda.maxSeguidorsDirectes
			// no m'esta seguint a mi
			&& animal.banda.elMeuLider != jo
			// es lider o el segueixen mes seguidors que a mi
			&& animal.banda.seguidorsTotal >= seguidorsTotal
			; 	 	
	}
	public function AbandonaLider() {
		if (elMeuLider != null) {
			elMeuLider.banda.seguidorsTotal -= (seguidorsTotal + 1);	// sumem el propi animal
			elMeuLider.banda.AlliberaSlot(slotMeu);	
			slotMeu = 0;	
			elMeuLider = null;
		}
	}	
	public function SegueixLider(animal: Animal) {
		if (animal == jo) {
			Debug.Log("*** ERROR *** Segueix lider. animal == jo!!");
			return;
		}
		if (animal == null) {
			Debug.Log("*** ERROR *** Segueix lider. animal == null!!");
			return;
		}
			
		if (animal != elMeuLider) 
			if (CheckLider(animal)) {
				slotMeu = animal.banda.DonamSlot(jo);
				if (slotMeu != 0)  {
					jo.Rajo("rebut slot: "+slotMeu);
					elMeuLiderTornAnterior = elMeuLider;
					elMeuLider = animal;
					elMeuLider.banda.seguidorsTotal += (seguidorsTotal + 1);
					seguidorsTotalAnterior = (seguidorsTotal + 1);
					//Rajo("Nou lider! "+elMeuLider.meuId);
					// ja informarem de seguidors en UpdateInfoLider    OJO
				}
			}
	}

	// 0=cap, 1=E, 2=C, 3=D
	// el lider diu si te un slot lliure 
	public function DonamSlot(animal: Animal): int {
		if (slotEsquerra == null) {
			slotEsquerra = animal;
			seguidorsDirectes ++;	
			return 1;
		}
		else if (slotCentre == null) {
			slotCentre = animal;
			seguidorsDirectes ++;	
			return 2;
		}
		else if (slotDreta == null) {
			slotDreta = animal;
			seguidorsDirectes ++;	
			return 3;
		}
		return 0;
	}
	
	public function AlliberaSlot(slot: int) {
		switch(slot) {
			case 1:
				slotEsquerra = null;
				seguidorsDirectes --;
				break;	
			case 2:
				slotCentre = null;
				seguidorsDirectes --;
				break;	
			case 3:
				slotDreta = null;
				seguidorsDirectes --;
				break;	
			default:
				Debug.Log("*** ERROR *** AlliberaSlot slot= "+slot);
		}
	}
	
	
	
}