class ActiveCreneau
{
    /**
     * Active ou Désactive un créneau de pause
     */
    toggleActiveResa(){

        let boutton = $(this);
    
        let a = boutton.siblings();
    
        let creneauId = a.attr('id');
    
        let parent = boutton.parent();
    
        $.ajax({
            url: Routing.generate('active'),
            type: "POST",
            data: { "creneauId": creneauId },
        
            success: function (response) {
                if (response != 'error_active') {
                    
                    if (parent.hasClass('inactifAll')) {

                        a.show('fast');
                        parent.toggleClass('inactifAll');
                        boutton.removeClass('boutton_on_off');
                        
                    }

                    else if (parent.hasClass('inactif')){

                        a.show('fast');
                        parent.toggleClass('inactif');
                        boutton.removeClass('boutton_on_off');
                    }

                    else {

                        a.hide('fast');
                        parent.toggleClass('inactif');
                        boutton.toggleClass('boutton_on_off');
                    }
                    
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Attention',
                        text: 'Créneau réservé: la désactivation est impossible!',
                    });
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
    
}