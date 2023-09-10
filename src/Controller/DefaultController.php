<?php
declare(strict_types = 1);
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class DefaultController extends AbstractController{

    /**
     * Undocumented function
     *
     * @return void
     */
    public function index()
    {
        $test = "page d'accueil";
        $user = $this->getUser();
        return $this->render('index.html.twig', ['test' => $test, 'user' => $user]);
    }
}