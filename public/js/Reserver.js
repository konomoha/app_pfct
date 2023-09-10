class Reserver
{
    ////////////////////////////// RESERVER PAUSE ///////////////////////////////////
	/**
	 * Permet de réserver une pause
	 * @param {*} e 
	 * @param {*} a 
	 * @param {*} boutton 
	 */
    reserverPause(e, a, boutton)
    {
		e.preventDefault();

		let creneauId = a.attr('id');

		let agt = $('#Agt').text();

		let spin = "<div class='spin2'></div>"

		$.ajax({
			url:  Routing.generate('reservation'),
			type: "POST",
			beforeSend: function () { a.html(spin)},
			data: { "creneauId" : creneauId 
						,  "agt" :agt},
			
			success: function (response) {

				console.log(response);

				if (response != 'error_AM' && response != 'error_PM' && response != 'error_dispo' && response != "error_verrou") {
					
					boutton.toggle("normal");
					
					(response.role === "ROLE_MANAGER")? a.parent().addClass('taken2') : a.parent().addClass('taken');

					a.html('<b>' + response.nom + '</b><br><b>' + response.prenom + '</b>');

				}

				else{

					switch (response) {

						case 'error_AM':

							Swal.fire({
								icon: 'error',
								title: 'Attention ! ',
								text: '1 seule réservation possible par demi-journée !',
							});
							a.toggleClass('creneau');
							a.toggleClass('supp_creneau');
							a.html('Disponible');
							break;
						
						case 'error_PM':

							Swal.fire({
								icon: 'error',
								title: 'Attention ! ',
								text: '1 seule réservation possible par demi-journée !',
							});
							a.toggleClass('creneau');
							a.toggleClass('supp_creneau');
							a.html('Disponible');
							break;
						
						case 'error_dispo':

							Swal.fire('Ce créneau est indisponible !')
							a.toggleClass('creneau');
							a.toggleClass('supp_creneau');
							a.html('Disponible');
							break;
					}
				}
			},
			error: function (jqXHR, exception) {
				var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                console.log(msg)
			}
		}); 
		
    }
    
    /////////////////////////// SUPPRIMER PAUSE ////////////////////

	/**
	 * Annule la réservation d'une pause
	 * @param {*} e 
	 * @param {*} a 
	 * @param {*} boutton 
	 */
    supprimerPause(e, a, boutton)
    {	
		e.preventDefault();

		let idCreneau = a.attr('id');

		$.ajax({
			url: Routing.generate('suppression'),
			type: "POST",
			data: {
				'idCreneau' : idCreneau
			},

			success: function (response) {

				if(response !== "error_verrou"){

					boutton.toggle("normal");
					a.parent().removeClass('taken');
					a.parent().removeClass('taken2')
					a.html(response.statut);
				}
				
			},

			error: function (jqXHR, exception) {
				var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                console.log(msg)
			}
		})

	}

}