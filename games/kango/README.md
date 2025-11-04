# 🎮 Kango — Demolition

Juego retro hecho con **Phaser 3** para el **Platanus Hack 25: Arcade Challenge**.

## 🎯 Objetivo
Demuele un edificio de varios pisos lo más rápido posible con tu Kango (martillo en “T”).  
Cada golpe destruye el piso superior y te da más puntos si eres veloz.

## 🕹️ Controles
- **↓** Demoler piso actual  
- **R** Reiniciar partida

## ✨ Características
- Edificio generado proceduralmente (pisos y ventanas aleatorias).  
- Arte 100% por código: skyline neón, grúas, logo Kango, polvo al golpear.  
- Puntaje basado en rapidez.

## ⚙️ Reglas cumplidas
✅ Vanilla JS (sin imports, sin require).  
✅ Sin assets ni URLs externas.  
✅ Sin llamadas de red.  
✅ < 50KB tras minificar.  
✅ Phaser 3.87.0 inyectado globalmente.  
✅ Controles simples.

## 🚀 Cómo correr localmente
```bash
cd games/kango
npx http-server .
# o
python3 -m http.server