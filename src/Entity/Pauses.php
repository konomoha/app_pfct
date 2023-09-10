<?php

namespace App\Entity;

use App\Repository\PausesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=PausesRepository::class)
 */
class Pauses
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $horaire;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $date_jour;

    /**
     * @ORM\Column(type="integer")
     */
    private $nb_dispo_TG;

    /**
     * @ORM\Column(type="string", length=3, nullable=true)
     */
    private $meridien;

    /**
     * @ORM\Column(type="string", length=8, nullable=true)
     */
    private $stamp;


    public function __construct()
    {
        $this->resaPauses = new ArrayCollection();
    }
    

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getHoraire(): ?string
    {
        return $this->horaire;
    }

    public function setHoraire(string $horaire): self
    {
        $this->horaire = $horaire;

        return $this;
    }

    public function getDateJour(): ?\DateTimeInterface
    {
        return $this->date_jour;
    }

    public function setDateJour(\DateTimeInterface $date_jour): self
    {
        $this->date_jour = $date_jour;

        return $this;
    }

    public function getNbDispoTG(): ?int
    {
        return $this->nb_dispo_TG;
    }

    public function setNbDispoTG(int $nb_dispo_TG): self
    {
        $this->nb_dispo_TG = $nb_dispo_TG;

        return $this;
    }

    public function getMeridien(): ?string
    {
        return $this->meridien;
    }

    public function setMeridien(string $meridien): self
    {
        $this->meridien = $meridien;

        return $this;
    }

    public function getStamp(): ?string
    {
        return $this->stamp;
    }

    public function setStamp(?string $stamp): self
    {
        $this->stamp = $stamp;

        return $this;
    }

}
