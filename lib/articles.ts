export type Article = { slug: string; category: string; title: string; summary: string; date: string; publishedAt?: string; eventAt?: string; withdrawn?: boolean; image?: string; imageCredit?: string; paragraphs: string[]; angle: string; sources: {name: string; url: string}[] };

// Synthèses originales de documents primaires datés. Les prochaines éditions sont ajoutées ici.
export const articles: Article[] = [
  {
    slug: "capgemini-cession-filiale-ice-itc-federal",
    category: "France · Pouvoir et sous-traitance",
    title: "ICE : Capgemini vend la filiale, pas les questions sur ses contrats",
    summary: "Le groupe français signe la cession de sa filiale travaillant pour l'État américain. L'acheteur compte renforcer ses missions fédérales ; le sort du contrat avec la police de l'immigration n'est pas précisé.",
    date: "2026-09-12",
    publishedAt: "2026-09-12T19:03:00Z",
    eventAt: "2026-09-12T14:00:00Z",
    image: "/images/flash-societe.webp",
    imageCredit: "Illustration originale · Le Fil Libre ; aucune photographie des entreprises ni des personnes concernées",
    paragraphs: [
      "Samedi 12 septembre à 16 heures, heure de Paris, Capgemini a annoncé un accord de vente de sa filiale américaine Government Solutions à ITC Federal. Le groupe avait lancé cette cession en février, après les révélations sur un contrat de la filiale avec l'ICE, la police fédérale de l'immigration. Il précise aujourd'hui que l'opération reste soumise aux conditions habituelles et ne devrait être achevée que dans les prochaines semaines : la vente n'est pas encore finalisée.",
      "ITC Federal présente déjà l'opération comme une acquisition et dit vouloir étendre ses prestations pour le ministère américain de la Sécurité intérieure et celui de la Justice, avec plusieurs clients que les deux entreprises avaient en commun. Ni son communiqué ni celui de Capgemini ne précisent ce qu'il adviendra du contrat particulier avec l'ICE. Se défaire d'une filiale répond à la pression sur le vendeur ; cela ne démontre ni la fin des prestations contestées ni le contrôle public de leurs usages. C'est sur ces points que les deux sociétés et l'administration américaine doivent encore répondre."
    ],
    angle: "Changer le propriétaire d'un sous-traitant ne dit pas ce que deviennent ses contrats ni qui répond de leur usage par l'État.",
    sources: [
      {name: "Capgemini, accord de cession annoncé le 12 septembre 2026 à 16 h (Paris)", url: "https://www.capgemini.com/news/press-releases/capgemini-signs-a-definitive-agreement-to-sell-capgemini-government-solutions/"},
      {name: "ITC Federal, communiqué sur l'acquisition et ses clients fédéraux, 12 septembre 2026", url: "https://itcfederal.com/news/itc-federal-acquires-capgemini-government-solutions-launching-itc-digital-solutions-to-expand-national-security-and-digital-modernization-capabilities/"},
      {name: "Capgemini, annonce initiale de mise en vente, 1er février 2026", url: "https://www.capgemini.com/fr-fr/actualites/communiques-de-presse/capgemini-va-mettre-en-vente-sa-filiale-capgemini-government-solutions/"},
      {name: "Reuters, rappel du contrat avec l'ICE et de la polémique, 1er février 2026", url: "https://www.reuters.com/business/french-tech-company-capgemini-sell-us-unit-linked-ice-2026-02-01/"}
    ]
  },
  {
    slug: "hongrie-adoption-agrement-ministre-promesse-retrait",
    category: "Monde · Pouvoir administratif",
    title: "Adoption en Hongrie : le feu vert du ministre promis à la suppression",
    summary: "Pour une personne souhaitant adopter seule, la loi de 2020 impose un accord ministériel à titre exceptionnel. Le gouvernement promet de retirer cette décision au politique, sans encore présenter de texte ni de calendrier.",
    date: "2026-09-12",
    publishedAt: "2026-09-12T15:03:00Z",
    eventAt: "2026-09-12T10:00:00Z",
    image: "/images/flash-societe.webp",
    imageCredit: "Illustration originale · Le Fil Libre ; aucune photographie des personnes ou de la conférence",
    paragraphs: [
      "Ce samedi 12 septembre, à la fin d'une conférence de presse sur la protection de l'enfance, le Premier ministre hongrois Péter Magyar a promis de modifier la procédure d'adoption : l'aptitude d'une personne demandant à adopter seule ne devrait plus dépendre de l'accord d'un ministre, mais être évaluée par des professionnels. La loi votée sous Viktor Orbán en 2020 a réservé cette possibilité aux cas exceptionnels assortis d'un consentement ministériel. Les couples de même sexe, qui ne peuvent pas se marier en Hongrie, sont notamment touchés par ce filtre.",
      "Magyar avait déjà défendu en juin l'idée de ne pas faire de l'adoption une question politique ; sa réponse de ce samedi confirme l'engagement de changer la règle. Mais il n'a présenté ni projet de loi ni date d'entrée en vigueur. Pour l'instant, le pouvoir de décision dénoncé reste dans les textes. Le test sera moins la formule prononcée devant les caméras que la suppression effective de ce contrôle et la façon dont les dossiers seront ensuite instruits."
    ],
    angle: "Faire passer l'aptitude d'un futur parent devant un ministre, plutôt que laisser l'évaluation aux spécialistes, est un choix de pouvoir ; la promesse de l'abroger ne vaut pas encore réforme.",
    sources: [
      {name: "Loi hongroise CLXV de 2020, articles 101 et 104, texte officiel de la Bibliothèque juridique nationale", url: "https://njt.hu/jogszabaly/2020-165-00-00.0"},
      {name: "Savaria Fórum, propos tenus à la conférence du 12 septembre 2026 et absence de calendrier", url: "https://www.savariaforum.hu/rovat/magyar-peter-meg-fogjuk-valtoztatni-az-azonos-nemu-parok-orokbefogadasanak-szabalyait"},
      {name: "Reuters, compte rendu de la réponse du Premier ministre, 12 septembre 2026 à 13 h 42 UTC", url: "https://www.reuters.com/world/hungary-pm-magyar-says-scrap-orban-era-restriction-gay-adoption-2026-09-12/"}
    ]
  },
  {
    slug: "hongrie-orban-bicske-reponse-balog-decoration",
    category: "Monde · Pouvoir et enfance",
    title: "Bicske : Orbán renvoie au ministre qui lui aurait proposé la décoration",
    summary: "Interrogé ce samedi sur sa signature au bas d'une proposition de décoration de 2016, l'ancien chef du gouvernement hongrois renvoie à son auteur. Le gouvernement actuel nomme Balog Zoltán ; la chaîne des décisions reste à éclaircir.",
    date: "2026-09-12",
    publishedAt: "2026-09-12T14:28:00Z",
    eventAt: "2026-09-12T13:33:00Z",
    image: "/images/flash-monde.webp",
    imageCredit: "Illustration originale · Le Fil Libre ; aucune photographie des personnes ou des faits",
    paragraphs: [
      "À Kötcse, ce samedi 12 septembre, Viktor Orbán a répondu aux journalistes qu'une personne lui avait soumis la candidature de János Vásárhelyi à une décoration de l'État hongrois, sans la nommer. Peu après, le Premier ministre Péter Magyar a désigné Balog Zoltán, alors ministre des Ressources humaines, comme celui qui avait fait cette proposition. Le document daté du 25 juillet 2016, rendu public aujourd'hui par le gouvernement, porte la signature d'Orbán sur la proposition adressée à la présidence. Vásárhelyi, ancien directeur du foyer de Bicske, a été condamné en 2019 pour des agressions sexuelles sur des mineurs.",
      "Que Balog ait proposé le nom et qu'Orbán ait signé ne se contredit pas : c'est précisément une chaîne de responsabilités politiques à établir. Des alertes sur le foyer existaient avant 2016, mais la signature seule ne démontre pas qu'Orbán connaissait personnellement les accusations au moment de signer. Le gouvernement actuel accuse son prédécesseur ; l'intéressé renvoie au proposant. Reste à savoir quelles vérifications chaque étage de l'État avait faites avant d'honorer le responsable d'enfants placés."
    ],
    angle: "Une signature officielle n'est pas une preuve de connaissance personnelle des crimes ; elle appelle néanmoins des comptes sur la procédure et ses contrôles.",
    sources: [
      {name: "Gouvernement hongrois, document de proposition du 25 juillet 2016 présenté le 12 septembre 2026", url: "https://kormany.hu/hirek/tudott-a-gyermekvedelem-gondjairol-az-elozo-kormany-megsem-tett-semmit"},
      {name: "Szeretlek Magyarország, réponse d'Orbán aux journalistes à Kötcse, 12 septembre 2026", url: "https://www.szeretlekmagyarorszag.hu/hirek/orban-viktor-kotcse-bicskei-pedofil-igazgato-kituntetese/"},
      {name: "HVG, identification de Balog par Péter Magyar et chronologie de la réponse, 12 septembre 2026", url: "https://hvg.hu/itthon/20260912_pedofilbotrany-bicskei-gyermekotthon-vasarhelyi-allami-kituntetes-orban-balog"}
    ]
  },
  {
    slug: "hongrie-protection-enfance-plan-95-milliards-places-fermees",
    category: "Monde · Services publics",
    title: "Hongrie : un plan pour les enfants, 853 places fermées faute de personnel",
    summary: "Le gouvernement annonce 9,5 milliards de forints pour la protection de l'enfance. Son propre diagnostic mesure 853 places inutilisables au 31 juillet : l'argent annoncé doit encore devenir des équipes et des lits réellement disponibles.",
    date: "2026-09-12",
    publishedAt: "2026-09-12T14:28:00Z",
    eventAt: "2026-09-12T09:17:00Z",
    image: "/images/flash-societe.webp",
    imageCredit: "Illustration originale · Le Fil Libre ; aucune photographie des établissements",
    paragraphs: [
      "À Budapest, ce samedi 12 septembre, le gouvernement de Péter Magyar annonce un programme d'urgence de 9,5 milliards de forints pour la protection de l'enfance : prise en charge de crise, soutien aux professionnels et remise en état des équipements. Il promet 184 places nouvelles ou réaffectées et un renforcement de quinze foyers spécialisés. Son rapport officiel, rédigé le 31 août et publié aujourd'hui, comptait pourtant, au 31 juillet, 853 places agréées ne pouvant accueillir d'enfants faute de personnel. Ce chiffre décrit la situation antérieure à l'annonce, pas un nouveau décompte effectué ce samedi.",
      "Le gouvernement reconnaît lui-même que ce plan ne réparera pas d'un coup des années de pénurie ; il annonce aussi une hausse des salaires dont les modalités restent à préciser. Les 184 places promises ne sont pas toutes des places nettes et ne se comparent donc pas directement aux 853 indisponibles. La mesure à suivre est concrète : combien de professionnels recrutés, combien de places rouvertes, et à quelle date les enfants y seront-ils effectivement accueillis ?"
    ],
    angle: "Débloquer des fonds est une décision ; protéger les enfants exige de montrer quand les équipes et les places existent vraiment.",
    sources: [
      {name: "Gouvernement hongrois, annonce du programme de 9,5 milliards de forints, 12 septembre 2026", url: "https://kormany.hu/hirek/gyermekvedelemi-krizisprogram-indul-95-milliardbol"},
      {name: "Ministère hongrois des Affaires sociales, diagnostic daté du 31 août 2026, publié le 12 septembre, p. 45", url: "https://cdn.kormany.hu/uploads/sheets/7/7c/7c0/7c0bcc123b46828d022cf594cbe94d9.pdf"},
      {name: "Gouvernement hongrois, détail des 184 places nouvelles ou réaffectées, 12 septembre 2026", url: "https://kormany.hu/hirek/10-milliard-forintos-krizisprogram-reszletei"},
      {name: "24.hu, annonce lors de la conférence de presse du 12 septembre 2026 à 11 h 17 (heure locale)", url: "https://24.hu/belfold/2026/09/12/10-milliardos-gyermekvedelmi-krizisprogram-indul/"}
    ]
  },
  {
    slug: "brics-declaration-new-delhi-retenue-moyen-orient",
    category: "Monde · Pouvoir",
    title: "Les BRICS appellent à la retenue : leurs actes restent à voir",
    summary: "Une déclaration commune adoptée ce samedi demande la désescalade au Moyen-Orient. La signature d’États aux intérêts opposés n’est pas encore une paix.",
    date: "2026-09-12",
    publishedAt: "2026-09-12T13:09:00Z",
    eventAt: "2026-09-12T11:18:03Z",
    image: "/images/flash-monde.webp",
    imageCredit: "Illustration originale · Le Fil Libre ; aucune photographie du sommet",
    paragraphs: [
      "À New Delhi, les dirigeants des BRICS ont adopté samedi 12 septembre une déclaration commune appelant à une retenue maximale et au règlement des conflits par la diplomatie. La plateforme gouvernementale indienne MyGov a annoncé l’adoption vers 11 h 18 UTC ; Reuters a publié à 12 h 13 UTC des extraits du texte. La déclaration critique aussi les mesures commerciales unilatérales.",
      "L’Iran et les Émirats arabes unis siègent dans ce même groupe malgré des positions différentes sur la guerre au Moyen-Orient. Les dirigeants ont trouvé les mots pour signer ensemble ; cela ne démontre pas que les armes se taisent ni que les populations civiles soient protégées. La portée réelle de leur appel se mesurera aux décisions de chacun, pas à l’unanimité affichée sur le papier."
    ],
    angle: "Une déclaration commune engage la parole de ceux qui gouvernent ; leurs actes devront établir si cette parole protège effectivement les civils.",
    sources: [
      {name: "MyGovIndia, annonce de l’adoption, 12 septembre 2026 vers 11 h 18 UTC", url: "https://x.com/mygovindia/status/2098732872257687593"},
      {name: "Reuters, extraits de la déclaration de New Delhi, 12 septembre 2026 à 12 h 13 UTC", url: "https://www.reuters.com/world/china/brics-adopts-joint-declaration-urges-maximum-restraint-mideast-2026-09-12/"},
      {name: "Associated Press, compte rendu du sommet, 12 septembre 2026", url: "https://apnews.com/article/india-brics-modi-russia-china-iran-wars-5393274f87a16461b195d13f324e747a"}
    ]
  },
  {
    slug: "reform-uk-deux-dons-72-millions-livres",
    category: "Monde · Argent et politique",
    title: "Deux fortunes apportent 72 millions de livres au parti de Farage",
    summary: "Après les 36 millions annoncés vendredi par Ben Delo, Christopher Harborne déclare ce samedi avoir donné autant à Reform UK. Qui peut financer la course au pouvoir à cette échelle ?",
    date: "2026-09-12",
    publishedAt: "2026-09-12T13:09:00Z",
    eventAt: "2026-09-12T11:53:56Z",
    image: "/images/flash-societe.webp",
    imageCredit: "Illustration originale · Le Fil Libre ; aucune photographie des donateurs",
    paragraphs: [
      "Au Royaume-Uni, l’investisseur Christopher Harborne a déclaré samedi 12 septembre dans le Telegraph avoir égalé le don de 36 millions de livres que Ben Delo avait annoncé vendredi à Reform UK. Richard Tice, dirigeant du parti, l’a publiquement remercié vers 11 h 54 UTC ; Reuters a confirmé le montant à 11 h 56 UTC. Deux donateurs revendiquent donc 72 millions de livres pour le parti de Nigel Farage en deux jours. Ce sont des dons au parti, non des fonds versés au gouvernement.",
      "Harborne dit ne demander ni poste ni changement de politique en échange. Rien dans ces annonces ne prouve une contrepartie illégale. Reste une question que son démenti n’efface pas : quand deux fortunes peuvent donner à un parti l’équivalent d’années de campagne, le droit de soutenir une idée existe pour tous, mais le pouvoir de la faire entendre n’est pas distribué également."
    ],
    angle: "La légalité alléguée d’un don ne règle pas la question démocratique de l’inégalité des moyens de peser sur une élection.",
    sources: [
      {name: "Christopher Harborne, tribune dans The Telegraph, 12 septembre 2026", url: "https://www.telegraph.co.uk/politics/2026/09/12/christopher-harborne-reform/"},
      {name: "Richard Tice, annonce publique du soutien, 12 septembre 2026 vers 11 h 54 UTC", url: "https://x.com/TiceRichard/status/2098741900232511704"},
      {name: "Reuters, confirmation du montant et des deux dons, 12 septembre 2026 à 11 h 56 UTC", url: "https://www.reuters.com/world/uk/reform-uk-receives-second-36-million-donation-48-hours-telegraph-reports-2026-09-12/"}
    ]
  },
  {
    slug: "deraillement-cleon-parquet-morceau-rail-enquete",
    category: "France · Transports",
    title: "Cléon : un morceau de rail sur la voie, l’enquête doit encore dire pourquoi",
    summary: "Le parquet de Rouen privilégie la présence d’un morceau de rail pour expliquer le déraillement. L’origine de cet obstacle reste inconnue : la piste d’un acte volontaire n’est pas une conclusion.",
    date: "2026-09-12",
    publishedAt: "2026-09-12T12:03:00Z",
    eventAt: "2026-09-12T10:00:00Z",
    withdrawn: true, // Retirée de la une : fait divers hors de la priorité éditoriale.
    image: "/images/flash-france.webp",
    imageCredit: "Illustration originale · Le Fil Libre ; aucune photographie du déraillement",
    paragraphs: [
      "Le TER Rouen–Caen a déraillé vendredi 11 septembre vers 19 h 45 à Cléon, en Seine-Maritime. Samedi, lors d’un point vers midi puis dans un communiqué cité par RTL, le parquet de Rouen a indiqué qu’un morceau de rail présent sur la voie pourrait expliquer l’accident. Son origine n’est pas établie. L’enquête, confiée à la police judiciaire, examine notamment la possibilité d’un acte malveillant : elle ne permet pas encore de l’affirmer.",
      "Le bilan de 44 blessés était déjà connu vendredi soir ; ce n’est donc pas la nouvelle de cette brève. Le parquet précise samedi que la jeune femme hospitalisée n’a pas son pronostic vital engagé. Aux victimes, on doit des réponses sur la sécurité de la voie et sur les responsabilités éventuelles, pas un sabotage décrété avant les conclusions des enquêteurs."
    ],
    angle: "Un obstacle sur la voie appelle des explications. Identifier qui l’y a mis — ou comment il y est arrivé — reste précisément le travail de l’enquête.",
    sources: [
      {name:"RTL, communiqué du parquet de Rouen et entretien du ministre des Transports, 12 septembre 2026, mis à jour à 13 h 29",url:"https://www.rtl.fr/actu/justice-faits-divers/le-train-a-heurte-un-rail-pose-sur-les-voies-la-piste-d-un-acte-malveillant-envisagee-apres-deraillement-qui-a-fait-44-blesses-en-normandie-7900671688"},
      {name:"Associated Press, propos recueillis auprès de la police, 12 septembre 2026 à 11 h 29 UTC",url:"https://apnews.com/article/e76d34a3dee9c22e5a84ee5383f4bc34"},
      {name:"Le Parisien, bilan et ouverture de l’enquête, 12 septembre 2026, mis à jour à 12 h 39",url:"https://www.leparisien.fr/faits-divers/les-vitres-ont-explose-44-blesses-ce-que-lon-sait-du-deraillement-dun-train-entre-rouen-et-caen-12-09-2026-U4DQZUG3OJDOVE4KOTLJ25VRBM.php"}
    ]
  },
  { slug: "magistrat-images-mineurs-amende-sursis-2006", category: "Justice · Vérification", title: "Un magistrat, 1 000 € d’amende : la peine ne s’arrête pas là", summary: "En 2006, Michel Joubrel a aussi été condamné à huit mois de prison avec sursis. Il avait été radié de la magistrature. Le récit d’une simple amende pour un million d’images ne correspond pas aux pièces retrouvées sur cette affaire.", date: "2026-09-12", angle: "La peine peut choquer. Pour demander des comptes à la justice, il faut publier toutes les sanctions et dire ce que les pièces ne permettent pas de prouver.", paragraphs: ["Le 20 juin 2006, le tribunal correctionnel de Tours a condamné Michel Joubrel, ancien substitut général à Versailles, dans une affaire d’échange d’images sexuelles de mineurs. La dépêche de l’AFP reprise le lendemain par Le Monde indique une peine de huit mois d’emprisonnement avec sursis et 1 000 € d’amende. Le sursis n’est pas du temps passé en prison ; c’est néanmoins une condamnation à l’emprisonnement, absente des récits qui ne retiennent que l’amende.", "Avant ce jugement pénal, une procédure disciplinaire avait déjà mis fin à sa carrière. Le décret du 23 février 2005 constate une mise à la retraite d’office décidée le 7 décembre 2004 et une radiation des cadres de la magistrature à compter du 3 janvier 2005. Ce décret ne justifie pas la peine pénale : il établit une sanction professionnelle distincte. Le jugement complet et ses motifs n’ont pas été retrouvés dans les documents consultés.", "Un article du Parisien publié avant le procès faisait état, selon les enquêteurs, de 5 600 images impliquant des mineurs parmi 16 330 fichiers trouvés. Une formule circulant en 2026 évoque « un million » de fichiers et une simple amende ; nous n’avons trouvé aucune décision permettant de rattacher ce chiffre au cas Joubrel ou d’identifier sûrement un autre dossier. La vraie question demeure : pourquoi cette peine a-t-elle été prononcée, et selon quels motifs ? Sans jugement intégral, il faut laisser cette question ouverte."], sources: [{name:"Le Monde / AFP, compte rendu de la condamnation, 21 juin 2006",url:"https://www.lemonde.fr/societe/article/2006/06/21/pedophilie-sur-internet-un-ancien-magistrat-condamne_786284_3224.html"},{name:"Journal officiel / Légifrance, décret de radiation du 23 février 2005",url:"https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000000257819"},{name:"Le Parisien, éléments d’enquête présentés avant le procès, 19 juin 2006",url:"https://www.leparisien.fr/faits-divers/le-haut-magistrat-detenait-plus-de-5-000-images-pedophiles-19-06-2006-2007087953.php"},{name:"TV Libertés, publication du 25 juin 2026 relayant la formule « un million »",url:"https://www.facebook.com/tvlofficiel/posts/%EF%B8%8F-ce-juge-qui-a-t%C3%A9l%C3%A9charg%C3%A9-un-million-de-fichiers-p%C3%A9dopornographiques-et-qui-na-/1459061712917982/"}] },
  { slug: "conde-sur-sarthe-appel-ministere-violences-prison", category: "Justice · Prison", title: "Condé-sur-Sarthe : le ministère perd son appel contre une injonction de prévenir les abus", summary: "Après un rapport alarmant sur des violences et humiliations en détention, le garde des Sceaux contestait l’ordre d’y mettre fin. Le Conseil d’État a rejeté son appel le 3 septembre, sans établir la responsabilité individuelle des agents.", date: "2026-09-12", angle: "L’administration doit protéger les personnes qu’elle enferme. Le rejet de son appel ne dispense pas d’établir les faits et les responsabilités de chacun.", paragraphs: ["À la suite d’une visite réalisée du 4 au 7 mai 2026 à la prison d’Alençon-Condé-sur-Sarthe, la Contrôleure générale des lieux de privation de liberté a publié le 9 juillet des recommandations en urgence. Son équipe rapporte des témoignages de détenus et de professionnels et décrit des fouilles humiliantes ou brutales, des usages disproportionnés de la force et des brimades. Elle souligne que des alertes et mesures antérieures n’avaient pas suffi à faire cesser ces pratiques. Ce sont les constats de l’autorité de contrôle, pas des condamnations pénales individuelles.", "Saisi en référé, le tribunal administratif de Caen a ordonné le 18 juillet au ministre de prendre les mesures utiles pour empêcher des comportements contraires à la déontologie. Le ministre de la Justice a fait appel, invoquant notamment les mesures déjà prises et contestant la réalité ou l’actualité des faits dénoncés. Par ordonnance du 3 septembre, le Conseil d’État a rejeté son recours : l’administration doit de toute façon empêcher ces agissements et le ministre conserve le choix des mesures nécessaires.", "La portée du jugement mérite d’être dite exactement. Le Conseil d’État ne tranche pas, dans cette ordonnance, la matérialité de chaque violence ni la responsabilité de tel agent ; il rejette aussi d’autres demandes des détenus et de l’Observatoire international des prisons. L’injonction de prévention demeure, tandis que l’enquête sur les faits et les suites disciplinaires ou pénales éventuelles doivent être suivies séparément."], sources: [{name:"CGLPL, recommandations en urgence publiées au Journal officiel le 9 juillet 2026",url:"https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054400191"},{name:"Conseil d’État, ordonnance n° 518418 du 3 septembre 2026 (texte intégral transmis par l’OIP)",url:"https://oip.org/wp-content/uploads/2026/09/decision-518418-anonymisee40.pdf"},{name:"CGLPL, présentation de l’enquête et des réponses du ministère",url:"https://www.cglpl.fr/publications/recommandations-en-urgence-relatives-au-centre-penitentiaire-dalencon-conde-sur-sarthe-orne"}] },
  { slug: "plaintes-violences-mineurs-revue-justice-2026", category: "Justice · Enfance", title: "Violences sexuelles sur mineurs : 85 047 plaintes recensées, après le drame", summary: "Une revue nationale déclenchée en juin a recensé 85 047 plaintes en cours. Au 15 juillet, 69 626 dossiers avaient été revus et 970 classés prioritaires. Le ministère n’a pas publié de bilan final actualisé dans sa réponse du 27 août.", date: "2026-09-12", angle: "Qu’il ait fallu un drame pour dresser pour la première fois ce tableau national appelle une question : combien de temps chaque enfant attend-il réellement une protection ?", paragraphs: ["Après la mort d’une enfant dans le Gers, le ministère de la Justice a demandé en juin 2026 aux parquets de reprendre le stock des procédures relatives aux violences sexuelles sur mineurs. Son bilan du 15 juillet recense 85 047 plaintes et 69 626 dossiers déjà revus, soit 82 % du stock selon le ministère. « Plaintes », « dossiers revus » et « affaires poursuivies » ne désignent pas la même chose : ces 85 047 plaintes ne sont pas autant de dossiers abandonnés.", "Le ministère indique avoir repéré 970 dossiers prioritaires, définis ici par la présence d’un auteur identifié avec antécédents judiciaires et d’une victime toujours mineure. Il donne une ancienneté moyenne de 14,2 mois pour les dossiers traités par les parquets, et attribue à la revue 1 350 ouvertures d’informations judiciaires ainsi que 675 incarcérations depuis le 8 juin. Ces chiffres décrivent une opération de tri et ses premiers effets, sans établir pour chaque plainte si une protection a été assurée à temps.", "Dans une réponse publiée au Sénat le 27 août, le ministère reprend encore le bilan arrêté au 15 juillet ; elle n’apporte pas de nouveau nombre de dossiers revus. Le sénateur interrogateur pointait notamment la circulation de l’information entre parquets, mais sa question ne vaut pas, à elle seule, conclusion d’enquête sur les responsabilités dans le drame. Il manque un bilan actualisé, les délais par type de dossier et les suites données aux plaintes hors de la catégorie « prioritaire »."], sources: [{name:"Ministère de la Justice, bilan de la revue du 15 juillet 2026",url:"https://www.justice.gouv.fr/actualites/actualite/bilan-revue-plaintes-relatives-aux-violences-sexuelles-commises-mineurs"},{name:"Sénat, question n° 09171 et réponse du ministère du 27 août 2026",url:"https://www.senat.fr/questions/base/2026/qSEQ260609171.html"}] },
  { slug: "petrole-aie-septembre-offre-demande-diesel", category: "Monde · Économie", title: "Pétrole : la demande baisse, le diesel reste sous tension", summary: "L’Agence internationale de l’énergie revoit ses prévisions à la baisse pour 2026. Les difficultés d’approvisionnement et de raffinage expliquent pourquoi cela ne signifie pas des carburants moins chers.", date: "2026-09-11", angle: "Une demande mondiale en recul ne garantit pas une détente des prix quand l’offre et le raffinage se contractent aussi.", paragraphs: ["Dans son rapport du 11 septembre, l’Agence internationale de l’énergie (AIE) prévoit que la demande mondiale de pétrole diminuera de 2,5 millions de barils par jour en 2026 par rapport à 2025. Elle a accentué cette baisse de 940 000 barils par jour depuis son rapport précédent. Dans le même temps, elle anticipe une offre mondiale en recul de 5,7 millions de barils par jour sur l’année. Ce sont des prévisions, pas encore des résultats définitifs.", "L’AIE souligne que la tension porte particulièrement sur les produits raffinés. Elle indique que les prix de gros du diesel aux États-Unis ont dépassé 200 dollars par baril au début de septembre, dans un contexte de perturbations de la production, du transport et des raffineries. Ce chiffre ne correspond pas au prix payé à la pompe en France : il décrit un marché de gros et un pays précis.", "L’agence lie ses projections à la poursuite des difficultés de circulation du pétrole au Moyen-Orient et prévoit une reprise de la production en 2027. Pour les ménages et les entreprises, le rapport signale un risque de coûts énergétiques persistants, mais il ne permet pas de chiffrer leur prochaine facture. L’évolution du conflit, des stocks et du raffinage reste déterminante."], sources: [{name:"AIE, Oil Market Report, 11 septembre 2026",url:"https://www.iea.org/reports/oil-market-report-september-2026"}] },
  { slug: "gaz-octobre-prix-repere", category: "Économie", title: "Gaz : une hausse de 6,3 %, mais pas pour tous les contrats", summary: "Le prix repère grimpera en octobre. Pour savoir si votre facture suivra, il faut regarder la formule de votre contrat, pas seulement le pourcentage annoncé.", date: "2026-09-11", angle: "Le chiffre est réel, mais il ne décrit pas toutes les factures.", paragraphs: ["La Commission de régulation de l’énergie fixe le prix repère d’octobre à 182,88 € TTC par mégawattheure, contre 172,05 € en septembre. Cela représente une hausse de 6,3 % d’un mois sur l’autre.", "Ce prix repère sert de référence, mais chaque fournisseur détermine ses offres. Les clients dont le prix est indexé sur ce repère peuvent voir leur facture évoluer ; un contrat à prix fixe n’est pas directement concerné par cette hausse.", "Selon l’estimation citée par Service Public, l’effet moyen en octobre serait de 5,28 € TTC pour les contrats concernés. Avant de conclure que votre facture augmentera de 6,3 %, vérifiez le type d’offre et la période de facturation."], sources: [{name:"Service Public, 11 septembre 2026",url:"https://www.service-public.gouv.fr/particuliers/actualites/A17956"}] },
  { slug: "croissance-francaise-insee-septembre", category: "Économie", title: "Croissance : ce que dit vraiment l’alerte de l’Insee", summary: "L’institut prévoit une progression de 0,4 % de l’économie française en 2026. Il s’agit d’une prévision, avec un ralentissement déjà visible au premier semestre.", date: "2026-09-10", angle: "Une prévision décrit un scénario, pas un résultat acquis.", paragraphs: ["Dans sa note de conjoncture de septembre, l’Insee anticipe une croissance de 0,4 % sur l’ensemble de 2026. Après un recul de 0,2 % durant l’hiver, l’activité a stagné au printemps. L’institut envisage une petite reprise de 0,1 % à l’été puis de 0,2 % en fin d’année.", "L’Insee avance plusieurs facteurs de faiblesse : les travaux publics, les effets des vagues de chaleur sur l’agriculture et un marché du travail moins dynamique. Ses estimations reposent sur les informations disponibles au moment de la publication et peuvent être révisées.", "Le point utile à retenir : la France pourrait retrouver une croissance trimestrielle positive sans que cela efface la faiblesse de l’année entière. Les prochaines données permettront de mesurer l’écart entre cette prévision et la réalité."], sources: [{name:"Insee, note de conjoncture, 10 septembre 2026",url:"https://www.insee.fr/fr/statistiques/9050743?sommaire=9050757"}] },
  { slug: "etudiants-rentree-2026-droits", category: "Société", title: "Rentrée étudiante : les aides à vérifier avant de renoncer", summary: "Logement, bourses, repas et santé : les dispositifs existent, mais leurs conditions ne sont pas les mêmes. Un point de départ pour vérifier ses droits.", date: "2026-09-07", angle: "Une liste d’aides ne vaut pas une confirmation d’éligibilité.", paragraphs: ["Service Public a rassemblé pour la rentrée 2026-2027 les principales démarches qui concernent les étudiants : inscription, bourses, logement, restauration universitaire et accompagnement en santé mentale.", "La page renvoie vers les règles détaillées de chaque dispositif. Elle mentionne notamment le repas à 1 € accessible à tous les étudiants. Pour une bourse ou une aide au logement, les conditions individuelles restent à vérifier sur les pages dédiées.", "Notre conseil de lecture : commencez par les droits qui correspondent à votre situation, puis vérifiez leurs dates et leurs justificatifs sur le site officiel. Une synthèse générale ne remplace pas la règle applicable à votre dossier."], sources: [{name:"Service Public, 7 septembre 2026",url:"https://www.service-public.gouv.fr/particuliers/actualites/A19053"}] }
];

export function formatDate(value: string) { return new Intl.DateTimeFormat("fr-FR", {day:"numeric", month:"long", year:"numeric", timeZone:"Europe/Paris"}).format(new Date(`${value}T12:00:00Z`)); }

export const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
export function isFreshArticle(article: Article, now = Date.now()) {
  // Older entries have no precise publication time and must never reappear as fresh news.
  const published = Date.parse(article.publishedAt ?? "");
  const event = Date.parse(article.eventAt ?? "");
  return !article.withdrawn && Number.isFinite(published) && Number.isFinite(event)
    && published <= now && event <= now && now - published < SIX_HOURS_MS
    && now - event < SIX_HOURS_MS;
}
