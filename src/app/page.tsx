import { Button } from "@/components/ui/button";
import LandingHero from "@/components/landing/LandingHero";
import ClassroomScene from "@/components/landing/ClassroomScene";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section with 3D Classroom */}
      <section className="relative h-screen w-full pt-16">
        {/* Three.js Scene Container */}
        <div className="absolute inset-0 z-0 pt-16">
          <ClassroomScene />
        </div>

        {/* Overlay Content */}
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          <LandingHero />
        </div>
      </section>

      {/* Additional Landing Page Sections */}
      <section className="bg-background py-24">
        <div className="container">
          <h2 className="mb-10 text-center text-4xl font-bold">How It Works</h2>
          {/* Content about how the platform works */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <FeatureCard
              title="For Tutors"
              description="Create and share your knowledge through engaging courses"
              icon="👨‍🏫"
            />
            <FeatureCard
              title="For Students"
              description="Learn from expert tutors with AI-enhanced video lectures"
              icon="👩‍🎓"
            />
            <FeatureCard
              title="Real-time Interaction"
              description="Engage with tutors and fellow students through live discussions"
              icon="💬"
            />
          </div>
        </div>
      </section>

      <section className="bg-muted py-24">
        <div className="container">
          <h2 className="mb-10 text-center text-4xl font-bold">Why Choose Our Platform</h2>
          {/* Content about platform benefits */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <BenefitCard title="AI Transcription" icon="🤖" />
            <BenefitCard title="Interactive Learning" icon="🔄" />
            <BenefitCard title="Affordable Courses" icon="💰" />
            <BenefitCard title="Expert Tutors" icon="🏆" />
          </div>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="container text-center">
          <h2 className="mb-6 text-4xl font-bold">Ready to Transform Learning?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Join thousands of tutors and students who are already part of our community.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="text-lg" asChild>
              <a href="/signup">Sign Up as Student</a>
            </Button>
            <Button size="lg" variant="outline" className="text-lg" asChild>
              <a href="/signup?role=tutor">Become a Tutor</a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

// Simple components for the landing page
function FeatureCard({ title, description, icon }: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-lg bg-card p-6 shadow-md">
      <div className="mb-4 text-5xl">{icon}</div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function BenefitCard({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="rounded-lg bg-card p-6 text-center shadow-md">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="text-lg font-medium">{title}</h3>
    </div>
  );
}
