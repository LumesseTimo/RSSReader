using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using System.Net;

namespace RSSReader.Controllers
{
    public class HomeController : Controller
    {
        [HttpPost]
        public string getRSS(string link)
        {
            WebClient client = new WebClient();

            // set the user agent to IE6
            client.Headers.Add("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.0.3705;)");
            try
            {
                string xmlText = Encoding.UTF8.GetString(Encoding.Default.GetBytes(client.DownloadString("http://www.spiegel.de/politik/index.rss")));
                xmlText = xmlText.Replace("<link>", " <derlink>");
                xmlText = xmlText.Replace("</link>", " </derlink>");

                xmlText = xmlText.Replace("<guid>", " <dieguid>");
                xmlText = xmlText.Replace("</guid>", " </dieguid>");

                xmlText = xmlText.Replace("<url>", " <dieurl>");
                xmlText = xmlText.Replace("</url>", " </dieurl>");
                return xmlText;
            }
            catch (WebException we)
            {
                // WebException.Status holds useful information
                Console.WriteLine(we.Message + "\n" + we.Status.ToString());
                return null;
            }
            catch (NotSupportedException ne)
            {
                // other errors
                Console.WriteLine(ne.Message);
                return null;
            }
        }

        public ActionResult Index()
        {
            return View();
        }
        
        /*public ActionResult GETRSS(string link)
        {
            ViewBag.Link = link;

            return View();
        }*/

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}