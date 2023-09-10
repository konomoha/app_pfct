class Plage
{
    ///////////////////////////////////////////////////////////////// ACTIVE ALL TRUE///////////////////////////////////////////////////////////////////
	
	/**
	 * Active tous les créneaux libres d'une plage horaire
	 * @param {*} boutton_plage 
	 */
	activeAllTrue(boutton_plage) {
		
		let cells = boutton_plage.closest('td').siblings();

		let pauseId = boutton_plage.attr('id');

		$.ajax({
			url: Routing.generate('activeAllTrue'),
			type: "POST",
			data: { "pauseId": pauseId },
			
			success: function (response) {
				if (response != "error") {
					
					for (let i = 0; i < response.length; i++){
						
						let a = $('#' + response[i].id);

						let boutton = a.siblings();

						let parent = boutton.parent();

						if (parent.hasClass('inactif')) {
							parent.removeClass('inactif');
							boutton.removeClass('boutton_on_off');
							a.show('fast');
						}
						else if (parent.hasClass('inactifAll')) {
							parent.removeClass('inactifAll');
							boutton.removeClass('boutton_on_off');
							a.show('fast');
						}
					}

				}
				else {
					alert('marche pas');
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
			
		boutton_plage.toggleClass('plage_on text-success');
		boutton_plage.toggleClass('plage_off text-danger');
	}

///////////////////////////////////////////////////////////////// ACTIVE ALL FALSE ///////////////////////////////////////////////////////////
	
	/**
	 * Désactive tous les créneaux libres d'une plage horaire
	 * @param {*} boutton_plage 
	 */
	activeAllFalse(boutton_plage) {
	
		let cells = boutton_plage.closest('td').siblings();

		let pauseId = boutton_plage.attr('id');

		console.log(cells);

		$.ajax({
			url: Routing.generate('activeAllFalse'),
			type: "POST",
			data: { "pauseId": pauseId },
			
			success: function (response) {
				if (response != "error") {
					
					for (let i = 0; i < response.length; i++){

						let a = $('#' + response[i].id);

						let boutton = a.siblings();

						let parent = boutton.parent();

						if (parent.hasClass('inactif')) {
							
							parent.removeClass('inactif');

						}

						parent.addClass('inactifAll');

						boutton.addClass('boutton_on_off');

						a.hide('fast');

					}	
				}
				else {
					alert('marche pas');
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

		boutton_plage.toggleClass('plage_off text-danger');
		boutton_plage.toggleClass('plage_on text-success');
			
	}	
}