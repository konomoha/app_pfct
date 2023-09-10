class BlockResa
{
    /**
     * Bloque la possibilité de modifier une réservation une fois la plage horaire dépassée
     */
    bloquerResa()
    {
        let date = new Date();

        let sec = date.getSeconds();
        let min = date.getMinutes();
        let hours = date.getHours();

        let sec0 = (sec < 10)? "0" : "";
        
        let min0 = (min < 10) ? "0" : "";
        
        let hour0 = (hours < 10) ? "0" : "";

        let time = hour0 + hours + ':' + min0 + min + ':' + sec0 + sec;


        let horaires = $('.cell_horaire');

        for (let horaire of horaires){

            let cells = $("[data-stamp='" + horaire.dataset.stamp + "']").siblings();

            let a = cells.children('a');

            if (time > horaire.dataset.stamp){

                a.removeClass('creneau supp_creneau');

                a.click(function (e) {

                    e.preventDefault();

                    Swal.fire({
                        icon: 'error',
                        title: 'Horaire dépassé ! ',
                        text: 'Réservation / Suppression impossible.',
                    });
                    
                });
            }
            
        }
    }
}