if (Array.prototype.includesLink) { //adds a function to check if an element in a feedslist has the link included
    Array.prototype.includesLink = function (searchElement) {
        var Arr = this;
        
        for (var i = 0; i < Arr.length; i++){ //checks every item in the array
            if(searchElement == Arr[i].link){ //if the link of the current item matches the link 
                return true; //function returns true
            }
        }

        return false; //function returns false
    }
}

function UnSubscribe(elem, link, name, categories) { //function for when you click the little icon at the right side of the channel div
    //var categories = Array.prototype.slice(arguments, 2);
    console.log(arguments);

        if (elem.hasAttribute('add')) { //if that clicked element has the attribute "add"
            elem.removeAttribute('add'); //will remove the attribute
            elem.setAttribute('remove', ''); //will add the attribute "remove"
            elem.setAttribute('title', 'Remove');
            addFeed(link, name, categories); //will execute the addFeed function
        }
        else { //if the element does not have the attribute
            elem.removeAttribute('remove');  //remove the attribute "remove"
            elem.setAttribute('add', ''); //add the attribute "add"
            elem.setAttribute('title', 'Add');
            removeFeed(link); //execute the removeFeed function
        }
    }



    function addFeed(link, name) {
        var NewChannel; //variable for the channel that should be added
        if (link == null||link == undefined) { //checks if the link variable (which is the function parameter) is empty
            if (Cookies.getJSON('Sources') != undefined && !Cookies.getJSON('Sources').channel.includes($("#NewFeedLink").val())) { //checks if the Cookie is set and if the link doesen't already exist in the list
                var Channels = Cookies.getJSON('Sources'); //get the JSON from the Cookie
            }
            else {
                var Channels; //create a new varibale
            }
            $.ajax({
                url: "Home/GETRSS",
                type: "POST",
                data: { "link": $("#NewFeedLink").val() }, //gets contents of the link. link is being pulled from the input-field #NewFeedLink
                dataType: "text",
                async: false,
                success: function (data) {
                    if ($(data).find("channel").text() !="") { //checks if the content of the page contains a "channel" tag
                        var NewCategories = Array();
                        for (var i = 0; i < $("#NewFeedCategory").val().split(",").length; i++) { //goes trhough all the categories the user specified
                            NewCategories[i] = $("#NewFeedCategory").val().split(",")[i].trim(); //adds the categories to an array
                        }

                        if ($('#NewFeedName').val() == "") {
                            $('#NewFeedName').val($(data).find("title").first().text());
                        }

                        if (Cookies.getJSON('Sources') != undefined) { //checks if there is already a cookie
                            var Channels = Cookies.getJSON('Sources'); //if so, get's the contents of that cookie
                        }

                        else {
                            var Channels = { "channel": Array() }; // if not, creates the blueprint for that cookie
                        }

                        var isNewChannel = true; // creates a bool variable for testing if a channel already exists
                        for (var b = 0; b < Channels.channel.length; b++) {
                            var currentChannel = JSON.parse(Channels.channel[b])
                            if (currentChannel.link == $("#NewFeedLink").val()) {
                                isNewChannel = false;
                                break;
                            }
                        }

                        if (isNewChannel == true) { //if there is not already a channel with same link
                            NewChannel = { "link": $("#NewFeedLink").val(), "name": $('#NewFeedName').val(), "categories": NewCategories, "image": $(data).find("dieurl").first().text() }; //creating a new channel with the link and the categories the user added
    
                            addToFeedsList($("#NewFeedLink").val(), $('#NewFeedName').val(), NewCategories); //adds the channel to the feeds list

                            $("#NewFeedLink").val(""); //empties the input field
                            $("#NewFeedCategory").val(""); //empties the input field
                            $("#NewFeedName").val(""); //empties the input field

                            Channels.channel[Channels.channel.length] = JSON.stringify(NewChannel); //adds the new Channel to the array of channels
                            Cookies.set('Sources', JSON.stringify(Channels), { expires: 3650 }); //sets the cookie with an expiry time of 10 years

                            $('.loading').show(); //show the loading screen
                            setTimeout(loadFeeds(true), 10); //load the feedslist      

                            $("#SuccessModal").modal('show'); //show that the link has been successfully added
                        }

                        else {
                            $("#LinkAlreadyExistsModal").modal('show'); //show that the channel already exists
                        }
                    }
                    else {
                        $("#WrongLinkModal").modal('show'); //show that the link provided did not contain a rss-feed
                    }
                }
            });


        }
        else {
            var categories = Array.prototype.slice(arguments, 2);
            NewChannel = { "link": link, "name": name, "categories": categories };
            if (Cookies.getJSON('Sources') != undefined) {
                var Channels = Cookies.getJSON('Sources');
                Channels.channel[Channels.channel.length] = JSON.stringify(NewChannel);
                Cookies.set('Sources', JSON.stringify(Channels), { expires: 3650 });

                $('.loading').show();
                setTimeout(loadFeeds(true), 10);
            }
        }

    }

    function removeFeed(link) {
        var getChannels = Cookies.getJSON('Sources'); //gets the JSON-Object, which is saved in the Cookie "Sources"
        for (var i = 0; i < getChannels.channel.length; i++) { //runs through all the channels saved in that Cookie

            var getChannel = JSON.parse(getChannels.channel[i]); //creates a JSON-object for the current channel
            if (getChannel.link == link) {
                getChannels.channel.splice(i, 1);
                Cookies.set('Sources', JSON.stringify(getChannels), { expires: 3650 });
                break;
            }
        }

        $('.loading').show();
        setTimeout(loadFeeds(true), 10);
    }

    function addToFeedsList(link, name) {
        
        var categories = Array.prototype.slice(arguments, 2);
        var categoriesStr = "";

        $('#sources').html($('#sources').html().substring(0, $('#sources').html().lastIndexOf('<div class="RSS-Source Row btn" data-toggle="modal" data-target="#NewFeedModal">')));

        for (var c = 0 ; c < categories.length; c++) { //for each element in the category-array
            categoriesStr += "'"+getChannel.categories[c] + "', ";  //adds the name of the category followed by a comma and a space
        }

        while (categories.length > 0 && categories.lastIndexOf(", ") >= categories.length - 2) { //while the last occurence of ", " is at the very end of the string
            categories = categories.substring(0, categories.length - 2); //remove the ", " from the string
        }

        var sourceshtml;

        parameters = "'" + link + "', '" + name + "', " + categories;

        request = $.ajax({
            url: "Home/GETRSS",
            type: "POST",
            data: { "link": link },
            dataType: "text",
            async: false,
            success: function (data) {
                var imageUrl = $(data).find("dieurl").first().text();
                var sitelink = $(data).find("derlink").first().text();

                if (imageUrl == "" || imageUrl == null) {
                    imageUrl = "/Content/Images/noPictureAvailable.jpg";
                }

                sourceshtml = '<div class="RSS-Source Row"><div class="RSS-Thumbnail col-sm-3 alignContainer"><span class="alignHelper"></span><img src="' + imageUrl + '" class="aligner"></div><div class="RSS-Link col-sm-7 alignContainer"><span class="alignHelper"></span><a class="aligner" target="_blank" href="' + sitelink + ' title="' + name + '">' + name + '</a></div><div class="RSS-Subscription col-sm-2 alignContainer"><span class="alignHelper"></span> <span class="glyphicon glyphicon-pencil aligner" onclick="OpenEdit(&quot;' + link + '&quot;)" title="Edit"></span><span class="glyphicon glyphicon-remove-circle aligner" onclick="UnSubscribe(this, ' + parameters + ')" remove="" title="Remove"></span></div></div>';
                $('#sources').html($('#sources').html() + sourceshtml);
            }
        });

        $('#sources').html($('#sources').html() + '<div class="RSS-Source Row btn" data-toggle="modal" data-target="#NewFeedModal"><div class="Row alignContainer"><span class="alignHelper"></span><span class="glyphicon glyphicon-plus-sign"></span><span class="aligner"> Add New Feed </span></div></div>');

    }

