<?php

namespace App\Repository;

use App\Entity\ResaPauses;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ResaPauses|null find($id, $lockMode = null, $lockVersion = null)
 * @method ResaPauses|null findOneBy(array $criteria, array $orderBy = null)
 * @method ResaPauses[]    findAll()
 * @method ResaPauses[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ResaPausesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ResaPauses::class);
    }

    // /**
    //  * @return ResaPauses[] Returns an array of ResaPauses objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('r.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ResaPauses
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */

    /**
     * Retourne toutes les données de la table resa_pauses ayant la date du jour, les données sont classées selon la clé étrangère pause_id
     *
     */
    public function findByCurrentDate()
    {
        $date = date('Y-m-d');
        $connexion=$this->getEntityManager()->getConnection();
        $sql = "SELECT * from WHERE date = :date ORDER BY pause_id, id, num_agt ASC";
        $statement = $connexion->prepare($sql);
        $statement->bindValue(':date', $date, \PDO::PARAM_STR);
        $statement->executeStatement();
        
        return $statement->fetchAll();
    }

    /**
     * Supprime toutes les réservations ayant la date du jour (en cas de nouveau planning généré)
     *
     * @return void
     */
    public function deleteClone()
    {
        $date = date('Y-m-d');
        $connexion=$this->getEntityManager()->getConnection();
        $sql = "DELETE from WHERE date = :date";
        $statement = $connexion->prepare($sql);
        $statement->bindValue(':date', $date, \PDO::PARAM_STR);
        $statement->executeStatement();
    }

    /**
     * Génère des insertions en bdd en fonction du nombre de créneaux souhaité
     *
     * @param [array] $pauses_tab Contient les id de chaque plage horaire présent en bdd
     * @param [integer] $nb_creneaux Nombre de créneaux désiré par plage horaire
     * @param [integer] $gestionId id de la dernière ligne enregistrée dans la table Gestion 
     * @return void
     */
    public function pauseGenerator(array $pauses_tab, int $nb_creneaux, int $gestionId)
    {
        $connexion=$this->getEntityManager()->getConnection();
        
        $current_date = date("Y-m-d");

        for($i = 0; $i < count($pauses_tab); $i++){

            for($r = 1; $r <= $nb_creneaux; $r++){

                $sql = "INSERT INTO (id, site, statut, pause_id, date, gestion_id, actif) VALUES(nextval('seq'), :site, :statut, :pause_id, :date, :gestion_id, :actif)";
                
                $statement = $connexion->prepare($sql);

                $statement->bindValue(':site', 'Bobigny', \PDO::PARAM_STR);
                $statement->bindValue(':statut', 'Disponible', \PDO::PARAM_STR);
                $statement->bindValue(':pause_id', $pauses_tab[$i], \PDO::PARAM_INT);
                $statement->bindValue(':date', $current_date, \PDO::PARAM_STR);
                $statement->bindValue(':gestion_id', $gestionId, \PDO::PARAM_INT);
                $statement->bindValue(':actif', true, \PDO::PARAM_BOOL);

                $statement->executeStatement();
            }
        }
    }
}
