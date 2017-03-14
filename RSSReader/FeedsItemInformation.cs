using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RSSReader
{
    public class FeedsItemInformation
    {
        public string title { get; set; }
        public string link { get; set; }
        public object image { get; set; }
        public string category { get; set; }
        public string description { get; set; }
        public DateTime pubDate { get; set; }
    }
}