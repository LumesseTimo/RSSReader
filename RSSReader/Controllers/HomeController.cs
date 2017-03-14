using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RSSReader.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

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

        public ActionResult RSS_Feedlist()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult RSS_Sourcelist()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}