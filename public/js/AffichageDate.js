class AffichageDate
{
    ///////////////////////////////////////////////////////// FONCTION AFFICHAGE PLUS ///////////////////////////////////////////////////////
	
	/**
	 * Affiche l'historique du jour suivant
	 * @param {*} response contient toutes les infos des réservations effectuées
	 * @param {*} time affiche la date sélectionnée
	 */
    affichagePlus(response, time) {
		
		$('.planning_link').hide();

		//Si la response est vide, on affiche un message et on cache le tableau
		if (response.length === 0) {

			$('#tab_historique').hide();

			$('#scroll_left').addClass('scroll_hide');
			$('#scroll_right').addClass('scroll_hide');

			let noHistory = "Pas d'historique disponible pour le " + time;

			$('#schedule_title').html(noHistory);

		}
		else {

			//On désactive les liens de réservation
			$('.creneau').css('pointer-events', 'none');
			
			$('#schedule_title').html('Planning du ' + time);

			$('#body_historique').html('');

			//on affiche de nouveau le tableau
			$('#tab_historique').show();

			$('#scroll_right').removeClass('scroll_hide');
			$('#scroll_left').removeClass('scroll_hide');

			let resa_compteur = 0;

			while (resa_compteur < response.length) {

				for (let i = 0; i < response[0].plages_horaire.length; i++) {

					let row = "<tr id='ligne_" + i + "'><td class='text-center fw-bold cell_horaire'>" + response[0].plages_horaire[i] + "</td></tr>";

					$('#body_historique').append(row);

					let separateur = "<tr><td class='bg-white' colspan='12'></td></tr>";

					if(!response.fullDay){

						(response[0].plages_horaire[i] === '11h40 - 12h00') ? $('#body_historique').append(separateur) : '';
					}
					
					for (let e = 0; e < response[0].nbPlaces; e++) {
						
						let cells = "";
						
						if (response[resa_compteur].agent !== "") {

							cells = "<td class='bg-warning text-danger text-center resa_cell fw-bold creneau taken2'><b>" + response[resa_compteur].agent.nom + "</b><br><b>" + response[resa_compteur].agent.prenom + "</b></td>";
						}
						else {
							
							if (response[resa_compteur].actif === false) {
								cells = "<td class='bg-warning text-center resa_cell inactif2'></i></td>";
							}
							else {
								cells = "<td class='bg-success text-primary text-center resa_cell fw-bold creneau'>Non réservé</td>";
							}

						}

						$('#ligne_' + i).append(cells);
						
						resa_compteur++;
					}
				}
			}
		}
		$('.date_title').attr('id', 'ejs_heure_plus');
		$('#ejs_heure_plus').css('font-size', '1.6rem');
		$('#ejs_heure_plus').css('margin-bottom', '5px');
		$('.date_title').html('<span>' + time + '</span>');
    }

    ////////////////////// FONCTION AFFICHAGE MINUS ///////////////////////////
    
	/**
	 * Affiche l'historique du jour précédent
	 * @param {*} time affiche la date sélectionnée
	 * @param {*} response retourne toutes les infos des réservations effectuées
	 */
    affichageMinus(time, response) {

        $('.creneau').css('pointer-events', 'none');
        $('.planning_link').hide();
    
        if (response.length === 0) {
    
            $('#tab_historique').hide();
            $('#scroll_left').addClass('scroll_hide');
            $('#scroll_right').addClass('scroll_hide');
    
            let noHistory = "Pas d'historique disponible pour le " + time;
    
            $('#schedule_title').html(noHistory);
        }
        else {
			$('#scroll_right').removeClass('scroll_hide');
			$('#scroll_left').removeClass('scroll_hide');
            
            $('#schedule_title').html('Planning du ' + time);
    
            $('#body_historique').html('');
    
            $('#tab_historique').show();
    
            let resa_compteur = 0;
    
            while (resa_compteur < response.length) {
    
                for (let i = 0; i < response[0].plages_horaire.length; i++) {
    
                    let row = "<tr id='ligne_" + i + "'><td class='text-center fw-bold cell_horaire'>" + response[0].plages_horaire[i] + "</td></tr>";
    
                    $('#body_historique').append(row);
    
                    let separateur = "<tr><td class='bg-white' colspan='12'></td></tr>";
    
                    (response[0].plages_horaire[i] === '11h40 - 12h00') ? $('#body_historique').append(separateur) : '';
    
                    for (let e = 0; e < response[0].nbPlaces; e++) {
    
                        let cells = "";
    
                        
                        if (response[resa_compteur].agent !== "") {
    
                            cells = "<td class='bg-warning text-danger text-center resa_cell fw-bold creneau taken2'><b>" + response[resa_compteur].agent.nom + "</b><br><b>" + response[resa_compteur].agent.prenom + "</b></td>";
                        }
                        else {
    
                            if (response[resa_compteur].actif === false) {
                                cells = "<td class='bg-warning text-center resa_cell inactif2'></i></td>";
                            }
                            else {
                                cells = "<td class='bg-success text-primary text-center resa_cell fw-bold creneau'>Non réservé</td>";
                            }
                            
                        }
                        
                        $('#ligne_' + i).append(cells);
                        
                        
                        resa_compteur++;
                    }
                }
            }
        }
    
        $('.date_title').attr('id', 'ejs_heure_minus');
        $('#ejs_heure_minus').css('font-size', '1.6rem');
        $('#ejs_heure_minus').css('margin-bottom', '5px');
        $('.date_title').html('<span>' + time + '</span>');
        
        $('#date_plus').prop('hidden', false);
        $('#current_date').prop('hidden', false);
    
    }

    ///////////////////// FONCTION AFFICHAGE CURRENT //////////////////////////
	/**
	 * Affiche le planning du jour
	 * @param {*} response retourne toutes les infos des réservations du jour
	 */
	affichageCurrent(response) {

		let activeCreneau = new ActiveCreneau;
		let toggleReservation = new ToggleReservation;
		let activeplage = new ActivePlage;
		let blockResa = new BlockResa;

		$('.date_title').attr('id', 'ejs_heure');
			
		currentTime();

		$('.planning_link').show();

		$('#date_plus').prop('hidden', true);

		$('#current_date').prop('hidden', true);

		if (response.length === 0) {
			
			$('#tab_historique').hide();

			$('#scroll_left').addClass('scroll_hide');
			$('#scroll_right').addClass('scroll_hide');
			
			$('#schedule_title').html("Le planning du jour n'a pas encore été généré");

		}
		else {

			let verrou;

			if(response[0].gestionVerrou){

				verrou = "<a title='planning fermé' href=''><i class='fas fa-lock verrou_on text-danger' id='verrou_planning' data-idPlanning='"+ response[0].gestionId + "'></i></a>";
			}
			else{

				verrou = "<a title='planning fermé' href=''><i class='fas fa-unlock-alt verrou_off text-success' id='verrou_planning' data-idPlanning='"+ response[0].gestionId + "'></i></a>";
			}
			
			$('#schedule_title').html('Planning du jour &nbsp;&nbsp;'+ verrou);

			$('#tab_historique').show();

			$('#scroll_right').removeClass('scroll_hide');
			$('#scroll_left').removeClass('scroll_hide');

			$('#body_historique').html('');

			let resa_compteur = 0;

			while (resa_compteur < response.length) {

				for (let i = 0; i < response[0].plages_horaire.length; i++) {

					let row = "<tr id='ligne_" + i + "'><td class='text-center fw-bold cell_horaire plage' data-stamp='" + response[resa_compteur].stamp + "'><div><span><i class='fa fa-power-off plage_button text-success' id='" + response[resa_compteur].pauseId + "'></i></span><span>" + response[0].plages_horaire[i] + "</span></div></td></tr>";

					$('#body_historique').append(row);

					let separateur = "<tr><td class='bg-white' colspan='12'></td></tr>";

					(response[0].plages_horaire[i] === '11h40 - 12h00') ? $('#body_historique').append(separateur) : '';
					
					for (let e = 0; e < response[0].nbPlaces; e++) {

						let cells = "";

						if (response[resa_compteur].agent === "") {

							if (response[resa_compteur].actif === true) {

								cells = "<td class='bg-success text-center resa_cell'><a id='" + response[resa_compteur].idCreneau + "' class='resa_link creneau' href='#'>" + response[resa_compteur].statut + "</a><i class='fa fa-power-off boutton_actif mx-3'></i></td>";
							}
							else {
								cells = "<td class='bg-success text-center resa_cell inactif'><a id='" + response[resa_compteur].idCreneau + "' class='resa_link creneau' href='#' style='display: none;'>" + response[resa_compteur].statut + "</a><i class='fa fa-power-off boutton_actif boutton_on_off'></i></td>";
							}
							
						}

						else {
							
							if (response[resa_compteur].agentConnecte === response[resa_compteur].agent.numagt) {
								cells = "<td class='bg-success text-center resa_cell taken2'><a id='" + response[resa_compteur].idCreneau + "' class='supp_creneau resa_link' href='#'><b>" + response[resa_compteur].agent.nom + "</b><br><b>" + response[resa_compteur].agent.prenom + "</b></a><i class='fa fa-power-off boutton_actif mx-3' style='display: none;'></i></td>";
							}

							else {

								cells = "<td class='bg-warning text-danger text-center resa_cell fw-bold taken2'><b>" + response[resa_compteur].agent.nom + "</b><br><b>" + response[resa_compteur].agent.prenom + "</b></td>";

							}
						}

						$('#ligne_' + i).append(cells);
						
						resa_compteur++;
					}
				}
			}

			blockResa.bloquerResa();
			$('.resa_link').click(toggleReservation.toggleResa);
			$('.boutton_actif').click(activeCreneau.toggleActiveResa);
			$('.plage_button').click(activeplage.toggleActivePlage);
		}
	}
}