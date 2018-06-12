var reds, blues, whites, empty, missing = 0;
var slotValues = [
    ["A","B","C"],
    ["D","E","F"],
    ["G","H","I"]
];

function updateUI() {
    var form = document.getElementById("sampleDataForm");
    var slot_00 = form.elements["slot_00"].value;
    var slot_01 = form.elements["slot_02"].value;
    var slot_02 = form.elements["slot_01"].value;

    var slot_10 = form.elements["slot_10"].value;
    var slot_11 = form.elements["slot_12"].value;
    var slot_12 = form.elements["slot_11"].value;

    var slot_20 = form.elements["slot_20"].value;
    var slot_21 = form.elements["slot_22"].value;
    var slot_22 = form.elements["slot_21"].value;

    slotValues = [
        [slot_00, slot_01, slot_02],
        [slot_10, slot_11, slot_12],
        [slot_20, slot_21, slot_22],
    ];

    var gridChildren = document.getElementById("grid-container").children;

    for (var i = 0; i < gridChildren.length; i++) {
        var rowChildren = gridChildren[i].children;
        for (var j = 0; j < rowChildren.length; j++) {
            var txt = "";
            txt = slotValues[i][j];
            txt = "<p class=\"label\">" + txt + "</p>";
            rowChildren[j].innerHTML = txt;
        }

    }

}
