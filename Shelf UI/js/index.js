var reds, whites, blues, emptys, missings = 0;
var slotValues = [
    ["R","W","B"],
    ["R","E","W"],
    ["W","B","M"]
];
window.onload = function(){
    randomizeData();
    updateTotals();
    updateSlot();
};

function randomizeData() {
    var letters = ["R","W","B","E","M"];

    for (var i = 0; i < slotValues.length; i++) {
        for (var j = 0; j < slotValues.length; j++) {
            slotValues[i][j] = letters[Math.floor(Math.random() * letters.length)];
        }
    }
    updateUI();
}

function updateSampleData() {
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

    updateUI();
}

function updateUI() {
    updateSlot();
    updateTotals();
}

function updateTotals() {
    reds = whites = blues = emptys = missings = 0;

    for (var i = 0; i < slotValues.length; i++) { // Loop for rows
        for (var j = 0; j < slotValues[i].length; j++) { // Loop for cols
            switch (slotValues[i][j].toLowerCase()){
                case "r":
                    reds += 1;
                    break;
                case "w":
                    whites += 1;
                    break;
                case "b":
                    blues += 1;
                    break;
                case "e":
                    emptys += 1;
                    break;
                default:
                    missings += 1;
            }
        }
    }

    var totals = [reds, whites, blues, emptys, missings];
    var max = 0;

    for (var x = 0; x < totals.length; x++){
        if (max < totals[x]){max = totals[x];}
    }


    document.getElementsByClassName("totals-bar red")[0].style.width = ((reds/max)*100) + "%";
    document.getElementsByClassName("totals-bar red")[0].innerHTML = "<p>" + reds + "</p>";

    document.getElementsByClassName("totals-bar white")[0].style.width = ((whites/max)*100) + "%";
    document.getElementsByClassName("totals-bar white")[0].innerHTML = "<p>" + whites + "</p>";

    document.getElementsByClassName("totals-bar blue")[0].style.width = ((blues/max)*100) + "%";
    document.getElementsByClassName("totals-bar blue")[0].innerHTML = "<p>" + blues + "</p>";

    document.getElementsByClassName("totals-bar empty")[0].style.width = ((emptys/max)*100) + "%";
    document.getElementsByClassName("totals-bar empty")[0].innerHTML = "<p>" + emptys + "</p>";

    document.getElementsByClassName("totals-bar missing")[0].style.width = ((missings/max)*100) + "%";
    document.getElementsByClassName("totals-bar missing")[0].innerHTML = "<p>" + missings + "</p>";
}

function updateSlot() {

    var gridChildren = document.getElementById("grid-container").children;

    for (var i = 0; i < gridChildren.length; i++) {
        var rowChildren = gridChildren[i].children;
        for (var j = 0; j < rowChildren.length; j++) {
            slot = rowChildren[j];
            slotValue = slotValues[i][j];

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
    }
}