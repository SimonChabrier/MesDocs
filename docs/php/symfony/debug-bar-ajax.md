---
title: Régler le probmème de CSP avec le debug bar de Symfony en AJAX
description: Régler le probmème de CSP avec le debug bar de Symfony en AJAX quand on utilise des CSP restrictives avec Symfony.
---

# Régler le probmème de CSP avec le debug bar de Symfony en AJAX

## Problème

Quand on utilise des CSP restrictives avec Symfony & NelmioSecurity, la debug bar lève un eerreur de violation CSP en AJAX. Comme elle est réinjectée avec un nonce une erreur de violation de CSP est levée si le nonce ne correspond pas à celui évalué. En Javascrit je n'arrive pas systèmatiquement à être synchrone avec la réponse pour réinjecter le hash du nonce qui est accessible sur les headers de réponse donc la solution la plus solide même si elle est radicale est de supprimer la génération du nonce pour le debug bar.

## Solution

Regarder dans vendor, il y a :`'Symfony\Bundle\WebProfilerBundle\Csp\ContentSecurityPolicyHandler'` at la classe contient une méthode `public function disableCsp()`


## 1 Faire Service 

J'utilise l'attribut #[When(env: 'dev')] pour ne pas charger le service en prod et ne pas avoir d'erreur de classe manquante en prod.

- [lien vers la doc et les sytaxe d'attributs d'env](https://symfony.com/doc/current/service_container.html#limiting-services-to-a-specific-symfony-environment)

```php
<?php

namespace App\Service\System;

use Symfony\Component\DependencyInjection\Attribute\When;
use Symfony\Bundle\WebProfilerBundle\Csp\ContentSecurityPolicyHandler;

#[When(env: 'dev')]
class DesableDebubBarCsp
{

    public function __construct(
        private ContentSecurityPolicyHandler $contentSecurityPolicyHandler,
    ) {}

    /**
     * Hoverhide ContentSecurityPolicyHandler from bundle symfony/web-profiler-bundle
     * @return void
     */
    public function disableCsp(): void
    {
        $this->contentSecurityPolicyHandler->disableCsp();
    }
}
```

## 2 Injecter le service dasn le container

`@web_profiler.csp.handler` est le service de la classe ContentSecurityPolicyHandler donc je l'utilise pour injecter mon service. 

`Symfony\Bundle\WebProfilerBundle\Csp\ContentSecurityPolicyHandler: '@web_profiler.csp.handler'`

## 3 Subbscriber

Comme l'indique la dog pour que la debg bar soit réinjecté après les chargement en Ajax j'ajoute le subscriber dasn le quel j'injecte le service et je désactive la génération du nonce avant de réinjecter la debug bar comme le dit la doc : [lien vers la doc](https://symfony.com/doc/current/profiler.html#updating-the-web-debug-toolbar-after-ajax-requests)

```php
<?php

namespace App\EventSubscriber\System;

use App\Service\System\DesableDebubBarCsp;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\DependencyInjection\Attribute\When;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

#[When(env: 'dev')]
class AjaxDebugBarSubscriber implements EventSubscriberInterface
{

    public function __construct(
        private KernelInterface $kernel,
        private DesableDebubBarCsp $csp
    ) {}

    public function onKernelResponse(ResponseEvent $event): void
    {
        // this remove the nonce generation
        $this->csp->disableCsp();

        if (!$this->kernel->isDebug()) {
            return;
        }

        $request = $event->getRequest();
        if (!$request->isXmlHttpRequest()) {
            return;
        }

        $response = $event->getResponse();

        $response->headers->set('Symfony-Debug-Toolbar-Replace', '1');
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::RESPONSE => 'onKernelResponse',
        ];
    }
}
```

C'est terminé. L'attribu `#[When(env: 'dev')]` permet de ne pas charger le service en prod et ne pas avoir d'erreur de classe manquante en prod.
Tout macher bien parce que Nelmio Security a déjà appliqué les CSP au chargement initial de la page donc la réinjection n'est pas bloquée par les CSP.
Ca crée une faille mais comme j e n'active jamais ni n'istalle la deug bar ne prod ça ne pose pas de problème et permet de continuer à développer avec des CSP strictes en local.




