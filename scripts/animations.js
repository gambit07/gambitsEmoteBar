export async function performLaugh(token) {
    let facing = 1;
    let mirrorFace = true;
  
    if(token.document.getFlag("gambitsEmoteBar", "laughing")){
      await Sequencer.EffectManager.endEffects({ name: "Laugh", object: token })
    } 
    else {
      await token.document.setFlag("gambitsEmoteBar", "laughing", true)
  
      new Sequence()
  
      .effect()
      .name("Laugh")
      .file("modules/gambitsEmoteBar/assets/laugh_large.webp")
      .atLocation(token, {offset:{x:(-0.4*token.document.width*facing), y:-0.45*token.document.width}, gridUnits: true, local: true})
      .attachTo(token)
      .loopProperty("sprite", "rotation", { from: 0, to: -15*facing, duration: 250, ease: "easeOutCubic" })
      .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
      .scaleToObject(0.34)
      .mirrorX(mirrorFace)
      .private()
      .persist()
  
      .effect()
      .name("Laugh")
      .file("modules/gambitsEmoteBar/assets/laugh_small.webp")
      .atLocation(token, {offset:{x:(-0.55*token.document.width*facing), y:0*token.document.width}, gridUnits: true, local: true})
      .attachTo(token)
      .loopProperty("sprite", "rotation", { from: 0, to: 20*facing, duration: 250,ease: "easeOutCubic" })
      .loopProperty("sprite", "position.y", { from: 0, to: -0.025, duration: 250, gridUnits: true, pingPong: false })
      .scaleToObject(0.34)
      .mirrorX(mirrorFace)
      .private()
      .persist()
  
      .effect()
      .name("Laugh")
      .copySprite(token)
      .scaleToObject(token.document.texture.scaleX)
      .atLocation(token)
      .attachTo(token)
      .loopProperty("sprite", "position.y", { from: 0, to: -0.01, duration: 150, gridUnits: true, pingPong: true, ease:"easeOutQuad" })
      .loopProperty("sprite", "width", { from: 0, to: 0.015, duration: 150, gridUnits: true, pingPong: true, ease:"easeOutQuad" })
      .loopProperty("sprite", "height", { from: 0, to: 0.015, duration: 150, gridUnits: true, pingPong: true, ease:"easeOutQuad"  })
      .persist()
      .mirrorY(false)
      .waitUntilFinished(-200)
  
      .thenDo(function(){
          token.document.unsetFlag("gambitsEmoteBar", "laughing")
          Sequencer.EffectManager.endEffects({ name: "Laugh", object: token });
      })
  
      .animation()
      .on(token)
      .opacity(1)
  
      .play()
    }
}
  
export async function performAngry(token) {
    if(token.document.getFlag("gambitsEmoteBar", "angry")){
      await Sequencer.EffectManager.endEffects({ name: "Anger", object: token })
    }
    else {
      await token.document.setFlag("gambitsEmoteBar", "angry", true)
      
      new Sequence()
      
      .effect()
          .name("Anger")
          .file(`modules/gambitsEmoteBar/assets/angry_wide.webp`)
          .atLocation(token)
          .scaleIn(0, 1000, {ease: "easeOutElastic"})
          .scaleOut(0, 1000, {ease: "easeOutExpo"})
          .spriteOffset({x:0.3*token.document.width, y:-0.3*token.document.width}, { gridUnits: true, local: true})
          .scaleToObject(0.45)
          .persist()
          .attachTo(token, {bindAlpha:false })
          .loopProperty("alphaFilter", "alpha", { values: [1,1,1, 1,1,1,1, 1, -1, -1, -1, -1, -1, -1, -1, -1], duration: 25, pingPong: false })
          .private()
      
      .effect()
          .name("Anger")
          .file(`modules/gambitsEmoteBar/assets/angry_narrow.webp`)
          .atLocation(token)
          .scaleIn(0, 1000, {ease: "easeOutElastic"})
          .scaleOut(0, 1000, {ease: "easeOutExpo"})
          .spriteOffset({x:0.3*token.document.width, y:-0.3*token.document.width}, { gridUnits: true, local: true})
          .scaleToObject(0.45)
          .persist()
          .attachTo(token, {bindAlpha: false})
          .loopProperty("alphaFilter", "alpha", { values: [-1, -1,-1,-1,-1, -1,-1,-1, 1, 1,1,1, 1, 1,1,1], duration: 25, pingPong: false })
          .waitUntilFinished()
      
      .thenDo(function(){
          token.document.unsetFlag("gambitsEmoteBar", "angry")
          Sequencer.EffectManager.endEffects({ name: "Anger", object: token });
      })
      
      .play();
    }
}
  
export async function performSurprised(token) {
    new Sequence()
  
    if(token.document.getFlag("gambitsEmoteBar", "surprised")) {
      await Sequencer.EffectManager.endEffects({ name: "Surprise", object: token })
    }
    else {
      await token.document.setFlag("gambitsEmoteBar", "surprised", true);
  
      new Sequence()
  
      .effect()
      .name("Surprise")
      .file("modules/gambitsEmoteBar/assets/surprised_exclamation.webp")
      .atLocation(token)
      .anchor({x: 0.5, y: 1.55})
      .scaleIn(0, 500, {ease: "easeOutElastic"})
      .scaleOut(0, 500, {ease: "easeOutExpo"})
      .loopProperty("sprite", "position.y", { from: 0, to: -15, duration: 750, pingPong: true})
      .persist()
      .scaleToObject(0.6)
      .attachTo(token, {bindAlpha: false})
      .private()
  
      .effect()
      .name("Surprise")
      .file("modules/gambitsEmoteBar/assets/surprised.webp")
      .atLocation(token)
      .anchor({x: -0.3, y: 1.25})
      .scaleIn(0, 500, {ease: "easeOutElastic"})
      .scaleOut(0, 500, {ease: "easeOutExpo"})
      .loopProperty("sprite", "position.y", { from: 0, to: -15, duration: 750, pingPong: true})
      .persist()
      .scaleToObject(0.45)
      .attachTo(token, {bindAlpha: false})
      .waitUntilFinished()
  
      .thenDo(function(){
          token.document.unsetFlag("gambitsEmoteBar", "surprised")
          Sequencer.EffectManager.endEffects({ name: "Surprise", object: token });
      })
  
      .play();
    }
}
  
export async function performShout(token) {
    let facing = 1;
    let mirrorFace = false;
    
    if(token.document.getFlag("gambitsEmoteBar", "shouting")) {
      await Sequencer.EffectManager.endEffects({ name: "Shout", object: token })
    }
    else {
      await token.document.setFlag("gambitsEmoteBar", "shouting", true);
  
      new Sequence()
  
      .effect()
      .name("Shout")
      .file("modules/gambitsEmoteBar/assets/shout_small.webp")
      .atLocation(token, {offset:{x:(-0.45*token.document.width)*facing, y:(-0.4*token.document.width)}, gridUnits: true, local: true})
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
      .name("Shout")
      .file("modules/gambitsEmoteBar/assets/shout_large.webp")
      .atLocation(token, {offset:{x:(-0.6*token.document.width)*facing, y:(-0.25*token.document.width)}, gridUnits: true, local: true})
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
      .name("Shout")
      .file("modules/gambitsEmoteBar/assets/shout_small.webp")
      .atLocation(token, {offset:{x:(-0.6*token.document.width)*facing, y:(-0.05*token.document.width)}, gridUnits: true, local: true})
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
  
      .thenDo(function(){
          token.document.unsetFlag("gambitsEmoteBar", "shouting")
          Sequencer.EffectManager.endEffects({ name: "Shout", object: token });
      })
  
      .play()
    }
}
  
export async function performDrunk(token) {
    if(token.document.getFlag("gambitsEmoteBar", "drunken")) {
      await Sequencer.EffectManager.endEffects({ name: "Drunk", object: token })
      token.document.unsetFlag("gambitsEmoteBar", "drunken")
    }
    else {
      let centerX =  token.x+(canvas.grid.size*token.document.height)/2
      let centerY =  token.y+(canvas.grid.size*token.document.height)/2
      
      let location = token.center;
      let locationX = (location.x/canvas.grid.size)-(centerX/canvas.grid.size);
      locationX = Math.round(locationX * 100) / 100;
      locationX = locationX.toFixed(2);
      
      let locationY = (location.y/canvas.grid.size)-(centerY/canvas.grid.size);
      locationY = Math.round(locationY * 100 ) / 100;
      locationY = locationY.toFixed(2);
      //
      
      token.document.setFlag("gambitsEmoteBar", "drunken", true)
      
      new Sequence()
      
      .effect()
      .file("modules/gambitsEmoteBar/assets/drunk_large.webp")
      .name("Drunk")
      .delay(0,500)
      .atLocation(token, {offset:{x:-0.2*token.document.width, y:-0.6*token.document.width}, gridUnits:true})
      .duration(7000)
      .scaleToObject(0.05)
      .zeroSpriteRotation()
      .loopProperty("sprite", "position.x", {  from:0, to: -0.02, duration: 2000, pingPong: true, gridUnits: true, ease:"linear" })
      .loopProperty("sprite", "position.y", { from:0.15, to: -0.15, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutSine" })
      .loopProperty("sprite", "width", {  from:0, to: 0.1, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutCubic" })
      .loopProperty("sprite", "height", { from:0, to: 0.1, duration: 6000, pingPong: false, gridUnits: true, ease:"easeOutCubic" })
      .loopProperty("alphaFilter", "alpha", { values: [-1, 1, 1, 1, 1, -1], duration: 1000, pingPong: true, ease:"easeOutCubic" })
      .persist()
      .attachTo(token, {bindAlpha: false, bindRotation:false})
      .private()
      
      .effect()
      .file("modules/gambitsEmoteBar/assets/drunk_small.webp")
      .name("Drunk")
      .atLocation(token, {offset:{x:-0.35*token.document.width, y:-0.5*token.document.width}, gridUnits:true})
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
      .attachTo(token, {bindAlpha: false, bindRotation:false})
      .private()
      
      .effect()
      .file("modules/gambitsEmoteBar/assets/drunk_medium.webp")
      .name("Drunk")
      .atLocation(token, {offset:{x:-0.2*token.document.width, y:-0.5*token.document.width}, gridUnits:true})
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
      .attachTo(token, {bindAlpha: false, bindRotation:false})
      .private()
      
      .effect()
      .file("modules/gambitsEmoteBar/assets/drunk_tiny.webp")
      .name("Drunk")
      .atLocation(token, {offset:{x:-0.1*token.document.width, y:-0.3*token.document.width}, gridUnits:true})
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
      .attachTo(token, {bindAlpha: false, bindRotation:false})
      .private()
      
      .animation()
      .on(token)
      .opacity(0)
      
      .effect()
      .file("modules/gambitsEmoteBar/assets/drunk_blush.webp")
      .name("Drunk")
      .opacity(0.85)
      .scaleToObject(0.4)
      .loopProperty("spriteContainer", "position.x", {  from:-20, to: 20, duration: 2500, pingPong: true, ease:"easeInOutSine" })
      .loopProperty("sprite", "position.y", { values: [0, 20, 0, 20], duration: 2500, pingPong: true })
      .loopProperty("sprite", "rotation", { from: -10, to: 10, duration: 2500, pingPong: true,ease:"easeInOutSine" })
      .persist()
      .attachTo(token, {offset: {x:Number(locationX), y:Number(locationY)}, gridUnits: true, bindAlpha: false})
      .zIndex(0)
      .private()
      
      .effect()
      .copySprite(token)
      .name("Drunk")
      .atLocation(token)
      .loopProperty("spriteContainer", "position.x", {  from:-20, to: 20, duration: 2500, pingPong: true, ease:"easeInOutSine" })
      .loopProperty("sprite", "position.y", { values: [0, 20, 0, 20], duration: 2500, pingPong: true })
      .loopProperty("sprite", "rotation", { from: -10, to: 10, duration: 2500, pingPong: true,ease:"easeInOutSine" })
      .persist()
      .attachTo(token, {bindAlpha: false})
      .waitUntilFinished()
      
      .animation()
      .on(token)
      .opacity(1)
      
      .play();
    }
}
  
export async function performSoul(token) {
    let facing = 1;
    let mirrorFace = false; 
    
    if(token.document.getFlag("gambitsEmoteBar", "soulSucked")){
       await Sequencer.EffectManager.endEffects({ name: "Soul", object: token })
    }
    else {
      token.document.setFlag("gambitsEmoteBar", "soulSucked", true)
      
      new Sequence()
      
      .effect()
        .name("Soul")
        .file("modules/gambitsEmoteBar/assets/soul.webp")
        .atLocation(token)
        .scaleIn(0, 1000, {ease: "easeOutElastic"})
        .scaleOut(0, 1000, {ease: "easeOutExpo"})
        .spriteOffset({x:(-0.45*token.document.width)*facing, y:-0.25}, { gridUnits: true, local: true})
        .scaleToObject(0.45)
        .persist()
        .attachTo(token, {bindAlpha: false})
        .mirrorX(mirrorFace)
        .loopProperty("sprite", "position.y", { from: -0.05, to: 0.05, duration: 3000, gridUnits:true, pingPong: true})
        .waitUntilFinished()
      
      .thenDo(function(){
        token.document.unsetFlag("gambitsEmoteBar", "soulSucked")
        Sequencer.EffectManager.endEffects({ name: "Soul", object: token });
      })
      
      .play();
    }
}
  
export async function performSlap(token) {
    let location = token.center;
    let seq = new Sequence();
    
    const hasAnimatedSpellEffects = game.modules.get("animated-spell-effects")?.active;
    
    if (hasAnimatedSpellEffects) {
      seq.effect()
        .atLocation(location, { offset: { x: 0.1, y: -0.1 }, gridUnits: true })
        .file("animated-spell-effects-cartoon.magic.impact.02")
        .size(1.4, { gridUnits: true });
    }
    
    seq.effect()
      .atLocation(location)
      .file("modules/gambitsEmoteBar/assets/slap.webp")
      .size(0.55, { gridUnits: true })
      .rotate(-45)
      .fadeOut(250)
      .duration(1000)
      .delay(50)
      .zIndex(1)
    
      .effect()
      .atLocation(location)
      .file("modules/gambitsEmoteBar/assets/slap.webp")
      .size(0.55, { gridUnits: true })
      .filter("ColorMatrix", { brightness: -1 })
      .opacity(0.5)
      .duration(6000)
      .fadeOut(1000)
      .rotate(-45)
      .delay(50)
      .zIndex(0)
    
      .play();
}