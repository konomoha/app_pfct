<?php

namespace App\Form;

use App\Entity\Gestion;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Positive;
use Symfony\Component\Validator\Constraints\Range;

class GestionType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('nbCreneaux', NumberType::class, [
                'label' => 'Nombre de créneaux',
                'required' => false,
                'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez indiquer un nombre de creneaux !'
                    ]),
                    new Range([
                        'min' => 1,
                        'max'=> 30,
                        'minMessage' => 'Veuillez entrer une valeur supérieure à zéro !',
                        'maxMessage' => 'Nombre maximum de créneaux limité à 30.'
                    ])
                ]
            ])
            ->add('meridien', ChoiceType::class, [
                'choices'=>[
                    'Matin'=> 'am',
                    'Après-midi'=> 'pm',
                    'Journée complète' => null
                ],
                'multiple' => false,
                'required' => false,
                'placeholder' => false,
                'label' => "Positionnement"
            ])
            ->add('Generer', SubmitType::class, [
                'label' => 'Générer',
                'attr' => [
                    'class' => 'save btn-success'],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Gestion::class,
        ]);
    }
}
