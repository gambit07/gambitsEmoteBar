<h1 style="text-align: center;">Gambit's Emote Bar</h1>
<p style="text-align: center;"><i>Bring your tokens to life with dynamic emote animations at your fingertips. You can choose from built-in emotes, craft your own, or set up automated triggers to add theatrical flair to every session. Elevate your storytelling with expressive emotes, right in the Foundry VTT Token Controls menu!</i></p>
<p style="text-align: center;"><img src="https://img.shields.io/github/v/release/gambit07/gambitsEmoteBar?style=for-the-badge" alt="GitHub release" /> <img src="https://img.shields.io/github/downloads/gambit07/gambitsEmoteBar/total?style=for-the-badge" alt="GitHub all releases" /> <a href="https://discord.gg/BA7SQKqMpa" target="_blank" rel="nofollow noopener"><img src="https://dcbadge.limes.pink/api/server/BA7SQKqMpa" alt="Discord" /></a></p>
<h2 style="text-align: center;">Supporting The Module</h2>
<p style="text-align: center;"><a href="https://ko-fi.com/gambit07" target="_blank" rel="nofollow noopener"><img src="https://ko-fi.com/img/githubbutton_sm.svg" alt="ko-fi" /></a> <a href="https://www.patreon.com/GambitsLounge" target="_blank" rel="nofollow noopener"> <img src="https://img.shields.io/badge/Patreon-Gambits Lounge-F96854?style=for-the-badge&amp;logo=patreon" alt="Patreon Gambits Lounge" /> </a></p>
<p>This module adds emotes accessible via the Token Controls bar that players/gms can use whenever they want to have some fun! An emote can be applied to multiple tokens at once as long as they are owned, so if the GM wants to emote surprised on a pack of baddies that can be done as well. All animations use the brilliant Sequencer module.</p>
<p>&nbsp;</p>
<p>Full credit to Eskie (eskiemoh) who is the co-author of this module and the original creator of these animations! You can join their discord <a href="https://discord.gg/rCbY7jAZKh" target="_blank" rel="nofollow noopener">here</a> for many more excellent animations such as spell effects, movement, etc!</p>
<ul>
<li>Create your own custom macros controllable through the bar (alongside the default emotes)</li>
<li>Add specific triggers for any emotes (ex. trigger On Long Rest, On Combat Start, On HP % Threshold, etc)</li>
<li>API for playing any emote, which you can use if the trigger system doesn't have what you're looking for</li>
<li>Add custom sounds to your emotes, with optional functionality to allow players to customize those as well</li>
<li>Hide/Unhide functionality for all emotes per player</li>
<li>Configure Offsets allowing each user to input specific locations on a token that certain emotes will use when necessary (ex. eye location)</li>
</ul>
<hr/>
<p>The module contains an api for playing emotes. For example, you could do something like the following (restricted to GMs)</p>

```
let tokens = canvas.tokens.placeables.filter(token => token.document.hasStatusEffect("surprised"));

game.gambitsEmoteBar.playEmote({ emote: "Surprised", tokens: tokens, duration: 5 });
```

<p>You have the ability to register and add your own custom emotes! Custom macro creation functionality is restricted to GMs, but players will have access to play all custom emotes. These emotes will be displayed in a list where you can edit or remove them as you wish. In the macro text editor, you have access to the token object as token. All custom emotes are also registered in the api and can be accessed there. Example video below:</p>
<hr/>

[CustomEmoteGuide.webm](https://github.com/user-attachments/assets/a35f6bf4-f13f-41fb-b333-0fb27330668f)

[emoteBar.webm](https://github.com/user-attachments/assets/11021d1a-37b3-4ff9-92f0-7c03ca639a4a)
