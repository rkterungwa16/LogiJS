// File: selectionHandling.js
// Contains functions for the selection feature

/*
    This is invoked when the selection area is drawn
    It selects all underlying items 
*/
function handleSelection(x1, y1, x2, y2) {
    sClickBox.updatePosition(x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2);
    sClickBox.updateSize(x2 - x1, y2 - y1);
    sClickBox.setTransform(transform);
    showSClickBox = true;
    selection = [];
    segIndizees = [];
    wireIndices = [];
    for (let i = 0; i < gates.length; i++) {
        if (gates[i].x >= x1 && gates[i].x <= x2 && gates[i].y >= y1 && gates[i].y <= y2) {
            gates[i].marked = true;
            selection.push(gates[i]);
        }
    }
    for (let i = 0; i < customs.length; i++) {
        if (customs[i].visible && (customs[i].x >= x1 && customs[i].x <= x2 && customs[i].y >= y1 && customs[i].y <= y2)) {
            customs[i].marked = true;
            selection.push(customs[i]);
        }
    }
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].x >= x1 && inputs[i].x <= x2 && inputs[i].y >= y1 && inputs[i].y <= y2) {
            inputs[i].marked = true;
            selection.push(inputs[i]);
        }
    }
    for (let i = 0; i < outputs.length; i++) {
        if (outputs[i].x >= x1 && outputs[i].x <= x2 && outputs[i].y >= y1 && outputs[i].y <= y2) {
            outputs[i].marked = true;
            selection.push(outputs[i]);
        }
    }
    for (let i = 0; i < conpoints.length; i++) {
        if (conpoints[i].x >= x1 && conpoints[i].x <= x2 && conpoints[i].y >= y1 && conpoints[i].y <= y2) {
            conpoints[i].marked = true;
            selection.push(conpoints[i]);
        }
    }
    for (let i = 0; i < diodes.length; i++) {
        if (diodes[i].x >= x1 && diodes[i].x <= x2 && diodes[i].y >= y1 && diodes[i].y <= y2) {
            diodes[i].marked = true;
            selection.push(diodes[i]);
        }
    }
    for (let i = 0; i < labels.length; i++) {
        if (labels[i].x >= x1 && labels[i].x <= x2 && labels[i].y >= y1 && labels[i].y <= y2) {
            labels[i].marked = true;
            selection.push(labels[i]);
        }
    }
    for (let i = 0; i < segDisplays.length; i++) {
        if (segDisplays[i].x >= x1 && segDisplays[i].x <= x2 && segDisplays[i].y >= y1 && segDisplays[i].y <= y2) {
            segDisplays[i].marked = true;
            selection.push(segDisplays[i]);
        }
    }
    let wireSelection = [];
    for (let i = 0; i < wires.length; i++) {
        if ((wires[i].direction === 0) && ((wires[i].startX >= x1 || x1 <= wires[i].endX) && (wires[i].startX <= x2 || x2 >= wires[i].endX)) && (wires[i].startY >= y1 && wires[i].endY <= y2)) {
            wires[i].marked = true;
            wireSelection.push(wires[i]);
            //wireIndices.push(i);
        } else if ((wires[i].direction === 1) && ((wires[i].startY >= y1 || y1 <= wires[i].endY) && (wires[i].startY <= y2 || y2 >= wires[i].endY)) && (wires[i].startX >= x1 && wires[i].endX <= x2)) {
            wires[i].marked = true;
            wireSelection.push(wires[i]);
            //wireIndices.push(i);
        }
    }
    //wireIndices.reverse();
    //console.log('Selection:');
    //console.log(wireSelection);
    /*let segsInWires = [];
    for (let i = wireSelection.length - 1; i >= 0; i--) {
        if (wireSelection[i].startX === wireSelection[i].endX) {
            // Vertical wire, split in n vertical segments | Assuming startY < endY, can always be saved in that form
            for (let j = 0; j < (wireSelection[i].endY - wireSelection[i].startY) / GRIDSIZE; j++) {
                segsInWires.push(new WSeg(1, wireSelection[i].startX, wireSelection[i].startY + j * GRIDSIZE,
                    false, transform));
            }
        } else if (wireSelection[i].startY === wireSelection[i].endY) {
            // Horizontal wire, split in n horizontal segments | Assuming startX < endX, can always be saved in that form
            for (let j = 0; j < (wireSelection[i].endX - wireSelection[i].startX) / GRIDSIZE; j++) {
                segsInWires.push(new WSeg(0, wireSelection[i].startX + j * GRIDSIZE, wireSelection[i].startY,
                    false, transform));
            }
        }
    }*/
    /*let segSelection = [];
    for (let i = 0; i < segments.length; i++) {
        // This is genius
        if (segsInWires.findIndex(function (a) { // jshint ignore:line
            return ((a.startX === segments[i].startX) && (a.endX === segments[i].endX) && (a.startY === segments[i].startY) && (a.endY === segments[i].endY));
        }) >= 0) {
            segSelection.push(segments[i]);
            segIndizees.push(i);
        }
    }
    segIndizees.reverse();*/
    let preLength = selection.length;
    selection = selection.concat(wireSelection);
    //selection = selection.concat(wireIndices);
    //selection = selection.concat(segSelection);
    selection.push(preLength);
    selection.push(wireSelection.length);
}

function compWires(a, b, dx = 0, dy = 0) {
    return ((a.startX === (b.startX + dx)) && (a.endX === (b.endX + dx)) && (a.startY === (b.startY + dy)) && (a.endY === (b.endY + dy)));
}

/*
    Moves the selected items by dx, dy
*/
function moveSelection(dx, dy) {
    sClickBox.updatePosition(sClickBox.x + dx, sClickBox.y + dy);
    let wireCount = selection[selection.length - 1];
    let preLength = selection[selection.length - 2];
    for (let i = 0; i < preLength; i++) {
        selection[i].alterPosition(dx, dy);
    }
    for (let i = preLength; i < preLength + wireCount; i++) {
        for (let j = 0; j < wires.length; j++) {
            if (wires[j].id === selection[i].id) {
                wires[j].alterPosition(dx, dy);
            }
        }
    }
}

/*
    Recalculates all wire segments and redoes the connection points
*/
function finishSelection() {
    segments = [];
    for (let i = 0; i < wires.length; i++) {
        if (wires[i].startX === wires[i].endX) {
            // Vertical wire, split in n vertical segments
            for (let j = 0; j < (wires[i].endY - wires[i].startY) / GRIDSIZE; j++) {
                segments.push(new WSeg(1, wires[i].startX, (wires[i].startY + j * GRIDSIZE), false, transform));
            }
        } else if (wires[i].startY === wires[i].endY) {
            // Horizontal wire, split in n horizontal segments
            for (let j = 0; j < (wires[i].endX - wires[i].startX) / GRIDSIZE; j++) {
                segments.push(new WSeg(0, wires[i].startX + j * GRIDSIZE, wires[i].startY, false, transform));
            }
        }
    }
    doConpoints();
}