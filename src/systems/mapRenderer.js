export function createBackground(scene, worldWidth, worldHeight) {
  scene.bgSky = scene.add.rectangle(worldWidth / 2, worldHeight / 2, worldWidth, worldHeight, 0x99e8ff).setDepth(0);
  scene.bgGround = scene.add.rectangle(worldWidth / 2, worldHeight - 100, worldWidth, 200, 0xa8de78).setDepth(1);
}

export function applyMap(scene, mapKey, worldWidth, worldHeight) {
  const map = scene.mapSettings[mapKey] || scene.mapSettings.city;
  scene.currentMapKey = mapKey;
  scene.bgSky.setVisible(true);
  scene.bgGround.setVisible(true);
  scene.bgSky.setFillStyle(map.skyColor, 1);
  scene.bgGround.setFillStyle(map.groundColor, 1);

  for (let i = 0; i < scene.backgroundElements.length; i += 1) {
    scene.backgroundElements[i].destroy();
  }
  scene.backgroundElements = [];

  if (mapKey === 'city') {
    const cityNight = scene.currentThemeKey === 'night';
    scene.bgSky.setVisible(true);
    scene.bgGround.setVisible(true);
    scene.bgSky.setFillStyle(cityNight ? 0x101a34 : 0x95d5ff, cityNight ? 0.94 : 1);
    scene.bgGround.setFillStyle(cityNight ? 0x3a4558 : 0x6d7686, 1);

    const sunOrMoon = scene.add.circle(1030, 86, 36, cityNight ? 0xe9f3ff : 0xffed9e, cityNight ? 0.86 : 0.92).setDepth(2);
    scene.backgroundElements.push(sunOrMoon);

    for (let i = 0; i < 11; i += 1) {
      const x = 54 + i * 122;
      const h = 90 + (i % 4) * 26;
      const buildingColor = cityNight ? 0x273348 : 0x7f8ea4;
      const windowColor = cityNight ? 0x1a2236 : 0x5a687d;
      const lightColor = cityNight ? 0xffeb3b : 0xfffacd;
      const building = scene.add.rectangle(x, worldHeight - 170 - h * 0.5, 78, h, buildingColor, 0.95).setDepth(2);
      scene.backgroundElements.push(building);

      const floorCount = Math.max(3, Math.floor(h / 20));
      for (let f = 0; f < floorCount; f += 1) {
        for (let w = 0; w < 2; w += 1) {
          const windowY = worldHeight - 170 - h * 0.5 + (f - floorCount * 0.5) * 22;
          const windowX = x - 16 + w * 32;
          const windowGlass = scene.add.rectangle(windowX, windowY, 10, 10, windowColor, 0.85).setDepth(2);
          scene.backgroundElements.push(windowGlass);

          if (cityNight && ((i + f + w) % 3 !== 0)) {
            const light = scene.add.rectangle(windowX, windowY, 8, 8, lightColor, 0.65).setDepth(2);
            scene.backgroundElements.push(light);
          }
        }
      }

      if (i % 3 === 0) {
        const roofY = worldHeight - 170 - h - 5;
        const roofLeft = scene.add.triangle(x - 20, roofY + 6, 0, 10, 20, 0, 40, 10, cityNight ? 0x1a1625 : 0x5a3a25, 0.9).setDepth(2);
        const roofRight = scene.add.triangle(x + 20, roofY + 6, 0, 10, 20, 0, 40, 10, cityNight ? 0x1a1625 : 0x5a3a25, 0.9).setDepth(2);
        scene.backgroundElements.push(roofLeft, roofRight);
      }
    }

    const skylineBaseY = Math.floor(worldHeight * 0.75);
    const asphalt = scene.add.rectangle(worldWidth / 2, skylineBaseY + 14, worldWidth, 44, 0x262a32, 0.9).setDepth(2);
    const laneStripe = scene.add.rectangle(worldWidth / 2, skylineBaseY + 14, worldWidth, 3, 0xc9c9bf, 0.55).setDepth(2);
    scene.backgroundElements.push(asphalt, laneStripe);

    for (let i = 0; i < 7; i += 1) {
      const tx = 90 + i * 170;
      const trunk = scene.add.rectangle(tx, skylineBaseY - 8, 8, 18, 0x5b3a25, 0.95).setDepth(3);
      const leaves = scene.add.circle(tx, skylineBaseY - 22, 13, 0x4f9650, 0.95).setDepth(3);
      scene.backgroundElements.push(trunk, leaves);
    }

    for (let i = 0; i < 4; i += 1) {
      const y = skylineBaseY + 6 + i * 7;
      const speed = 3800 + i * 700;
      const color = [0xe04444, 0x44a6e0, 0xf0c547, 0xa35de6][i % 4];
      const fromLeft = i % 2 === 0;
      const body = scene.add.rectangle(fromLeft ? -80 : worldWidth + 80, y, 48, 16, color, 0.9).setDepth(2);
      const wheelA = scene.add.circle(body.x - 14, y + 8, 3, 0x1f1f1f, 1).setDepth(2);
      const wheelB = scene.add.circle(body.x + 14, y + 8, 3, 0x1f1f1f, 1).setDepth(2);
      scene.backgroundElements.push(body, wheelA, wheelB);

      scene.tweens.add({
        targets: body,
        x: fromLeft ? worldWidth + 90 : -90,
        duration: speed,
        repeat: -1,
        ease: 'Linear',
        onUpdate: () => {
          wheelA.x = body.x - 14;
          wheelB.x = body.x + 14;
        },
      });
    }
  } else if (mapKey === 'desert') {
    const dune1 = scene.add.ellipse(230, worldHeight - 80, 420, 110, 0xe7bf7e, 0.55).setDepth(2);
    const dune2 = scene.add.ellipse(640, worldHeight - 65, 560, 130, 0xd6aa68, 0.5).setDepth(2);
    const sun = scene.add.circle(830, 86, 34, 0xfff1a0, 0.9).setDepth(2);
    scene.backgroundElements.push(dune1, dune2, sun);
  } else if (mapKey === 'beach') {
    const sea = scene.add.rectangle(worldWidth / 2, worldHeight * 0.58, worldWidth, worldHeight * 0.64, 0x4fc4dc, 0.6).setDepth(2);
    const wave1 = scene.add.ellipse(260, worldHeight * 0.41, 420, 34, 0xbef6ff, 0.45).setDepth(2);
    const wave2 = scene.add.ellipse(700, worldHeight * 0.44, 520, 38, 0xbef6ff, 0.4).setDepth(2);
    const wave3 = scene.add.ellipse(1080, worldHeight * 0.47, 360, 30, 0xbef6ff, 0.36).setDepth(2);
    scene.backgroundElements.push(sea, wave1, wave2, wave3);
  } else if (mapKey === 'moon') {
    scene.bgSky.setVisible(true);
    scene.bgSky.setFillStyle(0x0c1330, 1);
    scene.bgGround.setVisible(false);
    const moonSurface = scene.add.ellipse(worldWidth / 2, worldHeight + 150, 1400, 560, 0x8f97ab, 0.8).setDepth(2);
    const ringA = scene.add.ellipse(worldWidth / 2, worldHeight + 160, 1250, 500, 0xc7cdd8, 0.08).setDepth(3);
    const ringB = scene.add.ellipse(worldWidth / 2, worldHeight + 170, 1120, 440, 0xdde3ef, 0.08).setDepth(3);
    scene.backgroundElements.push(moonSurface, ringA, ringB);

    for (let i = 0; i < 16; i += 1) {
      const cx = Phaser.Math.Between(90, worldWidth - 90);
      const cy = Phaser.Math.Between(worldHeight - 42, worldHeight + 66);
      const rx = Phaser.Math.Between(18, 52);
      const ry = Phaser.Math.Between(9, 24);
      const crater = scene.add.ellipse(cx, cy, rx, ry, 0x727b8e, 0.36).setDepth(3);
      const rim = scene.add.ellipse(cx - 4, cy - 2, rx * 0.7, ry * 0.55, 0xc8cfdb, 0.14).setDepth(3);
      scene.backgroundElements.push(crater, rim);
    }

    scene.tweens.add({ targets: ringA, x: worldWidth / 2 + 24, y: worldHeight + 152, duration: 4600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    scene.tweens.add({ targets: ringB, x: worldWidth / 2 - 24, y: worldHeight + 178, duration: 5100, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }
}
