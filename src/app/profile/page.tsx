"use client"

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export default function Profile() {
  const router = useRouter();
  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">Account</p>
      <h1 className="mt-1 font-display text-3xl font-bold">Profile & settings</h1>

      <div className="mt-8 grid gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <span className="grid h-16 w-16 place-items-center rounded-full gradient-primary text-lg font-bold text-primary-foreground">AR</span>
            <div className="flex-1">
              <p className="font-semibold">Alex Rivera</p>
              <p className="text-sm text-muted-foreground">alex@finwise.app</p>
            </div>
            <Button variant="outline" onClick={() => toast.info("Change avatar")}>Change avatar</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold">Profile</h3>
            <form
              className="mt-4 grid gap-4 sm:grid-cols-2"
              onSubmit={(e) => { e.preventDefault(); toast.success("Profile saved"); }}
            >
              <div>
                <Label htmlFor="p-name">Full name</Label>
                <Input id="p-name" defaultValue="Alex Rivera" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="p-email">Email</Label>
                <Input id="p-email" type="email" defaultValue="alex@finwise.app" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="p-currency">Currency</Label>
                <Input id="p-currency" defaultValue="USD" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="p-tz">Timezone</Label>
                <Input id="p-tz" defaultValue="America/Los_Angeles" className="mt-1.5" />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" className="gradient-primary text-primary-foreground">Save changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold">Notifications</h3>
            <div className="mt-4 space-y-4">
              {[
                { label: "Bill reminders", desc: "Email me 3 days before upcoming bills.", default: true },
                { label: "Weekly summary", desc: "A Monday digest of the past week.", default: true },
                { label: "Unusual charges", desc: "Alert me on unexpected spending.", default: false },
              ].map((n) => (
                <div key={n.label} className="flex items-center justify-between rounded-xl border border-border/60 p-4">
                  <div>
                    <p className="text-sm font-medium">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch defaultChecked={n.default} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="font-semibold">Sign out</p>
              <p className="text-sm text-muted-foreground">You'll be returned to the home page.</p>
            </div>
            <Button variant="outline" onClick={() => { toast.success("Signed out"); router.push("/"); }}>
              <LogOut className="mr-1.5 h-4 w-4" /> Log out
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
