export function createHud(scene, worldWidth) {
  const style = {
    fontFamily: '"Trebuchet MS", "Verdana", sans-serif',
    fontSize: '20px',
    color: '#2f1b14',
    stroke: '#fff8e6',
    strokeThickness: 3,
  };

  scene.scoreText = scene.add.text(20, 20, 'Food: 0', style).setDepth(20);
  scene.sizeText = scene.add.text(20, 48, 'Size: 1.00x', style).setDepth(20);
  scene.modeText = scene.add.text(20, 76, 'Mode: --', style).setDepth(20);
  scene.batteryLabelText = scene.add.text(20, 104, 'Battery', style).setDepth(20);
  scene.batteryBarFrame = scene.add.graphics().setDepth(20);
  scene.batteryBarFill = scene.add.graphics().setDepth(20);
  scene.fuelLabelText = scene.add.text(20, 132, 'Fuel', style).setDepth(20);
  scene.fuelBarFrame = scene.add.graphics().setDepth(20);
  scene.fuelBarFill = scene.add.graphics().setDepth(20);

  scene.add
    .text(worldWidth - 20, 20, 'ESC: Menu   F: Light/Laser   G: Fullscreen', {
      fontFamily: '"Trebuchet MS", "Verdana", sans-serif',
      fontSize: '18px',
      color: '#2f1b14',
      stroke: '#fff8e6',
      strokeThickness: 3,
    })
    .setOrigin(1, 0)
    .setDepth(20);

  scene.updateHud();
}

export function updateHud(scene, modeSettings, mapSettings, enemySettings) {
  const mode = modeSettings[scene.currentModeKey] || modeSettings.medium;
  const map = mapSettings[scene.currentMapKey] || mapSettings.city;
  const enemy = enemySettings[scene.currentEnemyType] || enemySettings.off;
  scene.scoreText.setText(`Food: ${scene.foodPoints}`);
  scene.sizeText.setText(`Size: ${scene.sizeMultiplier.toFixed(2)}x`);
  scene.modeText.setText(`Mode: ${mode.label} | Map: ${map.label} | Enemy: ${enemy.label}`);

  const barX = 108;
  const barY = 110;
  const barW = 64;
  const barH = 18;
  const fillPct = Phaser.Math.Clamp(scene.flashlightBattery / scene.flashlightBatteryMax, 0, 1);

  scene.batteryBarFrame.clear();
  scene.batteryBarFrame.lineStyle(2, 0x13331e, 1);
  scene.batteryBarFrame.strokeRoundedRect(barX, barY, barW, barH, 3);
  scene.batteryBarFrame.fillStyle(0x13331e, 1);
  scene.batteryBarFrame.fillRect(barX + barW, barY + 5, 4, 8);

  scene.batteryBarFill.clear();
  scene.batteryBarFill.fillStyle(0x54d66a, 1);
  scene.batteryBarFill.fillRoundedRect(barX + 2, barY + 2, Math.max(0, (barW - 4) * fillPct), barH - 4, 2);

  const fuelVisible = scene.currentMapKey === 'moon';
  scene.fuelLabelText.setVisible(fuelVisible);
  if (!fuelVisible) {
    scene.fuelBarFrame.clear();
    scene.fuelBarFill.clear();
    return;
  }

  const fuelBarY = barY + 28;
  const fuelPct = Phaser.Math.Clamp(scene.jetpackFuel / scene.jetpackFuelMax, 0, 1);
  scene.fuelBarFrame.clear();
  scene.fuelBarFrame.lineStyle(2, 0x2f2633, 1);
  scene.fuelBarFrame.strokeRoundedRect(barX, fuelBarY, barW, barH, 3);
  scene.fuelBarFrame.fillStyle(0x2f2633, 1);
  scene.fuelBarFrame.fillRect(barX + barW, fuelBarY + 5, 4, 8);

  scene.fuelBarFill.clear();
  scene.fuelBarFill.fillStyle(0xffb547, 1);
  scene.fuelBarFill.fillRoundedRect(barX + 2, fuelBarY + 2, Math.max(0, (barW - 4) * fuelPct), barH - 4, 2);
}

export function showCatchPopup(scene, x, y, text) {
  const label = scene.add.text(x, y, text, {
    fontFamily: '"Trebuchet MS", "Verdana", sans-serif',
    fontSize: '18px',
    color: '#9e2a2a',
    stroke: '#fff3d8',
    strokeThickness: 3,
  });
  label.setOrigin(0.5).setDepth(25);
  scene.tweens.add({ targets: label, y: y - 30, alpha: 0, duration: 420, ease: 'Sine.easeOut', onComplete: () => label.destroy() });
}
