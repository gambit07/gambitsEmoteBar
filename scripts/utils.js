export async function setOffsets(token) {
    let leftEyeCrosshair = await Sequencer.Crosshair.show({
        t: "circle",
        distance: 0.15 * token.document.width,
        borderColor: "#FF0000",
        fillColor: "#FF0000",
        gridHighlight: false,
        snap: { position: 0 },
        label: { text: game.i18n.format("gambitsEmoteBar.selector.sequencer.leftEye") }
    });

    let rightEyeCrosshair = await Sequencer.Crosshair.show({
        t: "circle",
        distance: 0.15 * token.document.width,
        borderColor: "#FF0000",
        fillColor: "#FF0000",
        gridHighlight: false,
        snap: { position: 0 },
        label: { text: game.i18n.format("gambitsEmoteBar.selector.sequencer.rightEye") }
    });

    let mouthCrosshair = await Sequencer.Crosshair.show({
        t: "circle",
        distance: 0.2*token.document.width,
        borderColor: "#FF0000",
        fillColor: "FF0000",
        gridHighlight:false,
        snap:{position:0},
        label: { text: game.i18n.format("gambitsEmoteBar.selector.sequencer.mouth") }
    })

    let noseCrosshair = await Sequencer.Crosshair.show({
        t: "circle",
        distance: 0.2*token.document.width,
        borderColor: "#FF0000",
        fillColor: "FF0000",
        gridHighlight:false,
        snap:{position:0},
        label: { text: game.i18n.format("gambitsEmoteBar.selector.sequencer.nose") }
    })

    let leftEyeScale = leftEyeCrosshair.distance / token.document.width;
    let rightEyeScale = rightEyeCrosshair.distance / token.document.width;

    let leftEyeOffset = {
        x: (leftEyeCrosshair.x / canvas.grid.size) - (token.center.x / canvas.grid.size),
        y: (leftEyeCrosshair.y / canvas.grid.size) - (token.center.y / canvas.grid.size)
    };
    let rightEyeOffset = {
        x: (rightEyeCrosshair.x / canvas.grid.size) - (token.center.x / canvas.grid.size),
        y: (rightEyeCrosshair.y / canvas.grid.size) - (token.center.y / canvas.grid.size)
    };

    let mouthOffset = {
        x:(mouthCrosshair.x/canvas.grid.size) - (token.center.x/canvas.grid.size),
        y:(mouthCrosshair.y/canvas.grid.size) - (token.center.y/canvas.grid.size)
    };

    let noseOffset = {
        x:(noseCrosshair.x/canvas.grid.size) - (token.center.x/canvas.grid.size),
        y:(noseCrosshair.y/canvas.grid.size) - (token.center.y/canvas.grid.size)
    };

    await token.document.setFlag("gambitsEmoteBar", "offsets", {
        leftEyeOffset,
        rightEyeOffset,
        leftEyeScale,
        rightEyeScale,
        mouthOffset,
        noseOffset
    });

    return { leftEyeOffset, rightEyeOffset, leftEyeScale, rightEyeScale, mouthOffset, noseOffset };
}