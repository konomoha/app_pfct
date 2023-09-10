<?php

namespace App\Entity;

use App\Repository\ResaPausesRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ResaPausesRepository::class)
 */
class ResaPauses
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     */
    private $site;

    /**
     * @ORM\Column(type="integer",  nullable=true)
     */
    private $numAgt;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $statut;

    /**
     * @ORM\ManyToOne(targetEntity=Pauses::class, fetch="EAGER")
     * @ORM\JoinColumn(nullable=true)
     */
    private $pause;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $date;

    /**
     * @ORM\ManyToOne(targetEntity=Gestion::class, inversedBy="resaPauses")
     * @ORM\JoinColumn(nullable=true)
     */
    private $gestion;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $actif;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSite(): ?string
    {
        return $this->site;
    }

    public function setSite(?string $site): self
    {
        $this->site = $site;

        return $this;
    }

    public function getNumAgt(): ?int
    {
        return $this->numAgt;
    }

    public function setNumAgt(?int $numAgt): self
    {
        $this->numAgt = $numAgt;

        return $this;
    }

    public function getStatut(): ?string
    {
        return $this->statut;
    }

    public function setStatut(?string $statut): self
    {
        $this->statut = $statut;

        return $this;
    }

    public function getPause(): ?Pauses
    {
        return $this->pause;
    }

    public function setPause(?Pauses $pause): self
    {
        $this->pause = $pause;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(?\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getGestion(): ?Gestion
    {
        return $this->gestion;
    }

    public function setGestion(?Gestion $gestion): self
    {
        $this->gestion = $gestion;

        return $this;
    }

    public function getActif(): ?bool
    {
        return $this->actif;
    }

    public function setActif(?bool $actif): self
    {
        $this->actif = $actif;

        return $this;
    }

}
