"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, BookOpen, ArrowLeft, Github, Mail, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";

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
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    expertise: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (userType === "tutor" && !formData.expertise) {
      toast({
        title: "Error",
        description: "Please specify your area of expertise",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Register the user
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          role: userType.toUpperCase(),
          expertise: formData.expertise,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register");
      }

      toast({
        title: "Success!",
        description: "Your account has been created",
      });

      // Sign in the user after registration
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        // If sign-in fails, redirect to login
        router.push("/login");
        return;
      }

      // Redirect to dashboard based on role
      router.push(userType === "student" ? "/dashboard" : "/tutor/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider: "github" | "google") => {
    try {
      setIsLoading(true);
      await signIn(provider, {
        callbackUrl: userType === "tutor" ? "/tutor/dashboard" : "/dashboard",
      });
    } catch (error) {
      console.error(`${provider} sign-up error:`, error);
      toast({
        title: "Sign-up Failed",
        description: `Could not sign up with ${provider}`,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
          disabled={isLoading}
        />
      </div>

      {userType === "tutor" && (
        <div className="space-y-2">
          <Label htmlFor="expertise">Area of Expertise</Label>
          <Input
            id="expertise"
            name="expertise"
            value={formData.expertise}
            onChange={handleChange}
            placeholder="e.g. Computer Science, Mathematics, etc."
            required
            disabled={isLoading}
          />
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
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
        <Button
          variant="outline"
          type="button"
          className="w-full"
          onClick={() => handleSocialSignup("github")}
          disabled={isLoading}
        >
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button
          variant="outline"
          type="button"
          className="w-full"
          onClick={() => handleSocialSignup("google")}
          disabled={isLoading}
        >
          <Mail className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
    </form>
  );
}
