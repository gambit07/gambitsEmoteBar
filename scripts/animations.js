import { getTokenImage, applyEmoteSound, getTokenRotation, getEskieModules, resolveEskieFile, requireEskiePatreon, getTokenFacing, getTokenMirrorFacing, getTokenIsMirrored, applyCapturedMirrorToOffset } from './utils.js';
import { packageId } from "./constants.js";

export async function performLaugh(token) {
  let seq = new Sequence()

  applyEmoteSound(seq, "Laugh")

  const eskieFile = resolveEskieFile("eskie.emote.laugh.02.yellow", "eskie-free.emote.laugh.01.yellow");
  if (eskieFile) {
    seq.effect()
      .name(`emoteBarLaugh_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file(eskieFile)
      .attachTo(token, { offset: { x: (-0.4 * token.document.width * getTokenFacing(token)), y: -0.45 * token.document.width }, gridUnits: true, local: getTokenRotation(token) })
      .scaleToObject(0.8, { considerTokenScale: true })
      .mirrorX(true)
      .spriteRotation(getTokenIsMirrored(token) ? -20 : 20)
      .zIndex(2)
      .rotate(token.rotation)
      .private()
      .persist(true);

    seq.effect()
      .name(`emoteBarLaugh_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .copySprite(token)
      .scaleToObject(1, { considerTokenScale: true })
      .attachTo(token, { bindAlpha: false })
      .loopProperty("sprite", "position.y", { from: 0, to: -0.01, duration: 150, gridUnits: true, pingPong: true, ease: "easeOutQuad" })
      .loopProperty("sprite", "width", { from: 0, to: 0.015, duration: 150, gridUnits: true, pingPong: true, ease: "easeOutQuad" })
      .loopProperty("sprite", "height", { from: 0, to: 0.015, duration: 150, gridUnits: true, pingPong: true, ease: "easeOutQuad" })
      .rotate(token.rotation)
      .persist(true)
      .zIndex(1);

    seq.play();
    return;
  }

  seq.effect()
    .name(`emoteBarLaugh_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("modules/gambitsEmoteBar/assets/laugh_large.webp")
    .attachTo(token, {offset:{x:(-0.4*token.document.width*getTokenFacing(token)), y:-0.45*token.document.width}, gridUnits: true, local: getTokenRotation(token)})
    .loopProperty("sprite", "rotation", { from: 0, to: -15*getTokenFacing(token), duration: 250, ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
    .scaleToObject(0.34)
    .mirrorX(!getTokenIsMirrored(token))
    .zIndex(2)
    .rotate(token.rotation)
    .private()
    .persist(true)

  seq.effect()
    .name(`emoteBarLaugh_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("modules/gambitsEmoteBar/assets/laugh_small.webp")
    .attachTo(token, {offset:{x:(-0.55*token.document.width*getTokenFacing(token)), y:0*token.document.width}, gridUnits: true, local: getTokenRotation(token)})
    .loopProperty("sprite", "rotation", { from: 0, to: 20*getTokenFacing(token), duration: 250,ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
    .scaleToObject(0.34)
    .mirrorX(!getTokenIsMirrored(token))
    .zIndex(2)
    .rotate(token.rotation)
    .private()
    .persist(true)

  seq.effect()
    .name(`emoteBarLaugh_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .copySprite(token)
    .scaleToObject(1, {considerTokenScale: true})
    .attachTo(token)
    .loopProperty("sprite", "position.y", { from: 0, to: -0.01, duration: 150, gridUnits: true, pingPong: true, ease:"easeOutQuad" })
    .loopProperty("sprite", "width", { from: 0, to: 0.015, duration: 150, gridUnits: true, pingPong: true, ease:"easeOutQuad" })
    .loopProperty("sprite", "height", { from: 0, to: 0.015, duration: 150, gridUnits: true, pingPong: true, ease:"easeOutQuad"  })
    .rotate(token.rotation)
    .persist(true)
    .mirrorY(false)
    .zIndex(1)
    .waitUntilFinished(-200)

  seq.play()
}

export async function performAngry(token) {
  let seq = new Sequence()

  applyEmoteSound(seq, "Angry")

  const eskie = getEskieModules();
  const eskieFile = resolveEskieFile("eskie.emote.angry.02", "eskie-free.emote.angry.01");

  if (eskieFile) {
    seq.effect()
      .name(`emoteBarAngry_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file(eskieFile)
      .attachTo(token)
      .scaleIn(0, 250, { ease: "easeOutBack" })
      .scaleOut(0, 250, { ease: "easeOutCubic" })
      .spriteOffset({x:0.3*token.document.width, y:-0.3*token.document.width}, { gridUnits: true, local: getTokenRotation(token)})
      .scaleToObject(0.8, { considerTokenScale: true })
      .spriteRotation(eskie.hasPatreon ? 25 : 0)
      .rotate(token.rotation)
      .persist(true)
      .attachTo(token, { bindAlpha: false })
      .private()
      .waitUntilFinished();

    seq.play();
    return;
  }

  seq.effect()
    .name(`emoteBarAngry_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file(`modules/gambitsEmoteBar/assets/angry_wide.webp`)
    .attachTo(token)
    .scaleIn(0, 1000, {ease: "easeOutElastic"})
    .scaleOut(0, 1000, {ease: "easeOutExpo"})
    .spriteOffset({x:0.3*token.document.width, y:-0.3*token.document.width}, { gridUnits: true, local: getTokenRotation(token)})
    .scaleToObject(0.45)
    .rotate(token.rotation)
    .persist(true)
    .attachTo(token, {bindAlpha:false })
    .loopProperty("alphaFilter", "alpha", { values: [1,1,1, 1,1,1,1, 1, -1, -1, -1, -1, -1, -1, -1, -1], duration: 25, pingPong: false })
    .private()

  seq.effect()
    .name(`emoteBarAngry_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file(`modules/gambitsEmoteBar/assets/angry_narrow.webp`)
    .attachTo(token)
    .scaleIn(0, 1000, {ease: "easeOutElastic"})
    .scaleOut(0, 1000, {ease: "easeOutExpo"})
    .spriteOffset({x:0.3*token.document.width, y:-0.3*token.document.width}, { gridUnits: true, local: getTokenRotation(token)})
    .scaleToObject(0.45)
    .rotate(token.rotation)
    .persist(true)
    .attachTo(token, {bindAlpha: false})
    .loopProperty("alphaFilter", "alpha", { values: [-1, -1,-1,-1,-1, -1,-1,-1, 1, 1,1,1, 1, 1,1,1], duration: 25, pingPong: false })
    .waitUntilFinished()

  seq.play();
}

export async function performSurprised(token) {
  const { hasPatreon } = getEskieModules();
  const eskieFile = resolveEskieFile("eskie.emote.surprised.02", "eskie-free.emote.surprised.01");

  let seq = new Sequence()

  applyEmoteSound(seq, "Surprised")

  if (eskieFile) {
    seq.effect()
      .name(`emoteBarSurprised_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file(eskieFile)
      .attachTo(token, { offset: { x: 0.5 * token.document.width * getTokenFacing(token), y: -0.5 * token.document.width }, gridUnits: true, bindRotation: false, local: getTokenRotation(token) })
      .scaleToObject(0.7, { considerTokenScale: true })
      .scaleIn(0.25, 150, { ease: "easeOutBack" })
      .scaleOut(0, 250, { ease: "easeOutBack" })
      .persist(true)
      .rotate(token.rotation)
      .private()
      .addOverride(async (_effect, data) => {
        if (!hasPatreon) {
          data.scaleToObject = { scale: 1.5, considerTokenScale: true };
          data.offset.source = { x: 0 * token.document.width * getTokenFacing(token), y: -0.3 * token.document.width, gridUnits: true };
          data.animations = [{
            delay: 0,
            screenSpace: false,
            looping: true,
            indefinite: true,
            target: "sprite",
            propertyName: "position.y",
            duration: 100,
            pingPong: true,
            gridUnits: true,
            values: [-0.015, 0.015]
          }];
        }
        return data;
      });
  } else {
    seq.effect()
      .name(`emoteBarSurprised_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file("modules/gambitsEmoteBar/assets/surprised_exclamation.webp")
      .attachTo(token)
      .anchor({ x: 0.5, y: 1.55 })
      .scaleIn(0, 500, { ease: "easeOutElastic" })
      .scaleOut(0, 500, { ease: "easeOutExpo" })
      .loopProperty("sprite", "position.y", { from: 0, to: -15, duration: 750, pingPong: true })
      .rotate(token.rotation)
      .persist(true)
      .scaleToObject(0.6)
      .attachTo(token, { bindAlpha: false })
      .private();

    seq.effect()
      .name(`emoteBarSurprised_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file("modules/gambitsEmoteBar/assets/surprised.webp")
      .attachTo(token)
      .anchor({ x: -0.3, y: 1.25 })
      .scaleIn(0, 500, { ease: "easeOutElastic" })
      .scaleOut(0, 500, { ease: "easeOutExpo" })
      .loopProperty("sprite", "position.y", { from: 0, to: -15, duration: 750, pingPong: true })
      .rotate(token.rotation)
      .persist(true)
      .scaleToObject(0.45)
      .attachTo(token, { bindAlpha: false })
      .waitUntilFinished();
  }

  seq.play();
}

export async function performThankYou(token) {
  if (!requireEskiePatreon()) return;

  let seq = new Sequence();
  applyEmoteSound(seq, "ThankYou");

  seq.effect()
    .name(`emoteBarThankYou_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("eskie.emote.emote_bubble.thank_you")
    .attachTo(token, {
      offset: { x: -0.65 * token.document.width, y: -0.35 * token.document.width },
      bindAlpha: false,
      bindRotation: false,
      gridUnits: true,
      local: false,
    })
    .scaleToObject(1, { considerTokenScale: true })
    .mirrorX(!getTokenMirrorFacing(token))
    .zIndex(2)
    .private()
    .persist(true);

  seq.play();
}

export async function performWink(token) {
  if (!requireEskiePatreon()) return;

  let seq = new Sequence();
  applyEmoteSound(seq, "Wink");

  seq.effect()
    .name(`emoteBarWink_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("eskie.emote.emote_bubble.wink")
    .attachTo(token, {
      offset: { x: -0.65 * token.document.width * getTokenFacing(token), y: -0.35 * token.document.width },
      bindAlpha: false,
      bindRotation: false,
      gridUnits: true,
      local: false,
    })
    .scaleToObject(1, { considerTokenScale: true })
    .zIndex(2)
    .private()
    .persist(true);

  seq.play();
}

export async function performSmug(token) {
  if (!requireEskiePatreon()) return;

  let seq = new Sequence();
  applyEmoteSound(seq, "Smug");

  seq.effect()
    .name(`emoteBarSmug_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("eskie.emote.emote_bubble.smug")
    .attachTo(token, {
      offset: { x: -0.65 * token.document.width * getTokenFacing(token), y: -0.3 * token.document.width },
      bindAlpha: false,
      bindRotation: false,
      gridUnits: true,
      local: false,
    })
    .scaleToObject(1, { considerTokenScale: true })
    .zIndex(2)
    .private()
    .persist(true);

  seq.play();
}

export async function performHuh(token) {
  if (!requireEskiePatreon()) return;

  let seq = new Sequence();
  applyEmoteSound(seq, "Huh");

  seq.effect()
    .name(`emoteBarHuh_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("eskie.emote.emote_bubble.confused")
    .attachTo(token, {
      offset: { x: 0.65 * token.document.width * getTokenFacing(token), y: -0.3 * token.document.width },
      bindAlpha: false,
      bindRotation: false,
      gridUnits: true,
      local: false,
    })
    .scaleToObject(1, { considerTokenScale: true })
    .zIndex(2)
    .private()
    .persist(true);

  seq.play();
}

export async function performConfused(token) {
  if (!requireEskiePatreon()) return;

  let seq = new Sequence();
  applyEmoteSound(seq, "Confused");

  seq.effect()
    .name(`emoteBarConfused_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("eskie.emote.confused.01")
    .attachTo(token, {
      offset: { x: 0.45 * token.document.width * getTokenFacing(token), y: -0.5 * token.document.width },
      bindAlpha: false,
      bindRotation: false,
      gridUnits: true,
      local: false,
    })
    .scaleToObject(0.7, { considerTokenScale: true })
    .scaleIn(0, 500, { ease: "easeOutCubic" })
    .scaleOut(0, 50, { ease: "easeOutQuint" })
    .animateProperty("sprite", "position.y", { from: -0.2, to: 0, duration: 500, gridUnits: true, ease: "easeOutElastic" })
    .animateProperty("sprite", "position.x", { from: 0.2, to: 0, duration: 500, gridUnits: true, ease: "easeOutElastic" })
    .zIndex(2)
    .private()
    .persist(true);

  seq.play();
}

export async function performWhistle(token) {
  if (!requireEskiePatreon()) return;

  const offsets = token.document.getFlag(packageId, "offsets");
  const savedMouthOffset = offsets?.mouthOffset;
  const capturedMirrored = offsets?.capturedMirrored ?? false;

  const fallback = { x: 0.5 * token.document.width * getTokenFacing(token), y: -0.1 * token.document.width };
  const mouthOffset = savedMouthOffset
    ? {
        x: applyCapturedMirrorToOffset(token, savedMouthOffset, capturedMirrored).x + (getTokenIsMirrored(token) ? -0.3 : 0.3),
        y: savedMouthOffset.y
      }
    : fallback;

  let seq = new Sequence();
  applyEmoteSound(seq, "Whistle");

  seq.effect()
    .name(`emoteBarWhistle_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("eskie.emote.whistle")
    .attachTo(token, { offset: mouthOffset, gridUnits: true, local: getTokenRotation(token), bindAlpha: false })
    .scaleToObject(0.6, { considerTokenScale: true })
    .scaleIn(0, 500, { ease: "easeOutCubic" })
    .scaleOut(0, 50, { ease: "easeOutQuint" })
    .zIndex(2)
    .private()
    .persist(true);

  seq.play();
}

export async function performShout(token) {
  let seq = new Sequence()

  applyEmoteSound(seq, "Shout")

  const eskieFile = resolveEskieFile("eskie.emote.shout.01", "eskie-free.emote.shout.01");
  if (eskieFile) {
    seq.effect()
      .name(`emoteBarShout_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file(eskieFile)
      .attachTo(token, { offset: { x: (-0.45 * token.document.width) * getTokenFacing(token), y: -0.3 * token.document.width }, gridUnits: true, local: getTokenRotation(token) })
      .spriteRotation(-10 * getTokenFacing(token))
      .loopProperty("sprite", "rotation", { from: 0, to: 15 * getTokenFacing(token), duration: 250, ease: "easeOutCubic" })
      .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
      .loopProperty("sprite", "position.x", { from: 0, to: -0.025 * getTokenFacing(token), duration: 250, gridUnits: true, pingPong: false })
      .scaleIn(0, 250, { ease: "easeOutBack" })
      .scaleOut(0, 250, { ease: "easeOutCubic" })
      .scaleToObject(1.25, { considerTokenScale: true })
      .rotate(token.rotation)
      .persist(true)
      .mirrorX(true)
      .private();

    seq.play();
    return;
  }

  seq.effect()
    .name(`emoteBarShout_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("modules/gambitsEmoteBar/assets/shout_small.webp")
    .attachTo(token, {offset:{x:(-0.45*token.document.width)*getTokenFacing(token), y:(-0.4*token.document.width)}, gridUnits: true, local: getTokenRotation(token)})
    .spriteRotation(35*getTokenFacing(token))
    .loopProperty("sprite", "rotation", { from: 0, to: 15*getTokenFacing(token), duration: 250,ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
    .loopProperty("sprite", "position.x", { from: 0, to: -0.025*getTokenFacing(token), duration: 250, gridUnits: true, pingPong: false })
    .scaleIn(0, 1500, {ease: "easeOutElastic"})
    .scaleOut(0, 500, {ease: "easeOutExpo"})
    .scaleToObject(0.3)
    .private()
    .mirrorX(getTokenIsMirrored(token))
    .mirrorY()
    .rotate(token.rotation)
    .persist(true)

  seq.effect()
    .name(`emoteBarShout_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("modules/gambitsEmoteBar/assets/shout_large.webp")
    .attachTo(token, {offset:{x:(-0.6*token.document.width)*getTokenFacing(token), y:(-0.25*token.document.width)}, gridUnits: true, local: getTokenRotation(token)})
    .spriteRotation(-15*getTokenFacing(token))
    .loopProperty("sprite", "rotation", { from: 0, to: -10*getTokenFacing(token), duration: 250, ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
    .loopProperty("sprite", "position.x", { from: 0, to: -0.025*getTokenFacing(token), duration: 250, gridUnits: true, pingPong: false })
    .scaleIn(0, 1500, {ease: "easeOutElastic"})
    .scaleOut(0, 500, {ease: "easeOutExpo"})
    .scaleToObject(0.37)
    .private()
    .mirrorX(getTokenIsMirrored(token))
    .rotate(token.rotation)
    .persist(true)

  seq.effect()
    .name(`emoteBarShout_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("modules/gambitsEmoteBar/assets/shout_small.webp")
    .attachTo(token, {offset:{x:(-0.6*token.document.width)*getTokenFacing(token), y:(-0.05*token.document.width)}, gridUnits: true, local: getTokenRotation(token)})
    .loopProperty("sprite", "rotation", { from: 0, to: 15*getTokenFacing(token), duration: 250,ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
    .loopProperty("sprite", "position.x", { from: 0, to: -0.025*getTokenFacing(token), duration: 250, gridUnits: true, pingPong: false })
    .scaleIn(0, 1500, {ease: "easeOutElastic"})
    .scaleOut(0, 500, {ease: "easeOutExpo"})
    .scaleToObject(0.3)
    .mirrorX(getTokenIsMirrored(token))
    .persist(true)
    .rotate(token.rotation)
    .waitUntilFinished(-200)

  seq.play()
}

export async function performDrunk(token) {
  let offsets = token.document.getFlag(packageId, "offsets");
  let noseOffset = offsets?.noseOffset ?? { x: 0, y: 0 };
  const capturedMirrored = offsets?.capturedMirrored ?? false;
  noseOffset = applyCapturedMirrorToOffset(token, noseOffset, capturedMirrored);

  let seq = new Sequence()

  applyEmoteSound(seq, "Drunk")

  const fileBubbles = resolveEskieFile("eskie.emote.drunk_bubbles.01", "eskie-free.emote.drunk_bubbles.01");
  const fileBlush = resolveEskieFile("eskie.emote.blush.01.red", "eskie-free.emote.blush.01.red");

  if (fileBubbles && fileBlush) {
    seq.animation()
      .delay(100)
      .on(token)
      .opacity(0)

    seq.effect()
      .name(`emoteBarDrunk_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file(fileBubbles)
      .attachTo(token, {offset:{x:-0.2*token.document.width, y:-0.6*token.document.width}, gridUnits: true, bindAlpha:false, local: getTokenRotation(token)})
      .scaleToObject(0.75, {considerTokenScale: true})
      .persist(true)
      .rotate(token.rotation)
      .zIndex(1)
      .private()
      .belowTokens(false)

    seq.effect()
      .name(`emoteBarDrunk_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file(fileBlush)
      .attachTo(token, {offset: {x:noseOffset.x, y:noseOffset.y}, gridUnits: true, bindAlpha:false, local: getTokenRotation(token)})
      .scaleToObject(0.4, {considerTokenScale: true})
      .persist(true)
      .loopProperty("spriteContainer", "position.x", {  from:-0.1, to: 0.1, duration: 2500, pingPong: true, ease:"easeInOutSine", gridUnits:true, delay: 100 })
      .loopProperty("spriteContainer", "position.y", { values: [0, 0.05, 0, 0.05], duration: 2500, pingPong: true, gridUnits:true, delay: 100 })
      .loopProperty("spriteContainer", "rotation", { from: -10, to: 25, duration: 2500, pingPong: true, ease:"easeInOutSine", delay: 100 })
      .rotate(token.rotation)
      .zIndex(0)
      .private()

    seq.effect()
      .name(`emoteBarDrunk_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .copySprite(token)
      .attachTo(token, {bindAlpha:false, local: getTokenRotation(token)})
      .scaleToObject(1, {considerTokenScale:true})
      .persist(true)
      .loopProperty("spriteContainer", "position.x", {  from:-0.05, to: 0.05, duration: 2500, pingPong: true, ease:"easeInOutSine", gridUnits:true, delay: 100 })
      .loopProperty("spriteContainer", "position.y", { values: [0, 0.05, 0, 0.05], duration: 2500, pingPong: true, gridUnits:true, delay: 100 })
      .loopProperty("spriteContainer", "rotation", { from: -10, to: 25, duration: 2500, pingPong: true, ease:"easeInOutSine", delay: 100 })
      .rotate(token.rotation)
      .extraEndDuration(500)
      .waitUntilFinished()

    seq.animation()
      .on(token)
      .opacity(1)

    seq.play();
    return;
  }

  seq.animation()
    .on(token)
    .opacity(0)

  seq.effect()
    .file("modules/gambitsEmoteBar/assets/drunk_large.webp")
    .name(`emoteBarDrunk_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .delay(0,500)
    .attachTo(token, {offset:{x:-0.2*token.document.width, y:-0.6*token.document.width}, gridUnits: true, bindAlpha: false, local: getTokenRotation(token)})
    .duration(7000)
    .scaleToObject(0.05)
    .zeroSpriteRotation()
    .loopProperty("sprite", "position.x", {  from:0, to: -0.02, duration: 2000, pingPong: true, gridUnits: true, ease:"linear" })
    .loopProperty("sprite", "position.y", { from:0.15, to: -0.15, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutSine" })
    .loopProperty("sprite", "width", {  from:0, to: 0.1, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutCubic" })
    .loopProperty("sprite", "height", { from:0, to: 0.1, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutCubic" })
    .loopProperty("alphaFilter", "alpha", { values: [-1, 1, 1, 1, 1, -1], duration: 1000, pingPong: true, ease:"easeOutCubic" })
    .persist(true)
    .attachTo(token, {gridUnits: true, bindAlpha: false, local: getTokenRotation(token)})
    .rotate(token.rotation)
    .private()
    .belowTokens(false)

  seq.effect()
    .file("modules/gambitsEmoteBar/assets/drunk_small.webp")
    .name(`emoteBarDrunk_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .attachTo(token, {offset:{x:-0.35*token.document.width, y:-0.5*token.document.width}, gridUnits: true, bindAlpha: false, local: getTokenRotation(token)})
    .duration(7000)
    .delay(0, 600)
    .scaleToObject(0.05)
    .zeroSpriteRotation()
    .loopProperty("sprite", "position.x", {  from:0, to: 0.05, duration: 2000, pingPong: true, gridUnits: true, ease:"easeOutSine" })
    .loopProperty("sprite", "position.y", { from:0.15, to: -0.15, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutSine" })
    .loopProperty("sprite", "width", {  from:0, to: 0.1, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutCubic" })
    .loopProperty("sprite", "height", { from:0, to: 0.1, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutCubic" })
    .loopProperty("alphaFilter", "alpha", { values: [-1, 1, 1, 1, 1, -1], duration: 1000, pingPong: true, ease:"easeOutCubic" })
    .rotate(token.rotation)
    .persist(true)
    .attachTo(token, {gridUnits: true, bindAlpha: false, local: getTokenRotation(token)})
    .private()
    .belowTokens(false)

  seq.effect()
    .file("modules/gambitsEmoteBar/assets/drunk_medium.webp")
    .name(`emoteBarDrunk_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .attachTo(token, {offset:{x:-0.2*token.document.width, y:-0.5*token.document.width}, gridUnits: true, bindAlpha: false, local: getTokenRotation(token)})
    .duration(7000)
    .delay(750, 1000)
    .scaleToObject(0.05)
    .zeroSpriteRotation()
    .loopProperty("sprite", "position.x", {  from:0, to: 0.05, duration: 2000, pingPong: true, gridUnits: true, ease:"easeOutSine" })
    .loopProperty("sprite", "position.y", { from:0.15, to: -0.15, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutSine" })
    .loopProperty("sprite", "width", {  from:0, to: 0.1, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutCubic" })
    .loopProperty("sprite", "height", { from:0, to: 0.1, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutCubic" })
    .loopProperty("alphaFilter", "alpha", { values: [-1, 1, 1, 1, 1, -1], duration: 1000, pingPong: true, ease:"easeOutCubic" })
    .rotate(token.rotation)
    .persist(true)
    .attachTo(token, {gridUnits: true, bindAlpha: false, local: getTokenRotation(token)})
    .private()
    .belowTokens(false)

  seq.effect()
    .file("modules/gambitsEmoteBar/assets/drunk_tiny.webp")
    .name(`emoteBarDrunk_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .attachTo(token, {offset:{x:-0.1*token.document.width, y:-0.3*token.document.width}, gridUnits: true, bindAlpha: false, local: getTokenRotation(token)})
    .duration(7000)
    .delay(500,1200)
    .scaleToObject(0.05)
    .zeroSpriteRotation()
    .loopProperty("sprite", "position.x", {  from:0, to: -0.05, duration: 2000, pingPong: true, gridUnits: true, ease:"easeOutSine" })
    .loopProperty("sprite", "position.y", { from:0.15, to: -0.15, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutSine" })
    .loopProperty("sprite", "width", {  from:0, to: 0.1, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutCubic" })
    .loopProperty("sprite", "height", { from:0, to: 0.1, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutCubic" })
    .loopProperty("alphaFilter", "alpha", { values: [-1, 1, 1, 1, 1, -1], duration: 1000, pingPong: true, ease:"easeOutCubic" })
    .rotate(token.rotation)
    .persist(true)
    .attachTo(token, {gridUnits: true, bindAlpha: false, local: getTokenRotation(token)})
    .private()
    .belowTokens(false)

  seq.effect()
    .file("modules/gambitsEmoteBar/assets/drunk_blush.webp")
    .name(`emoteBarDrunk_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .opacity(0.85)
    .scaleToObject(0.2, {considerTokenScale: true})
    .loopProperty("spriteContainer", "position.x", {  from:-20, to: 20, duration: 2500, pingPong: true, ease:"easeInOutSine" })
    .loopProperty("sprite", "position.y", { values: [0, 25, 0, 25], duration: 2500, pingPong: true })
    .loopProperty("sprite", "rotation", { from: -10, to: 10, duration: 2500, pingPong: true,ease:"easeInOutSine" })
    .rotate(token.rotation)
    .persist(true)
    .attachTo(token, {offset: {x:noseOffset.x-0.0, y:noseOffset.y+0.0}, gridUnits: true, bindAlpha: false, local: getTokenRotation(token)})
    .zIndex(0)
    .private()

  seq.effect()
    .file(getTokenImage(token))
    .name(`emoteBarDrunk_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .attachTo(token, {gridUnits: true, bindAlpha: false, local: getTokenRotation(token)})
    .scaleToObject(1, {considerTokenScale: true})
    .loopProperty("spriteContainer", "position.x", {  from:-20, to: 20, duration: 2500, pingPong: true, ease:"easeInOutSine" })
    .loopProperty("sprite", "position.y", { values: [0, 20, 0, 20], duration: 2500, pingPong: true })
    .loopProperty("sprite", "rotation", { from: -10, to: 10, duration: 2500, pingPong: true,ease:"easeInOutSine" })
    .rotate(token.rotation)
    .persist(true)
    .attachTo(token, {gridUnits: true, bindAlpha: false, local: getTokenRotation(token)})
    .waitUntilFinished()

  seq.animation()
    .on(token)
    .opacity(1)

  seq.play();
}

export async function performSoul(token) {
  const eskieFile = resolveEskieFile("eskie.emote.soul_sucked.01", "eskie-free.emote.soul_sucked.01");

  let seq = new Sequence()

  applyEmoteSound(seq, "Soul")

  if (eskieFile) {
    seq.effect()
      .name(`emoteBarSoul_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file(eskieFile)
      .attachTo(token, { offset: { x: -0.5 * getTokenFacing(token) * token.document.width, y: -0.3 * token.document.width }, gridUnits: true, local: getTokenRotation(token) })
      .scaleToObject(1, { considerTokenScale: true })
      .scaleIn(0, 250, { ease: "easeOutBack" })
      .scaleOut(0, 250, { ease: "easeOutCubic" })
      .rotate(token.rotation)
      .persist(true)
      .attachTo(token, { bindAlpha: false })
      .loopProperty("sprite", "position.y", { from: -0.05, to: 0.05, duration: 3000, gridUnits: true, pingPong: true })
      .waitUntilFinished();
  } else {
    seq.effect()
      .name(`emoteBarSoul_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file("modules/gambitsEmoteBar/assets/soul.webp")
      .attachTo(token)
      .scaleIn(0, 1000, { ease: "easeOutElastic" })
      .scaleOut(0, 1000, { ease: "easeOutExpo" })
      .spriteOffset({ x: (-0.45 * token.document.width) * getTokenFacing(token), y: -0.25 }, { gridUnits: true, local: getTokenRotation(token) })
      .scaleToObject(0.45)
      .rotate(token.rotation)
      .persist(true)
      .attachTo(token, { bindAlpha: false })
      .mirrorX(!getTokenMirrorFacing(token))
      .loopProperty("sprite", "position.y", { from: -0.05, to: 0.05, duration: 3000, gridUnits: true, pingPong: true })
      .waitUntilFinished();
  }

  seq.play();
}

export async function performSlap(token) {
  let location = token.center;
  const hasAnimatedSpellEffects = game.modules.get("animated-spell-effects")?.active;

  let seq = new Sequence();

  applyEmoteSound(seq, "Slap")

  if (hasAnimatedSpellEffects) {
    seq.effect()
      .name(`emoteBarSlap_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .attachTo(location, { offset: { x: 0.1, y: -0.1 }, gridUnits: true })
      .file("animated-spell-effects-cartoon.magic.impact.02")
      .scaleToObject(token.document.width, {considerTokenScale: true})
  }

  seq.effect()
    .name(`emoteBarSlap_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .attachTo(location)
    .file("modules/gambitsEmoteBar/assets/slap.webp")
    .size(0.55, { gridUnits: true })
    .rotate(token.rotation-45)
    .fadeOut(250)
    .duration(1000)
    .delay(50)
    .zIndex(1)
    .scaleToObject(token.document.width / 2, {considerTokenScale: true})

  seq.effect()
    .name(`emoteBarSlap_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .attachTo(location)
    .file("modules/gambitsEmoteBar/assets/slap.webp")
    .size(0.55, { gridUnits: true })
    .filter("ColorMatrix", { brightness: -1 })
    .opacity(0.5)
    .duration(6000)
    .fadeOut(1000)
    .rotate(token.rotation-45)
    .delay(50)
    .zIndex(0)
    .scaleToObject(token.document.width / 2, {considerTokenScale: true})

  seq.play();
}

export async function performCry(token) {
  const offsets = token.document.getFlag(packageId, "offsets") ?? {};
  const leftEyeOffset = offsets.leftEyeOffset ?? { x: 0, y: 0 };
  const rightEyeOffset = offsets.rightEyeOffset ?? { x: 0, y: 0 };
  const leftEyeScale = offsets.leftEyeScale ?? 0.25;
  const rightEyeScale = offsets.rightEyeScale ?? 0.25;
  const capturedMirrored = offsets.capturedMirrored ?? false;

  const adjustedLeftEyeOffset = applyCapturedMirrorToOffset(token, leftEyeOffset, capturedMirrored);
  const adjustedRightEyeOffset = applyCapturedMirrorToOffset(token, rightEyeOffset, capturedMirrored);

  let seq = new Sequence()

  applyEmoteSound(seq, "Cry")

  const eskieFile = resolveEskieFile("eskie.emote.cry.01", "eskie-free.emote.cry.01");

  if (eskieFile) {
    seq.effect()
      .name(`emoteBarCry_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file(eskieFile)
      .attachTo(token, { offset: { x: adjustedLeftEyeOffset.x, y: adjustedLeftEyeOffset.y + 0.02 }, gridUnits: true, bindAlpha: false, local: getTokenRotation(token) })
      .fadeIn(500)
      .fadeOut(500)
      .scaleToObject(leftEyeScale, {considerTokenScale: true})
      .mirrorX(!getTokenIsMirrored(token))
      .loopProperty("sprite", "position.y", { from: 0, to: -0.0025, duration: 200, gridUnits: true, pingPong: true })
      .rotate(token.rotation)
      .persist(true)
      .private()
      .belowTokens(false)

    seq.effect()
      .name(`emoteBarCry_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file(eskieFile)
      .attachTo(token, { offset: { x: adjustedRightEyeOffset.x, y: adjustedRightEyeOffset.y + 0.02 }, gridUnits: true, bindAlpha: false, local: getTokenRotation(token) })
      .fadeIn(500)
      .fadeOut(500)
      .scaleToObject(rightEyeScale, {considerTokenScale: true})
      .mirrorX(getTokenIsMirrored(token))
      .loopProperty("sprite", "position.y", { from: 0, to: -0.0025, duration: 200, gridUnits: true, pingPong: true })
      .waitUntilFinished()
      .belowTokens(false)
      .rotate(token.rotation)
      .persist(true)

    seq.play();
    return;
  }

    seq.effect()
      .name(`emoteBarCry_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file("modules/gambitsEmoteBar/assets/cry_lefteye.webp")
      .attachTo(token, { offset: { x: adjustedLeftEyeOffset.x, y: adjustedLeftEyeOffset.y + 0.02 }, gridUnits: true, bindAlpha: false, local: getTokenRotation(token) })
      .fadeIn(500)
      .fadeOut(500)
      .scaleToObject(leftEyeScale)
      .mirrorX(!getTokenIsMirrored(token))
      .loopProperty("sprite", "position.y", { from: 0, to: -0.0025, duration: 200, gridUnits: true, pingPong: true })
      .rotate(token.rotation)
      .persist(true)
      .private()
      .belowTokens(false)

    seq.effect()
      .name(`emoteBarCry_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file("modules/gambitsEmoteBar/assets/cry_righteye.webp")
      .attachTo(token, { offset: { x: adjustedRightEyeOffset.x, y: adjustedRightEyeOffset.y + 0.02 }, gridUnits: true, bindAlpha: false, local: getTokenRotation(token) })
      .fadeIn(500)
      .fadeOut(500)
      .scaleToObject(rightEyeScale)
      .mirrorX(getTokenIsMirrored(token))
      .loopProperty("sprite", "position.y", { from: 0, to: -0.0025, duration: 200, gridUnits: true, pingPong: true })
      .waitUntilFinished()
      .belowTokens(false)
      .rotate(token.rotation)
      .persist(true)

    seq.play();
}

export async function performDisgusted(token) {
  let seq = new Sequence()

  applyEmoteSound(seq, "Disgusted")

  const eskie = getEskieModules();
  const eskieFile = resolveEskieFile("eskie.emote.disgusted.02", "eskie-free.emote.disgusted.01");

  if (eskieFile) {
    seq.effect()
      .name(`emoteBarDisgusted_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file(eskieFile)
      .attachTo(token, {gridUnits: true, bindAlpha: false, local: getTokenRotation(token)})
      .scaleToObject(1, {considerTokenScale: true})
      .rotate(token.rotation)
      .persist(true)
      .addOverride(async (effect, data) => {
        if (!eskie.hasPatreon) data.masks = [data.source];
        return data;
      })
      .waitUntilFinished()

    seq.play();
    return;
  }

  seq.effect()
    .name(`emoteBarDisgusted_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("modules/gambitsEmoteBar/assets/disgusted.webp")
    .attachTo(token, {gridUnits: true, bindAlpha: false, local: getTokenRotation(token)})
    .scaleToObject(1, {considerTokenScale: true})
    .rotate(token.rotation)
    .persist(true)
    .attachTo(token, {offset:{y:-1}, gridUnits: true, bindAlpha: false, local: getTokenRotation(token)})
    .animateProperty("sprite", "position.y", { from: 0, to: 1, duration: 500, gridUnits:true, fromEnd: false })
    .animateProperty("sprite", "position.y", { from: 0, to: -0.8, duration: 500, gridUnits:true, fromEnd: true })
    .mask()
    .opacity(0.9)
    .waitUntilFinished()

  seq.play();
}

export async function performGiggle(token) {
  let seq = new Sequence()

  applyEmoteSound(seq, "Giggle")

  const eskieFile = resolveEskieFile("eskie.emote.laugh.02.blue", "eskie-free.emote.laugh.01.blue");

  if (eskieFile) {
    seq.effect()
      .name(`emoteBarGiggle_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file(eskieFile)
      .attachTo(token, {offset:{x:(-0.5*token.document.width), y:-0.25*token.document.width}, gridUnits: true, local: getTokenRotation(token)})
      .scaleToObject(0.5, {considerTokenScale: true})
      .mirrorX(getTokenMirrorFacing(token))
      .zIndex(2)
      .rotate(token.rotation)
      .persist(true)
      .playbackRate(1.3)
      .private()

    seq.effect()
      .name(`emoteBarGiggle_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .copySprite(token)
      .scaleToObject(1, {considerTokenScale: true})
      .atLocation(token)
      .attachTo(token, {bindAlpha: false})
      .loopProperty("sprite", "position.y", { from: 0, to: -0.01, duration: 100, gridUnits: true, pingPong: true, ease:"easeOutQuad" })
      .loopProperty("sprite", "width", { from: 0, to: 0.01, duration: 100, gridUnits: true, pingPong: true, ease:"easeOutQuad" })
      .loopProperty("sprite", "height", { from: 0, to: 0.01, duration: 100, gridUnits: true, pingPong: true, ease:"easeOutQuad"  })
      .rotate(token.rotation)
      .persist(true)
      .waitUntilFinished(-200)
      .zIndex(1)

    seq.play();
    return;
  }

  seq.effect()
    .name(`emoteBarGiggle_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("modules/gambitsEmoteBar/assets/giggle_top.webp")
    .attachTo(token, {offset:{x:(-0.5*token.document.width)*getTokenFacing(token), y:-0.25*token.document.width}, gridUnits: true, local: getTokenRotation(token)})
    .loopProperty("sprite", "rotation", { from: 0, to: -15*getTokenFacing(token), duration: 150, ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 150, gridUnits: true, pingPong: false })
    .scaleToObject(0.2, {considerTokenScale: true})
    .private()
    .mirrorX(true)
    .rotate(token.rotation)
    .persist(true)
    .zIndex(2)

  seq.effect()
    .name(`emoteBarGiggle_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("modules/gambitsEmoteBar/assets/giggle_bottom.webp")
    .attachTo(token, {offset:{x:(-0.55*token.document.width)*getTokenFacing(token), y:-0}, gridUnits: true, local: getTokenRotation(token)})
    .loopProperty("sprite", "rotation", { from: 0, to: 20*getTokenFacing(token), duration: 150,ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 150, gridUnits: true, pingPong: false })
    .scaleToObject(0.2, {considerTokenScale: true})
    .private()
    .mirrorX(true)
    .rotate(token.rotation)
    .persist(true)
    .zIndex(2)

  seq.effect()
    .name(`emoteBarGiggle_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file(getTokenImage(token))
    .scaleToObject(1, {considerTokenScale: true})
    .atLocation(token)
    .attachTo(token, {bindAlpha: false})
    .loopProperty("sprite", "position.y", { from: 0, to: -0.01, duration: 100, gridUnits: true, pingPong: true, ease:"easeOutQuad" })
    .loopProperty("sprite", "width", { from: 0, to: 0.01, duration: 100, gridUnits: true, pingPong: true, ease:"easeOutQuad" })
    .loopProperty("sprite", "height", { from: 0, to: 0.01, duration: 100, gridUnits: true, pingPong: true, ease:"easeOutQuad"  })
    .rotate(token.rotation)
    .persist(true)
    .waitUntilFinished(-200)
    .zIndex(1)

  seq.play()
}

export async function performLove(token) {
  const userId = game.gambitsEmoteBar?.dialogUser ?? game.user.id;
  const flagPath = `loopActive.Love.${userId}`;
  game.gambitsEmoteBar.loveActive.set(token.id, true);
  if (token?.document) await token.document.setFlag(packageId, flagPath, true);

  let seq = new Sequence()

  applyEmoteSound(seq, "Love")

  const eskieFile = resolveEskieFile("eskie.emote.love.01", "eskie-free.emote.love.01");
  const loveFile = eskieFile ?? "modules/gambitsEmoteBar/assets/love.webp";

  while (game.gambitsEmoteBar.loveActive.get(token.id) && token?.document?.getFlag?.(packageId, flagPath)) {
    await new Sequence()
      .effect()
        .name(`emoteBarLove_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
        .file(loveFile)
        .atLocation(token, { offset: { x: Math.random() * (0.4 - (-0.4)) + (-0.4) }, gridUnits: true })
        .spriteOffset({ y: -0.15 * token.document.width }, { gridUnits: true })
        .scaleIn(0, 1000, { ease: "easeOutElastic" })
        .fadeOut(400, { ease: "linear" })
        .scaleToObject(eskieFile ? 0.75 : 0.25, { considerTokenScale: true })
        .duration(1000)
        .attachTo(token, { bindAlpha: false })
        .rotate(token.rotation)
        .animateProperty("sprite", "position.y", { from: 0, to: -0.75, duration: 1000, gridUnits: true })
        .loopProperty("sprite", "position.x", { from: -0.025, to: 0.025, duration: 500, gridUnits: true, pingPong: true })
        .wait(450)

      .play();
  }

  game.gambitsEmoteBar.loveActive.delete(token.id);
  if (token?.document) await token.document.setFlag(packageId, flagPath, false);
}

export async function performROFL(token) {
  let seq = new Sequence()

  applyEmoteSound(seq, "Rofl")

  const eskieFile = resolveEskieFile("eskie.emote.laugh.02.pink", "eskie-free.emote.laugh.01.pink");
  if (eskieFile) {
    seq.animation()
      .delay(100)
      .on(token)
      .opacity(0);

    seq.effect()
      .name(`emoteBarRofl_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file(eskieFile)
      .attachTo(token, {
        offset: { x: (-0.45 * token.document.width) * getTokenFacing(token), y: 0.4 * token.document.width },
        bindAlpha: false,
        bindRotation: false,
        gridUnits: true,
        local: false,
      })
      .scaleToObject(0.8, { considerTokenScale: true })
      .mirrorY(true)
      .mirrorX(true)
      .spriteRotation(getTokenIsMirrored(token) ? 10 : -10)
      .belowTokens(false)
      .zIndex(2)
      .persist(true)
      .private();

    seq.effect()
      .name(`emoteBarRofl_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file(getTokenImage(token))
      .scaleToObject(1, { considerTokenScale: true })
      .attachTo(token, { bindAlpha: false })
      .loopProperty("sprite", "position.y", { from: 0, to: 0.01, duration: 150, gridUnits: true, pingPong: true, ease: "easeOutQuad" })
      .loopProperty("sprite", "rotation", { from: -33, to: 33, duration: 300, ease: "easeOutCubic", pingPong: true })
      .rotate(90)
      .persist(true)
      .waitUntilFinished(-200)
      .zIndex(5);

    seq.animation()
      .on(token)
      .opacity(1);

    seq.play();
    return;
  }

  seq.animation()
    .on(token)
    .opacity(0)

  seq.effect()
    .name(`emoteBarRofl_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("modules/gambitsEmoteBar/assets/rofl_top.webp")
    .attachTo(token, {offset:{x:-0.45*token.document.width, y:0.4*token.document.width}, bindAlpha: false, gridUnits: true, local: getTokenRotation(token)})
    .loopProperty("sprite", "rotation", { from: 0, to: -15, duration: 250, ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
    .scaleToObject(0.34, {considerTokenScale: true})
    .private()
    .mirrorX(getTokenIsMirrored(token))
    .rotate(token.rotation)
    .persist(true)
    .zIndex(2)

  seq.effect()
    .name(`emoteBarRofl_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("modules/gambitsEmoteBar/assets/rofl_bottom.webp")
    .attachTo(token, {offset:{x:-0.5*token.document.width, y:0.55*token.document.width}, bindAlpha: false, gridUnits: true, local: getTokenRotation(token)})
    .loopProperty("sprite", "rotation", { from: 90, to: 105, duration: 250,ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
    .scaleToObject(0.34, {considerTokenScale: true})
    .private()
    .mirrorX(getTokenIsMirrored(token))
    .rotate(token.rotation)
    .persist(true)
    .zIndex(2)

  seq.effect()
    .name(`emoteBarRofl_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file(getTokenImage(token))
    .scaleToObject(1, {considerTokenScale: true})
    .attachTo(token, {bindAlpha: false})
    .loopProperty("sprite", "position.y", { from: 0, to: 0.01, duration: 150, gridUnits: true, pingPong: true, ease:"easeOutQuad" })
    .loopProperty("sprite", "rotation", { from: -33, to: 33, duration: 300, ease: "easeOutCubic", pingPong: true })
    .rotate(90)
    .persist(true)
    .waitUntilFinished(-200)
    .zIndex(5)
    .belowTokens(false)

  seq.animation()
    .on(token)
    .opacity(1)

  seq.play()
}

export async function performSmoking(token) {
  let offsets = token.document.getFlag(packageId, "offsets");
  let mouthOffset = offsets?.mouthOffset ?? { x: 0, y: 0 };
  const capturedMirrored = offsets?.capturedMirrored ?? false;

  const hasAnimatedSpellEffects = game.modules.get("animated-spell-effects")?.active;
  const adjustedMouthOffset = applyCapturedMirrorToOffset(token, mouthOffset, capturedMirrored);

  const eskieFile = resolveEskieFile("eskie.emote.cigarette.01", "eskie-free.emote.cigarette.01");

  let seq = new Sequence();

  applyEmoteSound(seq, "Smoking")

  if (eskieFile) {
    const finalMouthOffset = { x: adjustedMouthOffset.x + (0.1 * getTokenFacing(token)), y: adjustedMouthOffset.y + 0.035 };

    seq.effect()
      .file(eskieFile)
      .name(`emoteBarSmoking_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .attachTo(token, { offset: finalMouthOffset, gridUnits: true, bindAlpha: false, local: getTokenRotation(token) })
      .mirrorX(false)
      .scaleToObject(0.5, { considerTokenScale: true })
      .rotate(token.rotation)
      .persist(true)
      .spriteRotation(getTokenIsMirrored(token) ? -5 : 5)
      .zIndex(0.15)
      .waitUntilFinished();
  } else {
    if (hasAnimatedSpellEffects) {
      seq.effect()
        .file("animated-spell-effects-cartoon.smoke.97")
        .name(`emoteBarSmoking_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
        .attachTo(token, { offset: { x: adjustedMouthOffset.x - (0.17 * getTokenFacing(token)), y: adjustedMouthOffset.y + 0.01 }, gridUnits: true, bindAlpha: false, local: getTokenRotation(token) })
        .mirrorX(getTokenMirrorFacing(token))
        .scale(0.02)
        .filter("ColorMatrix", { brightness: 0.75 })
        .rotate(token.rotation)
        .persist(true)
        .zIndex(0.15);
    }
    seq.effect()
      .file("modules/gambitsEmoteBar/assets/smoking.webp")
      .name(`emoteBarSmoking_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .attachTo(token, { offset: { x: adjustedMouthOffset.x - (0.1 * getTokenFacing(token)), y: adjustedMouthOffset.y + 0.05 }, gridUnits: true, bindAlpha: false, local: getTokenRotation(token) })
      .mirrorX(getTokenMirrorFacing(token))
      .scale(0.15)
      .rotate(token.rotation)
      .persist(true)
      .waitUntilFinished();
  }

  seq.play();
}

export async function performNervous(token) {
  const isMirrored = token.document.texture.scaleX < 0;

  let seq = new Sequence()

  applyEmoteSound(seq, "Nervous")

  const eskie = getEskieModules();
  const eskieFile = resolveEskieFile("eskie.emote.nervous.02", "eskie-free.emote.nervous.01");
  if (eskieFile) {
    const isMirrored = token.document.texture.scaleX < 0;
    const facing = isMirrored ? -1 : 1;

    seq.effect()
      .name(`emoteBarNervous_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file(eskieFile)
      .attachTo(token, { offset: { x: 0.4 * token.document.width * facing, y: -0.5 * token.document.width }, gridUnits: true, local: getTokenRotation(token) })
      .scaleToObject(0.8, { considerTokenScale: true })
      .persist(true)
      .rotate(token.rotation)
      .private()
      .addOverride(async (effect, data) => {
        if (!eskie.hasPatreon) {
          data.scaleToObject = { scale: 2, considerTokenScale: true };
          data.offset.source = { x: 0, y: -0.15 * token.document.width, gridUnits: true };
        }
        return data;
      });

    seq.play();
    return;
  }

    seq.effect()
      .name(`emoteBarNervous_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file("modules/gambitsEmoteBar/assets/nervous_left.webp")
      .scaleToObject(0.5, { considerTokenScale: true })
      .mirrorX(isMirrored)
      .scaleIn(0, 1000, { ease: "easeOutElastic" })
      .attachTo(token, { offset: { x: -0.35 * token.document.width, y: ((0.9 - Math.abs(token.document.texture.scaleX)) / 2) - 0.35 }, gridUnits: true, align: "center", edge: "inner", local: getTokenRotation(token) })
      .loopProperty("sprite", "scale.x", { from: 0.5, to: 1, duration: 200, ease: "easeOutQuint" })
      .loopProperty("sprite", "position.x", { from: 0, to: -0.1, gridUnits: true, duration: 200, ease: "easeOutCirc" })
      .loopProperty("sprite", "scale.y", { from: 0.5, to: 1, duration: 200, ease: "easeOutQuint" })
      .loopProperty("sprite", "rotation", { from: 0, to: 15, duration: 1000 })
      .rotate(token.rotation)
      .persist(true)
      .belowTokens(false)
      .zIndex(2)

    seq.effect()
      .name(`emoteBarNervous_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file("modules/gambitsEmoteBar/assets/nervous_right.webp")
      .scaleToObject(0.5, { considerTokenScale: true })
      .scaleIn(0, 1000, { ease: "easeOutElastic" })
      .attachTo(token, { offset: { x: 0.3 * token.document.width, y: ((0.9 - Math.abs(token.document.texture.scaleX)) / 2) - 0.35 }, gridUnits: true, align: "center", edge: "inner", local: getTokenRotation(token) })
      .mirrorX(!isMirrored)
      .loopProperty("sprite", "scale.x", { from: 0.5, to: 1, duration: 200, ease: "easeOutQuint" })
      .loopProperty("sprite", "position.x", { from: 0, to: 0.1, gridUnits: true, duration: 200, ease: "easeOutCirc" })
      .loopProperty("sprite", "scale.y", { from: 0.5, to: 1, duration: 200, ease: "easeOutQuint" })
      .loopProperty("sprite", "rotation", { from: 0, to: -15, duration: 1000 })
      .rotate(token.rotation)
      .persist(true)
      .belowTokens(false)
      .zIndex(2)

    seq.effect()
      .name(`emoteBarNervous_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file(getTokenImage(token))
      .attachTo(token)
      .scaleToObject(1, { considerTokenScale: true })
      .animateProperty("sprite", "position.x", { from: 0, to: 1, duration: 50, ease: "linear", pingPong: true })
      .loopProperty("sprite", "position.x", { from: 0, to: -0.005, duration: 50, gridUnits: true, pingPong: true, ease:"easeOutQuad" })
      .persist(true)
      .rotate(token.rotation)
      .zIndex(1)

    seq.effect()
      .name(`emoteBarNervous_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file(getTokenImage(token))
      .attachTo(token)
      .scaleToObject(1, { considerTokenScale: true })
      .animateProperty("sprite", "position.x", { from: 0, to: 1, duration: 50, ease: "linear", pingPong: true })
      .loopProperty("sprite", "position.x", { from: 0, to: -0.005, duration: 50, gridUnits: true, pingPong: true, ease:"easeOutQuad" })
      .persist(true)
      .rotate(token.rotation)
      .zIndex(1)

    seq.play();
}

export async function performParty(token) {
  const keyframes = 24;
  const radius = 20;
  const valuesX = [];
  const valuesY = [];

  for (let i = 0; i <= keyframes; i++) {
    let angle = (2 * Math.PI * i) / keyframes;
    valuesX.push(radius * Math.cos(angle));
    valuesY.push(radius * Math.sin(angle));
  }

  const hues = [];
  for (let h = 0; h <= 360; h += 10) {
    hues.push(h);
  }

  const fullHueCycle = hues.concat(hues.slice(1, hues.length - 1).reverse());

  let seq = new Sequence();

  applyEmoteSound(seq, "Party")

  seq.animation()
    .on(token)
    .opacity(0);

  seq.effect()
    .name(`emoteBarParty_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file(getTokenImage(token))
    .attachTo(token, { gridUnits: true, bindAlpha: false, local: getTokenRotation(token) })
    .scaleToObject(1, { considerTokenScale: true })
    .filter("ColorMatrix", { hue: 0 }, `emoteBarParty_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .loopProperty("effect", `effectFilters.emoteBarParty_${token.id}_${game.gambitsEmoteBar.dialogUser}.hue`, { values: fullHueCycle, duration: 80 })
    .loopProperty("spriteContainer", "position.x", { values: valuesX, duration: 40, ease: "linear" })
    .loopProperty("spriteContainer", "position.y", { values: valuesY, duration: 40, ease: "linear" })
    .rotate(token.rotation)
    .persist(true)
    .waitUntilFinished()

  seq.animation()
    .on(token)
    .opacity(1);

  seq.play();
}

export async function performThunderHype(token) {
  const hasJB2APatreon = game.modules.get("jb2a-patreon")?.active === true || game.modules.get("jb2a_patreon")?.active === true;
  if (!hasJB2APatreon) {
    ui.notifications.warn("JB2A Patreon (jb2a-patreon) is not active.");
    return;
  }

  let seq = new Sequence()

  applyEmoteSound(seq, "ThunderHype")

  seq.effect()
    .name(`emoteBarThunderHype_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("modules/gambitsEmoteBar/assets/thunder_sword.webp")
    .attachTo(token, {offset:{x:0, y:-0.60*token.document.width}, gridUnits: true, local: getTokenRotation(token)})
    .scaleToObject(0.7)
    .rotate(token.rotation)
    .fadeIn(500)
    .fadeOut(500)
    .private()
    .zIndex(2)
    .duration(8500)

  seq.effect()
    .name(`emoteBarThunderHype_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("jb2a.markers.bubble.loop.rainbow")
    .attachTo(token)
    .scaleToObject(1.1, {considerTokenScale: true})
    .rotate(token.rotation)
    .fadeIn(500)
    .mask(token)
    .fadeOut(500)
    .filter("ColorMatrix", { saturate: 2 })
    .private()
    .zIndex(1)
    .duration(8500)

  seq.effect()
    .name(`emoteBarThunderHype_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .attachTo(token, {offset:{ x:0, y:-1.35*token.document.width}, gridUnits: true })
    .file("jb2a.electric_arc.blue02.04")
    .scaleToObject(2, {gridUnits: true})
    .rotate(270)
    .filter("ColorMatrix", { hue: 160 })
    .fadeIn(500)
    .fadeOut(500)
    .zIndex(3)
    .wait(4000)

  seq.effect()
    .name(`emoteBarThunderHype_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .attachTo(token, {offset:{ x:0, y: -0.55*token.document.width}, gridUnits: true })
    .file("jb2a.static_electricity.02.red")
    .scaleToObject(1, {considerTokenScale: true, gridUnits: true})
    .rotate(270)
    .filter("ColorMatrix", { saturate: 0.8 })
    .zIndex(3)
    .waitUntilFinished(-200)

  seq.effect()
    .name(`emoteBarThunderHype_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .attachTo(token, {offset:{ x:0, y: 0}, gridUnits: true })
    .file("jb2a.explosion.02.orange")
    .scaleToObject(2, {considerTokenScale: true, gridUnits: true})
    .rotate(270)
    .filter("ColorMatrix", { hue: -30 })
    .zIndex(3)
    .waitUntilFinished()

  seq.play()
}

export async function performBloodied(token) {
  let seq = new Sequence()

  applyEmoteSound(seq, "Bloodied")

  seq.animation()
    .on(token)
    .opacity(0)

  seq.effect()
    .name(`emoteBarBloodied_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("modules/gambitsEmoteBar/assets/bloodied.webp")
    .attachTo(token, {gridUnits: true, bindAlpha: false, local: getTokenRotation(token)})
    .scaleToObject(1, {considerTokenScale: true})
    .rotate(token.rotation)
    .persist(true)
    .belowTokens(false)
    .zIndex(2)
    .loopProperty("sprite", "position.y", { from: 0, to: -0.03, duration: 1200, gridUnits: true, pingPong: true, ease:"easeOutQuad" })
    .opacity(1)

  seq.effect()
    .name(`emoteBarBloodied_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file(getTokenImage(token))
    .scaleToObject(1, {considerTokenScale: true})
    .attachTo(token, {gridUnits: true, bindAlpha: false, local: getTokenRotation(token)})
    .loopProperty("sprite", "position.y", { from: 0, to: -0.03, duration: 1200, gridUnits: true, pingPong: true, ease:"easeOutQuad" })
    .rotate(token.rotation)
    .persist(true)
    .mirrorY(false)
    .waitUntilFinished()

  seq.animation()
    .on(token)
    .opacity(1)

  seq.play();
}

export async function performSuspicious(token) {
  const userId = game.gambitsEmoteBar?.dialogUser ?? game.user.id;
  const flagPath = `loopActive.Suspicious.${userId}`;
  game.gambitsEmoteBar.suspiciousActive.set(token.id, true);
  if (token?.document) await token.document.setFlag(packageId, flagPath, true);

  let seq = new Sequence()

  applyEmoteSound(seq, "Suspicious")

  let mirrored = token.document.texture.scaleX < 0;
  const offsets = token.document.getFlag("gambitsEmoteBar", "offsets") || {};
  const capturedMirrored = offsets.capturedMirrored ?? false;
  const leftEyeOffset  = offsets.leftEyeOffset  || { x:0, y:0 };
  const rightEyeOffset = offsets.rightEyeOffset || { x:0, y:0 };
  const leftEyeScale   = offsets.leftEyeScale   || 0.25;
  const rightEyeScale  = offsets.rightEyeScale  || 0.25;
  const adjustedLeftEyeOffset = applyCapturedMirrorToOffset(token, leftEyeOffset, capturedMirrored);
  const adjustedRightEyeOffset = applyCapturedMirrorToOffset(token, rightEyeOffset, capturedMirrored);

  while (game.gambitsEmoteBar.suspiciousActive.get(token.id) && token?.document?.getFlag?.(packageId, flagPath)) {
    await new Sequence()
      .effect()
        .name(`emoteBarSuspicious_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
        .file("modules/gambitsEmoteBar/assets/suspicious_lefteye.webp")
        .attachTo(token, {offset: { x: adjustedLeftEyeOffset.x, y: adjustedLeftEyeOffset.y + 0.02 }, gridUnits: true, bindAlpha: false, local: getTokenRotation(token)})
        .scaleToObject(leftEyeScale)
        .mirrorX(mirrored)
        .belowTokens(false)
        .rotate(token.rotation)
        .duration(2100)

      .effect()
        .name(`emoteBarSuspicious_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
        .file("modules/gambitsEmoteBar/assets/suspicious_lefteye.webp")
        .attachTo(token, {offset: { x: adjustedRightEyeOffset.x, y: adjustedRightEyeOffset.y + 0.02 }, gridUnits: true, bindAlpha: false, local: getTokenRotation(token)})
        .scaleToObject(rightEyeScale)
        .mirrorX(mirrored)
        .belowTokens(false)
        .rotate(token.rotation)
        .duration(2100)
        .wait(2000)

      .play();

    mirrored = !mirrored;
  }

  game.gambitsEmoteBar.suspiciousActive.delete(token.id);
  if (token?.document) await token.document.setFlag(packageId, flagPath, false);
}
