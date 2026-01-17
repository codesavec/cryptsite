"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PartnersCarousel } from "@/components/partners-carousel"
import { COMPANY_NAME, INVESTMENT_PLANS } from "@/lib/constants"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      const userData = JSON.parse(user)
      router.push(userData.role === "admin" ? "/admin" : "/dashboard")
    }
  }, [router])

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="bg-secondary border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 flex items-center justify-between">
          <div className="text-2xl md:text-3xl font-bold text-accent">
            {COMPANY_NAME}
          </div>

          <nav className="hidden lg:flex gap-8 text-sm font-medium">
            <a
              href="#features"
              className="text-foreground hover:text-accent transition"
            >
              Features
            </a>
            <a
              href="#plans"
              className="text-foreground hover:text-accent transition"
            >
              Plans
            </a>
            <a
              href="#how-it-works"
              className="text-foreground hover:text-accent transition"
            >
              How It Works
            </a>
            <a
              href="#contact"
              className="text-foreground hover:text-accent transition"
            >
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/login")}
              className="text-foreground hover:text-accent hidden sm:inline-flex"
            >
              Sign In
            </Button>
            <Button
              size="sm"
              onClick={() => router.push("/register")}
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs md:text-sm font-bold"
            >
              Get Started
            </Button>

            {/* Mobile Nav Toggle */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-accent">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="bg-secondary border-l-border"
                >
                  <SheetHeader>
                    <SheetTitle className="text-accent text-left">
                      {COMPANY_NAME}
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-6 mt-12">
                    <a
                      href="#features"
                      className="text-lg font-medium text-foreground hover:text-accent"
                    >
                      Features
                    </a>
                    <a
                      href="#plans"
                      className="text-lg font-medium text-foreground hover:text-accent"
                    >
                      Plans
                    </a>
                    <a
                      href="#how-it-works"
                      className="text-lg font-medium text-foreground hover:text-accent"
                    >
                      How It Works
                    </a>
                    <a
                      href="#contact"
                      className="text-lg font-medium text-foreground hover:text-accent"
                    >
                      Contact
                    </a>
                    <hr className="border-border" />
                    <Button
                      variant="outline"
                      onClick={() => router.push("/login")}
                      className="w-full justify-start text-foreground"
                    >
                      Sign In
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="relative bg-gradient-to-b from-secondary to-background py-16 md:py-32 overflow-hidden">
          {/* Background Animated Shapes - Visible on all screens */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[10%] -right-10 w-32 h-32 md:w-64 md:h-64 bg-gradient-to-br from-green-400/20 to-green-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute top-[40%] -left-10 w-40 h-40 md:w-80 md:h-80 bg-gradient-to-br from-blue-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute bottom-[10%] right-[20%] w-32 h-32 md:w-64 md:h-64 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="animate-fade-in text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-foreground mb-4 md:mb-6 leading-tight tracking-tighter">
                  TRADE{" "}
                  <span className="text-accent underline decoration-accent/30 underline-offset-8">
                    CRYPTO
                  </span>
                </h1>
                <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-accent mb-6">
                  {COMPANY_NAME.toUpperCase()} EXCHANGE
                </h2>
                <p className="text-sm sm:text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Join the future of finance. Triangular or triple arbitrage
                  using our powerful software and servers, making arbitrage
                  transactions within 1 exchange almost in real-time.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button
                    size="lg"
                    onClick={() => router.push("/register")}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-6 h-auto text-lg font-bold shadow-xl shadow-accent/20"
                  >
                    Get Started
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-accent text-accent hover:bg-accent/10 px-10 py-6 h-auto text-lg font-bold bg-transparent"
                  >
                    Read More
                  </Button>
                </div>
              </div>

              {/* Right Illustration Placeholder */}
              {/* <div className="relative h-64 md:h-96 hidden lg:block">
                <div className="absolute inset-0 bg-accent/5 rounded-3xl border border-accent/10 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-9xl animate-bounce">Company</div>
                </div>
              </div> */}
              <div className="relative h-64 md:h-96 hidden lg:block">
                <div className="absolute inset-0 rounded-3xl flex items-center justify-center">
                  <div className="text-9xl animate-bounce">₿</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Plans Section */}
        <div
          id="plans"
          className="py-16 md:py-24 bg-card border-y border-border"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl md:text-5xl font-black text-center text-foreground mb-4">
              Premium Investment Plans
            </h3>
            <p className="text-center text-muted-foreground mb-10 md:mb-16 max-w-2xl mx-auto text-sm md:text-base">
              Select from our carefully designed investment plans with
              competitive returns and flexible terms
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {INVESTMENT_PLANS.map((plan, idx) => (
                <Card
                  key={plan.id}
                  className="bg-background border border-border hover:border-accent/50 transition-all hover:shadow-2xl hover:shadow-accent/10 animate-slide-up group"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <CardHeader className="text-center pb-4 md:pb-6">
                    <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      💰
                    </div>
                    <CardTitle className="text-accent text-xl md:text-2xl font-bold">
                      {plan.name}
                    </CardTitle>
                    <div className="flex flex-col mt-4">
                      <span className="text-3xl md:text-4xl font-black text-foreground">
                        {plan.returnPercentage}%
                      </span>
                      <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest mt-1 font-bold">
                        Profit after {plan.durationDays} days
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 md:space-y-6">
                    <div className="space-y-2 border-y border-border/50 py-4">
                      <div className="flex justify-between items-center text-xs md:text-sm">
                        <span className="text-muted-foreground">
                          Min. Deposit:
                        </span>
                        <span className="font-bold text-foreground">
                          ${plan.minAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs md:text-sm">
                        <span className="text-muted-foreground">
                          Max. Deposit:
                        </span>
                        <span className="font-bold text-foreground">
                          ${plan.maxAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-2 text-[10px] md:text-xs">
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-accent font-bold">✓</span>{" "}
                        <span>
                          Referral Commission: {plan.referralPercentage}%
                        </span>
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-accent font-bold">✓</span>{" "}
                        <span>Principal Return: Included</span>
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-accent font-bold">✓</span>{" "}
                        <span>Withdrawals: Instant</span>
                      </li>
                    </ul>
                    <Button
                      onClick={() => router.push("/register")}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-6 h-auto text-lg font-bold"
                    >
                      Choose Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Partner Exchanges */}
        <PartnersCarousel />

        {/* How It Works */}
        <div id="how-it-works" className="py-20 bg-card border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-4xl font-bold text-center text-foreground mb-16">
              What do you need to start?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {[
                {
                  icon: "1",
                  title: "Go through a simple registration",
                  desc: "We promise that registration will not take more than 5 minutes",
                },
                {
                  icon: "2",
                  title: "Activate your account after registration",
                  desc: "You need to verify your email address",
                },
                {
                  icon: "3",
                  title:
                    "Replenish your balance and choose the best deal for you",
                  desc: "Choose the best deals for triple sharing",
                },
                {
                  icon: "4",
                  title: "Open a transaction and get a guaranteed profit",
                  desc: "You can open a lifelong transaction for automated trading",
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="text-center p-6 bg-background border border-border rounded-lg hover:border-accent/50 transition animate-slide-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.icon}
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    {step.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Automated Trading Benefits */}
            <div className="bg-background border border-border rounded-lg p-12">
              <h3 className="text-3xl font-bold text-foreground mb-4 text-center">
                Automated Trading
              </h3>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Our bot can trade instead of you, choosing the best pairs for
                the transaction. You relax, and our trading bot works.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: "💰",
                    title: "Maximum Profit from Transactions",
                    desc: "You relax and our platform generates profit for you",
                  },
                  {
                    icon: "24",
                    title: "The Uptime of Our Bots is 99.99%",
                    desc: "Distributed server load keeps the bot always in service",
                  },
                  {
                    icon: "₿",
                    title: "Low Cost of Our Bot",
                    desc: "Only 0.005 BTC one-time and you get daily profit for a lifetime",
                  },
                ].map((benefit, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-5xl mb-4">{benefit.icon}</div>
                    <h4 className="font-bold text-foreground mb-2 text-lg">
                      {benefit.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {benefit.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div id="contact" className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-4xl font-bold text-foreground mb-12 text-center">
              Contact Us
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  icon: "🕐",
                  title: "24/7 Support",
                  desc: "Have a question? Ask us! Our support team is available 24/7.",
                },
                {
                  icon: "📰",
                  title: `${COMPANY_NAME} Blog`,
                  desc: "The latest cryptocurrency news, personal opinions, and original posts.",
                },
                {
                  icon: "👥",
                  title: "Community",
                  desc: "There are many of us, and there will be even more. Join the discussion.",
                },
                {
                  icon: "🚀",
                  title: "Vacancies",
                  desc: "Do you want to be involved in building the future? Our doors are open.",
                },
              ].map((contact, idx) => (
                <Card
                  key={idx}
                  className="bg-card border border-border hover:border-accent/50 transition cursor-pointer"
                >
                  <CardContent className="pt-6 text-center">
                    <div className="text-4xl mb-3">{contact.icon}</div>
                    <h4 className="font-bold text-foreground mb-2">
                      {contact.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {contact.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="font-bold text-accent mb-3">{COMPANY_NAME}</p>
              <p className="text-sm text-muted-foreground">
                © 2026 All rights reserved
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-3">About us</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent">
                    Company
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-3">Support</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-3">Legal</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; 2026 {COMPANY_NAME}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
