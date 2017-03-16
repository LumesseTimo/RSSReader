    function UnSubscribe(elem, link) {
        if (elem.hasAttribute('add')) {
            elem.removeAttribute('add');
            elem.setAttribute('remove', '');
            addFeed(link);
        }
        else {
            elem.removeAttribute('remove');
            elem.setAttribute('add', '');
            removeFeed(link);
        }
    }

    $(document).ready(
        function(){
            $.get("Home/GETRSS", function (data) {
                $(data).find("item").each(function () { // or "item" or whatever suits your feed
                    var el = $(this);

                    console.log("------------------------");
                    console.log("title      : " + el.find("title").text());
                    console.log("author     : " + el.find("author").text());
                    console.log("description: " + el.find("description").text());
                });
            });
        }
    );

    function getFeeds() {

        $.ajax({
            type: "GET",
            url: "Home/RSS_Sourcelist",
            success: function (data) {
                $("#sources").html(data + "<div class='RSS-Source Row addFeed'>"
                                    + "<div class='RSS-Link col-xs-12 alignContainer'>"
                                    + "<span class='alignHelper'></span>"
                                    + "<span class='aligner'>"
                                    + "<span class='glyphicon glyphicon-remove-circle' add></span>"
                                    + "Add Other RSS-Feed"
                                    + "</span>"
                                    + "</div>"
                                    + "</div>"
                                    );
            }
        });

    }

    $(document).ready(function () {
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

        var getChannels = Cookies.getJSON('Sources'); //gets the JSON-Objekt, which is saved in the Cookie "Sources"

        for (var i = 0; i < getChannels.channel.length; i++) { //runs through all the channels saved in that Cookie

            var getChannel = JSON.parse(getChannels.channel[i]); //creates a JSON-object for the current channel

            for (var j = 0; j < getChannel.categories.length; j++) { //runs through all the saved categories for that channel
                string += getChannel.categories[j];
            }
        }

});

    function addFeed(link) {
        if (link == null) {
            var NewChannel = { "link": link, "categories": Array() };
            if (document.getElementsByName('Category') != null && document.getElementsByName('Category') != undefined) {
                for (var i = 0; i < document.getElementsByName('Category').length; i++) {
                    NewChannel.categories[NewChannel.categories.length - 1] = document.getElementsByName('Category')[i].value;
                }
            }
        }
        else {
            var NewChannel = { "link": link, "categories": Array() };
            var Channels = Cookies.getJSON('Sources');
            Channels.channel[Channels.channel.length] = JSON.stringify(NewChannel);
            Cookies.set('Sources', JSON.stringify(Channels));
        }

    }

    function removeFeed(link) {

        var getChannels = Cookies.getJSON('Sources'); //gets the JSON-Objekt, which is saved in the Cookie "Sources"
        for (var i = 0; i < getChannels.channel.length; i++) { //runs through all the channels saved in that Cookie

            var getChannel = JSON.parse(getChannels.channel[i]); //creates a JSON-object for the current channel
            if (getChannel.link == link) {
                getChannels.channel.splice(i, 1);
                Cookies.set('Sources', JSON.stringify(getChannels));
                break;
            }
        }
    }

