<?php

namespace App\Controller;

use App\Entity\Pauses;
use App\Entity\ResaPauses;
use App\Repository\GestionRepository;
use App\Repository\PausesRepository;
use App\Repository\ResaPausesRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Annotation\Route;

class CalendrierController extends AbstractController
{
    //////////////////////////INDEX //////////////////
    /**
     * @Route("/", name="index")
     */
    public function index(){

        $test = "page d'accueil";
        $user = $this->getUser();

        $userNumAgt = substr($user->getIdentifiant(), 0, 5);

        return $this->render('index.html.twig', ['test' => $test, 'user' => $user]);
    }

    ////////////////////////////// DOCUMENTATION ////////////////////

    /**
     * Mode opératoire de l'application PFCT
     *
     * @return void
     */
    public function documentation()
    {

        $user = $this->getUser();


        if($user->getRoles()[0] === "ROLE1"){

            return $this->file('doc_pfct_manager.pdf', null, ResponseHeaderBag::DISPOSITION_INLINE);

        }
        else{
            return $this->file('doc_pfct_agent.pdf', null, ResponseHeaderBag::DISPOSITION_INLINE);
        }

    }

    ////////////////////////////////PLANNING //////////////////////////
    /**
     * @Route("/planning", name="planning")
     */
    public function planning(PausesRepository $pauseRepo, ResaPausesRepository $resaPauseRepo, service $service, Request $request, GestionRepository $gestionRepo): Response
    {
        $today = date('Y-m-d');

        $converted_date = date_create_from_format('Y-m-d', $today);

        $reservations = $resaPauseRepo->findByCurrentDate();

        $gestionData = ($reservations)? $gestionRepo->findOneBy(['id' => $reservations[0]['gestion_id']], []) : "";

        $pauses = "";

        if($gestionData){

            $pauses = ($gestionData->getMeridien())? $pauseRepo->findBy(['meridien' => $gestionData->getMeridien()], ['id' => 'ASC']) : $pauseRepo->findBy(array(), array('id' => 'ASC'));
        }

        $fullDay = ($gestionData && !$gestionData->getMeridien())? true : false;
        
        $planning = (!$reservations) ? false : true;

        $resa_pauses = $this->getDoctrine()->getRepository(ResaPauses::class)->findAll();

        $nb_place_dispo = $gestionRepo->findLast();

        $agents = [];
        
        $resa_pause_numAgt = $this->getDoctrine()->getRepository(ResaPauses::class)->findBy(['date' => $converted_date], ['numAgt' => 'ASC']);

        foreach ($resa_pause_numAgt as $key => $value) {

           $numAgt =  $value->getNumAgt();
            
            if($numAgt != null){

                $agent = $service->getAgentByNumAgt($numAgt);

                $agents[] = [
                    "prenom" => $agent['prenom'],
                    "nom" => $agent['nom'],
                    'numagt' =>$numAgt,
                    "idCreneau" => $value->getId()
                ];

            }
        
        }

        $user = $this->getUser();

        $userNumAgt = substr($user->getIdentifiant(), 0, 5);

         $userVerif = $service->getAgentByNumAgt($userNumAgt);

        if(!$userVerif){
            return $this->render('indexAccess.html.twig', []);
        }
        else{
            
            return $this->render('calendrier/index.html.twig', [
                'resa_pauses' => $resa_pauses,
                'pauses' => $pauses,
                'nbCreneaux' => $nb_place_dispo[0]['nb_creneaux'],
                'user' => $user,
                'userNumAgt' =>$userNumAgt,
                'reservations' => $reservations,
                'agents' => $agents,
                'planning' => $planning,
                'gestionData' => $gestionData,
                'fullDay' => $fullDay
            ]);
        }
    }

    //////////////////////  RESERVATION ////////////////////////

    /**
     * Enregistrement d'une réservation en bdd
     *
     * @param ResaPauses|null $resaPause
     * @param ResaPausesRepository $resaPauseRepo
     * @param EntityManagerInterface $em
     * @param Request $request
     */
    public function reserverPause(ResaPauses $resaPause = null, ResaPausesRepository $resaPauseRepo, GestionRepository $gestionRepo, EntityManagerInterface $em, Request $request)
    {
        $creneauID=$request->get('creneauId');
        $numAgt=$request->get('agt');

        $user = $this->getUser();
        $data['nom'] = $user->getNom();
        $data['prenom']=$user->getPrenom();
        $data['numagt'] = $numAgt;
        $data['role']= $user->getRoles()[0];
        $resa_pauses = $resaPauseRepo->findAll();
        $nbSaisieAM = 0;
        $nbSaisiePM = 0;
        $today = date('Y-m-d');

        $resaPause = $this->getDoctrine()->getRepository(ResaPauses::class)->findOneBy(['id'=>$creneauID]);

        foreach ($resa_pauses as $key => $value) {

            if ($value->getNumAgt() == $numAgt && $value->getDate()->format('Y-m-d') === $today){

                if($value->getPause()->getMeridien() === 'am'){

                    $nbSaisieAM++;

                    if($resaPause->getPause()->getMeridien() === "am" && $nbSaisieAM > 0){
                        return new JsonResponse('error_AM');
                    }

                }

                elseif($value->getPause()->getMeridien() === 'pm'){

                    $nbSaisiePM++;
                    
                    if($resaPause->getPause()->getMeridien() === "pm" && $nbSaisiePM > 0){
                        return new JsonResponse('error_PM');
                    }

                }
                
            }
        }

        if($resaPause->getNumAgt() != "" || $resaPause->getActif() === false){

            return new JsonResponse('error_dispo');
        }

        $planning = $gestionRepo->findOneBy(['id' => $resaPause->getGestion()], []);

        if($planning->getVerrouillage()){
            return new JsonResponse('error_verrou');
        }
        
        $resaPause->setNumAgt(intval($numAgt));
        $em->persist($resaPause);
        $em->flush();
        return new JsonResponse($data);

    }

    //////////////////////SUPPRESSION ////////////////////////

    /**
     * Suppression d'une réservation en bdd
     *
     * @param ResaPausesRepository $resaPausesRepo
     * @param Request $request
     * @param EntityManagerInterface $em
     * @return void
     */

    public function supprimerPause(GestionRepository $gestionRepo, Request $request, EntityManagerInterface $em)
    {
        $idCreneau = $request->get('idCreneau');

        $user = $this->getUser();
        
        if($user){

            

            $reservation = $this->getDoctrine()->getRepository(ResaPauses::class)->findOneBy(['id'=>$idCreneau]);

            $planning = $gestionRepo->findOneBy(['id' => $reservation->getGestion()], []);

            if($planning->getVerrouillage()){

                return new JsonResponse('error_verrou');
            }

            $reservation->setNumAgt(null);
            $em->persist($reservation);
            $em->flush();

            $data = ['creneauID' => $reservation->getId(),
                    'statut' => $reservation->getStatut()];

            return new JsonResponse($data);

        }
    }

//////////////////////ACTIVE CRENEAU /////////////////////////////

/**
 * Activation / Désactivation d'un créneau de réservation
 *
 * @param ResaPausesRepository $resaPauseRepo
 * @param Request $request
 * @return void
 */
    public function activeCreneau(ResaPausesRepository $resaPauseRepo, Request $request)
    {
        
        $id = $request->get('creneauId');

        $reservation = $resaPauseRepo->findOneBy(['id'=>$id]);

        $em = $this->getDoctrine()->getManager();

        $reservation->setActif(!$reservation->getActif());

        if(!empty($reservation->getNumAgt())){

            return new JsonResponse('error_active');

        }

        $em->persist($reservation);
        $em->flush();
        
        return new JsonResponse($reservation);
    }

///////////////////////////// ACTIVE ALL CRENEAU TRUE //////////////////////////////

/**
 * Activation de tous les créneaux d'une plage
 *
 * @param ResaPausesRepository $resaPauseRepo
 * @param Request $request
 * @return void
 */
public function activeAllCreneauTrue(ResaPausesRepository $resaPauseRepo, Request $request)
{
    $pauseId = $request->get('pauseId');

    $date = date('Y-m-d');

    $converted_date = date_create_from_format('Y-m-d', $date);

    $reservations = $resaPauseRepo->findBy(['pause' => $pauseId, 'date' => $converted_date, 'numAgt' => null], ['id' => 'ASC']);

    $em = $this->getDoctrine()->getManager();

    $resatab = [];

    for($i= 0; $i < count($reservations); $i++){

        $reservations[$i]->setActif(true);

        $em->persist($reservations[$i]);
        $em->flush();

        $resatab[]= [
            "id" => $reservations[$i]->getId()
        ];
    }

    return new JsonResponse($resatab);
}

////////////////////////////////// ACTIVE ALL CRENEAU FALSE /////////////////////////////

/**
 * Désactivation de tous les créneaux d'une plage
 *
 * @param ResaPausesRepository $resaPauseRepo
 * @param Request $request
 * @return void
 */
public function activeAllCreneauFalse(ResaPausesRepository $resaPauseRepo, Request $request)
{
    $pauseId = $request->get('pauseId');

    $date = date('Y-m-d');

    $converted_date = date_create_from_format('Y-m-d', $date);

    $reservations = $resaPauseRepo->findBy(['pause' => $pauseId, 'date' => $converted_date, 'numAgt' => null], ['id' => 'ASC']);

    $em = $this->getDoctrine()->getManager();

    $resatab = [];


    for($i= 0; $i < count($reservations); $i++){

        $reservations[$i]->setActif(false);

        $em->persist($reservations[$i]);
        $em->flush();

        $resatab[]= [
            "id" => $reservations[$i]->getId()
        ];
    }

    return new JsonResponse($resatab);
}

/////////////////////////////////HISTORIQUE //////////////////////

    /**
     * Affiche toutes les données enregistrées en fonction de la date sélectionnée
     *
     * @param Request $request Informations envoyées via la requête Ajax
     * @param pausesRepository $pauseRepo Récupère des données de la table Pauses
     * @param ResaPausesRepository $resaPauseRepo Récupère des données de la table ResaPauses
     * @return JsonResponse Renvoie en json toutes les données récupérées en bdd
     */
    public function historiquePauses(Request $request, pausesRepository $pauseRepo, ResaPausesRepository $resaPauseRepo, GestionRepository $gestionRepo): JsonResponse
    {
        $user = $this->getUser();

        $agentConnecte = ltrim(substr($user->getIdentifiant(), 0, 5), '0');

        $selected_date = $request->get('selected_date');

        $converted_date = date_create_from_format('Y-m-d', $selected_date);

        $selected_resa = $resaPauseRepo->findBy(['date' => $converted_date], ['pause' => 'ASC', 'id' => 'ASC']);
        
        $reservations = [];

        $planningMeridien = ($selected_resa)? $gestionRepo->findOneBy(['id' => $selected_resa[0]->getGestion()->getId()], []) : "";

        $fullDay = ($planningMeridien && !$planningMeridien->getMeridien())? true : false;

        $pauses = ($planningMeridien && $planningMeridien->getMeridien())? $pauseRepo->findBy(['meridien' => $planningMeridien->getMeridien()], ['id' => 'ASC']) : $pauseRepo->findBy([], ['id' => 'ASC']);

        $plages_horaire = [];

        foreach($pauses as $key => $tab){
            $plages_horaire[]= $tab->getHoraire();
        }

        foreach ($selected_resa as $key => $tab){
            
            $agent = ($tab->getNumAgt()) ? $service->getAgentByNumAgt($tab->getNumAgt()) : '';

            $gestionData = $gestionRepo->findOneBy(['id' => $tab->getGestion()], []);

            $reservations[]= [
                'idCreneau' => $tab->getId(),
                'agent' => ($agent)? $agent : "",
                'statut' => $tab->getStatut(),
                'nbPlaces' => $tab->getGestion()->getNbCreneaux(),
                'plage' => $tab->getPause()->getHoraire(),
                'stamp' => $tab->getPause()->getStamp(),
                'actif' => $tab->getActif(),
                'plages_horaire' => $plages_horaire,
                'pauseId' => $tab->getPause()->getId(),
                'agentConnecte' => $agentConnecte,
                'roleAgent' => $user->getRoles()[0],
                'gestionId' => $gestionData->getId(),
                'gestionVerrou' => $gestionData->getVerrouillage(),
                'fullDay' => $fullDay
            ];
        }

        return new JsonResponse($reservations);

    }
}
