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

### Rozbalenie Archívu

1. Stiahnite súbor: `Filicko_Kocakova_PG1_2025_2026.zip`
2. Rozbalte archív do požadovanej zložky:
   - **Windows**: Kliknite pravým tlačidlom → "Extrahovať všetko"
   - **macOS/Linux**: `unzip Filicko_Kocakova_PG1_2025_2026.zip`

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



