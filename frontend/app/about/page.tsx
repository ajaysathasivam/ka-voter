import AboutSite from "@/components/custom/about";
import ContactInfo from "@/components/custom/contact";
import DeveloperInfo from "@/components/custom/developer-info";

// Easily update site, developer, contact info here!
const aboutContent = {
  site: {
    title: "About Our Site",
    description: `The Secure Online Voting System is a web-based platform designed to ensure transparent, tamper-proof, and user-friendly digital voting. Built with HTML for the frontend and Python (Flask) for the backend, our system prioritizes robust security and seamless user experience.`,
    features: [
      "Dual-factor OTP authentication via Email & SMS",
      "Admin dashboard for election and candidate management",
      "Secure registration and vote casting with one-vote-per-user",
      "Strong data encryption and reliable session management",
      "Real-time result counting and transparent display"
    ],
    mission: `Our mission is to simplify secure voting for organizations and educational institutions, particularly enabling remote participation for citizens abroad, the elderly, or physically challenged. Every eligible person deserves a fair opportunity to vote, wherever they are.`,
    security: `The app integrates digital verification (photo, voter ID, Aadhaar, etc.) with the highest security standards.`
  },
  developer: {
    team: "VoteGuard",
    members: [
      { name: "Jane Doe", role: "Lead Developer (Full Stack, Cybersecurity)" },
      { name: "John Smith", role: "Backend Developer (Python, Flask)" },
      { name: "Priya Kumar", role: "Frontend Developer (React, Next.js)" }
    ],
    tagline: "We build reliable, secure digital solutions for democracy."
  },
  contact: {
    email: "support@voteguard.io",
    phone: "+91-98765-43210",
    address: "1234 Tech Park, Bengaluru, India"
  }
};


export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-bl from-[#1a223b] to-[#273b56] py-10 px-4 flex flex-col items-center">
      <AboutSite site={aboutContent.site} />
      <DeveloperInfo developer={aboutContent.developer} />
      <ContactInfo contact={aboutContent.contact} />
    </main>
  );
}
