# HeitzFit4 Planning Card

Carte Lovelace pour afficher le planning du capteur `sensor.heitzfit4_planning`, réserver une activité et annuler une réservation.

## Fonctions

- Affichage des activités par jour, triées par heure de début.
- Conversion des dates ISO dans le fuseau horaire du navigateur/Home Assistant.
- Filtrage du nombre de jours et des seules activités réservées.
- Barre verticale verte si `booked: true`, grise sinon.
- Capacité en rouge lorsque `placesTaken >= placesMax`.
- Réservation via `heitzfit4.book_activity`.
- Annulation via `heitzfit4.delete_activity`.
- Rafraîchissement via `homeassistant.update_entity` après l'action.
- Interface FR/EN, automatique ou forcée.
- Éditeur visuel Lovelace pour toutes les options de la carte.
- Masquage automatique des activités du jour dont l’heure de fin est dépassée.
- Compatible thème clair/sombre et affichage mobile.

## Compilation

```bash
npm install
npm run build
```

Le bundle est généré dans `dist/heitzfit4-planning-card.js`.

## Installation manuelle

1. Copier `dist/heitzfit4-planning-card.js` vers `/config/www/heitzfit4-planning-card.js`.
2. Dans Home Assistant, ajouter une ressource JavaScript de type `module` avec l'URL `/local/heitzfit4-planning-card.js`.
3. Vider le cache du navigateur ou recharger le frontend.

## Éditeur visuel

La carte expose un éditeur graphique dans le dialogue Lovelace. Il permet de choisir le capteur, le nombre de jours, le titre, le logo, la langue, le filtre des réservations et l’affichage des actions.

## Configuration Lovelace

```yaml
type: custom:heitzfit4-planning-card
entity: sensor.heitzfit4_planning
days: 7
only_booked: false
show_actions: true
logo: /local/images/logo_globalfit.png
language: auto
```

Options :

- `entity` : obligatoire.
- `days` : nombre de dates non vides à afficher, par défaut `7`.
- `only_booked` : n'afficher que les activités réservées, par défaut `false`.
- `show_actions` : afficher les actions Réserver/Annuler, par défaut `true`.
- `logo` : URL facultative du logo.
- `language` : `auto`, `fr` ou `en`.
- `title` : titre facultatif.

> Correction importante : la valeur du logo doit être `logo: /local/images/logo_globalfit.png`, sans doubles apostrophes.

## Structure attendue du capteur

Le planning doit être exposé dans `state.attributes.planning`. La carte accepte également un état JSON contenant directement le planning ou une propriété `planning`.

## Services attendus

```yaml
service: heitzfit4.book_activity
data:
  activity_id: "104464564"
```

```yaml
service: heitzfit4.delete_activity
data:
  activity_id: "104464564"
```

Après chaque action, la carte appelle :

```yaml
service: homeassistant.update_entity
data:
  entity_id: sensor.heitzfit4_planning
```
