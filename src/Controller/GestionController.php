<?php

namespace App\Controller;
use App\Entity\Gestion;
use App\Form\GestionType;
use App\Repository\GestionRepository;
use App\Repository\PausesRepository;
use App\Repository\ResaPausesRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class GestionController extends AbstractController
{
    /**
     * @Route("/gestion", name="gestion")
     */
    public function index(servicepg $servicepg, Request $request, EntityManagerInterface $em, ResaPausesRepository $resaPauseRepo, PausesRepository $pauseRepo): Response
    {
        $user = $this->getUser();

        $userNumAgt = substr($user->getIdentifiant(), 0, 5);

        $userVerif = $servicepg->getAgentByNumAgt($userNumAgt);

        if(!$userVerif){
            
            return $this->render('indexAccess.html.twig', []);
        }
        else{

            if($user->getRoles()[0] === "ROLE2"){

                $Gestion = new Gestion();

                $form = $this->createForm(GestionType::class, $Gestion);

                $verifResa = false;
                //On vérifie qu'aucun créneau n'a été généré aujourd'hui
                $reservations = $resaPauseRepo->findByCurrentDate();

                if(!empty($reservations)){

                    $verifResa = true;
                }

                $userNumAgt = substr($user->getIdentifiant(), 0, 5);
                
                $codeService= $servicepg->getCodeService($userNumAgt);

                $form->handleRequest($request);

                if ($form->isSubmitted() && $form->isValid()) {

                    $Gestion = $form->getData();
                    $Gestion->setNumAgtManager($userNumAgt);
                    $Gestion->setCodeServ($codeService['codser']);
                    $Gestion->setDate(new \DateTime());
                    $Gestion->setVerrouillage(true);
                    $em->persist($Gestion);

                    $pause_tab = $pauseRepo->find_all_id($Gestion->getMeridien());

                    $em->flush();
                    $nbCreneaux = $Gestion->getNbCreneaux();
                    $gestionId = $Gestion->getId();
                    
                    ($verifResa === true)? $resaPauseRepo->deleteClone() : '';

                    $resaPauseRepo->pauseGenerator($pause_tab, $nbCreneaux, $gestionId);

                    $this->addFlash('success', "Le planning a bien été généré ! Pensez à le déverrouiller pour donner l'accès à tous les agents !");
                    return $this->redirectToRoute('planning');
                }

                return $this->render('gestion/index.html.twig', [
                    'formGestion' => $form->createView(),
                    'controller_name' => 'GestionController',
                    'verifResa' => $verifResa
                ]);
            }
            else{
                
                return $this->redirectToRoute('planning');
            }
        }
    }

    public function verrouPlanning(Gestion $gestion, EntityManagerInterface $manager)
    {
        $gestion->setVerrouillage(!$gestion->getVerrouillage());

        $manager->persist($gestion);

        $manager->flush();

        if(!$gestion){
            return new JsonResponse('error_planning');
        }

        return new JsonResponse($gestion->getVerrouillage());
    }
}
