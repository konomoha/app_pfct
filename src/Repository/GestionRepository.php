<?php

namespace App\Repository;

use App\Entity\Gestion;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Gestion|null find($id, $lockMode = null, $lockVersion = null)
 * @method Gestion|null findOneBy(array $criteria, array $orderBy = null)
 * @method Gestion[]    findAll()
 * @method Gestion[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class GestionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Gestion::class);
    }

    // /**
    //  * @return Gestion[] Returns an array of Gestion objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('g')
            ->andWhere('g.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('g.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Gestion
    {
        return $this->createQueryBuilder('g')
            ->andWhere('g.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */

    /**
     * Retourne les informations de la dernière ligne enregistrée dans la table gestion
     *
     */
    public function findLast()
    {
        $connexion=$this->getEntityManager()->getConnection();
        $sql = "SELECT nb_creneaux FROM pfct.gestion WHERE ID = (SELECT MAX(ID) FROM pfct.gestion)";
        $statement = $connexion->query($sql);
        return $statement->fetchAll();
    }
}
