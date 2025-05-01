# Changelog

## [v2.1.4] - 2025-05-01
- Updated module.json to enable 5e V5 compatibility
- Fixed V13 compatability, forgot to set the new max versions in the foundry release api

## [v2.1.3] - 2025-05-01
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

