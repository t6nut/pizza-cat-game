export function scheduleZombieSpawns(scene) {
  if (scene.zombieSpawnEvent) {
    scene.zombieSpawnEvent.remove(false);
  }
  const mode = scene.getCurrentMode();
  scene.zombieSpawnEvent = scene.time.addEvent({
    delay: mode.zombieSpawnDelay,
    loop: true,
    callback: scene.spawnZombie,
    callbackScope: scene,
  });
}

export function spawnZombie(scene, worldWidth) {
  if (!scene.zombiesEnabled) {
    return;
  }
  const mode = scene.getCurrentMode();
  const isVampire = scene.currentEnemyType === 'vampires';
  const fromLeft = Math.random() > 0.5;
  const startX = fromLeft ? 10 : worldWidth - 10;
  const speed = isVampire ? mode.zombieSpeed + 12 : mode.zombieSpeed;
  const velocityX = fromLeft ? speed : -speed;
  const textureKey = isVampire ? 'vampireWalker1' : 'zombieWalker1';

  const activeEnemies = scene.zombieGroup.getChildren();
  for (let i = 0; i < activeEnemies.length; i += 1) {
    const e = activeEnemies[i];
    if (!e?.active) {
      continue;
    }
    if (Math.abs(e.x - startX) < 72) {
      return;
    }
  }

  const zombie = scene.zombieGroup.get(startX, scene.getGroundSurfaceY(), textureKey);
  if (!zombie) {
    return;
  }
  if (zombie.shadow) {
    zombie.shadow.destroy();
    zombie.shadow = null;
  }
  zombie.shadow = scene.add.ellipse(startX, scene.getGroundSurfaceY(), 36, 12, 0x000000, 0.2).setDepth(6);
  if (zombie.umbrella) {
    zombie.umbrella.destroy();
    zombie.umbrella = null;
  }
  zombie.setActive(true);
  zombie.setVisible(true);
  zombie.setOrigin(0.5, 1);
  zombie.body.enable = true;
  zombie.setVelocityX(velocityX);
  zombie.setDepth(7);
  zombie.setFlipX(!fromLeft);
  zombie.clearTint();
  if (isVampire) {
    zombie.setTint(0xd8c3ff);
  }
  zombie.alive = true;
  zombie.growthScale = 1;
  zombie.setScale(1);
  zombie.moveDir = fromLeft ? 1 : -1;
  zombie.moveSpeed = speed;
  zombie.litStopped = false;
  zombie.enemyType = isVampire ? 'vampire' : 'zombie';
  zombie.vampireLightMs = 0;
  zombie.laserBurnMs = 0;
  zombie.umbrella = null;
  zombie.walkAnimTime = 0;
  zombie.walkAnimFrame = 0;
  scene.syncEnemyBody(zombie);
}
