# Lovelace cards for the heitzfit4 integration

A few cards to help display informations from the [heitzfit4 integration for Home Assistant](https://github.com/delphiki/hass-heitzfit4)

## Installation

### Using HACS

Add this repository to HACS : https://github.com/delphiki/lovelace-heitzfit4.git
then:  
HACS > Lovelace > **heitzfit4 Cards**

## Cards

### Planning
  
![planning heitzfit4 card example](/doc/images/planning-card.png "Planning heitzfit4 card example").
  
```yaml
type: custom:heitzfit4-planning-card
entity: sensor.heitzfit4_planning
display_header: true
display_done_reservation: true
reduce_done_reservation: true
current_week_only: false
```

This card can be used with all reservation sensors.


### Booking
  
![Booking card example](/doc/images/delays-card.png "Booking card example").
  
```yaml
type: custom:heitzfit4-booking-card
entity: sensor.heitzfit4_booking
display_header: true
max_delays: null
```