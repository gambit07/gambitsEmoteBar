<p>A small module adding some basic emotes accessible via the Token Controls bar that players can use whenever they want to have some fun! An emote can be applied to multiple tokens at once as long as they are owned, so if the GM wants to emote surprised on a pack of baddies that can be done as well. All animations use the brilliant Sequencer module.</p>

<p>Full credit to Eskie (eskiemoh) who is the co-author of this module and the original creator of these animations! You can join their discord <a href="https://discord.gg/rCbY7jAZKh" target="_blank" rel="nofollow noopener">here</a> for many more excellent animations such as spell effects, movement, etc!</p>

<p>The module contains an api for play emotes. For example, you could do something like the following (restricted to GMs)</p>

```
let tokens = canvas.tokens.placeables.filter(token => token.document.hasStatusEffect("surprised"));

game.gambitsEmoteBar.playEmote({ emote: "surprised", tokens: tokens, duration: 5 });
```

[emoteBar.webm](https://github.com/user-attachments/assets/11021d1a-37b3-4ff9-92f0-7c03ca639a4a)
