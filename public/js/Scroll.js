class Scroll 
{
    ///////////////////////////////////////////////////////////// SCROLL LEFT ///////////////////////////////////////////////////////////

    /**
     * Effectue un scroll automatique du planning vers la gauche
     */
    scrollToLeft() {
        
        let position = $('#body_historique').scrollLeft();

        $("#body_historique").animate({

            scrollLeft: position - 819

        }, 200);

        $("#head_historique").animate({

            scrollLeft: position - 819

        }, 200);

        console.log('un scroll left a été effectué');

    }

    ///////////////////////////////////////////////////////////// SCROLL RIGHT ///////////////////////////////////////////////////////////

    /**
     * Effectue un scroll automatique du planning vers la droite
     */
    scrollToRight() {
        
        let position = $('#body_historique').scrollLeft();


        $("#body_historique").animate({

            scrollLeft: position + 819

        }, 200);

        $("#head_historique").animate({

            scrollLeft: position + 819

        }, 200);

        console.log('un scroll right a été effectué');

    };
}