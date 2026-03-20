export type ProjectCategory = "Product" | "3D" | "Graphics" | "UI/UX" | "AI" | "Web" | "Automation" | "Mobile";

export interface Project {
    id: string;
    title: string;
    year: string;
    categories: ProjectCategory[];
    thumbnail: string;
    heroImage: string;
    shortDescription: string;
    description: string;
    icon: string;
    color: string;
    tags: string[];
}

export const projects: Project[] = [
    {
        id: "dinelyx-ai",
        title: "Dinelyx AI",
        year: "2025",
        categories: ["AI", "Product", "UI/UX"],
        thumbnail: "/assets/hero/projects/dinelyx.png",
        heroImage: "/assets/hero/projects/dinelyx.png",
        shortDescription: "INTELLIGENT RESTAURANT MANAGEMENT PLATFORM",
        description: "Dinelyx AI is a full-stack restaurant automation platform that combines conversational AI, real-time order management, and data-driven insights to modernize food service operations. Built with cutting-edge voice AI and modern web technologies, the system handles everything from customer ordering to kitchen workflow optimization. Core Features include an AI Voice Ordering Agent (Urdu/English code-mixed, 2s processing), Digital Menu & Cart System, real-time Kitchen Management Dashboard, Session Management, and a full Admin Portal. Built with FastAPI (Python), Next.js 14, Supabase, OpenAI Whisper, and ElevenLabs.",
        icon: "🤖",
        color: "#9b72f0",
        tags: ["Python", "FastAPI", "OpenAI Whisper", "Next.js", "Supabase", "ElevenLabs"],
    },
    {
        id: "animal-welfare",
        title: "Animal Welfare",
        year: "2025",
        categories: ["AI", "Mobile", "UI/UX"],
        thumbnail: "/assets/hero/projects/animal-welfare.png",
        heroImage: "/assets/hero/projects/animal-welfare.png",
        shortDescription: "AI-powered pet care & rescue app",
        description: "Animal Welfare AI is a real-time, AI-powered animal rescue and veterinary coordination platform built to address the critical lack of structured response systems in emerging markets. The application enables users to instantly report injured or distressed animals by uploading images, descriptions, and live GPS location. These reports are stored and synchronized through Firebase, and visualized as dynamic map pins using the Google Maps API. At the core is an AI-driven triage assistant powered by OpenAI, which analyzes user input and provides immediate first-aid guidance. Built with Flutter, Firebase Auth, and Firebase Storage.",
        icon: "🐾",
        color: "#d4824a",
        tags: ["Flutter", "Firebase", "Supabase", "OpenAI", "Google Maps"],
    },
    {
        id: "zozet-app",
        title: "Zozet App",
        year: "2025",
        categories: ["Product", "Mobile", "AI"],
        thumbnail: "/assets/hero/projects/zozet.png",
        heroImage: "/assets/hero/projects/zozet.png",
        shortDescription: "Smart Virtual Closet & AI Try-On",
        description: "A hybrid mobile application that enables users to virtually try on clothing using parametric 3D avatars scaled to real-world body measurements. Orchestrated a complex, multi-stage pipeline connecting a Flutter frontend to a Python/FastAPI backend. Engineered robust 3D garment reconstruction and cloth simulation features, including a CPU-fallback mode to ensure simulation accessibility.",
        icon: "👗",
        color: "#7b6bb5",
        tags: ["Flutter", "Python", "FastAPI", "Supabase", "Three.js", "SF3D", "Physics", "OpenCV"],
    },
    {
        id: "coffeemistry",
        title: "Coffeemistry",
        year: "2024",
        categories: ["Web", "3D", "Graphics"],
        thumbnail: "/assets/hero/projects/coffeemistry.png",
        heroImage: "/assets/hero/projects/coffeemistry.png",
        shortDescription: "Scroll-driven specialty coffee experience",
        description: "Made dinelyx ai website gsap next js. Scroll trigger cinematic front end developer been in to this add detial about this ur seld. A dark, premium, scroll-driven website for a specialty coffee brand. Features anti-gravity scroll animation of an iced latte on HTML5 Canvas, scroll-linked overlay text, and a cinematic post-scroll landing page.",
        icon: "☕",
        color: "#8a6e4e",
        tags: ["WebGL", "Scroll", "Canvas"],
    },
    {
        id: "workflow-automation",
        title: "Workflow Automation",
        year: "2024–25",
        categories: ["Automation", "AI"],
        thumbnail: "/assets/hero/projects/project-3.png",
        heroImage: "/assets/hero/projects/project-3.png",
        shortDescription: "AI Automation Pipelines & Bots",
        description: "Made automation workflow n8n social media automation, tally quiz automation from quiz submit to make then contacts made in ghl, GHL instagram automation. Built a Stripe webhook with payment 5 payment program, Lob API key address verification, delivery tracking. Made personal assistant n8n with telegram. Introducing: AI-Powered Lead Generation & Research System (LGRS) – Built in n8n. Multi-Channel Input via Telegram, AI Agent Orchestration, Automated LinkedIn Scraping via Apify, On-Demand Lead Research, and Real-Time Data Storage in Google Sheets. Scalable Architecture for B2B intelligence.",
        icon: "⚡",
        color: "#e88a3a",
        tags: ["n8n", "Telegram Bot", "GPT-4"],
    },
    {
        id: "rosewood-saas",
        title: "Rosewood",
        year: "2024–25",
        categories: ["Web", "UI/UX", "Product"],
        thumbnail: "/assets/hero/projects/rosewood.jpg",
        heroImage: "/assets/hero/projects/rosewood.jpg",
        shortDescription: "Compliance-Based SaaS MVP",
        description: "Built a full-stack, compliance-focused SaaS platform that automates the generation, validation, and delivery of legally compliant property notices. The system integrates frontend workflows, backend automation (Make.com), payment infrastructure (Stripe overage billing, webhooks), and real-world mailing APIs (Lob API for certified mail tracking) into a single end-to-end pipeline. Frontend built with Softr, Backend heavily backed by Airtable. Uses DocsAutomator + Google Docs for dynamic PDF generation. Ensures no notice is sent without meeting compliance and payment validation.",
        icon: "🏠",
        color: "#c87070",
        tags: ["Airtable", "Make", "Lob API", "Stripe", "Softr"],
    },
];
