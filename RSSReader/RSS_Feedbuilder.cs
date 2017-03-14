using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RSSReader
{
    public class RSS_Feedbuilder
    {
        public void GetAllFeeds()
        {


            //useless
            //List<FeedsItemInformation> allFeeds = new List<FeedsItemInformation>();

            ////Abzufragende Tags | attribute possible:
            ///* channel | no
            // * item | no
            // * title | no
            // * link | no
            // * image | yes but as tags (<url>/<title>/<link>)
            // * category | no
            // * description | no*/

            ////ItemList will, at the end, give the main view an information about all Feeds and their informations
            //List<FeedsItemInformation> ItemList = new List<FeedsItemInformation>();

            ////RSS Example
            ///*<?xml version="1.0" encoding="UTF-8" ?>
            //  <rss version="2.0">

            //       <channel>
            //          <title>W3Schools Home Page</title>
            //          <link>https://www.w3schools.com</link>
            //          <description>Free web building tutorials</description>
            //          <item>
            //              <title>RSS Tutorial</title>
            //              <link>https://www.w3schools.com/xml/xml_rss.asp</link>
            //              <description>New RSS tutorial on W3Schools</description>
            //          </item>
            //          <item>
            //              <title>XML Tutorial</title>
            //              <link>https://www.w3schools.com/xml</link>
            //              <description>New XML tutorial on W3Schools</description>
            //          </item>
            //       </channel>

            //  </rss>*/

            ////1.) get everything from the GetFeeds.cshtml 
            ////string feedsData = "<?xml version='1.0' encoding='UTF-8' ?>  <rss version = '2.0'>< channel>  <title>W3Schools Home Page</title>  <link>https://www.w3schools.com</link>  <description>Free web building tutorials</description>        <item>          <title>RSS Tutorial</title>                <link>https://www.w3schools.com/xml/xml_rss.asp</link>    <description>New RSS tutorial on W3Schools</description></item><item>          <title>XML Tutorial</title>                <link>https://www.w3schools.com/xml</link>    <description>New XML tutorial on W3Schools</description>        </item>   </channel>";
            //string feedsData = "dofjfsdjflkdsn<item>NEEIIINNN</item>";

            ////only if rss exist in the first place
            ////if (feedsData.Contains("<rss") == true)
            ////{
            ////    int startposition = 0;
            ////    int endposition = 0;

            ////    endposition = feedsData.IndexOf("<channel") + 8;
            ////teststring will get the copy of a part of the getfeedsdata string
            //int startposition = 0;
            //int endposition = 0;

            //string teststring = "";



            ////2.) when he finds an <item> tag, copy everything until the next </item> tag
            //while (feedsData.Contains("<item>"))
            //{
            //    allFeeds.Add(Handle_Item(feedsData));

            //    ////if there is no attribute in the tag
            //    //if (feedsData[startposition] == '>')
            //    //{
            //    //    //-8 is because 'IndexOf' gets the position of before the '<' but we don't want to get any of the tag characters
            //    //    feedstagdata = feedsData.Substring(startposition, (feedsData.Length - startposition - 8 - feedsData.Substring(endposition).Length));
            //    //    teststring += feedstagdata;
            //    //    feedsData = feedsData.Remove(startposition - 5, feedstagdata.Length + 12); 
            //    //    //+12 so enough characters get deleted to include the tags
            //    //}
            //    ////if there is
            //    //else
            //    //{
            //    //    int tagendposition = feedsData.IndexOf(">") + 1;
            //    //    feedstagdata = feedsData.Substring(tagendposition, (feedsData.Length - tagendposition - 7 - feedsData.Substring(endposition).Length));
            //    //    teststring += feedstagdata;
            //    //    feedsData = feedsData.Remove(startposition - 5, feedstagdata.Length + 12 + (tagendposition - startposition));
            //    //    //+(tagendposition - startposition) so enough characters get deleted to include the tags
            //    //}
            //}

            ////3.) when he finds a <title>/<link>/<description>/<category> tag, copy everything until next </closing tag>
            ////4.) add value to the string
            ////5.) when done with the tag, delete everything (including the opening/closing tag) out of the main copy of GetFeeds.cstml
            ////6.) Repeat from point 2.
            ////}

            //return allFeeds;
        }

//useless
        //public void Handle_Channel_Tag()
        //{

        //}

        //public FeedsItemInformation Handle_Item(string feedsData)
        //{
        //    int startposition = 0;
        //    int endposition = 0;

        //    string feedItemData = "";
        //    startposition = feedsData.IndexOf("<item>");
        //    endposition = feedsData.IndexOf("</item>") + 7;

        //    //-9 is because 
        //    //1)-1 comes because the position of a char starts with 0
        //    feedItemData = feedsData.Substring(startposition + 6, (feedsData.Length - startposition - feedsData.Substring(endposition).Length) - 1);

        //    string category, description, link, title;

        //    category = Handle_Category();
        //    description = Handle_Description();
        //    Handle_Image();
        //    link = Handle_Link();
        //    title = Handle_Title();

        //    FeedsItemInformation item = new FeedsItemInformation {
        //        title = title,
        //        link = link,
        //        image = null,
        //        category = category,
        //        description = description
        //    };

        //    feedsData = feedsData.Remove(startposition, feedItemData.Length + 13);
        //    //only needed when deleting <item>, tags inside <item> don't need there own delete!
        //    //+13 so enough characters get deleted to include the tags

        //    return item;
        //}

        //public string Handle_Title()
        //{
        //    string feedTitleData = "";

        //    return feedTitleData;
        //}

        //public string Handle_Link()
        //{
        //    string feedLinkData = "";

        //    return feedLinkData;
        //}

        //public void Handle_Image()
        //{
            
        //}

        //public void Handle_Image_Description()
        //{
        //    string imageDescriptionData = "";
        //}
        //public void Handle_Image_Link()
        //{
        //    string imageLinkData = "";
        //}
        //public void Handle_Image_Url()
        //{
        //    string imageUrlData = "";
        //}

        //public string Handle_Category()
        //{
        //    string feedCategoryData = "";

        //    return feedCategoryData;
        //}

        //public string Handle_Description()
        //{
        //    string feedDescriptionData = "";

        //    return feedDescriptionData;
        //}
    }
}