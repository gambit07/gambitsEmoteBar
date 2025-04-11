<p><b>To support my continued work on this module! Join my Patreon at https://www.patreon.com/GambitsLounge or donate on Kofi at https://ko-fi.com/gambit07</b></p>
<p><b>Join my Discord! If you have any questions, feature requests, or just generally want to chat feel free to join Gambit's Lounge: https://discord.gg/BA7SQKqMpa</b></p>
<p>A small module adding some basic emotes accessible via the Token Controls bar that players can use whenever they want to have some fun! An emote can be applied to multiple tokens at once as long as they are owned, so if the GM wants to emote surprised on a pack of baddies that can be done as well. Emotes can be re-ordered via drag and drop per user in the menu, and any emote can be hidden or revealed on a per-user basis as well. All animations use the brilliant Sequencer module.</p>

<p>Full credit to Eskie (eskiemoh) who is the co-author of this module and the original creator of these animations! You can join their discord <a href="https://discord.gg/rCbY7jAZKh" target="_blank" rel="nofollow noopener">here</a> for many more excellent animations such as spell effects, movement, etc!</p>
<hr/>
<p>The module contains an api for playing emotes. For example, you could do something like the following (restricted to GMs)</p>

```
let tokens = canvas.tokens.placeables.filter(token => token.document.hasStatusEffect("surprised"));

game.gambitsEmoteBar.playEmote({ emote: "surprised", tokens: tokens, duration: 5 });
```

<p>You have the ability to register and add your own custom emotes! Custom macro creation functionality is restricted to GMs, but players will have access to play all custom emotes. These emotes will be displayed in a list where you can edit or remove them as you wish. In the macro text editor, you have access to the token object as token. All custom emotes are also registered in the api and can be accessed there. Example video below:</p>
<hr/>

[CustomEmoteGuide.webm](https://github.com/user-attachments/assets/a35f6bf4-f13f-41fb-b333-0fb27330668f)

[emoteBar.webm](https://github.com/user-attachments/assets/11021d1a-37b3-4ff9-92f0-7c03ca639a4a)
