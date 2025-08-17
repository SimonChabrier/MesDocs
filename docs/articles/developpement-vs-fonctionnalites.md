---

title: Développement global vs ajout de fonctionnalités

description: Pourquoi développer une application, ce n’est pas juste coder une fonctionnalité.

author: Simon Chabrier

tags:

- développement

- architecture

- génie logiciel

- charge mentale

comments: true

—

# Développement global vs ajout de fonctionnalités

> Dans le domaine du développement logiciel, et plus particulièrement du développement web, le terme générique de « développement » recouvre en réalité deux natures d'activité très distinctes : la phase de conception initiale d’un système (architecture, socle technique, logique métier fondamentale), et la phase d’implémentation de nouvelles fonctionnalités sur un socle déjà établi. Ces deux phases engendrent des charges mentales et cognitives très différentes pour le développeur.
>
> ### 1. Le développement initial : une responsabilité d’ingénierie
>
> La phase de développement initial engage le développeur dans un travail de conception à long terme. Il ne s’agit pas seulement d’écrire du code fonctionnel, mais de poser les fondations d’un système qui devra rester maintenable, lisible, modulaire et évolutif sur plusieurs années. Les choix opérés à ce stade — structuration des services, conventions de nommage, système de routage, stratégie multilingue, séparation des responsabilités — sont déterminants pour l’avenir du produit.

Cette phase demande une vigilance constante, car chaque erreur de conception peut avoir des répercussions majeures sur les futures implémentations. Elle implique également de nombreux arbitrages : entre dette technique et rapidité, entre simplicité d’usage pour les intégrateurs et lisibilité du code, entre exigences métier et cohérence technique. Le développeur agit sans filet, en prenant des décisions structurantes qui doivent convenir à la fois à l’usage immédiat et aux besoins futurs.

> ### 2. L’ajout de fonctionnalités : un travail plus localisé

Une fois le socle défini, l’ajout de fonctionnalités s’appuie sur les structures existantes. Le développeur agit alors dans un cadre qu’il connaît ou qu’il a contribué à établir. Les décisions prises sont souvent locales, affectant une fonctionnalité précise, et peuvent être plus aisément testées, évaluées, ou réversibles. Cela ne signifie pas que ce travail est facile, mais il repose sur une architecture déjà pensée, ce qui réduit la charge de décision et la portée des impacts potentiels.

> ### 3. Deux charges mentales radicalement différentes
>
> Dans les deux cas, il s’agit de développement. Mais les exigences mentales et émotionnelles sont sans commune mesure : la phase initiale mobilise des capacités de projection, de modélisation, d’abstraction et d’anticipation nettement plus élevées. Le développeur y joue un rôle d’ingénieur logiciel, parfois de façon implicite et solitaire, avec une pression forte sur la justesse de ses décisions. Cette pression est d’autant plus grande lorsque les décisions prises engagent des années d’usage, ou impactent directement la qualité de travail des collègues.
>
> ### Conclusion
>
> Il est essentiel, dans un contexte professionnel où le développeur est amené à concevoir autant qu’à implémenter, de distinguer clairement ces deux registres. Cela permet non seulement de mieux répartir la charge de travail, mais aussi de reconnaître les efforts déployés dans les phases invisibles mais critiques de la construction logicielle. Une fonctionnalité bien pensée repose souvent sur une architecture bien conçue — et cette architecture, elle, requiert un effort intellectuel à part entière. Le mot « développement » masque une réalité plurielle. Derrière lui, se cachent des enjeux, des responsabilités et des charges mentales très différentes.
