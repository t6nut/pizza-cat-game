export function spawnBatteryDrop(scene, x, y, driftDir) {
  const battery = scene.batteryGroup.get(x, y, 'batteryDrop');
  if (!battery) {
    return;
  }
  battery.setTexture('batteryDrop');
  battery.setActive(true);
  battery.setVisible(true);
  battery.body.enable = true;
  battery.body.setAllowGravity(true);
  battery.setScale(1);
  battery.setVelocity(Phaser.Math.Between(4, 10) * driftDir, Phaser.Math.Between(8, 15));
  battery.setGravityY(34);
  battery.setDragX(45);
  battery.setDepth(8);
  battery.onGround = false;
  battery.groundTimer = null;
  scene.attachDropShadow(battery, 28, 9, 0.14);
}

export function spawnFuelDrop(scene, x, y, driftDir) {
  const fuel = scene.fuelGroup.get(x, y, 'jetFuelDrop');
  if (!fuel) {
    return;
  }
  fuel.setTexture('jetFuelDrop');
  fuel.setActive(true);
  fuel.setVisible(true);
  fuel.body.enable = true;
  fuel.body.setAllowGravity(true);
  fuel.setScale(1);
  fuel.setVelocity(Phaser.Math.Between(6, 13) * driftDir, Phaser.Math.Between(10, 20));
  fuel.setGravityY(42);
  fuel.setDragX(48);
  fuel.setDepth(8);
  fuel.onGround = false;
  fuel.groundTimer = null;
  scene.attachDropShadow(fuel, 30, 9, 0.14);
}

export function handleBatteryHitGround(scene, objA, objB) {
  const battery = scene.batteryGroup && scene.batteryGroup.contains(objA) ? objA : objB;
  if (!battery || !scene.batteryGroup.contains(battery) || !battery.active || battery.onGround) {
    return;
  }

  battery.onGround = true;
  battery.setAngularVelocity(0);
  if (battery.body && battery.body.velocity) {
    battery.body.velocity.x *= 0.25;
    battery.body.velocity.y = 0;
  }

  battery.groundTimer = scene.time.delayedCall(6000, () => {
    if (battery.active) {
      scene.destroyDropShadow(battery);
      battery.disableBody(true, true);
    }
  });
}

export function handleFuelHitGround(scene, objA, objB) {
  const fuel = scene.fuelGroup && scene.fuelGroup.contains(objA) ? objA : objB;
  if (!fuel || !scene.fuelGroup.contains(fuel) || !fuel.active || fuel.onGround) {
    return;
  }

  fuel.onGround = true;
  fuel.setAngularVelocity(0);
  if (fuel.body && fuel.body.velocity) {
    fuel.body.velocity.x *= 0.25;
    fuel.body.velocity.y = 0;
  }

  fuel.groundTimer = scene.time.delayedCall(6000, () => {
    if (fuel.active) {
      scene.destroyDropShadow(fuel);
      fuel.disableBody(true, true);
    }
  });
}

export function handleBatteryPickup(scene, _kitten, battery) {
  if (!battery.active) {
    return;
  }
  if (battery.groundTimer) {
    battery.groundTimer.remove(false);
    battery.groundTimer = null;
  }
  scene.destroyDropShadow(battery);
  battery.disableBody(true, true);
  scene.flashlightBattery = scene.flashlightBatteryMax;
  scene.updateHud();
  scene.showCatchPopup(scene.kitten.x, scene.kitten.y - 34, 'BATTERY +100%');
}

export function handleFuelPickup(scene, _kitten, fuel) {
  if (!fuel.active) {
    return;
  }
  if (fuel.groundTimer) {
    fuel.groundTimer.remove(false);
    fuel.groundTimer = null;
  }
  scene.destroyDropShadow(fuel);
  fuel.disableBody(true, true);
  if (scene.jetpackFuel < scene.jetpackFuelMax) {
    scene.jetpackFuel = Math.min(scene.jetpackFuelMax, scene.jetpackFuel + 2.5);
  }
  scene.updateHud();
  scene.showCatchPopup(scene.kitten.x, scene.kitten.y - 34, 'FUEL +2.5s');
}

export function ensureBatteryTexture(scene) {
  if (scene.textures.exists('batteryDrop')) {
    return;
  }

  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0xf3f3f3, 1);
  g.fillRect(2, 0, 20, 4);
  g.fillStyle(0xd6d6d6, 1);
  g.fillRect(2, 4, 20, 2);
  g.lineStyle(1, 0xe8e8e8, 1);
  g.beginPath();
  g.moveTo(4, 6);
  g.lineTo(9, 12);
  g.moveTo(20, 6);
  g.lineTo(15, 12);
  g.strokePath();
  g.fillStyle(0x5c5c5c, 1);
  g.fillRect(8, 12, 8, 11);
  g.fillStyle(0x9be86f, 1);
  g.fillRect(9, 14, 6, 7);
  g.fillStyle(0x8a8a8a, 1);
  g.fillRect(10, 10, 4, 2);
  g.generateTexture('batteryDrop', 24, 24);
  g.destroy();
}

export function ensureFuelTexture(scene) {
  if (scene.textures.exists('jetFuelDrop')) {
    return;
  }

  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0x494949, 1);
  g.fillRoundedRect(6, 6, 12, 16, 3);
  g.fillStyle(0xffbd59, 1);
  g.fillRoundedRect(8, 9, 8, 10, 2);
  g.fillStyle(0x2b2b2b, 1);
  g.fillRect(10, 3, 4, 3);
  g.fillStyle(0xe5e5e5, 0.9);
  g.fillRect(9, 11, 1, 6);
  g.generateTexture('jetFuelDrop', 24, 24);
  g.destroy();
}
