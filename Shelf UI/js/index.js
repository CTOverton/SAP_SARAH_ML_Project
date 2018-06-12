var reds, blues, whites, empty, missing = 0;

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

    var slots = [
        slot_00, slot_01, slot_02,
        slot_10, slot_11, slot_12,
        slot_20, slot_21, slot_22,
    ];

}


function myFunction() {
    var c = document.getElementById("grid-container").childNodes;
    var b;
    var txt = "";
    for (var i = 0; i < c.length; i++) {
        txt = txt + "Row: " + c[i].nodeName + "<br>";
        b = c[i].childNodes;
        for (var j = 0; j < b.length; j++) {
            txt = txt + "Cell: " + b[i].nodeName + " Value: " + b[i].className + "<br>";
        }

    }

    document.getElementById("demo").innerHTML = txt;
}

