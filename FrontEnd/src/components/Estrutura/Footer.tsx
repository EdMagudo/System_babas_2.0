import React from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t, i18n } = useTranslation();

 const BASE_URL = "https://ola-baba.com";

  // Define o caminho do arquivo com base no idioma
  const termsFile =
  i18n.language === "pt"
    ? `${BASE_URL}/api/download/terms/PT`
    : `${BASE_URL}/api/download/terms/EN`;


  return (
    <footer className="bg-gradient-to-r from-slate-50 to-slate-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Navigation Links */}
          <div className="space-y-4">
            <nav>
              <ul className="grid grid-cols-2 gap-4">
                <li>
                  <a
                    href="/contact-us"
                    className="text-slate-600 hover:text-slate-900 transition-colors duration-200 text-sm"
                  >
                    {t("footer.contactUs")}
                  </a>
                </li>
                <li>
                  <a
                    href={termsFile}
                    download="termos_de_servico.pdf"
                    className="text-slate-600 hover:text-slate-900 transition-colors duration-200 text-sm"
                  >
                    {t("footer.terms")}
                  </a>
                </li>
                <li>
                  <a
                    href='/faqs'
                    className="text-slate-600 hover:text-slate-900 transition-colors duration-200 text-sm"
                  >
                    {t("footer.faqs")}
                  </a>
                </li>
                
                <li>
                  <a
                    href='/Mozambique-travel-guide'
                    className="text-slate-600 hover:text-slate-900 transition-colors duration-200 text-sm"
                  >
                    {t("footer.placesToVisit")}
                  </a>
                </li>
                <li>
                  <a
                    href='/travel-tips'
                    className="text-slate-600 hover:text-slate-900 transition-colors duration-200 text-sm"
                  >
                    {t("footer.travelTips")}
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Social Media */}
          <div className="flex justify-center items-start space-x-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
            >
              <Twitter className="w-6 h-6" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-sm text-slate-500">
              {t("footer.copyright.text")}
              <br />
              {t("footer.copyright.allRightsReserved")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
