$(document).ready(function () {
    loadFeeds();
});

function loadFeeds() {
    var list = new Array();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            list = createFeedslist(this);
        }
    };

    xhttp.open("GET", "/Content/test.xml", true);
    xhttp.send();

    return list;
}

function createFeedslist(xml) {
    Cookies.remove('Sources');
    if (Cookies.get('Sources') == undefined) {
        var Channel1 = { "link": "http://www.spiegel.de/politik/index.rss", "categories": Array() }
        var Channel2 = { "link": "https://www.heise.de/newsticker/heise.rdf", "categories": Array() }
        var Channel3 = { "link": "http://rss.sueddeutsche.de/app/service/rss/alles/index.rss", "categories": Array() }
        var Channel4 = { "link": "http://www.bmwi.de/SiteGlobals/BMWI/Functions/RSSFeed/DE/RSSFeed-Kompakt.xml;jsessionid=649E32E3D68C44F9A088A1CACD230538", "categories": Array() }
        var Channels = { "channel": Array() };
        Channels.channel[0] = JSON.stringify(Channel1);
        Channels.channel[1] = JSON.stringify(Channel2);
        Channels.channel[2] = JSON.stringify(Channel3);
        Channels.channel[3] = JSON.stringify(Channel4);
        Cookies.set('Sources', JSON.stringify(Channels));
    }

    var channellink = "";
    var getChannels = Cookies.getJSON('Sources'); //gets the JSON-Objekt, which is saved in the Cookie "Sources"
    for (var i = 0; i < getChannels.channel.length; i++) { //runs through all the channels saved in that Cookie

        var getChannel = JSON.parse(getChannels.channel[i]); //creates a JSON-object for the current channel
        channellink = getChannel.link;
    }


    var link = "";
    var title = "";
    var category = "";
    var description = "";
    var pubDate = "";
    var xmlDoc = xml.responseXML;
    var listdiv = "";
    //var channellink = 'https://www.w3schools.com/xml/ajax_xmlfile.asp';
    var channelname = "test2";
    var feeds = xmlDoc.getElementsByTagName("item");
    var feedsList = new Array(); //creates an array to add every feed into
    for (var b = 0; b < feeds.length; b++) {
        if (feeds[b].getElementsByTagName("link").length == 0) {
            link = "";
        }
        else {
            link = feeds[b].getElementsByTagName("link")[0].childNodes[0].nodeValue;
        }
        if (feeds[b].getElementsByTagName("title").length == 0) {
            title = "";
        }
        else {
            title = feeds[b].getElementsByTagName("title")[0].childNodes[0].nodeValue;
        }
        if (feeds[b].getElementsByTagName("category").length == 0) {
            category = "";
        }
        else {
            category = feeds[b].getElementsByTagName("category")[0].childNodes[0].nodeValue;
        }
        if (feeds[b].getElementsByTagName("description").length == 0) {
            description = "";
        }
        else {
            description = feeds[b].getElementsByTagName("description")[0].childNodes[0].nodeValue;
        }
        if (feeds[b].getElementsByTagName("pubDate").length == 0) {
            pubDate = "";
        }
        else {
            pubDate = feeds[b].getElementsByTagName("pubDate")[0].childNodes[0].nodeValue;
        }

        feedsList.push(
            {
                link: link,
                title: title,
                category: category,
                description: description,
                pubDate: pubDate
            });
    }


    for (var i = 0; i < feedsList.length; i++) {
        listdiv += "<div class='RSS-Item Row'><div class='Row RSS-Item-Header'><div class='RSS-Item-Title col-xs-10'><a href='" +
        feedsList[i].link + "'>" +
        feedsList[i].title + "</a></div><div class='RSS-Item-Category col-xs-2'>" +
        feedsList[i].category + "</div></div><div class='Row RSS-Item-Content'>" +
        feedsList[i].description + "</div><div class='Row RSS-Item-Footer'><div class='col-xs-3 RSS-Item-Date'>" +
        feedsList[i].pubDate + "</div><div class='col-xs-9 RSS-Item-Source'><a href='" +
        channellink + "'>" + channelname + "</a></div></div></div>";
    }

    document.getElementById("feed").innerHTML = listdiv;
    //document.getElementById("sources").innerHTML = sourcelist;

    return feedsList;
}