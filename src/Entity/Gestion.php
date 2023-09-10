<?php

namespace App\Entity;

use App\Repository\GestionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=GestionRepository::class)
 */
class Gestion
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $nbCreneaux;

    /**
     * @ORM\Column(type="integer")
     */
    private $numAgtManager;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $codeServ;

    /**
     * @ORM\Column(type="datetime")
     */
    private $date;

    /**
     * @ORM\OneToMany(targetEntity=ResaPauses::class, mappedBy="gestion")
     */
    private $resaPauses;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $verrouillage;

    /**
     * @ORM\Column(type="string", length=3, nullable=true)
     */
    private $meridien;

    public function __construct()
    {
        $this->resaPauses = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNbCreneaux(): ?int
    {
        return $this->nbCreneaux;
    }

    public function setNbCreneaux(int $nbCreneaux): self
    {
        $this->nbCreneaux = $nbCreneaux;

        return $this;
    }

    public function getNumAgtManager(): ?int
    {
        return $this->numAgtManager;
    }

    public function setNumAgtManager(int $numAgtManager): self
    {
        $this->numAgtManager = $numAgtManager;

        return $this;
    }

    public function getCodeServ(): ?string
    {
        return $this->codeServ;
    }

    public function setCodeServ(string $codeServ): self
    {
        $this->codeServ = $codeServ;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    /**
     * @return Collection|ResaPauses[]
     */
    public function getResaPauses(): Collection
    {
        return $this->resaPauses;
    }

    public function addResaPause(ResaPauses $resaPause): self
    {
        if (!$this->resaPauses->contains($resaPause)) {
            $this->resaPauses[] = $resaPause;
            $resaPause->setGestion($this);
        }

        return $this;
    }

    public function removeResaPause(ResaPauses $resaPause): self
    {
        if ($this->resaPauses->removeElement($resaPause)) {
            // set the owning side to null (unless already changed)
            if ($resaPause->getGestion() === $this) {
                $resaPause->setGestion(null);
            }
        }

        return $this;
    }

    public function getVerrouillage(): ?bool
    {
        return $this->verrouillage;
    }

    public function setVerrouillage(?bool $verrouillage): self
    {
        $this->verrouillage = $verrouillage;

        return $this;
    }

    public function getMeridien(): ?string
    {
        return $this->meridien;
    }

    public function setMeridien(?string $meridien): self
    {
        $this->meridien = $meridien;

        return $this;
    }
}
