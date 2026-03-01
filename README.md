# 3D Reprezentácia Prevodovky 

## O Projekte

Tento program predstavuje **3D reprezentáciu prevodovky automobilu** vytvorenú v rámci tematického okruhu *Simulátor dynamického pohybu v 3D priestore* vrámci predmetu **Počítačová grafika**.

### Cieľ Projektu

Hlavným cieľom projektu je:
- Priblížiť **princíp činnosti manuálnej prevodovky**
- Vizuálne znázorniť zmenu prevodového stupňa
- Ukázať prenos točivého momentu z motora cez prevodovku až na kolesá
- Umožniť sledovanie celej poháňacej sústavy (drivetrain)

Program slúži ako **vzdelávací a interaktívny nástroj**, ktorý zrozumiteľnou formou ukazuje spoluprácu jednotlivých komponentov prevodovky.

---

## Inštalácia a Spustenie

### Spustenie Projektu

1. Otvorte projekt vo Webstorm IDE, zvoľte `index.html` súbor a vyberte si webový prehliadač (Chrome, Firefox, Edge, Safari) z ikoniek zobrazených v pravom hornom rohu IDE. 
2. Aplikácia by sa mala automaticky načítať

---

## Obsah Balíčka

```
Filicko_Kocakova_PG1_2025_2026/
├── index.html                 # Hlavný HTML súbor
├── main.js                    # Hlavný JavaScript kód
├── styles.css                 # Štýly aplikácie
├── package.json               # Konfigurácia projektu
├── README.md                  # Tento súbor
├── gearbox16.glb              # 3D model prevodovky
├── white.jpg                  # Textúra pozadia
├── road.jpg                   # Textúra cesty
├── js/                        # JavaScript knižnice
│   └── threejs/               # Three.js knižnica
├── DOKUMENTACIA/              # Dokumentácia projektu
│   ├── USER_GUIDE.pdf         # Návod na používanie
│   └── SYSTEM_GUIDE.pdf       # Technická dokumentácia
```

---

## Rýchly Návod na Používanie

### Ovládanie Kamery
- **WASD** - Pohyb kamery (dopredu, dozadu, vľavo, vpravo)
- **↑ / ↓** - Pohyb kamery hore/dole
- **Myš + klinutie** - Rotácia pohľadu (OrbitControls)
- **Shift** - Rýchlejší pohyb

### Interakcia s Prevodovkou
- **G** - Otvorenie výberu prevodového stupňa
- **Myš** - Pohyb v H-vzore prevodovky
- **Uvoľnenie G** - Zaradenie vybraného stupňa

### Vizualizácia
- Sledujte rotáciu ozubených kolies
- Pozorujte pohyb konekcií pri zmene stupňa
- Všimните si pohyb kolies automobilu

---

## Dokumentácia

### Pre Užívateľa
Podrobný návod na používanie aplikácie vrátane vysvetlenia jednotlivých komponentov prevodovky nájdete v:
- **`USER_GUIDE.pdf`** - Kompletný návod na používanie

### Pre Vývojárov
Ak chcete rozumieť kódu alebo vykonať zmeny v programe, pozrite si:
- **`SYSTEM_GUIDE.pdf`** - Technická dokumentácia, popis architektúry a kódu

---

## Technické Požiadavky

- **Webový prehliadač**: Chrome, Firefox, Edge, Safari (moderné verzie)
- **JavaScript**: Musí byť povolený v prehliadači
- **Internetové pripojenie**: Nie je potrebné (lokálne spustenie)

---

## Autori

**Jakub Filičko**  
**Jana Kocáková**

Predmet: Počítačová grafika  
Katedra informatiky a počítačov  
Technická univerzita v Košiciach  
Akademický rok: 2025/2026

---

## Poznámky

- Aplikácia používa **Three.js** knižnicu pre 3D grafiku
- 3D model prevodovky je importovaný z GLTF formátu (`.glb`)
- Interaktívne ovládanie je realizované pomocou HTML5 a WebGL

---

**Verzia**: 1.0  
**Dátum**: 28. December 2025

---

# 3D Gearbox Representation (English)

## About the Project

This program presents a **3D representation of an automotive gearbox** created within the thematic area *Dynamic Motion Simulator in 3D Space* for the **Computer Graphics** course.

### Project Goals

The main goals of the project are:
- To illustrate the **operation principle of a manual gearbox**
- To visually demonstrate gear shifting
- To show torque transmission from the engine through the gearbox to the wheels
- To allow observation of the entire drivetrain

The program serves as an **educational and interactive tool** that clearly demonstrates how the individual gearbox components work together.

---

## Installation and Running

### Running the Project

1. Open the project in WebStorm IDE, select the `index.html` file and choose a web browser (Chrome, Firefox, Edge, Safari) from the icons displayed in the top right corner of the IDE.
2. The application should load automatically

---

## Package Contents

```
Filicko_Kocakova_PG1_2025_2026/
├── index.html                 # Main HTML file
├── main.js                    # Main JavaScript code
├── styles.css                 # Application styles
├── package.json               # Project configuration
├── README.md                  # This file
├── gearbox16.glb              # 3D gearbox model
├── white.jpg                  # Background texture
├── road.jpg                   # Road texture
├── js/                        # JavaScript libraries
│   └── threejs/               # Three.js library
├── DOKUMENTACIA/              # Project documentation
│   ├── USER_GUIDE.pdf         # User guide
│   └── SYSTEM_GUIDE.pdf       # Technical documentation
```

---

## Quick User Guide

### Camera Controls
- **WASD** - Camera movement (forward, backward, left, right)
- **↑ / ↓** - Camera movement up/down
- **Mouse + click** - View rotation (OrbitControls)
- **Shift** - Faster movement

### Gearbox Interaction
- **G** - Open gear selection
- **Mouse** - Movement in H-pattern
- **Release G** - Engage selected gear

### Visualization
- Watch the rotation of gear wheels
- Observe the movement of connections when changing gears
- Notice the movement of the car wheels

---

## Documentation

### For Users
A detailed user guide including explanation of individual gearbox components can be found in:
- **`USER_GUIDE.pdf`** - Complete user guide

### For Developers
To understand the code or make changes to the program, see:
- **`SYSTEM_GUIDE.pdf`** - Technical documentation, architecture and code description

---

## Technical Requirements

- **Web browser**: Chrome, Firefox, Edge, Safari (recent versions)
- **JavaScript**: Must be enabled in the browser
- **Internet connection**: Not required (local run)

---

## Authors

**Jakub Filičko**  
**Jana Kocáková**

Course: Computer Graphics  
Department of Informatics and Computers  
Technical University of Košice  
Academic year: 2025/2026

---

## Notes

- The application uses the **Three.js** library for 3D graphics
- The 3D gearbox model is imported from GLTF format (`.glb`)
- Interactive control is implemented using HTML5 and WebGL

---

**Version**: 1.0  
**Date**: December 28, 2025


