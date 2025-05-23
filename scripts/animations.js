import { getTokenImage, applyEmoteSound, getTokenRotation } from './utils.js';
import { MODULE_ID } from "./module.js";

export async function performLaugh(token) {
  let facing = 1;
  let mirrorFace = true;
  
  let seq = new Sequence()

  applyEmoteSound(seq, "Laugh")
  seq.play()

  seq.effect()
    .name(`emoteBarLaugh_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("modules/gambitsEmoteBar/assets/laugh_large.webp")
    .attachTo(token, {offset:{x:(-0.4*token.document.width*facing), y:-0.45*token.document.width}, gridUnits: true, local: getTokenRotation(token)})
    .loopProperty("sprite", "rotation", { from: 0, to: -15*facing, duration: 250, ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
    .scaleToObject(0.34)
    .mirrorX(mirrorFace)
    .zIndex(2)
    .rotate(token.rotation)
    .private()
    .persist()

  seq.effect()
    .name(`emoteBarLaugh_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("modules/gambitsEmoteBar/assets/laugh_small.webp")
    .attachTo(token, {offset:{x:(-0.55*token.document.width*facing), y:0*token.document.width}, gridUnits: true, local: getTokenRotation(token)})
    .loopProperty("sprite", "rotation", { from: 0, to: 20*facing, duration: 250,ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
    .scaleToObject(0.34)
    .mirrorX(mirrorFace)
    .zIndex(2)
    .rotate(token.rotation)
    .private()
    .persist()

  seq.effect()
    .name(`emoteBarLaugh_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file(getTokenImage(token))
    .scaleToObject(1, {considerTokenScale: true})
    .attachTo(token)
    .loopProperty("sprite", "position.y", { from: 0, to: -0.01, duration: 150, gridUnits: true, pingPong: true, ease:"easeOutQuad" })
    .loopProperty("sprite", "width", { from: 0, to: 0.015, duration: 150, gridUnits: true, pingPong: true, ease:"easeOutQuad" })
    .loopProperty("sprite", "height", { from: 0, to: 0.015, duration: 150, gridUnits: true, pingPong: true, ease:"easeOutQuad"  })
    .rotate(token.rotation)
    .persist()
    .mirrorY(false)
    .zIndex(1)
    .waitUntilFinished(-200)

  seq.play()
}
  
export async function performAngry(token) {      
  let seq = new Sequence()

  applyEmoteSound(seq, "Angry")
  seq.play()

  seq.effect()
    .name(`emoteBarAngry_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file(`modules/gambitsEmoteBar/assets/angry_wide.webp`)
    .attachTo(token)
    .scaleIn(0, 1000, {ease: "easeOutElastic"})
    .scaleOut(0, 1000, {ease: "easeOutExpo"})
    .spriteOffset({x:0.3*token.document.width, y:-0.3*token.document.width}, { gridUnits: true, local: getTokenRotation(token)})
    .scaleToObject(0.45)
    .rotate(token.rotation)
    .persist()
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
    .persist()
    .attachTo(token, {bindAlpha: false})
    .loopProperty("alphaFilter", "alpha", { values: [-1, -1,-1,-1,-1, -1,-1,-1, 1, 1,1,1, 1, 1,1,1], duration: 25, pingPong: false })
    .waitUntilFinished()

  seq.play();
}
  
export async function performSurprised(token) {
  let seq = new Sequence()

  applyEmoteSound(seq, "Surprised")
  seq.play()

  seq.effect()
    .name(`emoteBarSurprised_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("modules/gambitsEmoteBar/assets/surprised_exclamation.webp")
    .attachTo(token)
    .anchor({x: 0.5, y: 1.55})
    .scaleIn(0, 500, {ease: "easeOutElastic"})
    .scaleOut(0, 500, {ease: "easeOutExpo"})
    .loopProperty("sprite", "position.y", { from: 0, to: -15, duration: 750, pingPong: true})
    .rotate(token.rotation)
    .persist()
    .scaleToObject(0.6)
    .attachTo(token, {bindAlpha: false})
    .private()

  seq.effect()
    .name(`emoteBarSurprised_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("modules/gambitsEmoteBar/assets/surprised.webp")
    .attachTo(token)
    .anchor({x: -0.3, y: 1.25})
    .scaleIn(0, 500, {ease: "easeOutElastic"})
    .scaleOut(0, 500, {ease: "easeOutExpo"})
    .loopProperty("sprite", "position.y", { from: 0, to: -15, duration: 750, pingPong: true})
    .rotate(token.rotation)
    .persist()
    .scaleToObject(0.45)
    .attachTo(token, {bindAlpha: false})
    .waitUntilFinished()

  seq.play();
}
  
export async function performShout(token) {
  let facing = 1;
  let mirrorFace = false;
  
  let seq = new Sequence()

  applyEmoteSound(seq, "Shout")
  seq.play()

  seq.effect()
    .name(`emoteBarShout_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("modules/gambitsEmoteBar/assets/shout_small.webp")
    .attachTo(token, {offset:{x:(-0.45*token.document.width)*facing, y:(-0.4*token.document.width)}, gridUnits: true, local: getTokenRotation(token)})
    .attachTo(token)
    .spriteRotation(35*facing)
    .loopProperty("sprite", "rotation", { from: 0, to: 15*facing, duration: 250,ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
    .loopProperty("sprite", "position.x", { from: 0, to: -0.025*facing, duration: 250, gridUnits: true, pingPong: false })
    .scaleIn(0, 1500, {ease: "easeOutElastic"})
    .scaleOut(0, 500, {ease: "easeOutExpo"})
    .scaleToObject(0.3)
    .private()
    .mirrorX(mirrorFace)
    .mirrorY()
    .rotate(token.rotation)
    .persist()

  seq.effect()
    .name(`emoteBarShout_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("modules/gambitsEmoteBar/assets/shout_large.webp")
    .attachTo(token, {offset:{x:(-0.6*token.document.width)*facing, y:(-0.25*token.document.width)}, gridUnits: true, local: getTokenRotation(token)})
    .attachTo(token)
    .spriteRotation(-15*facing)
    .loopProperty("sprite", "rotation", { from: 0, to: -10*facing, duration: 250, ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
    .loopProperty("sprite", "position.x", { from: 0, to: -0.025*facing, duration: 250, gridUnits: true, pingPong: false })
    .scaleIn(0, 1500, {ease: "easeOutElastic"})
    .scaleOut(0, 500, {ease: "easeOutExpo"})
    .scaleToObject(0.37)
    .private()
    .mirrorX(mirrorFace)
    .rotate(token.rotation)
    .persist()

  seq.effect()
    .name(`emoteBarShout_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("modules/gambitsEmoteBar/assets/shout_small.webp")
    .attachTo(token, {offset:{x:(-0.6*token.document.width)*facing, y:(-0.05*token.document.width)}, gridUnits: true, local: getTokenRotation(token)})
    .attachTo(token)
    .loopProperty("sprite", "rotation", { from: 0, to: 15*facing, duration: 250,ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
    .loopProperty("sprite", "position.x", { from: 0, to: -0.025*facing, duration: 250, gridUnits: true, pingPong: false })
    .scaleIn(0, 1500, {ease: "easeOutElastic"})
    .scaleOut(0, 500, {ease: "easeOutExpo"})
    .scaleToObject(0.3)
    .mirrorX(mirrorFace)
    .persist()
    .rotate(token.rotation)
    .waitUntilFinished(-200)

  seq.play()
}
  
export async function performDrunk(token) {
  let offsets = token.document.getFlag(MODULE_ID, "offsets");
  let noseOffset = offsets?.noseOffset ?? { x: 0, y: 0 };
  
  let seq = new Sequence()

  applyEmoteSound(seq, "Drunk")
  seq.play()

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
    .persist()
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
    .persist()
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
    .persist()
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
    .persist()
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
    .persist()
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
    .persist()
    .attachTo(token, {gridUnits: true, bindAlpha: false, local: getTokenRotation(token)})
    .waitUntilFinished()
  
  seq.animation()
    .on(token)
    .opacity(1)
  
  seq.play();
}
  
export async function performSoul(token) {
  let facing = 1;
  let mirrorFace = false; 
    
  let seq = new Sequence()

  applyEmoteSound(seq, "Soul")
  seq.play()
  
  seq.effect()
    .name(`emoteBarSoul_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("modules/gambitsEmoteBar/assets/soul.webp")
    .attachTo(token)
    .scaleIn(0, 1000, {ease: "easeOutElastic"})
    .scaleOut(0, 1000, {ease: "easeOutExpo"})
    .spriteOffset({x:(-0.45*token.document.width)*facing, y:-0.25}, { gridUnits: true, local: getTokenRotation(token)})
    .scaleToObject(0.45)
    .rotate(token.rotation)
    .persist()
    .attachTo(token, {bindAlpha: false})
    .mirrorX(mirrorFace)
    .loopProperty("sprite", "position.y", { from: -0.05, to: 0.05, duration: 3000, gridUnits:true, pingPong: true})
    .waitUntilFinished()

  seq.play();
}
  
export async function performSlap(token) {
  let location = token.center;
  const hasAnimatedSpellEffects = game.modules.get("animated-spell-effects")?.active;

  let seq = new Sequence();

  applyEmoteSound(seq, "Slap")
  seq.play()
  
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
  const isMirrored = token.document.texture.scaleX < 0;
  const offsets = token.document.getFlag(MODULE_ID, "offsets") ?? {};
  const leftEyeOffset = offsets.leftEyeOffset ?? { x: 0, y: 0 };
  const rightEyeOffset = offsets.rightEyeOffset ?? { x: 0, y: 0 };
  const leftEyeScale = offsets.leftEyeScale ?? 0.25;
  const rightEyeScale = offsets.rightEyeScale ?? 0.25;
  
  const adjustedLeftEyeOffset = {
    x: isMirrored ? -leftEyeOffset.x : leftEyeOffset.x,
    y: leftEyeOffset.y
  };
  const adjustedRightEyeOffset = {
    x: isMirrored ? -rightEyeOffset.x : rightEyeOffset.x,
    y: rightEyeOffset.y
  };
  
  let seq = new Sequence()

  applyEmoteSound(seq, "Cry")
  seq.play()
  
    seq.effect()
      .name(`emoteBarCry_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file("modules/gambitsEmoteBar/assets/cry_lefteye.webp")
      .attachTo(token, { offset: { x: adjustedLeftEyeOffset.x, y: adjustedLeftEyeOffset.y + 0.02 }, gridUnits: true, bindAlpha: false, local: getTokenRotation(token) })
      .fadeIn(500)
      .fadeOut(500)
      .scaleToObject(leftEyeScale)
      .mirrorX(!isMirrored)
      .loopProperty("sprite", "position.y", { from: 0, to: -0.0025, duration: 200, gridUnits: true, pingPong: true })
      .rotate(token.rotation)
      .persist()
      .private()
      .belowTokens(false)
  
    seq.effect()
      .name(`emoteBarCry_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file("modules/gambitsEmoteBar/assets/cry_righteye.webp")
      .attachTo(token, { offset: { x: adjustedRightEyeOffset.x, y: adjustedRightEyeOffset.y + 0.02 }, gridUnits: true, bindAlpha: false, local: getTokenRotation(token) })
      .fadeIn(500)
      .fadeOut(500)
      .scaleToObject(rightEyeScale)
      .mirrorX(isMirrored)
      .loopProperty("sprite", "position.y", { from: 0, to: -0.0025, duration: 200, gridUnits: true, pingPong: true })
      .waitUntilFinished()
      .belowTokens(false)
      .rotate(token.rotation)
      .persist()
  
    seq.play();
}

export async function performDisgusted(token) {
  let seq = new Sequence()

  applyEmoteSound(seq, "Disgusted")
  seq.play()
  
  seq.effect()
    .name(`emoteBarDisgusted_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("modules/gambitsEmoteBar/assets/disgusted.webp")
    .attachTo(token, {gridUnits: true, bindAlpha: false, local: getTokenRotation(token)})
    .scaleToObject(1, {considerTokenScale: true})
    .rotate(token.rotation)
    .persist()
    .attachTo(token, {offset:{y:-1}, gridUnits: true, bindAlpha: false, local: getTokenRotation(token)})
    .animateProperty("sprite", "position.y", { from: 0, to: 1, duration: 500, gridUnits:true, fromEnd: false })
    .animateProperty("sprite", "position.y", { from: 0, to: -0.8, duration: 500, gridUnits:true, fromEnd: true })
    .mask()
    .opacity(0.9)
    .waitUntilFinished()
  
  seq.play();
}

export async function performGiggle(token) {
  let facing = -1
  let mirrorFace = false;

  let seq = new Sequence()

  applyEmoteSound(seq, "Giggle")
  seq.play()

  seq.effect()
    .name(`emoteBarGiggle_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("modules/gambitsEmoteBar/assets/giggle_top.webp")
    .attachTo(token, {offset:{x:(-0.5*token.document.width)*facing, y:-0.25*token.document.width}, gridUnits: true, local: getTokenRotation(token)})
    .loopProperty("sprite", "rotation", { from: 0, to: -15*facing, duration: 150, ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 150, gridUnits: true, pingPong: false })
    .scaleToObject(0.2, {considerTokenScale: true})
    .private()
    .mirrorX(mirrorFace)
    .rotate(token.rotation)
    .persist()
    .zIndex(2)

  seq.effect()
    .name(`emoteBarGiggle_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("modules/gambitsEmoteBar/assets/giggle_bottom.webp")
    .attachTo(token, {offset:{x:(-0.55*token.document.width)*facing, y:-0}, gridUnits: true, local: getTokenRotation(token)})
    .loopProperty("sprite", "rotation", { from: 0, to: 20*facing, duration: 150,ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 150, gridUnits: true, pingPong: false })
    .scaleToObject(0.2, {considerTokenScale: true})
    .private()
    .mirrorX(mirrorFace)
    .rotate(token.rotation)
    .persist()
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
    .persist()
    .waitUntilFinished(-200)
    .zIndex(1)

  seq.play()
}

export async function performLove(token) {
  game.gambitsEmoteBar.loveActive.set(token.id, true);

  let seq = new Sequence()

  applyEmoteSound(seq, "Love")
  seq.play()
  
  while (game.gambitsEmoteBar.loveActive.get(token.id)) {
    await new Sequence()
      .effect()
        .name(`emoteBarLove_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
        .file("modules/gambitsEmoteBar/assets/love.webp")
        .atLocation(token, { offset: { x: Math.random() * (0.4 - (-0.4)) + (-0.4) }, gridUnits: true })
        .spriteOffset({ y: -0.15 * token.document.width }, { gridUnits: true })
        .scaleIn(0, 1000, { ease: "easeOutElastic" })
        .fadeOut(400, { ease: "linear" })
        .scaleToObject(0.25, { considerTokenScale: true })
        .duration(1000)
        .attachTo(token, { bindAlpha: false })
        .rotate(token.rotation)
        .animateProperty("sprite", "position.y", { from: 0, to: -0.75, duration: 1000, gridUnits: true })
        .loopProperty("sprite", "position.x", { from: -0.025, to: 0.025, duration: 500, gridUnits: true, pingPong: true })
        .wait(450)

      .play();
  }
  
  game.gambitsEmoteBar.loveActive.delete(token.id);
}

export async function performROFL(token) {
  let facing = -1

  let seq = new Sequence()

  applyEmoteSound(seq, "Rofl")
  seq.play()

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
    .rotate(token.rotation)
    .persist()
    .zIndex(2)

  seq.effect()
    .name(`emoteBarRofl_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("modules/gambitsEmoteBar/assets/rofl_bottom.webp")
    .attachTo(token, {offset:{x:-0.5*token.document.width, y:0.55*token.document.width}, bindAlpha: false, gridUnits: true, local: getTokenRotation(token)})
    .loopProperty("sprite", "rotation", { from: 90, to: 105, duration: 250,ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
    .scaleToObject(0.34, {considerTokenScale: true})
    .private()
    .rotate(token.rotation)
    .persist()
    .zIndex(2)

  seq.effect()
    .name(`emoteBarRofl_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file(getTokenImage(token))
    .scaleToObject(1, {considerTokenScale: true})
    .attachTo(token, {bindAlpha: false})
    .loopProperty("sprite", "position.y", { from: 0, to: 0.01, duration: 150, gridUnits: true, pingPong: true, ease:"easeOutQuad" })
    .loopProperty("sprite", "rotation", { from: -33, to: 33, duration: 300, ease: "easeOutCubic", pingPong: true })
    .rotate(90)
    .persist()
    .waitUntilFinished(-200)
    .zIndex(5)
    .belowTokens(false)

  seq.animation()
    .on(token)
    .opacity(1)
  
  seq.play()
}

export async function performSmoking(token) {
  let offsets = token.document.getFlag(MODULE_ID, "offsets");
  let mouthOffset = offsets?.mouthOffset ?? { x: 0, y: 0 };
  
  let facing = -1;
  let mirrorFace = false;
  
  const hasAnimatedSpellEffects = game.modules.get("animated-spell-effects")?.active;
  const isMirrored = token.document.texture.scaleX < 0;
  const adjustedMouthOffset = { x: isMirrored ? -mouthOffset.x : mouthOffset.x, y: mouthOffset.y };

  let seq = new Sequence();

  applyEmoteSound(seq, "Smoking")
  seq.play()
  
  if (hasAnimatedSpellEffects) {
    new Sequence()
    seq.effect()
      .file("animated-spell-effects-cartoon.smoke.97")
      .name(`emoteBarSmoking_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .attachTo(token, { offset: { x: adjustedMouthOffset.x - (0.17 * facing), y: adjustedMouthOffset.y + 0.01 }, gridUnits: true, bindAlpha: false, local: getTokenRotation(token) })
      .mirrorX(!isMirrored && mirrorFace)
      .scale(0.02)
      .filter("ColorMatrix", { brightness: 0.75 })
      .rotate(token.rotation)
      .persist()
      .zIndex(0.15);
  }
  
  seq.effect()
    .file("modules/gambitsEmoteBar/assets/smoking.webp")
    .name(`emoteBarSmoking_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .attachTo(token, { offset: { x: adjustedMouthOffset.x - (0.1 * facing), y: adjustedMouthOffset.y + 0.05 }, gridUnits: true, bindAlpha: false, local: getTokenRotation(token) })
    .mirrorX(!isMirrored && mirrorFace)
    .scale(0.15)
    .rotate(token.rotation)
    .persist()
    .waitUntilFinished()

  seq.play();
}

export async function performNervous(token) {
  const isMirrored = token.document.texture.scaleX < 0;

  let seq = new Sequence()

  applyEmoteSound(seq, "Nervous")
  seq.play()

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
      .persist()
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
      .persist()
      .belowTokens(false)
      .zIndex(2)

    seq.effect()
      .name(`emoteBarNervous_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file(getTokenImage(token))
      .attachTo(token)
      .scaleToObject()
      .animateProperty("sprite", "position.x", { from: 0, to: 1, duration: 50, ease: "linear", pingPong: true })
      .loopProperty("sprite", "position.x", { from: 0, to: -0.005, duration: 50, gridUnits: true, pingPong: true, ease:"easeOutQuad" })
      .persist()
      .rotate(token.rotation)
      .zIndex(1)

    seq.effect()
      .name(`emoteBarNervous_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
      .file(getTokenImage(token))
      .attachTo(token)
      .scaleToObject()
      .animateProperty("sprite", "position.x", { from: 0, to: 1, duration: 50, ease: "linear", pingPong: true })
      .loopProperty("sprite", "position.x", { from: 0, to: -0.005, duration: 50, gridUnits: true, pingPong: true, ease:"easeOutQuad" })
      .persist()
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
  seq.play()

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
    .persist()
    .waitUntilFinished()

  seq.animation()
    .on(token)
    .opacity(1);

  seq.play();
}

export async function performThunderHype(token) {
  let seq = new Sequence()

  applyEmoteSound(seq, "Thunderhype")
  seq.play()

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

  /*const hasJAA = game.modules.get("jaamod")?.active;
  let fileName = hasJAA ? "jaamod.sequencer_fx_master.blood_splat.red" : "modules/gambitsEmoteBar/assets/bloodied.webp";
  let scale = hasJAA ? 1.25 : 1;
  let opacity = hasJAA ? 0.6 : 1;*/

  applyEmoteSound(seq, "Bloodied")
  seq.play()

  seq.animation()
    .on(token)
    .opacity(0)
  
  seq.effect()
    .name(`emoteBarBloodied_${token.id}_${game.gambitsEmoteBar.dialogUser}`)
    .file("modules/gambitsEmoteBar/assets/bloodied.webp")
    .attachTo(token, {gridUnits: true, bindAlpha: false, local: getTokenRotation(token)})
    .scaleToObject(1, {considerTokenScale: true})
    .rotate(token.rotation)
    .persist()
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
    .persist()
    .mirrorY(false)
    .waitUntilFinished()

  seq.animation()
    .on(token)
    .opacity(1)
  
  seq.play();
}

export async function performSuspicious(token) {
  game.gambitsEmoteBar.suspiciousActive.set(token.id, true);

  let seq = new Sequence()

  applyEmoteSound(seq, "Suspicious")
  seq.play()

  let mirrored = token.document.texture.scaleX < 0;
  const offsets = token.document.getFlag("gambitsEmoteBar", "offsets") || {};
  const leftEyeOffset  = offsets.leftEyeOffset  || { x:0, y:0 };
  const rightEyeOffset = offsets.rightEyeOffset || { x:0, y:0 };
  const leftEyeScale   = offsets.leftEyeScale   || 0.25;
  const rightEyeScale  = offsets.rightEyeScale  || 0.25;
  const adjustedLeftEyeOffset = {
    x: mirrored ? -leftEyeOffset.x : leftEyeOffset.x,
    y: leftEyeOffset.y
  };
  const adjustedRightEyeOffset = {
    x: mirrored ? -rightEyeOffset.x : rightEyeOffset.x,
    y: rightEyeOffset.y
  };

  while ( game.gambitsEmoteBar.suspiciousActive.get(token.id) ) {
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
}