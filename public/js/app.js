$(document).ready(function () {

	currentTime();

	let blockResa = new BlockResa;
	
	blockResa.bloquerResa();

	let scroll = new Scroll;

	$('#scroll_left').click(scroll.scrollToLeft);
	$('#scroll_right').click(scroll.scrollToRight);

	let toggleReservation = new ToggleReservation;

	$('.resa_link').click(toggleReservation.toggleResa);
		
	let activeCreneau = new ActiveCreneau;
	
	$('.boutton_actif').click(activeCreneau.toggleActiveResa);
		
	let activeplage = new ActivePlage;

	$('.plage_button').click(activeplage.toggleActivePlage);

	var date = new Date();

	var affichageDate = new AffichageDate;

	$("#gestion_Generer").click(function(e){

		$('#gestion_Generer').attr('disabled', true);

		$('#spinHistorique').fadeIn();

		let verifResa = $(this).attr('data-verifResa');

		if(verifResa){
			
			e.preventDefault();

			Swal.fire({
				title: "Créer un nouveau planning ?",
				text: "Cette action effacera le planning actuel.",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Oui',
				cancelButtonText: 'Non',
				}).then((result) => {
					if (result.isConfirmed) {
						$('.formulaire_pause').submit();
					}
					else{

						$('#spinHistorique').fadeOut();
						$('#gestion_Generer').attr('disabled', false);
					}
				}
			)

		}

	})

	////////////////////// VERROU PLANNING //////////////////////

	$('.container').on('click', '#verrou_planning', function(e){

		e.preventDefault();

		let idPlanning = $(this).attr('data-idPlanning');

		Swal.fire({
            title: $(this).hasClass('verrou_on') ? 'Déverouiller le planning ?' : 'Verrouiller le planning ?',
			text: $(this).hasClass('verrou_on') ? 'Les agents pourront accéder au planning' : 'Les agents ne pourront plus accéder au planning',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non',
        }).then((result) => {
            if (result.isConfirmed) {

				if($(this).hasClass('verrou_on')){

					$(this).removeClass('verrou_on text-danger fa-lock').addClass('verrou_off text-success fa-unlock-alt')

					$(this).attr('title', 'planning ouvert')
				}
				else{
		
					$(this).removeClass('verrou_off text-success fa-unlock-alt').addClass('verrou_on text-danger fa-lock')

					$(this).attr('title', 'planning fermé')
				}
		
				$.ajax({
					url: Routing.generate('verrou_planning', {'id':idPlanning}),
					type:"POST",
					dataType: "json",
		
					success: function(response){
						if(response !== "error_planning"){
		
							console.log(response)
						}
						else{
		
							console.log('planning non trouvé')
						}
					},
					error: function (jqXHR, exception) {
						responseFail(jqXHR, exception);
					}
				})
                
            }
        })

	})
		
	///////////////////////////DATEPICKER///////////////////////

	$('#datepicker_val').on('change', function () {

		let datepick_val = $(this).val();

		let today = new Date();

		let datepick = new Date(datepick_val);

		date.setFullYear(datepick.getFullYear());
		date.setMonth(datepick.getMonth());
		date.setDate(datepick.getDate());

		let options = { weekday: "long", year: "numeric", month: "long", day: "2-digit" };

		const month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

		let selected_date = datepick.getFullYear() + "-" + month[datepick.getMonth()] + "-" + datepick.getDate();

		let time = datepick.toLocaleDateString("fr-FR", options);

		$.ajax({
			url: Routing.generate('historique'),
			type: "POST",
			dataType: "json",
			beforeSend: function () { $('.spin').fadeIn(); },
            complete: function () { $('.spin').fadeOut(); },
			data: { "selected_date": selected_date },
			
			success: function (response) {
				if (response != 'error') {

					$('#head_historique').html("<tr id='ligne_entete'></tr>");

					let entete_horaire = "<th id='entete_horaire' class='text-center bg_bleu'>Horaires</th>";

					$('#ligne_entete').append(entete_horaire);

					if(response.length !== 0){

						for(let i = 1; i <= response[0].nbPlaces; i++){

							let entete_creneau = "<th id='entete_creneau' class='text-center bg_bleu' colspan='1'>Créneau " + i + "</th>";

							$("#ligne_entete").append(entete_creneau);
						}
					}
					
					if (date.getMonth() === today.getMonth()) {

						if(date.getDate() === today.getDate() && date.getFullYear() === today.getFullYear()) {
							
							affichageDate.affichageCurrent(response);

						}

						else {

							affichageDate.affichageMinus(time, response);
						}
					}

					else {

						affichageDate.affichageMinus(time, response);
					}
				}
			},
			error: function (jqXHR, exception) {
				responseFail(jqXHR, exception);
			}
		}); 
	})

	//////////////////////////////////DATE_MINUS ///////////////////////////
	
	$('#date_minus').click(function (e) {

		e.preventDefault();

		date.setDate(date.getDate() - 1);

		let options = { weekday: "long", year: "numeric", month: "long", day: "2-digit" };

		const month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

		let selected_date = date.getFullYear() + "-" + month[date.getMonth()] + "-" + date.getDate();

		let time = date.toLocaleDateString("fr-FR", options);

		$.ajax({
			url: Routing.generate('historique'),
			type: "POST",
			dataType: 'json',
			beforeSend: function () { $('.spin').fadeIn(); },
            complete: function () { $('.spin').fadeOut(); },
			data: { "selected_date": selected_date },
			
			success: function (response) {

				if (response != 'error') {

					
					$('#head_historique').html("<tr id='ligne_entete'></tr>");

					let entete_horaire = "<th id='entete_horaire' class='text-center bg_bleu'>Horaires</th>";

					$('#ligne_entete').append(entete_horaire);

					if(response.length !== 0){

						for(let i = 1; i <= response[0].nbPlaces; i++){

							let entete_creneau = "<th id='entete_creneau' class='text-center bg_bleu' colspan='1'>Créneau " + i + "</th>";

							$("#ligne_entete").append(entete_creneau);
						}
					}

					affichageDate.affichageMinus(time, response);

				}
				else{
					alert('erreur')
				}
			},

			error: function (jqXHR, exception) {
				responseFail(jqXHR, exception);
			}
		}); 
	});

	/////////////////////////////DATE_PLUS //////////////////////////
	
	$('#date_plus').click(function (e) {

		e.preventDefault();

		let today = new Date();

		date.setDate(date.getDate() + 1);

		let agt = $('#Agt').text().replace(/\s+/g, '').substring(7);

		let options = { weekday: "long", year: "numeric", month: "long", day: "2-digit" };

		const month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

		let selected_date = date.getFullYear() + "-" + month[date.getMonth()] + "-" + date.getDate();

		let time = date.toLocaleDateString("fr-FR", options);

		$('.date_title').attr('id', 'ejs_heure_plus');

		$.ajax({
			url: Routing.generate('historique'),
			type: "POST",
			beforeSend: function () { $('.spin').fadeIn(); },
            complete: function () { $('.spin').fadeOut(); },
			data: {
				"selected_date": selected_date
			},
			
			success: function (response) {

				if (response != 'error') {

					
					$('#head_historique').html("<tr id='ligne_entete'></tr>");

					let entete_horaire = "<th id='entete_horaire' class='text-center bg_bleu'>Horaires</th>";

					$('#ligne_entete').append(entete_horaire);

					if(response.length !== 0){

						for(let i = 1; i <= response[0].nbPlaces; i++){

							let entete_creneau = "<th id='entete_creneau' class='text-center bg_bleu' colspan='1'>Créneau " + i + "</th>";

							$("#ligne_entete").append(entete_creneau);
						}
					}


					if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {

						affichageDate.affichageCurrent(response);
						
					}

					else {

						affichageDate.affichagePlus(response, time);
					}
					
				} else {
					alert('passe pas')
				}
			},

			error: function (jqXHR, exception) {
				responseFail(jqXHR, exception);
			}
		}); 
	});

	////////////////////////////CURRENT_DATE ///////////////////////

	$('#current_date').click(function (e) {

		e.preventDefault();

		date = new Date();

		let agt = $('#Agt').text().replace(/\s+/g, '').substring(7);

		const month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

		let selected_date = date.getFullYear() + "-" + month[date.getMonth()] + "-" + date.getDate();

		$.ajax({
			url: Routing.generate('historique'),
			type: "POST",
			beforeSend: function () { $('.spin').fadeIn(); },
            complete: function () { $('.spin').fadeOut(); },
			data: {
				"selected_date": selected_date,
				"agt": agt
			},
			
			success: function (response) {

				if (response != 'error') {

					$('#head_historique').html("<tr id='ligne_entete'></tr>");

					let entete_horaire = "<th id='entete_horaire' class='text-center bg_bleu'>Horaires</th>";

					$('#ligne_entete').append(entete_horaire);

					if(response.length !== 0){

						for(let i = 1; i <= response[0].nbPlaces; i++){

							let entete_creneau = "<th id='entete_creneau' class='text-center bg_bleu' colspan='1'>Créneau " + i + "</th>";

							$("#ligne_entete").append(entete_creneau);
						}
					}

					affichageDate.affichageCurrent(response);

				} else {
					alert('une erreur est survenue');
				}
			},

			error: function (jqXHR, exception) {
				responseFail(jqXHR, exception);
			}
		}); 
	});

	/////////////////////// RESPONSE FAIL ///////////////////////////
	function responseFail(jqXHR, exception) {
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
	};

});