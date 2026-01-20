# Changelog

## [v3.0.1] - 2026-01-20
- Bugfixes:
  - Resolved error when deleting a token due to some writes being attempted

## [v3.0.0] - 2026-01-13
Massive structural overhaul for Emote Bar! I'd wanted to come back to Emote Bar at some point, and Eskie(moh) recently released his own animation modules and was kind enough to send me new and updated emotes! So I've taken that opportunity to do a big re-work of Emote Bar. Enjoy!
- Additions:
  - Added integration with Eskie's Eskie Effects and Eskie Effects Free modules. Most emotes have had a re-design when using Eskie's modules. The original implementations are still in place and will be used as a backup if neither module is present.
  - New emotes exclusive to Eskie's Effects have been added, you will only see these with the Eskie Effects module active: Thank You, Wink, Smug, Huh?, Confused, and Whistle
  - New main menu toggle slider for Persistent/Timed emotes. Persistent emotes continually play. Timed emotes can be set to a specific duration, when reached the effect will disable itself.
  - Added a new Preset selection dropdown when builing your own custom emotes. This will fill in the macro editor with the code used for a number of the built-in emote effects which you can use as examples or tweak to get the exact emote you want.
  - Added a new title bar dropdown option to the main Emote Bar app to allow resetting Emote sort order to A-Z.
- Updates:
  - Overhauled the codebase, all windows are now written in applicationV2 instead of dialogV2
  - Updated window designs in tandem, the main emote bar now has larger icons and better use of available space
  - Updated emotes with new designs from Eskie Effects, you will only see the updated effects if you have the Eskie Effects or Eskie Effects Free modules active: Angry, Confused, Cry, Disgust, Drunk, Giggle, Laugh, Love, Nervous, ROFL, Shout, Smoking, Soul, and Surprised
  - Updated the Thunder Hype emote to only be visible when JB2A Patreon is active, the emotes effects would not work if you did not have that module in the past.
  - Updated GM's End All Emotes functionality. When no tokens are selected, the old functionality to clear all emotes occurs. When 1 or more tokens are selected, only those specific tokens emotes are cleared
  - Updated Configure Default Emote Sounds to include custom emotes. Using any of the Presets menu options you will see 'applyEmoteSound(seq, emoteId);', this is what pulls the sound from Emote Sounds config menu.
  - Updated the custom emote macro editor textarea to use foundry's codemirror element to allow more streamlined editing
  - Updated active emotes highlighting in the menu bar. If no tokens are selected, all emotes active on the scene will be highlighted. If one or more tokens are selected, only active emotes for those tokens will be highlighted.
  - Added handling for offsets captured for a mirrored vs non-mirrored token
- Bugfixes:
  - (Hopefully) resolved any issues where Emotes would get stuck on and had to be ended through Sequencer's 'Show Sequencer Manager' window
  - Resolved a few visual issues for existing Emotes, most notably the Nervous emote not respecting token scaling
  - Resolved issues where on the first play of an emote the animation could appear to double up with a slight overlap
  - Did a full pass on horizontally mirrored tokens to make sure effects flip appropriately

## [v2.1.10] - 2025-07-16
- Removed a few unnecessary console logs that were spammy
- Added handling if a token is deleted while they have an active emote applied. Any active emotes will now be removed from a token if it is deleted.

## [v2.1.9] - 2025-06-24
- Fixed a couple hooks firing for non-gm users.
- Updated module.json to 13.345 verified

## [v2.1.8] - 2025-06-24
- Fixed a couple hooks firing for non-gm users.

## [v2.1.8] - 2025-06-24
- Fixed a couple hooks firing for non-gm users

## [v2.1.7] - 2025-05-09
- Fixed missing functionality causing the copy-able .name value of a custom emote to be empty when editing a custom emote that was already saved

## [v2.1.6] - 2025-05-03
- Fixed a bug that would cause the hpPercentage trigger to not work in certain (most) worlds.
- Fixed a small display bug in HP Percentage causing two colon's before the percentage is displayed
- Added in pt-br translations - Thanks Kharmans!

## [v2.1.5] - 2025-05-02
- Added Emote Bloodied
- Added Emote Suspicious
- Added new Trigger hpPercentage. This trigger can be setup with a custom percentage range to trigger an emote when a given tokens HP goes below the threshold. When the tokens HP goes back above the threshold, the emote is removed.
- Cleaned up some errant system files left in module.zip after the last update

## [v2.1.4] - 2025-05-01
- Updated module.json to enable 5e V5 compatibility
- Fixed V13 compatability, forgot to set the new max versions in the foundry release api

## [2.1.1] - 2025-04-21

Small bugfix for version finder syntax

## [2.1.0] - 2025-04-21

Initial release for Emote Triggers: You will now have the ability to add triggers for emotes! These triggers include Combat Start/End, Round Start, Turn Start, Combatant added to combat, Long Rest, and Short Rest. You can access the trigger list by right clicking an emote in the emote bar, or in a Register Custom Emote dialog.

## [2.0.1] - 2025-04-06

Added some missing localization keys and bumped version max to 13.

## [2.0.0] - 2025-04-05

HUGE update, marking as version 2.0.
- V13 Compatability (Still will need to wait on Sequencer's update to V13 to test)
- Emotes can now be re-ordered via drag and drop.
- New menu for hiding emotes, any emote can now be hidden on a per user basis.
- You now have the ability to register and add your own custom emotes! Custom macro creation functionality is limited to GMs, but players will have access to play all custom emotes. These emotes will be displayed in a list where you can edit or remove them as you wish. In the macro text editor, you have access to the token object as token. All custom emotes are also registered in the api and can be accessed there.

## [1.0.9] - 2025-03-07

And one more bugfix for slap

## [1.0.8] - 2025-03-07

Few additional bugfixes for the Love emote

## [1.0.7] - 2025-03-07

Couple small bugfixes for 1.0.7 BUT, one big note I forgot. This release contains a crosshair icon at the bottom of the emote list. This crosshair can be used to assign a location for a left eye, right eye, mouth, and nose which are used to specify locations for emotes that need them to give additional customization for placements

## [1.0.6] - 2025-03-07

TONS of updates not all listed here
- Additions: A bunch of new emotes! Ill let everyone discover them for themselves, but huge shoutout to eskiemoh as always for the original animations. Make sure to visit their discord for tons of other animations!
- Updates: Added in localization support (Thanks ChasarooniZ).
- Bugfixes: Updated the Drunk, Laughing, and Slap emotes to respect token scale. Updated all animations to use attachTo in place of atLocation to properly interact with scaleToObject (Thanks eskie). Added small delay to emote button presses to prevent sequencers endEffect not having time to remove an effect if all of its effect have not been generated yet. Completely revamped ending effects, should be much more efficient with large groups of tokens. Bunch of other stuff.

## [1.0.5] - 2025-03-06

- Updates: Added a keybind option to toggle the dialog open and closed, default is ctrl + e. Added data tooltip instead of title for better integration and visibility of button mouseover text. Added button highlighting to indicate when a button is in use. In addition, made the default selection only allow one emote at a time. A user can still hold the shift key and select additional emotes if desired. Added a title bar animation for a little spice
- Bugfixes: Reworked a bunch of the dialog functionality to clean up the implementation. Still need to re-visit emote start stop events to make them more efficient when multiple tokens are selected

## [1.0.4] - 2025-03-05

- Bugs: Fix a flag potentially remaining set if a world is closed with the dialog window open

## [1.0.3] - 2025-03-05

- Bugs: Fix not checking if animated-spell-effects active for the slap emote

## [1.0.25] - 2025-03-25

Updates: Update api to not try and close non-permanent emotes slap and thunderHype

## [1.0.24] - 2025-03-25

Updates: Reduced the width of the dialog, goal is to have this as a bar so as not to take up too much space. Slightly increased the height of the dialog to allow no scrolling. Any additional emotes that get added will cause scrolling to begin. Adjusted button sizing and spacing slightly. Fixed an error on startup.

## [1.0.23] - 2025-03-25

Updates: Added two new emotes! Dialog slightly re-worked to allow scrolling for emotes while fixing the general buttons on the bottom in place.

## [1.0.22] - 2025-03-23

Updates: Added better compatability with dynamic token rings. Slight positioning updates to a few emotes. Upscaled all images so they look a bit cleaner at high zoom.

## [1.0.21] - 2025-03-20

Updates: Added support for Carolingian UI, dependent on the theme you have enabled the emote dialog color scheme will change. Updated css class names to make sure they're not interfering with anything else.

## [1.0.20] - 2025-03-14

Bugfixes: Fix the love emote not being applied correctly via api.

## [1.0.2] - 2025-03-05

- Bugs: Was referencing a bunch of gambits-premades flags I forgot to update, oopsies!

## [1.0.19] - 2025-03-14

Bugfixes: Fix the love emote not being applied correctly via api.

## [1.0.18] - 2025-03-14

Features: Added a Clear All Emotes button. This button will remove any emotes for tokens that you have applied emotes to. Added an api, accessible via game.gambitsEmoteBar.playEmote. This api is only usable by a GM and can be passed an emote name, array of token objects, and a duration in seconds.
Bugfixes: Modified button highlighting functionality to keep the relevant emote button highlighted if any token has that emote assigned. This also allows highlighting to survive a world reload.

## [1.0.17] - 2025-03-11

A few updates to the nervous animation to revert the sweat color to blue and give the token a subtle shaking effect

## [1.0.16] - 2025-03-10

Few small bug fixes

## [1.0.15] - 2025-03-10

Updates: If no permissions given for user selected sounds, the sound picker button is now removed and the set offsets button is expanded to cover both columns for non-gm users

## [1.0.14] - 2025-03-09

Additions: Added a new setting to provide a default path for audio files.
Bugfixes: Fixed sound file paths getting erased if the Cancel button was used.

## [1.0.13] - 2025-03-09

Additions: Added a new setting to provide a default path for audio files.
Bugfixes: Fixed sound file paths getting erased if the Cancel button was used.

## [1.0.12] - 2025-03-09

Additions: Added a configurable sound selector tool per emote. There are two settings in the module now. One is to fully enable/disable sounds, default enabled. The second is to allow per user configuration of sounds, default disabled.
Bugfixes: Fixed a number of emotes not properly rotating the effect if the token started in a non-centered position. Fixed up the dialog icons for better centering of the FA icons and added the Sound Configuration button next to the existing Configure Offsets button.

## [1.0.11] - 2025-03-09

Bugfixes: Fix cry, disgusted, and drunk emotes not rotating with token correctly. Fix nervous emote not working correctly with a mirrored token and changed the color to make it look less like tears. Fix smoking and cry emotes to correctly mirror when token is mirrored. Add support for dynamic token ring images.

## [1.0.10] - 2025-03-09

Bugfixes: Fix cry, disgusted, and drunk emotes not rotating with token correctly. Fix nervous emote not working correctly with a mirrored token and changed the color to make it look less like tears. Fix smoking and cry emotes to correctly mirror when token is mirrored. Add support for dynamic token ring images.

## [1.0.1] - 2025-03-05

- Initial Release

## [1.0.0] - 2025-03-05

- Initial Release

