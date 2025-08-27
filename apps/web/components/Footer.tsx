import Link from "next/link";
import { MapPin, Mail, Phone, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  const footerLinks = {
    product: [
      { name: "Analizler", href: "/report" },
      { name: "Favoriler", href: "/favorites" },
      { name: "API Dokümantasyonu", href: "/docs" },
    ],
    company: [
      { name: "Hakkımızda", href: "/about" },
      { name: "İletişim", href: "/contact" },
      { name: "Blog", href: "/blog" },
    ],
    legal: [
      { name: "Gizlilik Politikası", href: "/privacy" },
      { name: "Kullanım Koşulları", href: "/terms" },
      { name: "Çerez Politikası", href: "/cookies" },
    ],
    social: [
      { name: "Twitter", href: "#", icon: Twitter },
      { name: "GitHub", href: "#", icon: Github },
      { name: "LinkedIn", href: "#", icon: Linkedin },
    ],
  };

  return (
    <footer className="border-t bg-background">
      <div className="container-responsive">
        <div className="grid gap-8 py-12 lg:grid-cols-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight">
                  LOKASCORE
                </span>
                <span className="text-xs text-muted-foreground">
                  Veri ve YZ destekli lokasyon analizi
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              Girişimcilerin ve yatırımcıların doğru konum seçme kararını veri
              ve yapay zeka ile destekliyoruz. Harita üzerinden seçilen noktalar
              için ticari potansiyel analizi sunuyoruz.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>hello@lokascore.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+90 (555) 123 45 67</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-6 lg:col-start-6">
            <div>
              <h3 className="text-sm font-semibold">Ürün</h3>
              <ul className="mt-4 space-y-2">
                {footerLinks.product.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Şirket</h3>
              <ul className="mt-4 space-y-2">
                {footerLinks.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Yasal</h3>
              <ul className="mt-4 space-y-2">
                {footerLinks.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Links */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold">Sosyal Medya</h3>
            <div className="mt-4 flex space-x-4">
              {footerLinks.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LOKASCORE. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>Made with ❤️ in Turkey</span>
              <span>•</span>
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
