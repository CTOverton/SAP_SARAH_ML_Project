var reds, blues, whites, empty, missing = 0;
var slotValues = [
    ["A","B","C"],
    ["D","E","F"],
    ["G","H","I"]
];

function updateUI() {
    var form = document.getElementById("sampleDataForm");
    var slot_00 = form.elements["slot_00"].value;
    var slot_01 = form.elements["slot_01"].value;
    var slot_02 = form.elements["slot_02"].value;

    var slot_10 = form.elements["slot_10"].value;
    var slot_11 = form.elements["slot_11"].value;
    var slot_12 = form.elements["slot_12"].value;

    var slot_20 = form.elements["slot_20"].value;
    var slot_21 = form.elements["slot_21"].value;
    var slot_22 = form.elements["slot_22"].value;

    slotValues = [
        [slot_00, slot_01, slot_02],
        [slot_10, slot_11, slot_12],
        [slot_20, slot_21, slot_22],
    ];

    var gridChildren = document.getElementById("grid-container").children;

    for (var i = 0; i < gridChildren.length; i++) {
        var rowChildren = gridChildren[i].children;
        for (var j = 0; j < rowChildren.length; j++) {
            updateSlot(rowChildren[j], slotValues[i][j]);
        }
    }
}

function updateSlot(slot, slotValue) {
    switch (slotValue.toLowerCase()){
        case "r":
            slot.innerHTML = "<p class=\"label\">R</p>";
            slot.className = "grid-cell red";
            break;
        case "w":
            slot.innerHTML = "<p class=\"label\">W</p>";
            slot.className = "grid-cell white";
            break;
        case "b":
            slot.innerHTML = "<p class=\"label\">B</p>";
            slot.className = "grid-cell blue";
            break;
        case "e":
            slot.innerHTML = "";
            slot.className = "grid-cell empty";
            break;
        default:
            slot.innerHTML = "";
            slot.className = "grid-cell missing";
    }
}