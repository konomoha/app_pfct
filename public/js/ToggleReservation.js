class ToggleReservation
{
	/**
	 * Déclenche la fonction reserverPause() ou supprimerPause() selon la classe de l'élément cible
	 * @param {*} e 
	 */
    toggleResa(e) {

		e.preventDefault();
        
		let reservation = new Reserver;
		
		let a = $(this);

		let boutton = $(this).siblings();

		if ($(this).hasClass('creneau')) {
			
			if($('#verrou_planning').hasClass('verrou_on')){

				Swal.fire({
					icon: 'error',
					title: 'Réservation temporairement suspendue !'
				});
				a.addClass('creneau');
				a.removeClass('supp_creneau');
				a.html('Disponible');

			}
			else{

				reservation.reserverPause(e, a, boutton);
			
				$(this).toggleClass('creneau');
				$(this).toggleClass('supp_creneau');
			}

		}
		
		else if ($(this).hasClass('supp_creneau')) {
			
			if($('#verrou_planning').hasClass('verrou_on')){

				Swal.fire({
					icon: 'error',
					title: 'Suppression temporairement suspendue !'
				});
				
				a.addClass('supp_creneau').removeClass('creneau');
				
			}
			else{

				reservation.supprimerPause(e, a, boutton);

				$(this).toggleClass('creneau');
				$(this).toggleClass('supp_creneau');
			}
		}	
		
	}; 
}