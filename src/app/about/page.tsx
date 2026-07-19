"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Globe, ShieldCheck, Target, Users, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden gradient-hero pt-20 pb-16 lg:pt-28 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              About <span className="text-gradient">Finwise</span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
              We're on a mission to empower everyone to take control of their financial future through intelligent, intuitive, and accessible tools.
            </p>
          </motion.div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why we built Finwise
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Personal finance shouldn't be complicated. We realized that traditional budgeting apps required too much manual work, leading to frustration and abandoned goals.
            </p>
            <p className="mt-4 text-lg text-muted-foreground">
              By combining cutting-edge AI with a beautiful, user-centric design, we created Finwise to be your proactive financial co-pilot, automatically categorized and deeply insightful.
            </p>
            
            <div className="mt-8 space-y-4">
              {[
                "Automated categorization with 99% accuracy",
                "Bank-level security and encryption",
                "Personalized insights based on your spending habits"
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/15 text-success">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-1 shadow-elegant backdrop-blur-3xl">
              <div className="h-full w-full rounded-xl bg-background/80 p-8 flex flex-col justify-center gap-8 backdrop-blur-sm border border-border/50">
                 <div className="flex items-start gap-4">
                   <div className="rounded-lg bg-primary/10 p-3 text-primary">
                     <Target className="h-6 w-6" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-lg">Our Mission</h3>
                     <p className="text-muted-foreground text-sm mt-1">To demystify personal finance and make wealth building accessible to everyone, regardless of their background.</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-4">
                   <div className="rounded-lg bg-blue-500/10 p-3 text-blue-500">
                     <Globe className="h-6 w-6" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-lg">Our Vision</h3>
                     <p className="text-muted-foreground text-sm mt-1">A world where financial stress is obsolete, replaced by confidence, clarity, and autonomous financial growth.</p>
                   </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="bg-muted/30 border-y border-border/50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Our Core Values</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">The principles that guide every feature we build and every decision we make.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Unwavering Trust",
                description: "Your data is yours. We employ bank-level encryption and never sell your personal information.",
                color: "text-emerald-500",
                bg: "bg-emerald-500/10"
              },
              {
                icon: Zap,
                title: "Effortless Innovation",
                description: "We use AI to eliminate the busywork, turning tedious tracking into delightful insights.",
                color: "text-amber-500",
                bg: "bg-amber-500/10"
              },
              {
                icon: Users,
                title: "User Obsession",
                description: "Every pixel, every interaction, and every feature is designed with your success in mind.",
                color: "text-primary",
                bg: "bg-primary/10"
              }
            ].map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card className="h-full bg-background/50 backdrop-blur-sm border-border/60 hover:shadow-elegant transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className={`mb-4 inline-flex rounded-xl p-3 ${value.bg} ${value.color}`}>
                      <value.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-bold text-xl">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-primary/20 bg-primary/5 p-8 md:p-16 backdrop-blur-sm shadow-elegant"
          >
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Ready to transform your finances?</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of users who have already taken control of their money with Finwise.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto gradient-primary text-primary-foreground shadow-elegant hover:opacity-95">
                  Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
