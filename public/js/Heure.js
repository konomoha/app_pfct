/**
 * Affiche l'heure en temps réel
 */
function currentTime() {

    let date = new Date();
    let options = { weekday: "long", year: "numeric", month: "long", day: "2-digit" };

    let hh = date.getHours();
    let mm = date.getMinutes();
    let ss = date.getSeconds();

    hh = (hh < 10) ? "0" + hh : hh;
    mm = (mm < 10) ? "0" + mm : mm;
    ss = (ss < 10) ? "0" + ss : ss;

    let time = date.toLocaleDateString("fr-FR", options) + ", il est " + hh + ":" + mm + ":" + ss;

    let date_heure = document.getElementById('ejs_heure');

    if (date_heure != null) {
        
        date_heure.innerText = time;

    }
    
    let t = setTimeout(function () { currentTime() }, 1000);
    
}
