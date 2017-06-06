$(document).ready(function () {
    $('.loading').show(); //displays the loading screen
    setTimeout(loadFeeds(false, true),10); //starts the loading of the itemslist
});

$('#importfile').change(function () {
    fileimport();
});

function OpenEdit(link) {
    var getChannels = Cookies.getJSON('Sources');
    var neededChannel, categories = "";
    for (var i = 0; i < getChannels.channel.length; i++) {
        var currentChannel = JSON.parse(getChannels.channel[i])
        if (currentChannel.link == link) {
            $('#editFeedID').val(i);
            neededChannel = currentChannel;
            break;
        }
    }

    if (neededChannel != undefined && neededChannel != null) {
        $('#editLink').val(neededChannel.link);
        $('#editName').val(neededChannel.name);

        for (var c = 0 ; c < neededChannel.categories.length; c++) { //for each element in the category-array
            categories += neededChannel.categories[c] + ", ";  //adds the name of the category followed by a comma and a space
        }
        while (categories.length > 0 && categories.lastIndexOf(", ") >= categories.length - 2) { //while the last occurence of ", " is at the very end of the string
            categories = categories.substring(0, categories.length - 2); //remove the ", " from the string
        }

        $('#editCategories').val(categories);
        $('#EditModal').modal('show');
    }
}

function EditFeed() {
    var ID = $('#editFeedID').val();
    if ($('#editLink').val() != "" && $('#editName').val() != "" && $('#editFeedID').val() != "") {
        var getChannels = Cookies.getJSON('Sources');
        var channelToEdit = JSON.parse(getChannels.channel[ID]);

        var NewCategories = Array();
        for (var i = 0; i < $("#editCategories").val().split(",").length; i++) { //goes trhough all the categories the user specified
            NewCategories[i] = $("#editCategories").val().split(",")[i].trim(); //adds the categories to an array
        }

        channelToEdit = { "link": $("#editLink").val(), "name": $('#editName').val(), "categories": NewCategories, "image": channelToEdit.image }; //update the channel with the new information the user added


        getChannels.channel[ID] = JSON.stringify(channelToEdit); //updates the Channel in the array of channels
        Cookies.set('Sources', JSON.stringify(getChannels), { expires: 3650 }); //sets the cookie with an expiry time of 10 years

        $('.loading').show(); //show the loading screen
        $('.RSS-Source:eq('+ID+')').remove();
        addToFeedsList(channelToEdit.link, channelToEdit.name, channelToEdit.categories);

        setTimeout(loadFeeds(true, false), 10); //load the feedslist
    }
}

function textexport() {
    var compressed = lzw_encode(Cookies.get('Sources'));
    var encrypted = sjcl.encrypt("Newsbird", compressed, null, null);
    $('#feedslistcode').val(encrypted);
}

function fileexport() {
    var compressed = lzw_encode(Cookies.get('Sources'));
    var encrypted = sjcl.encrypt("Newsbird", compressed, null, null);
    var blob = new Blob([encrypted], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "NewsbirdExport.nbx");
}

function textimport() {
    var decrypted = sjcl.decrypt("Newsbird", $('#feedslistcode').val(), null, null);
    var decompressed = lzw_decode(decrypted);
    var Array = JSON.parse(decompressed);
    if (Array[0].hasOwnProperty("link") && Array[0].hasOwnProperty("name") && Array[0].hasOwnProperty("categories")) {
        Cookies.set('Sources', decompressed, { expires: 3650 });
    }

    createFeedsList();
    $('.loading').show(); //displays the loading screen
    setTimeout(loadFeeds(false), 10); //starts the loading of the itemslist
}

function fileimport() {
    var file = document.querySelector("#importfile").files[0];
    var result;

    var reader = new FileReader();
    reader.onload = function (e) {
        result = e.target.result;

        console.log(result);
        var decrypted = sjcl.decrypt("Newsbird", result, null, null);
        var decompressed = lzw_decode(decrypted);

        var Array = JSON.parse(decompressed);
        if (Array[0].hasOwnProperty("link") && Array[0].hasOwnProperty("name") && Array[0].hasOwnProperty("categories")) {
            Cookies.set('Sources', decompressed, { expires: 3650 });
        }

        createFeedsList();
        $('.loading').show(); //displays the loading screen
        setTimeout(loadFeeds(false), 10); //starts the loading of the itemslist
    }
    reader.readAsText(file);


}

// LZW-compress a string
function lzw_encode(s) {
    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i = 1; i < data.length; i++) {
        currChar = data[i];
        if (dict[phrase + currChar] != null) {
            phrase += currChar;
        }
        else {
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            dict[phrase + currChar] = code;
            code++;
            phrase = currChar;
        }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (var a = 0; a < out.length; a++) {
        out[a] = String.fromCharCode(out[a]);
    }
    return out.join("");
}

// Decompress an LZW-encoded string
function lzw_decode(s) {
    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i = 1; i < data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        }
        else {
            phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
}


/**** FUNCTION to sort the items by date ****/
 
function mergeSort(arr) {
    var len = arr.length;
    if (len < 2)
        return arr;
    var mid = Math.floor(len / 2),
        left = arr.slice(0, mid),
        right = arr.slice(mid);
    //send left and right to the mergeSort to broke it down into pieces
    //then merge those
    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
    var result = [],
        lLen = left.length,
        rLen = right.length,
        l = 0,
        r = 0;
    while (l < lLen && r < rLen) {
        if (left[l].pubDate < right[r].pubDate) {
            result.push(left[l++]);
        }
        else {
            result.push(right[r++]);
        }
    }
    //remaining part needs to be addred to the result
    return result.concat(left.slice(l)).concat(right.slice(r));
}



function loadFeeds(shallFilter, editFeedsList) {

    var feedsList = []; //creates an array to add every feed into
    var feedDivContent = "";
    sourceFilter = $('#FilterChannels').val();
    categoryFilter = $('#FilterCategories').val();
    titleFilter = $('#FilterTitles').val();

    //sets variables whether to ex/include the items you entered the filters for
    excludeSource = $('#ChannelsExclude').is(':checked');
    excludeCategory = $('#CategoriesExclude').is(':checked');
    excludeTitle = $('#TitlesExclude').is(':checked');

    $('#FilteredSources').html("");
    $('#FilteredCategories').html("");
    $('#FilteredTitles').html("");

    if (editFeedsList) {
        $('#sources').html("");
    }

    var yesOrNoSource = "";
    var yesOrNoCategory = "";
    var yesOrNoTitle = "";

    if (Cookies.getJSON('Sources') != undefined) {
        var getChannels = Cookies.getJSON('Sources'); //gets the JSON-Object, which is saved in the Cookie "Sources"
        for (var i = 0; i < getChannels.channel.length; i++) { //runs through all the channels saved in that Cookie
            var getChannel = JSON.parse(getChannels.channel[i]); //creates a JSON-object for the current channel
            request = $.ajax({
                url: "Home/GETRSS",
                type: "POST",
                data: { "link": getChannel.link }, //posts the link of the text to the handler
                dataType: "text",
                async: false, //gets all the items from the channel. needed because it needs to be sorted
                success: function (data) {

                    var channeltitle = getChannel.name;
                    var channellink = $(data).find("derlink").first().text(); //gets text from the first "derlink" tag. "link" tags get renamed to "derlink" in the handler

                    if (editFeedsList) {
                        addToFeedsList(getChannel.link, getChannel.name, getChannel.categories);
                    }

                    $(data).find("item").each(function () { // or "item" or whatever suits your feed
                        var feed = $(this);

                        if (shallFilter == true) { //checks if filters need to be applied

                            if(sourceFilter.toLowerCase().trim() != ""){
                                var sourceFilterArray = sourceFilter.split(","); //the (not) wanted titles get seperatedvar 
                                var sourceOkay = excludeSource; //sets the variable that checks whether the item's source is okay to the default (true for if the filters are meant to exclude certain items, false if otherwise)
                                
                                for (var a = 0; a < sourceFilterArray.length && sourceFilter.length > 0; a++) { //runs trhough all the filters in the array, if there are any
                                    if (channeltitle.toLowerCase().indexOf(sourceFilterArray[a].toLowerCase().trim()) > -1)//if it finds an accordance/eine Übereinstimmung
                                    {
                                        sourceOkay = !sourceOkay; //inverts the default check for whether the source is okay or not 
                                        break; //exits the loop to save computing time (and to make sure the variable sourceOkay has the correct value
                                    }
                                }

                                //shows the informations about the Filter at the top right of the screen
                                yesOrNoSource = "Sources: ";
                                if (excludeSource == true) {
                                    yesOrNoSource += "<span class='glyphicon glyphicon-remove'></span> ";
                                }
                                else {
                                    yesOrNoSource += "<span class='glyphicon glyphicon-ok'></span> ";
                                }
                            }
                            else {
                                sourceOkay = true;
                            }

                            if (categoryFilter.toLowerCase().trim() != "") {
                                var categoryFilterArray = categoryFilter.split(","); //the (not) wanted categorys get seperated
                                var categoryOkay = excludeCategory; //sets the variable that checks whether the item's category is okay to the default (true for if the filters are meant to exclude certain items, false if otherwise)

                                for (var b = 0; b < categoryFilterArray.length && categoryFilter.length > 0; b++) { //runs through all the filters in the array, if there are any
                                    console.log(feed.find("category").text())
                                    console.log(categoryFilterArray[b]);
                                    if (feed.find("category").text().toLowerCase().indexOf(categoryFilterArray[b].toLowerCase().trim()) > -1) {//if it finds an accordance/eine Übereinstimmung
                                        categoryOkay = !categoryOkay; //inverts the default check for whether the category is okay or not 
                                        break; //exits the loop to save computing time (and to make sure the variable categoryOkay has the correct value)
                                    }
                                }
                                console.log(excludeCategory);
                                if (categoryOkay == excludeCategory) { //checks if the categoryOkay variable already has been inverted
                                    for (var c = 0 ; c < getChannel.categories.length && categoryFilter.length > 0; c++) { //runs thourgh all the categories the user specified for the 
                                        if (getChannel.categories[c].indexOf(categoryFilterArray[c].toLowerCase().trim()) > -1) {//if it finds an accordance/eine Übereinstimmung
                                            categoryOkay = !categoryOkay; //inverts the default check for whether the category is okay or not 
                                            break;//exits the loop to save computing time (and to make sure the variable categoryOkay has the correct value)
                                        }
                                    }
                                }

                                //shows the informations about the Filter at the top right of the screen
                                yesOrNoCategory = "Categories: ";
                                if (excludeCategory == true) {
                                    yesOrNoCategory += "<span class='glyphicon glyphicon-remove'></span> ";
                                }
                                else {
                                    yesOrNoCategory += "<span class='glyphicon glyphicon-ok'></span> ";
                                }
                            }
                            else {
                                categoryOkay = true;
                            }

                            if (titleFilter.toLowerCase().trim() != "") {
                                var titleFilterArray = titleFilter.split(","); //the (not) wanted titles get seperated
                                var titleOkay = excludeTitle;

                                for (var d = 0; d < titleFilterArray.length && titleFilter.length > 0; d++) { //runs thourgh all the titles the user specified for the 
                                    if (feed.find("title").text().toLowerCase().indexOf(titleFilterArray[d].toLowerCase().trim()) > -1) {//if it finds an accordance/eine Übereinstimmung
                                        titleOkay = !titleOkay; //inverts the default check for whether the title is okay or not 
                                        break; //exits the loop to save computing time (and to make sure the variable categoryOkay has the correct value)
                                    }
                                }

                                //shows the informations about the Filter at the top right of the screen
                                yesOrNoTitle = "Titles: ";
                                if (excludeTitle == true) {
                                    yesOrNoTitle += "<span class='glyphicon glyphicon-remove'></span> ";
                                }
                                else {
                                    yesOrNoTitle += "<span class='glyphicon glyphicon-ok'></span> ";
                                }
                            }
                            else {
                                titleOkay = true;
                            }

                            $('#FilteredSources').html(yesOrNoSource + sourceFilter);
                            $('#FilteredCategories').html(yesOrNoCategory + categoryFilter);
                            $('#FilteredTitles').html(yesOrNoTitle + titleFilter);
                        }

                        if (shallFilter == false || (sourceOkay == true && categoryOkay == true && titleOkay == true)) { //checks if the list is supposed to be filtered at all, if yes: if the current item-element's title, categories and source are okay   
                            var categories = ""; //setting the variavble for the display of the cagtegories
                            feed.find("category").each(function () { //for each category-element

                                var category = $(this);
                                categories += category.text().trim() + ", "; //adds the name of the category followed by a comma and a space

                            });
                            for (var e = 0 ; e < getChannel.categories.length; e++) { //for each element in the category-array
                                categories += getChannel.categories[e] + ", ";  //adds the name of the category followed by a comma and a space
                            }

                            while (categories.length > 0 && categories.lastIndexOf(", ") >= categories.length - 2) { //while the last occurence of ", " is at the very end of the string
                                categories = categories.substring(0, categories.length - 2); //remove the ", " from the string
                            }

                            feedsList.push({ //add the item to the array
                                link: feed.find("derlink").text(),
                                title: feed.find("title").text(),
                                category: categories,
                                description: feed.find("description").text(),
                                pubDate: Date.parse(feed.find("pubDate").text()),
                                channellink: channellink,
                                channeltitle: channeltitle
                            });
                        }
                    });
                }
            });

            var progress = i / (getChannels.channel.length-1) * 100; //calculates the percentage of how many of the sources have already been loaded
            $("#loadingProgress").attr("style", "width: " + progress + "%;"); //sets the width of the progress bar
        }

        for (var f = 0; f < feedsList.length; f++) {
            if (isNaN(feedsList[f].pubDate)) {
                feedsList[f].pubDate = 0; //sets the date to the 1.1.1970 00:00:00 for every item that hasn't got a (valid) date. This is done for sorting purposes. 
            }
        }

        feedsList = mergeSort(feedsList, 0, feedsList.length-1); //sorts all the items

        for (var d = feedsList.length-1 ; d >= 0 ; d--) { //backwards loop for going through the array
            var datum = feedsList[d].pubDate == 0 ? "Invalid Date" : new Date(feedsList[d].pubDate).toDateString(); //sets the variable "datum" to "invalid date" if the date is set to 1.1.1970 00:00:00, else it sets it converts the date in the list to a string
            feedDivContent += "<div class='RSS-Item Row'><div class='Row RSS-Item-Header'><div class='RSS-Item-Title col-sm-10 col-xs-12'><a title='" + feedsList[d].title + "' target='_blank' href='" +
            feedsList[d].link + "'>" +
            feedsList[d].title + "</a></div><div class='RSS-Item-Category col-sm-2 hidden-xs' title='" +
            feedsList[d].category + "'>" + feedsList[d].category + "</div></div><div class='Row RSS-Item-Content'>" +
            feedsList[d].description + "</div><div class='Row RSS-Item-Footer'><div class='row'><div class='col-xs-12 col-sm-6 RSS-Item-Date'>" +
            datum + "</div><div class='col-xs-12 col-sm-6 RSS-Item-Source'><a  target='_blank' href='" + feedsList[d].channellink + "'>" + feedsList[d].channeltitle + "</a></div></div></div></div></div>";
        }
        document.getElementById("feed").innerHTML = feedDivContent; //put the content of the listdiv variable into the left side div (feedoverview);

    }

    progress = 0; //sets progress bar to 0
    $("#loadingProgress").attr("style", "width: " + progress + "%;"); //sets the width of the filled out part of the progress bar to the calculated percentage
    $('.loading').hide(); //hide the loading 
}



function createFeedsList() {
    /*
    //============================================================== INITIALIZING TESTING LIST ===============================================================//
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
    //=========================================================================================================================================================//
    */
    var sourceshtml = "";
    var channellink = "";
    $('#sources').html("");
    if (Cookies.getJSON('Sources') != undefined) {
        var getChannels = Cookies.getJSON('Sources'); //gets the JSON-Objekt, which is saved in the Cookie "Sources"
        for (var i = 0; i < getChannels.channel.length; i++) { //runs through all the channels saved in that Cookie

            var getChannel = JSON.parse(getChannels.channel[i]); //creates a JSON-object for the current channel

            channellink = getChannel.link; //gets the link from the channel from the element

            request = $.ajax({
                url: "Home/GETRSS",
                type: "POST",
                data: { "link": channellink }, //gets contents of the feed
                dataType: "text",
                async: false,
                success: function (data) {
                    var imageUrl = $(data).find("dieurl").first().text();
                    var channeltitle = getChannel.name;
                    var sitelink = $(data).find("derlink").first().text();

                    var categories = "";

                    for (var c = 0 ; c < getChannel.categories.length; c++) { //for each element in the category-array
                        categories += "'"+getChannel.categories[c] + "', ";  //adds the name of the category followed by a comma and a space
                    }
                    while (categories.length > 0 && categories.lastIndexOf(", ") >= categories.length - 2) { //while the last occurence of ", " is at the very end of the string
                        categories = categories.substring(0, categories.length - 2); //remove the ", " from the string
                    }

                    var parameters = "'" + channellink + "', '" + channeltitle + "', " + categories;

                    if (imageUrl == "" || imageUrl == null) {
                        imageUrl = "/Content/Images/noPictureAvailable.jpg";
                    }

                    sourceshtml = '<div class="RSS-Source Row"><div class="RSS-Thumbnail col-sm-3 hidden-xs alignContainer"><span class="alignHelper"></span><img src="' + imageUrl + '" class="aligner"></div><div class="RSS-Link col-xs-7 alignContainer"><span class="alignHelper"></span><a class="aligner" target="_blank" href="' + sitelink + '" title="' + channeltitle + '">' + channeltitle + '</a></div><div class="RSS-Subscription col-sm-2 col-xs-5 alignContainer"><span class="alignHelper"></span><span class="glyphicon glyphicon-pencil aligner" onclick="OpenEdit(&quot;' + channellink + '&quot;)" title="Edit"></span><span class="glyphicon glyphicon-remove-circle aligner" onclick="UnSubscribe(this, ' + parameters + ')" remove="" title="Remove"></span></div></div>'; //builds the div for the channel
                    $('#sources').html($('#sources').html() + sourceshtml);
                }


            });
        }


    }
    $('#sources').html($('#sources').html() + '<div class="RSS-Source Row btn" data-toggle="modal" data-target="#NewFeedModal"><div class="Row alignContainer"><span class="alignHelper"></span><span class="glyphicon glyphicon-plus-sign"></span><span class="aligner"> Add New Feed </span></div></div>');
    // adding the "add new feed" button at the bottom of the feeds list
}
