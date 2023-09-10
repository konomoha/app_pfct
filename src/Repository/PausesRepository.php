<?php

namespace App\Repository;

use App\Entity\Pauses;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Pauses|null find($id, $lockMode = null, $lockVersion = null)
 * @method Pauses|null findOneBy(array $criteria, array $orderBy = null)
 * @method Pauses[]    findAll()
 * @method Pauses[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PausesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Pauses::class);
    }

    // /**
    //  * @return Pauses[] Returns an array of Pauses objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Pauses
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
    /**
     * Retourne toutes les données de la table pauses avec les id en ordre croissant
     *
     * @return void
     */
    public function findByHoraire()
    {
        $connexion=$this->getEntityManager()->getConnection();
        $sql = "SELECT * from ORDER BY id ASC";
        $statement = $connexion->query($sql);
        return $statement->fetchAll();
    }

    /**
     * Fonction retournant dans un array tous les ids des plages horaires (à utiliser de concert avec pauseGenerator())
     *
     */
    public function find_all_id($meridien)
    {
        $tab = [];
        $connexion=$this->getEntityManager()->getConnection();

        $sql = ($meridien)? "SELECT * from WHERE meridien = :meridien ORDER BY id ASC" : "SELECT * from ORDER BY id ASC";

        $statement = $connexion->prepare($sql);

        if($meridien){

            $statement->bindValue(':meridien', $meridien, \PDO::PARAM_STR);

        }
        
        $statement->executeStatement();

        while($pause = $statement->fetch(\PDO::FETCH_ASSOC)){
            $tab[]= $pause['id'];
        }

        return $tab;
        
    }

    
}
