"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  HeadphonesIcon,
  Globe,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const contactInfo = [
    {
      icon: Mail,
      label: "E-posta",
      value: "hello@lokascore.com",
      description: "Sorularınız için bize yazın",
    },
    {
      icon: Phone,
      label: "Telefon",
      value: "+90 (555) 123 45 67",
      description: "Pazartesi - Cuma, 09:00 - 18:00",
    },
    {
      icon: MapPin,
      label: "Adres",
      value: "Antalya, Türkiye",
      description: "Merkez ofisimiz",
    },
    {
      icon: Clock,
      label: "Çalışma Saatleri",
      value: "09:00 - 18:00",
      description: "Pazartesi - Cuma",
    },
  ];

  const contactTypes = [
    { value: "general", label: "Genel Bilgi", icon: MessageSquare },
    { value: "technical", label: "Teknik Destek", icon: HeadphonesIcon },
    { value: "business", label: "İş Ortaklığı", icon: Globe },
    { value: "media", label: "Basın & Medya", icon: Twitter },
  ];

  const faqItems = [
    {
      question: "LOKASCORE nasıl çalışır?",
      answer:
        "Harita üzerinden seçtiğiniz konumları yapay zeka ve veri analizi ile değerlendiriyoruz. PostGIS tabanlı mekansal analiz ile rakip yoğunluğu, yaya trafiği ve erişilebilirlik gibi faktörleri analiz ediyoruz.",
    },
    {
      question: "Hangi şehirlerde hizmet veriyorsunuz?",
      answer:
        "Şu an Antalya ilinde hizmet vermekteyiz. Yakında İstanbul, Ankara ve İzmir'i de kapsama planımız var.",
    },
    {
      question: "Fiyatlandırma nasıl?",
      answer:
        "Temel analiz ücretsiz, detaylı raporlar için uygun fiyatlı planlarımız mevcut. Özel ihtiyaçlarınız için iletişime geçin.",
    },
    {
      question: "API erişimi var mı?",
      answer:
        "Evet, geliştiriciler için REST API sunuyoruz. Dokümantasyon ve API anahtarı için bizimle iletişime geçin.",
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    try {
      // TODO: Implement actual form submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("sent");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        type: "general",
      });
    } catch (error) {
      setStatus("error");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container-responsive min-h-screen py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">İletişime Geçin</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Sorularınız, önerileriniz veya iş birliği teklifleriniz için bize
          ulaşın. En kısa sürede size dönüş yapacağız.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-12">
        {/* Contact Form */}
        <div className="lg:col-span-8">
          <div className="card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Send className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Mesaj Gönderin</h2>
                <p className="text-sm text-muted-foreground">
                  Formu doldurun, size hemen dönelim
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Type */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Konu Türü
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {contactTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleInputChange("type", type.value)}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        formData.type === type.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-input hover:border-primary/50"
                      }`}
                    >
                      <type.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="input w-full"
                    placeholder="Adınız ve soyadınız"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    E-posta
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="input w-full"
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="text-sm font-medium mb-2 block">Konu</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  className="input w-full"
                  placeholder="Mesajınızın konusu"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-medium mb-2 block">Mesaj</label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="textarea w-full"
                  placeholder="Mesajınızı detaylı olarak yazın..."
                />
              </div>

              {/* Status Messages */}
              {status === "sent" && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span>
                    Mesajınız başarıyla gönderildi! En kısa sürede size dönüş
                    yapacağız.
                  </span>
                </div>
              )}

              {status === "error" && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
                  <AlertCircle className="h-5 w-5" />
                  <span>
                    Mesaj gönderilemedi. Lütfen tekrar deneyin veya e-posta ile
                    iletişime geçin.
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "sending"}
                className="btn btn-primary w-full"
              >
                {status === "sending" ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Mesajı Gönder
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Contact Info & FAQ */}
        <div className="lg:col-span-4 space-y-6">
          {/* Contact Information */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">İletişim Bilgileri</h3>
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/50">
                    <info.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{info.value}</p>
                    <p className="text-sm text-muted-foreground">
                      {info.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm font-medium mb-3">Sosyal Medya</p>
              <div className="flex gap-3">
                {[
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Github, href: "#", label: "GitHub" },
                  { icon: Linkedin, href: "#", label: "LinkedIn" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border hover:border-primary hover:text-primary transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Sık Sorulan Sorular</h3>
            <div className="space-y-4">
              {faqItems.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-border last:border-b-0 pb-4 last:pb-0"
                >
                  <h4 className="font-medium mb-2 text-sm">{faq.question}</h4>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Response Time */}
          <div className="card p-6 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-primary">Yanıt Süresi</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Mesajlarınızı genellikle{" "}
              <span className="font-semibold text-foreground">2-4 saat</span>{" "}
              içinde yanıtlıyoruz. Acil durumlar için telefon numaramızı
              kullanabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
