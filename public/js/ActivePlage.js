class ActivePlage
{
	/**
	 * Active / Désactive tous les créneaux d'une plage horaire
	 */
    toggleActivePlage() {

		let boutton_plage = $(this);
		
        let plage = new Plage;

		if ($(this).hasClass('plage_on')) {
		
			plage.activeAllTrue(boutton_plage);
		}
		else {
			plage.activeAllFalse(boutton_plage);
		}
			
	}
	
}