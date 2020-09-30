// File: selectionHandling.js
// Contains functions for the selection feature

/*
    This is invoked when the selection area is drawn
    It selects all underlying items 
*/
function handleSelection(x1, y1, x2, y2) {
    selectionBox.updatePosition(x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2);
    selectionBox.updateSize(x2 - x1, y2 - y1);
    selectionBox.setTransform(transform);

    selectionStartPosX = selectionBox.x;
    selectionStartPosY = selectionBox.y;

    selectionLog = [];
    selWireIndizes = [];
    selDiodeIndizes = [];
    selGatesIndizes = [];
    selInputsIndizes = [];
    selOutputsIndizes = [];
    selLabelIndizes = [];
    selSegDisplayIndizes = [];
    selCustomIndizes = [];
    selConpointIndizes = [];

    for (let i = 0; i < wires.length; i++) {
        if (((wires[i].direction === 0) && ((wires[i].startX >= x1 || x1 <= wires[i].endX) &&
            (wires[i].startX <= x2 || x2 >= wires[i].endX)) && (wires[i].startY >= y1 && wires[i].endY <= y2)) ||
            ((wires[i].direction === 1) && ((wires[i].startY >= y1 || y1 <= wires[i].endY) &&
                (wires[i].startY <= y2 || y2 >= wires[i].endY)) && (wires[i].startX >= x1 && wires[i].endX <= x2))) {
            wires[i].marked = true;
            selWireIndizes.push(i);
        }
    }

    for (let i = 0; i < diodes.length; i++) {
        if (diodes[i].x >= x1 && diodes[i].x <= x2 && diodes[i].y >= y1 && diodes[i].y <= y2) {
            diodes[i].marked = true;
            selDiodeIndizes.push(i);
        }
    }

    for (let i = 0; i < gates.length; i++) {
        if (gates[i].x >= x1 && gates[i].x <= x2 && gates[i].y >= y1 && gates[i].y <= y2) {
            gates[i].marked = true;
            selGatesIndizes.push(i);
        }
    }

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].x >= x1 && inputs[i].x <= x2 && inputs[i].y >= y1 && inputs[i].y <= y2) {
            inputs[i].marked = true;
            selInputsIndizes.push(i);
        }
    }

    for (let i = 0; i < outputs.length; i++) {
        if (outputs[i].x >= x1 && outputs[i].x <= x2 && outputs[i].y >= y1 && outputs[i].y <= y2) {
            outputs[i].marked = true;
            selOutputsIndizes.push(i);
        }
    }

    for (let i = 0; i < labels.length; i++) {
        if (labels[i].x >= x1 && labels[i].x <= x2 && labels[i].y >= y1 && labels[i].y <= y2) {
            labels[i].marked = true;
            selLabelIndizes.push(i);
        }
    }

    for (let i = 0; i < segDisplays.length; i++) {
        if (segDisplays[i].x >= x1 && segDisplays[i].x <= x2 && segDisplays[i].y >= y1 && segDisplays[i].y <= y2) {
            segDisplays[i].marked = true;
            selSegDisplayIndizes.push(i);
        }
    }

    for (let i = 0; i < customs.length; i++) {
        if (customs[i].visible && (customs[i].x >= x1 && customs[i].x <= x2 && customs[i].y >= y1 && customs[i].y <= y2)) {
            customs[i].marked = true;
            selCustomIndizes.push(i);
        }
    }

    for (let i = 0; i < conpoints.length; i++) {
        if (conpoints[i].x >= x1 && conpoints[i].x <= x2 && conpoints[i].y >= y1 && conpoints[i].y <= y2) {
            conpoints[i].marked = true;
            selConpointIndizes.push(i);
        }
    }

    document.getElementById('select-tools').style.display = 'block';
    document.getElementById('copy-select-button').disabled = true; // for now
    document.getElementById('delete-select-button').disabled = true;
    positionSelectionTools();
}

/*
    Moves the selected items by dx, dy
*/
function moveSelection(dx, dy) {
    selectionBox.updatePosition(selectionBox.x + dx, selectionBox.y + dy);
    positionSelectionTools();

    for (let i = 0; i < selWireIndizes.length; i++) {
        wires[selWireIndizes[i]].alterPosition(dx, dy);
    }

    for (let i = 0; i < selDiodeIndizes.length; i++) {
        diodes[selDiodeIndizes[i]].alterPosition(dx, dy);
    }

    for (let i = 0; i < selGatesIndizes.length; i++) {
        gates[selGatesIndizes[i]].alterPosition(dx, dy);
    }

    for (let i = 0; i < selInputsIndizes.length; i++) {
        inputs[selInputsIndizes[i]].alterPosition(dx, dy);
    }

    for (let i = 0; i < selOutputsIndizes.length; i++) {
        outputs[selOutputsIndizes[i]].alterPosition(dx, dy);
    }

    for (let i = 0; i < selLabelIndizes.length; i++) {
        labels[selLabelIndizes[i]].alterPosition(dx, dy);
    }

    for (let i = 0; i < selSegDisplayIndizes.length; i++) {
        segDisplays[selSegDisplayIndizes[i]].alterPosition(dx, dy);
    }

    for (let i = 0; i < selCustomIndizes.length; i++) {
        customs[selCustomIndizes[i]].alterPosition(dx, dy);
    }

    for (let i = 0; i < selConpointIndizes.length; i++) {
        conpoints[selConpointIndizes[i]].alterPosition(dx, dy);
    }
}

/*
    Recalculates all wire segments and redoes the connection points
*/
function finishSelection() {
    let selectionOffsetX = selectionBox.x - selectionStartPosX;
    let selectionOffsetY = selectionBox.y - selectionStartPosY;

    document.getElementById('select-tools').style.display = 'none';

    for (let i = 0; i < selWireIndizes.length; i++) {
        selectionLog.push(['mWire', selWireIndizes[i]]);
    }

    integrateWires();

    let conpointsBefore = _.cloneDeep(conpoints);

    for (let i = 0; i < selConpointIndizes.length; i++) {
        conpointsBefore[selConpointIndizes[i]].alterPosition(-selectionOffsetX, -selectionOffsetY);
        conpointsBefore[selConpointIndizes[i]].marked = false;
        conpoints[selConpointIndizes[i]].marked = false;
    }

    let diodesBefore = _.cloneDeep(diodes);
    for (let i = 0; i < selDiodeIndizes.length; i++) {
        diodesBefore[selDiodeIndizes[i]].alterPosition(-selectionOffsetX, -selectionOffsetY);
        diodesBefore[selDiodeIndizes[i]].marked = false;
        diodes[selDiodeIndizes[i]].marked = false;
    }

    doConpoints();

    let conpointsAfter = _.cloneDeep(conpoints);
    let diodesAfter = _.cloneDeep(diodes);
    pushUndoAction('moveSel', [selectionOffsetX, selectionOffsetY, selGatesIndizes, selInputsIndizes, selOutputsIndizes, selLabelIndizes, selSegDisplayIndizes, selCustomIndizes, selConpointIndizes],
        [_.cloneDeep(selectionLog), conpointsBefore, conpointsAfter, diodesBefore, diodesAfter]);
    if (selectionOffsetX === 0 && selectionOffsetY === 0) {
        undo();
    }
}

function integrateWires() {
    // These are set true when a preview wire in that direction is 100% part of the existing wire
    let overlapOverAllX = false;
    let overlapOverAllY = false;

    let xIndex = -1;
    let yIndex = -1;

    let deletedIndices = [];

    let wiresToAdd = [];
    let wiresToAddIndizes = [];

    for (let i = selWireIndizes.length - 1; i >= 0; i--) {
        wires[selWireIndizes[i]].marked = false; // Unmark all marked wires
        wiresToAdd = wiresToAdd.concat(wires.splice(selWireIndizes[i], 1));
        wiresToAddIndizes.push(selWireIndizes[i]);
    }

    for (let j = 0; j < wiresToAdd.length; j++) {
        xIndex = -1;
        yIndex = -1;
        deletedIndices = [];
        overlapOverAllX = false;
        overlapOverAllY = false;
        if (wiresToAdd[j].direction === 0) {
            for (let i = 0; i < wires.length; i++) {
                let overlap = wireOverlap(wiresToAdd[j], wires[i]);
                if ((overlap[0] !== overlap[2] || overlap[1] !== overlap[3]) || (wires[i].direction === 0 && wiresToAdd[j].startY === wires[i].startY &&
                    (wiresToAdd[j].startX == wires[i].endX || wiresToAdd[j].startX == wires[i].startX || wiresToAdd[j].endX == wires[i].startX || wiresToAdd[j].endX == wires[i].endX))) { //jshint ignore:line
                    if (xIndex >= 0) {
                        let newWire = new Wire(0, Math.min(wires[xIndex].startX, wires[i].startX), wires[xIndex].startY, false, transform);
                        newWire.endX = Math.max(wires[xIndex].endX, wires[i].endX);
                        newWire.endY = wires[xIndex].startY;
                        if (newWire.startX !== wires[i].startX || newWire.endX !== wires[i].endX) {
                            selectionLog.push(['rWire', xIndex, wires[xIndex], newWire, wiresToAdd[j], wiresToAddIndizes[j]]);
                            wires.splice(xIndex, 1, newWire);
                            deletedIndices.push(i);
                        } else {
                            overlapOverAllX = true;
                            selectionLog.push(['rWire', xIndex, wires[xIndex], newWire, wiresToAdd[j], wiresToAddIndizes[j]]);
                        }
                    } else {
                        let newWire = new Wire(0, Math.min(wiresToAdd[j].startX, wires[i].startX), wiresToAdd[j].startY, false, transform);
                        newWire.endX = Math.max(wiresToAdd[j].endX, wires[i].endX);
                        newWire.endY = wiresToAdd[j].startY;
                        if (newWire.startX !== wires[i].startX || newWire.endX !== wires[i].endX) {
                            selectionLog.push(['rWire', i, wires[i], newWire, wiresToAdd[j], wiresToAddIndizes[j]]);
                            wires.splice(i, 1, newWire);
                            xIndex = i;
                        } else {
                            overlapOverAllX = true;
                            selectionLog.push(['rWire', i, wires[i], newWire, wiresToAdd[j], wiresToAddIndizes[j]]);
                        }
                    }
                }
            }
            if (xIndex < 0 && !overlapOverAllX) {
                let newWire = new Wire(0, wiresToAdd[j].startX, wiresToAdd[j].startY, false, transform);
                newWire.endX = wiresToAdd[j].endX;
                newWire.endY = wiresToAdd[j].startY;
                selectionLog.push(['aWire', wires.length, newWire, wiresToAddIndizes[j]]);
                wires.push(newWire);
            }
        } else {
            for (let i = 0; i < wires.length; i++) {
                let overlap = wireOverlap(wiresToAdd[j], wires[i]);
                // If there's an overlap or the wires are adjacent
                if ((overlap[0] !== overlap[2] || overlap[1] !== overlap[3]) || (wires[i].direction === 1 && wiresToAdd[j].startX === wires[i].startX &&
                    (wiresToAdd[j].startY == wires[i].endY || wiresToAdd[j].startY == wires[i].startY || wiresToAdd[j].endY == wires[i].startY || wiresToAdd[j].endY == wires[i].endY))) { //jshint ignore:line
                    if (yIndex >= 0) {
                        let newWire = new Wire(1, wires[yIndex].startX, Math.min(wires[yIndex].startY, wires[i].startY), false, transform);
                        newWire.endX = wires[yIndex].startX;
                        newWire.endY = Math.max(wires[yIndex].endY, wires[i].endY);
                        if (newWire.startY !== wires[i].startY || newWire.endY !== wires[i].endY) {
                            selectionLog.push(['rWire', yIndex, wires[yIndex], newWire, wiresToAdd[j], wiresToAddIndizes[j]]);
                            wires.splice(yIndex, 1, newWire);
                            deletedIndices.push(i);
                        } else {
                            overlapOverAllY = true;
                            selectionLog.push(['rWire', yIndex, wires[yIndex], newWire, wiresToAdd[j], wiresToAddIndizes[j]]);
                        }
                    } else {
                        let newWire = new Wire(1, wiresToAdd[j].startX, Math.min(wiresToAdd[j].startY, wires[i].startY), false, transform);
                        newWire.endX = wiresToAdd[j].startX;
                        newWire.endY = Math.max(wiresToAdd[j].endY, wires[i].endY);
                        if (newWire.startY !== wires[i].startY || newWire.endY !== wires[i].endY) {
                            selectionLog.push(['rWire', i, wires[i], newWire, wiresToAdd[j], wiresToAddIndizes[j]]);
                            wires.splice(i, 1, newWire);
                            yIndex = i;
                        } else {
                            overlapOverAllY = true;
                            selectionLog.push(['rWire', i, wires[i], newWire, wiresToAdd[j], wiresToAddIndizes[j]]);
                        }
                    }
                }
            }

            if (yIndex < 0 && !overlapOverAllY) {
                let newWire = new Wire(1, wiresToAdd[j].startX, wiresToAdd[j].startY, false, transform);
                newWire.endX = wiresToAdd[j].startX;
                newWire.endY = wiresToAdd[j].endY;
                selectionLog.push(['aWire', wires.length, newWire, wiresToAddIndizes[j]]);
                wires.push(newWire);
            }
        }

        for (let i = deletedIndices.length - 1; i >= 0; i--) {
            selectionLog.push(['dWire', deletedIndices[i], wires.splice(deletedIndices[i], 1)[0]]);
        }
    }
}

function positionSelectionTools() {
    document.getElementById('select-tools').style.left = ((selectionBox.x + selectionBox.w / 2 + transform.dx + 2) * transform.zoom) + 240 - 200 + 'px';
    document.getElementById('select-tools').style.top = ((selectionBox.y + transform.dy - selectionBox.h / 2 - 1) * transform.zoom) - 50 + 'px';
}