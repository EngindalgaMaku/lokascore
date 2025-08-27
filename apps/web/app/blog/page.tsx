import {
  Calendar,
  User,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  Brain,
  BarChart3,
  Lightbulb,
  Target,
} from "lucide-react";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: number;
  category: string;
  featured: boolean;
  image?: string;
};

export default function BlogPage() {
  const categories = [
    "Tümü",
    "Veri Bilimi",
    "İşletme",
    "Teknoloji",
    "Analiz",
    "Rehber",
  ];

  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "2024'te Lokasyon Seçiminde AI'ın Rolü",
      excerpt:
        "Yapay zeka teknolojilerinin işletme konumu seçimindeki artan önemi ve geleceğe yönelik trendler.",
      content: "",
      author: "Mehmet Yılmaz",
      date: "2024-03-20",
      readTime: 8,
      category: "Veri Bilimi",
      featured: true,
    },
    {
      id: "2",
      title: "Kafe Açmadan Önce Bilmeniz Gerekenler",
      excerpt:
        "Başarılı bir kafe işletmesi için konum seçiminden pazarlama stratejilerine kadar kapsamlı rehber.",
      content: "",
      author: "Ayşe Demir",
      date: "2024-03-18",
      readTime: 12,
      category: "İşletme",
      featured: true,
    },
    {
      id: "3",
      title: "PostGIS ile Mekansal Veri Analizi",
      excerpt:
        "Coğrafi bilgi sistemleri ve mekansal veri analizi tekniklerinin işletme kararlarındaki uygulamaları.",
      content: "",
      author: "Can Özkan",
      date: "2024-03-15",
      readTime: 15,
      category: "Teknoloji",
      featured: false,
    },
    {
      id: "4",
      title: "Restoran Lokasyonu: Altın Kurallar",
      excerpt:
        "Restoran sektöründe başarı için kritik konum faktörleri ve analiz yöntemleri.",
      content: "",
      author: "Zehra Kaya",
      date: "2024-03-12",
      readTime: 10,
      category: "İşletme",
      featured: false,
    },
    {
      id: "5",
      title: "Veri Görselleştirme ile Konum Analizi",
      excerpt:
        "Karmaşık mekansal verileri anlaşılır görsellere dönüştürme teknikleri ve araçları.",
      content: "",
      author: "Ali Veli",
      date: "2024-03-10",
      readTime: 7,
      category: "Analiz",
      featured: false,
    },
    {
      id: "6",
      title: "Perakende Sektöründe Dijital Dönüşüm",
      excerpt:
        "E-ticaret çağında fiziksel mağaza konumlarının önemi ve hibrit stratejiler.",
      content: "",
      author: "Fatma Yıldız",
      date: "2024-03-08",
      readTime: 9,
      category: "İşletme",
      featured: false,
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Veri Bilimi":
        return Brain;
      case "İşletme":
        return Target;
      case "Teknoloji":
        return BarChart3;
      case "Analiz":
        return TrendingUp;
      case "Rehber":
        return Lightbulb;
      default:
        return MapPin;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Veri Bilimi":
        return "bg-purple-100 text-purple-700";
      case "İşletme":
        return "bg-blue-100 text-blue-700";
      case "Teknoloji":
        return "bg-green-100 text-green-700";
      case "Analiz":
        return "bg-orange-100 text-orange-700";
      case "Rehber":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const featuredPosts = blogPosts.filter((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="section-padding bg-secondary/20">
        <div className="container-responsive">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4 lg:text-4xl">
              LOKASCORE Blog
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Lokasyon zekası, veri bilimi ve işletme stratejileri hakkında
              güncel içerikler ve uzman görüşleri
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full border hover:border-primary hover:text-primary transition-colors text-sm"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container-responsive py-12">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <div className="h-1 w-8 bg-primary rounded" />
              <h2 className="text-2xl font-bold">Öne Çıkan Yazılar</h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {featuredPosts.map((post) => {
                const CategoryIcon = getCategoryIcon(post.category);
                return (
                  <article
                    key={post.id}
                    className="card card-hover group overflow-hidden"
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <CategoryIcon className="h-12 w-12 text-primary/60" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(
                            post.category
                          )}`}
                        >
                          {post.category}
                        </span>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.date).toLocaleDateString("tr-TR")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readTime} dk
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {post.author}
                          </span>
                        </div>
                        <button className="text-primary hover:underline text-sm font-medium group-hover:gap-2 transition-all flex items-center gap-1">
                          Devamını Oku
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Regular Posts */}
        <section>
          <div className="flex items-center gap-2 mb-8">
            <div className="h-1 w-8 bg-primary rounded" />
            <h2 className="text-2xl font-bold">Son Yazılar</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularPosts.map((post) => {
              const CategoryIcon = getCategoryIcon(post.category);
              return (
                <article key={post.id} className="card card-hover group">
                  <div className="aspect-video bg-gradient-to-br from-secondary/50 to-muted/50 rounded-t-xl flex items-center justify-center">
                    <CategoryIcon className="h-8 w-8 text-muted-foreground/60" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(
                          post.category
                        )}`}
                      >
                        {post.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.date).toLocaleDateString("tr-TR")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime} dk
                        </div>
                      </div>
                      <span>{post.author}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mt-16">
          <div className="card bg-gradient-to-br from-primary/5 to-accent/5 p-8 text-center lg:p-12">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">
                Blog Güncellemelerini Kaçırma
              </h3>
              <p className="text-muted-foreground mb-8">
                Yeni yazılarımızdan ve lokasyon zekası alanındaki gelişmelerden
                haberdar olmak için e-posta listemize katıl.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="input flex-1"
                />
                <button className="btn btn-primary">Abone Ol</button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                İstediğiniz zaman abonelikten çıkabilirsiniz. Gizlilik
                politikamızı okuyun.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
