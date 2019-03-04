var tracker;
var facecanvas;
var facecontext;
var positions;
var verified;
var video;
var passes = [];

var myFace;

function passGen()
{
    var symb = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz*!@#";
    var pass = "";
    for (var i = 0; i != 20; i++)
    {
        var index = Math.round(Math.random() * symb.length - 1);
        pass += symb[index];
    }
}

function dist(p1id, p2id)
{
    var p1 = positions[p1id];
    var p2 = positions[p2id];
    var xd = p2[0] - p1[0];
    var yd = p2[1] - p1[1];
    return Math.sqrt(xd * xd + yd * yd);
}

function testDist(n1, n2)
{
    var error = 0.005;
    var x1 = n1 - error;
    var x2 = n1 + error;
    var y1 = n2 - error;
    var y2 = n2 + error;
    return x1 <= y2 && y1 <= x2;
}

function matchPercent(a, b)
{
    var correct = 0;
    for (var i = 0; i != a.length; i++)
        if (testDist(a[i], b[i])) correct++;
    return correct / a.length;
}

function registerFace()
{
    if (!(!myFace || verified)) return;
    positions = tracker.getCurrentPosition();
    var tp = dist(0, 14);
    var facedata = [dist(23, 25) / tp, dist(30, 28) / tp, dist(44, 50) / tp, dist(0, 7) / tp, dist(7, 14) / tp, 
        (dist(19, 20) + dist(20, 21) + dist(21, 22)) / tp, (dist(18, 17) + dist(17, 16) + dist(16, 15)) / tp, 
        dist(34, 40) / tp, dist(35, 39) / tp, dist(36, 38) / tp];
    myFace = facedata;
}

function compareFace()
{
    positions = tracker.getCurrentPosition();
    if (!myFace) return;
    var tp = dist(0, 14);
    var facedata = [dist(23, 25) / tp, dist(30, 28) / tp, dist(44, 50) / tp, dist(0, 7) / tp, dist(7, 14) / tp, 
        (dist(19, 20) + dist(20, 21) + dist(21, 22)) / tp, (dist(18, 17) + dist(17, 16) + dist(16, 15)) / tp, 
        dist(34, 40) / tp, dist(35, 39) / tp, dist(36, 38) / tp];
    var matching = matchPercent(facedata, myFace);
    console.log(matching);
    if (matching >= 0.85) 
        {
            $("#EnterButton").attr("class", "registerFace");
            verified = true;
            $("#EnterButton").text("Insert Password");
        }
        else
        {
            $("#EnterButton").attr("class", "verifying");
            $("#EnterButton").text("Verifying...");
            verified = false;
        }
}

function tick()
{
    requestAnimationFrame(tick);
    facecontext.clearRect(0, 0, 460, 300);
    positions = tracker.getCurrentPosition();
    compareFace();
    tracker.draw(facecanvas);
}

function init()
{
    $("#RegisterFace").click(registerFace);
    $("#RegisterWebsite").click(function ()
    {
        var pt = prompt("Website Name", "")
        $("#Passwords").append("<option>" + pt + "</option>");
        passes.append(passGen());
    });
    $("#EnterButton").click(function()
    {
        if (!verified) return;
        $("#emerg").val(passGen());
    });
    video = document.getElementById("facevideo");
    verified = false;
    facecanvas = document.getElementById("face");
    facecontext = facecanvas.getContext('2d');
    tracker = new clm.tracker();
    tracker.init(pModel);
    tracker.start(video);
    requestAnimationFrame(tick);
}


$(document).ready(init);
