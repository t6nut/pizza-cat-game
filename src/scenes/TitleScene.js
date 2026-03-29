import { drawNightBackground, TEXT_STYLE } from '../utils.js';

const W = 960;
const H = 540;

const CHARACTER_OPTIONS = {
  orange: { label: 'Orange Cat' },
  tuxedo: { label: 'Tuxedo Cat' },
  pikatchu: { label: 'Pikatchu' },
};

const MODE_OPTIONS = {
  easy: { label: 'Easy' },
  medium: { label: 'Medium' },
  hard: { label: 'Hard' },
};

const THEME_OPTIONS = {
  day: { label: 'Day' },
  night: { label: 'Night' },
};

const SAVE_PREFIX = 'cat_game_save_';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
    this.selectedCharacter = null;
    this.selectedMode = null;
    this.selectedTheme = null;
    this.selectedZombies = null;
    this.selectedRunMode = null;
    this.optionButtons = {};
  }

  preload() {
    // Load all assets here; Phaser caches them globally for other scenes.
    this.load.svg('kittenIdle', 'assets/sprites/kitten_idle.svg', { scale: 1 });
    this.load.svg('kittenRun',  'assets/sprites/kitten_run.svg',  { scale: 1 });
    this.load.svg('kittenEat',  'assets/sprites/kitten_eat.svg',  { scale: 1 });
    this.load.svg('tuxedoIdle', 'assets/sprites/tuxedo_idle.svg', { scale: 1 });
    this.load.svg('tuxedoRun',  'assets/sprites/tuxedo_run.svg',  { scale: 1 });
    this.load.svg('tuxedoEat',  'assets/sprites/tuxedo_eat.svg',  { scale: 1 });
    this.load.svg('pikatchuIdle', 'assets/sprites/pikatchu_idle.svg', { scale: 1 });
    this.load.svg('pikatchuRun',  'assets/sprites/pikatchu_run.svg',  { scale: 1 });
    this.load.svg('pikatchuEat',  'assets/sprites/pikatchu_eat.svg',  { scale: 1 });
    this.load.svg('pizza',      'assets/sprites/pizza_slice.svg', { scale: 1 });
    this.load.svg('pizzaWhole', 'assets/sprites/pizza_whole.svg', { scale: 1 });
    this.load.svg('chefHeli',   'assets/sprites/chef_helicopter.svg', { scale: 1 });
    this.load.svg('pizzaPlane', 'assets/sprites/pizza_plane.svg', { scale: 1 });
  }

  create() {
    drawNightBackground(this, W, H);

    // Helicopter flies in from the left, then hovers
    this.heli = this.add.sprite(-150, 82, 'chefHeli');
    this.heli.setScale(2).setDepth(5);

    this.tweens.add({
      targets: this.heli,
      x: W * 0.62,
      duration: 1700,
      ease: 'Cubic.easeOut',
      onComplete: () => this._startHeliHover(),
    });

    // Title
    this.add.text(W / 2, H / 2 - 118, 'PIZZA CAT', {
      ...TEXT_STYLE,
      fontSize: '66px',
      color: '#ffd700',
      strokeThickness: 10,
    }).setOrigin(0.5).setDepth(20);

    this.add.text(W / 2, H / 2 - 40,
      "An Italian chef in a helicopter is dropping pizza!", {
      ...TEXT_STYLE,
      fontSize: '17px',
      color: '#c8e0ff',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(20);

    this.add.text(W / 2, H / 2 - 12, '❤  Catch every slice to grow HUGE!  ❤', {
      ...TEXT_STYLE,
      fontSize: '18px',
      color: '#ffcc44',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(20);

    this.add.text(W / 2, H / 2 + 18, '← → or A / D move, ↑ or W jump', {
      ...TEXT_STYLE,
      fontSize: '16px',
      color: '#88aadd',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(20);

    this.add.text(W / 2, H / 2 + 54, 'Select all options to unlock Start', {
      ...TEXT_STYLE,
      fontSize: '18px',
      color: '#ffffff',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(20);

    this.createOptionsPanel();

    // Kitten bouncing at bottom
    const kitten = this.add.sprite(W / 2, H - 44, 'kittenIdle');
    kitten.setScale(3).setDepth(10);
    this.tweens.add({
      targets: kitten,
      y: H - 50,
      duration: 850,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Decorative pizzas drop every 1 s
    this.time.addEvent({ delay: 1000, loop: true, callback: this._dropPizza, callbackScope: this });

  }

  createOptionsPanel() {
    const panelY = H - 138;
    const panel = this.add.rectangle(W / 2, panelY, 860, 220, 0x0a142d, 0.9);
    panel.setStrokeStyle(3, 0x9bc4ff, 0.6);
    panel.setDepth(16);

    this.add.text(W / 2, panelY - 92, '1) Character', {
      ...TEXT_STYLE,
      fontSize: '18px',
      color: '#cde1ff',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(17);

    this.add.text(W / 2, panelY - 36, '2) Mode', {
      ...TEXT_STYLE,
      fontSize: '18px',
      color: '#cde1ff',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(17);

    this.add.text(W / 2, panelY + 20, '3) Theme   4) Zombies   5) Session', {
      ...TEXT_STYLE,
      fontSize: '18px',
      color: '#cde1ff',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(17);

    this.createOptionRow('character', ['orange', 'tuxedo', 'pikatchu'], CHARACTER_OPTIONS, panelY - 64, (value) => {
      this.selectedCharacter = value;
    });

    this.createOptionRow('mode', ['easy', 'medium', 'hard'], MODE_OPTIONS, panelY - 8, (value) => {
      this.selectedMode = value;
    });

    this.createOptionRow('theme', ['day', 'night'], THEME_OPTIONS, panelY + 48, (value) => {
      this.selectedTheme = value;
    }, W / 2 - 150);

    this.createOptionRow('zombies', ['on', 'off'], { on: { label: 'On' }, off: { label: 'Off' } }, panelY + 48, (value) => {
      this.selectedZombies = value;
    }, W / 2 + 150);

    this.createOptionRow('session', ['new', 'continue'], { new: { label: 'New' }, continue: { label: 'Continue' } }, panelY + 48, (value) => {
      this.selectedRunMode = value;
    }, W / 2 + 360);

    this.startButton = this.add.rectangle(W / 2, panelY + 92, 280, 44, 0x4d596b, 1)
      .setDepth(17)
      .setStrokeStyle(3, 0x9bc4ff, 0.5);
    this.startText = this.add.text(W / 2, panelY + 92, 'Select All Options', {
      ...TEXT_STYLE,
      fontSize: '20px',
      color: '#c6d0dd',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(18);

    this.startButton.setInteractive({ useHandCursor: true });
    this.startButton.on('pointerdown', () => {
      if (this.canStart()) {
        this._start();
      }
    });

    this.sessionHint = this.add.text(W / 2 + 360, panelY + 77, 'Pick character to check save', {
      ...TEXT_STYLE,
      fontSize: '12px',
      color: '#d2dbeb',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(18);

    this.updateStartButtonState();
  }

  createOptionRow(groupName, keys, sourceMap, y, onSelect, centerX = W / 2) {
    this.optionButtons[groupName] = [];
    const spacing = keys.length === 2 ? 130 : 170;
    const width = keys.length === 2 ? 120 : 150;
    const startX = centerX - ((keys.length - 1) * spacing) / 2;

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const label = sourceMap[key].label;
      const box = this.add.rectangle(startX + i * spacing, y, width, 34, 0x283c5c, 1)
        .setDepth(17)
        .setStrokeStyle(2, 0x89b8ff, 0.7);
      box.selected = false;

      const text = this.add.text(startX + i * spacing, y, label, {
        ...TEXT_STYLE,
        fontSize: '16px',
        color: '#e2f0ff',
        strokeThickness: 2,
      }).setOrigin(0.5).setDepth(18);

      box.setInteractive({ useHandCursor: true });
      box.on('pointerover', () => {
        if (!box.selected) {
          box.setFillStyle(0x33517a);
        }
      });
      box.on('pointerout', () => {
        if (!box.selected) {
          box.setFillStyle(0x283c5c);
        }
      });
      box.on('pointerdown', () => {
        const row = this.optionButtons[groupName];
        for (let j = 0; j < row.length; j += 1) {
          row[j].box.selected = false;
          row[j].box.setFillStyle(0x283c5c);
        }
        box.selected = true;
        box.setFillStyle(0x3b8a5f);
        onSelect(key);
        if (groupName === 'character') {
          this.refreshContinueAvailability();
        }
        this.updateStartButtonState();
      });

      this.optionButtons[groupName].push({ key, box, text });
    }
  }

  canStart() {
    if (!(this.selectedCharacter && this.selectedMode && this.selectedTheme && this.selectedZombies && this.selectedRunMode)) {
      return false;
    }

    if (this.selectedRunMode === 'continue') {
      return this.hasSaveForCharacter(this.selectedCharacter);
    }

    return true;
  }

  updateStartButtonState() {
    if (this.canStart()) {
      this.startButton.setFillStyle(0xff9a3d);
      this.startText.setText(this.selectedRunMode === 'continue' ? 'Continue Game' : 'Start New Game');
      this.startText.setColor('#111111');
    } else {
      this.startButton.setFillStyle(0x4d596b);
      this.startText.setText('Select All Options');
      this.startText.setColor('#c6d0dd');
    }
  }

  getSaveKey(characterKey) {
    return `${SAVE_PREFIX}${characterKey}`;
  }

  hasSaveForCharacter(characterKey) {
    if (!characterKey) {
      return false;
    }
    try {
      return !!localStorage.getItem(this.getSaveKey(characterKey));
    } catch (_err) {
      return false;
    }
  }

  refreshContinueAvailability() {
    const hasSave = this.hasSaveForCharacter(this.selectedCharacter);
    const row = this.optionButtons.session || [];

    for (let i = 0; i < row.length; i += 1) {
      const entry = row[i];
      if (entry.key === 'continue') {
        entry.box.alpha = hasSave ? 1 : 0.45;
        if (!hasSave && entry.box.selected) {
          entry.box.selected = false;
          entry.box.setFillStyle(0x283c5c);
          this.selectedRunMode = null;
        }
      }
    }

    this.sessionHint.setText(hasSave ? 'Save found for selected character' : 'No save for selected character');
  }

  _startHeliHover() {
    this.tweens.add({
      targets: this.heli,
      x: { from: W * 0.4, to: W * 0.78 },
      duration: 3200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    this.tweens.add({
      targets: this.heli,
      y: { from: 80, to: 90 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    this.time.addEvent({
      delay: 900,
      loop: true,
      callback: () => {
        if (this.heli?.active) this._dropPizza(this.heli.x, this.heli.y + 40);
      },
    });
  }

  _dropPizza(ox, oy) {
    const x = ox !== undefined ? ox + Phaser.Math.Between(-30, 30)
                               : Phaser.Math.Between(80, W - 80);
    const y = oy !== undefined ? oy : 80;
    const slice = this.add.sprite(x, y, 'pizza').setDepth(8)
                     .setScale(Phaser.Math.FloatBetween(0.9, 1.8));
    this.tweens.add({
      targets: slice,
      y: H + 50,
      angle: Phaser.Math.Between(-400, 400),
      duration: Phaser.Math.Between(1400, 2400),
      ease: 'Linear',
      onComplete: () => slice.destroy(),
    });
  }

  _start() {
    this.scene.start('MainScene', {
      character: this.selectedCharacter,
      mode: this.selectedMode,
      theme: this.selectedTheme,
      zombies: this.selectedZombies === 'on',
      runMode: this.selectedRunMode,
    });
  }
}
