"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, BookOpen, ArrowLeft, Github, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>("student");

  useEffect(() => {
    // Check for role query param to set initial tab
    const role = searchParams.get("role");
    if (role === "tutor") {
      setActiveTab("tutor");
    }
  }, [searchParams]);

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-16">
      <motion.div
        className="w-full max-w-md space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <Link href="/" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="mb-3 text-3xl font-extrabold">Create an Account</h1>
          <p className="text-muted-foreground">
            Join our platform to start learning or teaching.
          </p>
        </div>

        <Tabs
          defaultValue="student"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Student</span>
            </TabsTrigger>
            <TabsTrigger value="tutor" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span>Tutor</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="student" className="mt-6 space-y-4">
            <SignupForm userType="student" />
          </TabsContent>

          <TabsContent value="tutor" className="mt-6 space-y-4">
            <SignupForm userType="tutor" />
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function SignupForm({ userType }: { userType: "student" | "tutor" }) {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first-name">First Name</Label>
          <Input id="first-name" placeholder="John" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Last Name</Label>
          <Input id="last-name" placeholder="Doe" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="john@example.com" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="••••••••" required />
      </div>

      {userType === "tutor" && (
        <div className="space-y-2">
          <Label htmlFor="expertise">Area of Expertise</Label>
          <Input id="expertise" placeholder="e.g. Computer Science, Mathematics, etc." required />
        </div>
      )}

      <Button type="submit" className="w-full">
        Create Account
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" type="button" className="w-full">
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button variant="outline" type="button" className="w-full">
          <Mail className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
    </form>
  );
}
