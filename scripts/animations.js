import getTokenImage from './utils.js';

export async function performLaugh(token) {
  let facing = 1;
  let mirrorFace = true;
  
  new Sequence()

  .effect()
    .name(`emoteBarLaugh_${token.id}`)
    .file("modules/gambitsEmoteBar/assets/laugh_large.webp")
    .attachTo(token, {offset:{x:(-0.4*token.document.width*facing), y:-0.45*token.document.width}, gridUnits: true, local: true})
    .attachTo(token)
    .loopProperty("sprite", "rotation", { from: 0, to: -15*facing, duration: 250, ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
    .scaleToObject(0.34)
    .mirrorX(mirrorFace)
    .zIndex(2)
    .private()
    .persist()

  .effect()
    .name(`emoteBarLaugh_${token.id}`)
    .file("modules/gambitsEmoteBar/assets/laugh_small.webp")
    .attachTo(token, {offset:{x:(-0.55*token.document.width*facing), y:0*token.document.width}, gridUnits: true, local: true})
    .attachTo(token)
    .loopProperty("sprite", "rotation", { from: 0, to: 20*facing, duration: 250,ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
    .scaleToObject(0.34)
    .mirrorX(mirrorFace)
    .zIndex(2)
    .private()
    .persist()

  .effect()
    .name(`emoteBarLaugh_${token.id}`)
    .file(getTokenImage(token))
    .scaleToObject(1, {considerTokenScale: true})
    .attachTo(token)
    .attachTo(token)
    .loopProperty("sprite", "position.y", { from: 0, to: -0.01, duration: 150, gridUnits: true, pingPong: true, ease:"easeOutQuad" })
    .loopProperty("sprite", "width", { from: 0, to: 0.015, duration: 150, gridUnits: true, pingPong: true, ease:"easeOutQuad" })
    .loopProperty("sprite", "height", { from: 0, to: 0.015, duration: 150, gridUnits: true, pingPong: true, ease:"easeOutQuad"  })
    .persist()
    .mirrorY(false)
    .zIndex(1)
    .waitUntilFinished(-200)

  .animation()
  .on(token)
  .opacity(1)

  .play()
}
  
export async function performAngry(token) {      
  new Sequence()

  .effect()
    .name(`emoteBarAngry_${token.id}`)
    .file(`modules/gambitsEmoteBar/assets/angry_wide.webp`)
    .attachTo(token)
    .scaleIn(0, 1000, {ease: "easeOutElastic"})
    .scaleOut(0, 1000, {ease: "easeOutExpo"})
    .spriteOffset({x:0.3*token.document.width, y:-0.3*token.document.width}, { gridUnits: true, local: true})
    .scaleToObject(0.45)
    .persist()
    .attachTo(token, {bindAlpha:false })
    .loopProperty("alphaFilter", "alpha", { values: [1,1,1, 1,1,1,1, 1, -1, -1, -1, -1, -1, -1, -1, -1], duration: 25, pingPong: false })
    .private()
  
  .effect()
    .name(`emoteBarAngry_${token.id}`)
    .file(`modules/gambitsEmoteBar/assets/angry_narrow.webp`)
    .attachTo(token)
    .scaleIn(0, 1000, {ease: "easeOutElastic"})
    .scaleOut(0, 1000, {ease: "easeOutExpo"})
    .spriteOffset({x:0.3*token.document.width, y:-0.3*token.document.width}, { gridUnits: true, local: true})
    .scaleToObject(0.45)
    .persist()
    .attachTo(token, {bindAlpha: false})
    .loopProperty("alphaFilter", "alpha", { values: [-1, -1,-1,-1,-1, -1,-1,-1, 1, 1,1,1, 1, 1,1,1], duration: 25, pingPong: false })
    .waitUntilFinished()
  .play();
}
  
export async function performSurprised(token) {
  new Sequence()

  .effect()
    .name(`emoteBarSurprised_${token.id}`)
    .file("modules/gambitsEmoteBar/assets/surprised_exclamation.webp")
    .attachTo(token)
    .anchor({x: 0.5, y: 1.55})
    .scaleIn(0, 500, {ease: "easeOutElastic"})
    .scaleOut(0, 500, {ease: "easeOutExpo"})
    .loopProperty("sprite", "position.y", { from: 0, to: -15, duration: 750, pingPong: true})
    .persist()
    .scaleToObject(0.6)
    .attachTo(token, {bindAlpha: false})
    .private()

  .effect()
    .name(`emoteBarSurprised_${token.id}`)
    .file("modules/gambitsEmoteBar/assets/surprised.webp")
    .attachTo(token)
    .anchor({x: -0.3, y: 1.25})
    .scaleIn(0, 500, {ease: "easeOutElastic"})
    .scaleOut(0, 500, {ease: "easeOutExpo"})
    .loopProperty("sprite", "position.y", { from: 0, to: -15, duration: 750, pingPong: true})
    .persist()
    .scaleToObject(0.45)
    .attachTo(token, {bindAlpha: false})
    .waitUntilFinished()

  .play();
}
  
export async function performShout(token) {
  let facing = 1;
  let mirrorFace = false;
  
  new Sequence()

  .effect()
    .name(`emoteBarShout_${token.id}`)
    .file("modules/gambitsEmoteBar/assets/shout_small.webp")
    .attachTo(token, {offset:{x:(-0.45*token.document.width)*facing, y:(-0.4*token.document.width)}, gridUnits: true, local: true})
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
    .persist()

  .effect()
    .name(`emoteBarShout_${token.id}`)
    .file("modules/gambitsEmoteBar/assets/shout_large.webp")
    .attachTo(token, {offset:{x:(-0.6*token.document.width)*facing, y:(-0.25*token.document.width)}, gridUnits: true, local: true})
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
    .persist()

  .effect()
    .name(`emoteBarShout_${token.id}`)
    .file("modules/gambitsEmoteBar/assets/shout_small.webp")
    .attachTo(token, {offset:{x:(-0.6*token.document.width)*facing, y:(-0.05*token.document.width)}, gridUnits: true, local: true})
    .attachTo(token)
    .loopProperty("sprite", "rotation", { from: 0, to: 15*facing, duration: 250,ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
    .loopProperty("sprite", "position.x", { from: 0, to: -0.025*facing, duration: 250, gridUnits: true, pingPong: false })
    .scaleIn(0, 1500, {ease: "easeOutElastic"})
    .scaleOut(0, 500, {ease: "easeOutExpo"})
    .scaleToObject(0.3)
    .mirrorX(mirrorFace)
    .persist()
    .waitUntilFinished(-200)

  .play()
}
  
export async function performDrunk(token) {
  let offsets = token.document.getFlag("gambitsEmoteBar", "offsets");
  let noseOffset = offsets?.noseOffset ?? { x: 0, y: 0 };
  
  new Sequence()
  
  .effect()
    .file("modules/gambitsEmoteBar/assets/drunk_large.webp")
    .name(`emoteBarDrunk_${token.id}`)
    .delay(0,500)
    .attachTo(token, {offset:{x:-0.2*token.document.width, y:-0.6*token.document.width}, gridUnits: true, bindAlpha: false, local: true})
    .duration(7000)
    .scaleToObject(0.05)
    .zeroSpriteRotation()
    .loopProperty("sprite", "position.x", {  from:0, to: -0.02, duration: 2000, pingPong: true, gridUnits: true, ease:"linear" })
    .loopProperty("sprite", "position.y", { from:0.15, to: -0.15, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutSine" })
    .loopProperty("sprite", "width", {  from:0, to: 0.1, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutCubic" })
    .loopProperty("sprite", "height", { from:0, to: 0.1, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutCubic" })
    .loopProperty("alphaFilter", "alpha", { values: [-1, 1, 1, 1, 1, -1], duration: 1000, pingPong: true, ease:"easeOutCubic" })
    .persist()
    .attachTo(token, {gridUnits: true, bindAlpha: false, local: true})
    .private()
    .belowTokens(false)
  
  .effect()
    .file("modules/gambitsEmoteBar/assets/drunk_small.webp")
    .name(`emoteBarDrunk_${token.id}`)
    .attachTo(token, {offset:{x:-0.35*token.document.width, y:-0.5*token.document.width}, gridUnits: true, bindAlpha: false, local: true})
    .duration(7000)
    .delay(0, 600)
    .scaleToObject(0.05)
    .zeroSpriteRotation()
    .loopProperty("sprite", "position.x", {  from:0, to: 0.05, duration: 2000, pingPong: true, gridUnits: true, ease:"easeOutSine" })
    .loopProperty("sprite", "position.y", { from:0.15, to: -0.15, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutSine" })
    .loopProperty("sprite", "width", {  from:0, to: 0.1, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutCubic" })
    .loopProperty("sprite", "height", { from:0, to: 0.1, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutCubic" })
    .loopProperty("alphaFilter", "alpha", { values: [-1, 1, 1, 1, 1, -1], duration: 1000, pingPong: true, ease:"easeOutCubic" })
    .persist()
    .attachTo(token, {gridUnits: true, bindAlpha: false, local: true})
    .private()
    .belowTokens(false)
  
  .effect()
    .file("modules/gambitsEmoteBar/assets/drunk_medium.webp")
    .name(`emoteBarDrunk_${token.id}`)
    .attachTo(token, {offset:{x:-0.2*token.document.width, y:-0.5*token.document.width}, gridUnits: true, bindAlpha: false, local: true})
    .duration(7000)
    .delay(750, 1000)
    .scaleToObject(0.05)
    .zeroSpriteRotation()
    .loopProperty("sprite", "position.x", {  from:0, to: 0.05, duration: 2000, pingPong: true, gridUnits: true, ease:"easeOutSine" })
    .loopProperty("sprite", "position.y", { from:0.15, to: -0.15, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutSine" })
    .loopProperty("sprite", "width", {  from:0, to: 0.1, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutCubic" })
    .loopProperty("sprite", "height", { from:0, to: 0.1, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutCubic" })
    .loopProperty("alphaFilter", "alpha", { values: [-1, 1, 1, 1, 1, -1], duration: 1000, pingPong: true, ease:"easeOutCubic" })
    .persist()
    .attachTo(token, {gridUnits: true, bindAlpha: false, local: true})
    .private()
    .belowTokens(false)
  
  .effect()
    .file("modules/gambitsEmoteBar/assets/drunk_tiny.webp")
    .name(`emoteBarDrunk_${token.id}`)
    .attachTo(token, {offset:{x:-0.1*token.document.width, y:-0.3*token.document.width}, gridUnits: true, bindAlpha: false, local: true})
    .duration(7000)
    .delay(500,1200)
    .scaleToObject(0.05)
    .zeroSpriteRotation()
    .loopProperty("sprite", "position.x", {  from:0, to: -0.05, duration: 2000, pingPong: true, gridUnits: true, ease:"easeOutSine" })
    .loopProperty("sprite", "position.y", { from:0.15, to: -0.15, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutSine" })
    .loopProperty("sprite", "width", {  from:0, to: 0.1, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutCubic" })
    .loopProperty("sprite", "height", { from:0, to: 0.1, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutCubic" })
    .loopProperty("alphaFilter", "alpha", { values: [-1, 1, 1, 1, 1, -1], duration: 1000, pingPong: true, ease:"easeOutCubic" })
    .persist()
    .attachTo(token, {gridUnits: true, bindAlpha: false, local: true})
    .private()
    .belowTokens(false)
  
  .animation()
  .on(token)
  .opacity(0)
  
  .effect()
    .file("modules/gambitsEmoteBar/assets/drunk_blush.webp")
    .name(`emoteBarDrunk_${token.id}`)
    .opacity(0.85)
    .scaleToObject(0.3, {considerTokenScale: true})
    .loopProperty("spriteContainer", "position.x", {  from:-20, to: 20, duration: 2500, pingPong: true, ease:"easeInOutSine" })
    .loopProperty("sprite", "position.y", { values: [0, 20, 0, 20], duration: 2500, pingPong: true })
    .loopProperty("sprite", "rotation", { from: -10, to: 10, duration: 2500, pingPong: true,ease:"easeInOutSine" })
    .persist()
    .attachTo(token, {offset: {x:noseOffset.x-0.0, y:noseOffset.y+0.0}, gridUnits: true, bindAlpha: false, local: true})
    .zIndex(0)
    .private()
  
  .effect()
    .file(getTokenImage(token))
    .name(`emoteBarDrunk_${token.id}`)
    .attachTo(token, {gridUnits: true, bindAlpha: false, local: true})
    .scaleToObject(1, {considerTokenScale: true})
    .loopProperty("spriteContainer", "position.x", {  from:-20, to: 20, duration: 2500, pingPong: true, ease:"easeInOutSine" })
    .loopProperty("sprite", "position.y", { values: [0, 20, 0, 20], duration: 2500, pingPong: true })
    .loopProperty("sprite", "rotation", { from: -10, to: 10, duration: 2500, pingPong: true,ease:"easeInOutSine" })
    .persist()
    .attachTo(token, {gridUnits: true, bindAlpha: false, local: true})
    .waitUntilFinished()
  
  .animation()
  .on(token)
  .opacity(1)
  
  .play();
}
  
export async function performSoul(token) {
  let facing = 1;
  let mirrorFace = false; 
    
  new Sequence()
  
  .effect()
    .name(`emoteBarSoul_${token.id}`)
    .file("modules/gambitsEmoteBar/assets/soul.webp")
    .attachTo(token)
    .scaleIn(0, 1000, {ease: "easeOutElastic"})
    .scaleOut(0, 1000, {ease: "easeOutExpo"})
    .spriteOffset({x:(-0.45*token.document.width)*facing, y:-0.25}, { gridUnits: true, local: true})
    .scaleToObject(0.45)
    .persist()
    .attachTo(token, {bindAlpha: false})
    .mirrorX(mirrorFace)
    .loopProperty("sprite", "position.y", { from: -0.05, to: 0.05, duration: 3000, gridUnits:true, pingPong: true})
    .waitUntilFinished()
  .play();
}
  
export async function performSlap(token) {
  let location = token.center;
  let seq = new Sequence();
  
  const hasAnimatedSpellEffects = game.modules.get("animated-spell-effects")?.active;
  
  if (hasAnimatedSpellEffects) {
    seq.effect()
      .attachTo(location, { offset: { x: 0.1, y: -0.1 }, gridUnits: true })
      .file("animated-spell-effects-cartoon.magic.impact.02")
      .scaleToObject(token.document.width, {considerTokenScale: true})
  }
  
  seq.effect()
    .attachTo(location)
    .file("modules/gambitsEmoteBar/assets/slap.webp")
    .size(0.55, { gridUnits: true })
    .rotate(-45)
    .fadeOut(250)
    .duration(1000)
    .delay(50)
    .zIndex(1)
    .scaleToObject(token.document.width / 2, {considerTokenScale: true})
  
  seq.effect()
    .attachTo(location)
    .file("modules/gambitsEmoteBar/assets/slap.webp")
    .size(0.55, { gridUnits: true })
    .filter("ColorMatrix", { brightness: -1 })
    .opacity(0.5)
    .duration(6000)
    .fadeOut(1000)
    .rotate(-45)
    .delay(50)
    .zIndex(0)
    .scaleToObject(token.document.width / 2, {considerTokenScale: true})
  
  .play();
}

export async function performCry(token) {
  const isMirrored = token.document.texture.scaleX < 0;
  const offsets = token.document.getFlag("gambitsEmoteBar", "offsets") ?? {};
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
  
  new Sequence()
  
    .effect()
      .name(`emoteBarCry_${token.id}`)
      .file("modules/gambitsEmoteBar/assets/cry_lefteye.webp")
      .attachTo(token, { offset: { x: adjustedLeftEyeOffset.x, y: adjustedLeftEyeOffset.y + 0.02 }, gridUnits: true, bindAlpha: false, local: true })
      .fadeIn(500)
      .fadeOut(500)
      .scaleToObject(leftEyeScale)
      .mirrorX(!isMirrored)
      .loopProperty("sprite", "position.y", { from: 0, to: -0.0025, duration: 200, gridUnits: true, pingPong: true })
      .persist()
      .private()
      .belowTokens(false)
  
    .effect()
      .name(`emoteBarCry_${token.id}`)
      .file("modules/gambitsEmoteBar/assets/cry_righteye.webp")
      .attachTo(token, { offset: { x: adjustedRightEyeOffset.x, y: adjustedRightEyeOffset.y + 0.02 }, gridUnits: true, bindAlpha: false, local: true })
      .fadeIn(500)
      .fadeOut(500)
      .scaleToObject(rightEyeScale)
      .mirrorX(isMirrored)
      .loopProperty("sprite", "position.y", { from: 0, to: -0.0025, duration: 200, gridUnits: true, pingPong: true })
      .waitUntilFinished()
      .belowTokens(false)
      .persist()
  
    .play();
}

export async function performDisgusted(token) {
  new Sequence()
  
  .effect()
  .name(`emoteBarDisgusted_${token.id}`)
  .file("modules/gambitsEmoteBar/assets/disgusted.webp")
  .attachTo(token, {gridUnits: true, bindAlpha: false, local: true})
  .scaleToObject(1, {considerTokenScale: true})
  .persist()
  .attachTo(token, {offset:{y:-1}, gridUnits: true, bindAlpha: false, local: true})
  .animateProperty("sprite", "position.y", { from: 0, to: 1, duration: 500, gridUnits:true, fromEnd: false })
  .animateProperty("sprite", "position.y", { from: 0, to: -0.8, duration: 500, gridUnits:true, fromEnd: true })
  .mask()
  .opacity(0.9)
  .waitUntilFinished()
  
  .play();
}

export async function performGiggle(token) {
  let facing = -1
  let mirrorFace = false;

  new Sequence()

  .animation()
  .on(token)
  .opacity(0)

  .effect()
    .name(`emoteBarGiggle_${token.id}`)
    .file("modules/gambitsEmoteBar/assets/giggle_top.webp")
    .atLocation(token, {offset:{x:(-0.5*token.document.width)*facing, y:-0.25*token.document.width}, gridUnits: true, local: true})
    .attachTo(token, {bindAlpha: false})
    .loopProperty("sprite", "rotation", { from: 0, to: -15*facing, duration: 150, ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 150, gridUnits: true, pingPong: false })
    .scaleToObject(0.2, {considerTokenScale: true})
    .private()
    .mirrorX(mirrorFace)
    .persist()
    .zIndex(2)

  .effect()
    .name(`emoteBarGiggle_${token.id}`)
    .file("modules/gambitsEmoteBar/assets/giggle_bottom.webp")
    .atLocation(token, {offset:{x:(-0.55*token.document.width)*facing, y:-0}, gridUnits: true, local: true})
    .attachTo(token, {bindAlpha: false})
    .loopProperty("sprite", "rotation", { from: 0, to: 20*facing, duration: 150,ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 150, gridUnits: true, pingPong: false })
    .scaleToObject(0.2, {considerTokenScale: true})
    .private()
    .mirrorX(mirrorFace)
    .persist()
    .zIndex(2)

  .effect()
    .name(`emoteBarGiggle_${token.id}`)
    .file(getTokenImage(token))
    .scaleToObject(1, {considerTokenScale: true})
    .atLocation(token)
    .attachTo(token, {bindAlpha: false})
    .loopProperty("sprite", "position.y", { from: 0, to: -0.01, duration: 100, gridUnits: true, pingPong: true, ease:"easeOutQuad" })
    .loopProperty("sprite", "width", { from: 0, to: 0.01, duration: 100, gridUnits: true, pingPong: true, ease:"easeOutQuad" })
    .loopProperty("sprite", "height", { from: 0, to: 0.01, duration: 100, gridUnits: true, pingPong: true, ease:"easeOutQuad"  })
    .persist()
    .waitUntilFinished(-200)
    .zIndex(1)

  .animation()
  .on(token)
  .opacity(1)

  .play()
}

export async function performLove(token, state) {
  game.gambitsEmoteBar.loveActive.set(token.id, true);
  
  while (game.gambitsEmoteBar.loveActive.get(token.id)) {
    await new Sequence()
      .effect()
        .name(`emoteBarLove_${token.id}`)
        .file("modules/gambitsEmoteBar/assets/love.webp")
        .atLocation(token, { offset: { x: Math.random() * (0.4 - (-0.4)) + (-0.4) }, gridUnits: true })
        .spriteOffset({ y: -0.15 * token.document.width }, { gridUnits: true })
        .scaleIn(0, 1000, { ease: "easeOutElastic" })
        .fadeOut(400, { ease: "linear" })
        .scaleToObject(0.25, { considerTokenScale: true })
        .duration(1000)
        .attachTo(token, { bindAlpha: false })
        .animateProperty("sprite", "position.y", { from: 0, to: -0.75, duration: 1000, gridUnits: true })
        .loopProperty("sprite", "position.x", { from: -0.025, to: 0.025, duration: 500, gridUnits: true, pingPong: true })
        .wait(450)
      .play();
  }
  
  game.gambitsEmoteBar.loveActive.delete(token.id);
}

export async function performROFL(token) {
  let facing = -1

  new Sequence()

  .animation()
  .on(token)
  .opacity(0)

  .effect()
    .name(`emoteBarRofl_${token.id}`)
    .file("modules/gambitsEmoteBar/assets/rofl_top.webp")
    .atLocation(token, {offset:{x:-0.45*token.document.width, y:0.4*token.document.width}, gridUnits: true, local: true})
    .attachTo(token, {bindAlpha: false})
    .loopProperty("sprite", "rotation", { from: 0, to: -15, duration: 250, ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
    .scaleToObject(0.34, {considerTokenScale: true})
    .private()
    .persist()
    .zIndex(2)


  .effect()
    .name(`emoteBarRofl_${token.id}`)
    .file("modules/gambitsEmoteBar/assets/rofl_bottom.webp")
    .atLocation(token, {offset:{x:-0.5*token.document.width, y:0.55*token.document.width}, gridUnits: true, local: true})
    .attachTo(token, {bindAlpha: false})
    .loopProperty("sprite", "rotation", { from: 90, to: 105, duration: 250,ease: "easeOutCubic" })
    .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
    .scaleToObject(0.34, {considerTokenScale: true})
    .private()
    .persist()
    .zIndex(2)

  .effect()
    .name(`emoteBarRofl_${token.id}`)
    .file(getTokenImage(token))
    .scaleToObject(1, {considerTokenScale: true})
    .attachTo(token, {bindAlpha: false})
    .loopProperty("sprite", "position.y", { from: 0, to: 0.01, duration: 150, gridUnits: true, pingPong: true, ease:"easeOutQuad" })
    .loopProperty("sprite", "rotation", { from: -33, to: 33, duration: 300, ease: "easeOutCubic", pingPong: true })
    .rotate(-90*facing)
    .persist()
    .waitUntilFinished(-200)
    .zIndex(1)

  .animation()
  .on(token)
  .opacity(1)
  
  .play()
}

export async function performSmoking(token) {
  let offsets = token.document.getFlag("gambitsEmoteBar", "offsets");
  let mouthOffset = offsets?.mouthOffset ?? { x: 0, y: 0 };
  
  let facing = -1;
  let mirrorFace = false;
  let seq = new Sequence();
  
  const hasAnimatedSpellEffects = game.modules.get("animated-spell-effects")?.active;
  const isMirrored = token.document.texture.scaleX < 0;
  const adjustedMouthOffset = { x: isMirrored ? -mouthOffset.x : mouthOffset.x, y: mouthOffset.y };
  
  if (hasAnimatedSpellEffects) {
    seq.effect()
      .file("animated-spell-effects-cartoon.smoke.97")
      .name(`emoteBarSmoking_${token.id}`)
      .attachTo(token, { offset: { x: adjustedMouthOffset.x - (0.17 * facing), y: adjustedMouthOffset.y + 0.01 }, gridUnits: true, bindAlpha: false, local: true })
      .mirrorX(!isMirrored && mirrorFace)
      .scale(0.02)
      .filter("ColorMatrix", { brightness: 0.75 })
      .persist()
      .zIndex(0.15);
  }
  
  seq.effect()
    .file("modules/gambitsEmoteBar/assets/smoking.webp")
    .name(`emoteBarSmoking_${token.id}`)
    .attachTo(token, { offset: { x: adjustedMouthOffset.x - (0.1 * facing), y: adjustedMouthOffset.y + 0.05 }, gridUnits: true, bindAlpha: false, local: true })
    .mirrorX(!isMirrored && mirrorFace)
    .scale(0.15)
    .persist()
    .waitUntilFinished()
    .play();
}

export async function performNervous(token) {
  const isMirrored = token.document.texture.scaleX < 0;

  new Sequence()
    .effect()
      .name(`emoteBarNervous_${token.id}`)
      .file("modules/gambitsEmoteBar/assets/nervous_left.webp")
      .scaleToObject(0.5, { considerTokenScale: true })
      .mirrorX(isMirrored)
      .scaleIn(0, 1000, { ease: "easeOutElastic" })
      .attachTo(token, { offset: { x: -0.25 * token.document.width, y: ((0.9 - Math.abs(token.document.texture.scaleX)) / 2) - 0.35 }, gridUnits: true, align: "center", edge: "inner", local: true })
      .loopProperty("sprite", "scale.x", { from: 0.5, to: 1, duration: 200, ease: "easeOutQuint" })
      .loopProperty("sprite", "position.x", { from: 0, to: -0.1, gridUnits: true, duration: 200, ease: "easeOutCirc" })
      .loopProperty("sprite", "scale.y", { from: 0.5, to: 1, duration: 200, ease: "easeOutQuint" })
      .loopProperty("sprite", "rotation", { from: 0, to: 15, duration: 1000 })
      .filter("ColorMatrix", { saturate: -1 })
      .persist()
      .belowTokens(false)
    
    .effect()
      .name(`emoteBarNervous_${token.id}`)
      .file("modules/gambitsEmoteBar/assets/nervous_right.webp")
      .scaleToObject(0.5, { considerTokenScale: true })
      .scaleIn(0, 1000, { ease: "easeOutElastic" })
      .attachTo(token, { offset: { x: 0.2 * token.document.width, y: ((0.9 - Math.abs(token.document.texture.scaleX)) / 2) - 0.35 }, gridUnits: true, align: "center", edge: "inner", local: true })
      .mirrorX(!isMirrored)
      .loopProperty("sprite", "scale.x", { from: 0.5, to: 1, duration: 200, ease: "easeOutQuint" })
      .loopProperty("sprite", "position.x", { from: 0, to: 0.1, gridUnits: true, duration: 200, ease: "easeOutCirc" })
      .loopProperty("sprite", "scale.y", { from: 0.5, to: 1, duration: 200, ease: "easeOutQuint" })
      .loopProperty("sprite", "rotation", { from: 0, to: -15, duration: 1000 })
      .filter("ColorMatrix", { saturate: -1 })
      .persist()
      .belowTokens(false)
    
    .play();
}